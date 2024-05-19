package com.seasonfree.client.controller;

import com.seasonfree.client.dto.PostDTO;
import com.seasonfree.client.dto.request.BannerRequest;
import com.seasonfree.client.dto.request.PostRequest;
import com.seasonfree.client.dto.request.ThumbsUpRequest;
import com.seasonfree.client.entity.CustomerService;
import com.seasonfree.client.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/thumbs-up")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> thumbsUp(@RequestBody ThumbsUpRequest thumbsUpRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            PostDTO postDTO = adminService.updatePostType(thumbsUpRequest.getId(), thumbsUpRequest.getPostType());
            return ResponseEntity.ok(postDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }

    @PostMapping("/banner-image-upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bannerUpload(@RequestParam("image") MultipartFile file) {
        log.info("[ADMIN] 광고 배너 업로드 이미지 URL 생성");

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            return adminService.uploadImage(file);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }

    // 규격(width, height), 우선순위
    @PostMapping("/banner")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bannerSetting(@RequestBody BannerRequest bannerRequest){
        log.info("[ADMIN] 광고 배너 등록하기(체크 클릭)");

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            adminService.adBannerSetting(bannerRequest.getOrder(), bannerRequest.getWidth(), bannerRequest.getHeight(), bannerRequest.getImageUrl());
            return ResponseEntity.ok("배너가 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            log.error("배너 등록 중 에러 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("배너 등록 중 에러가 발생했습니다.");
        }
    }

    // 모든 게시글 삭제 및 수정 기능
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMyPost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            PostDTO updatedPost = adminService.updatePost(id, postRequest);
            return ResponseEntity.ok(updatedPost);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMyPost(@PathVariable Long id) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        String userEmail = authentication.getName();
        try {
            adminService.deletePost(id);
            return ResponseEntity.ok().body("게시글이 삭제되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }
}
