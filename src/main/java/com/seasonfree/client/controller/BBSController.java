package com.seasonfree.client.controller;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.dto.PostDTO;
import com.seasonfree.client.dto.request.PostRequest;
import com.seasonfree.client.entity.Post;
import com.seasonfree.client.service.BBSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/bbs")
@CrossOrigin
public class BBSController {
    private final BBSService bbsService;
    private final Map<String, String> gameRoutes;

    public BBSController(BBSService bbsService) {
        this.bbsService = bbsService;

        gameRoutes = new HashMap<>();
        gameRoutes.put("LINEAGE", "/lineage");
        gameRoutes.put("LINEAGE_2", "/lineage/lineage-2");
        gameRoutes.put("REMASTER", "/lineage/remaster");
        gameRoutes.put("LINEAGE_M", "/lineage/lineage-m");
        gameRoutes.put("MUE", "/mue");
        gameRoutes.put("BARAM", "/baram");
        gameRoutes.put("MAPLE", "/maple");
        gameRoutes.put("DIABLO", "/diablo");
        gameRoutes.put("AION", "/aion");
        gameRoutes.put("DARKEDEN", "/darkeden");
        gameRoutes.put("DF", "/df");
        gameRoutes.put("STONAGE", "/stonage");
        gameRoutes.put("ETC", "/etc");
    }

    @GetMapping("/{game}")
    public ResponseEntity<?> handleGameRoute(@PathVariable(value = "game") String game, @RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "size", defaultValue = "15") int size) {
        GameCategory categoryType;
        try {
            categoryType = GameCategory.valueOf(game.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 게임을 찾을 수 없습니다.");
        }

        Page<PostDTO> response = bbsService.getPostsByCategory(categoryType, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/write")
    public ResponseEntity<?> writeGamePost(@RequestBody PostRequest postRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        String path = gameRoutes.get(postRequest.getCategoryType().name());
        log.info("request: {}, game path: {}", postRequest.getCategoryType().name(), path);
        if (path == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 게임을 찾을 수 없습니다.");
        }

        GameCategory categoryType = postRequest.getCategoryType();

        try {
            // 서비스 계층에 사용자 ID와 출석체크 정보 전달
            String userEmail = authentication.getName();
            bbsService.savePost(userEmail, categoryType, postRequest);
            return ResponseEntity.ok().body("게시글이 작성되었습니다!");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("개시글 작성 중 에러 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }
}
