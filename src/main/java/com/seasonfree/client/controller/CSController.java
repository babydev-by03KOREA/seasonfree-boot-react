package com.seasonfree.client.controller;

import com.seasonfree.client.dto.CustomerServiceDTO;
import com.seasonfree.client.dto.CustomerServiceDetailDTO;
import com.seasonfree.client.dto.request.CSReplyRequest;
import com.seasonfree.client.entity.CustomerService;
import com.seasonfree.client.service.CSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/cs")
@CrossOrigin
public class CSController {
    private final CSService csService;

    // 페이지네이션, 순번, Title, 작성자, 작성날짜
    @GetMapping("/cs-list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkCS(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "15") int size) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            Page<CustomerServiceDTO> customerServiceList = csService.getCSContact(page, size);
            return ResponseEntity.ok(customerServiceList);
        } catch (Exception e) {
            log.error("CS 문의 확인 중 에러 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("CS 문의를 가져오는 중 에러가 발생했습니다.");
        }
    }

    // 페이지네이션, Title, Content, 작성자, 작성날짜
    @GetMapping("/cs-list/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> CSDetail(@PathVariable Long id) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            CustomerServiceDetailDTO customerServiceDetailDTO = csService.getCSDetail(id);
            return ResponseEntity.ok(customerServiceDetailDTO);
        } catch (Exception e) {
            log.error("다음과 같은 이유로 {} CS 개시글에 접근하지 못함: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("CS 문의를 가져오는 중 에러가 발생했습니다.");
        }
    }

    // 답변하기(작성하면 자동으로 메일로 답변 회신)
    @PostMapping("/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> CSReply(@RequestBody CSReplyRequest csReplyRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            csService.replySendEmail(csReplyRequest.getEmail(), csReplyRequest.getComment());
            return ResponseEntity.ok("메일을 성공적으로 전송하였습니다!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("CS 문의를 가져오는 중 에러가 발생했습니다.");
        }
    }
}
