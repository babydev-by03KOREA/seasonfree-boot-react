package com.seasonfree.client.controller;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.dto.PostDTO;
import com.seasonfree.client.dto.request.CommentRequest;
import com.seasonfree.client.dto.request.PostRequest;
import com.seasonfree.client.entity.Post;
import com.seasonfree.client.service.BBSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.ArrayList;
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
    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/bbs-images";

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
    public ResponseEntity<?> handleGameRoute(@PathVariable String game, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "15") int size) {
        GameCategory categoryType;
        try {
            categoryType = GameCategory.valueOf(game.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 게임을 찾을 수 없습니다.");
        }

        List<PostDTO> response = bbsService.getPostsByCategory(categoryType, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/combined/{game}")
    public ResponseEntity<?> handleCombinedGameRoute(@PathVariable String game, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "15") int size) {
        List<GameCategory> categoryTypes = new ArrayList<>();

        switch (game.toUpperCase()) {
            case "LINEAGE":
                categoryTypes.add(GameCategory.LINEAGE_2);
                categoryTypes.add(GameCategory.REMASTER);
                categoryTypes.add(GameCategory.LINEAGE_M);
                break;
            default:
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 게임을 찾을 수 없습니다.");
        }

        List<PostDTO> response = bbsService.getPostsByMultipleCategories(categoryTypes, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/image-upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        log.info("BBS 이미지 URL 간소화 접근!");
        Map<String, String> response = new HashMap<>();
        if (file.isEmpty()) {
            response.put("error", "Please provide a file");
            return ResponseEntity.badRequest().body(response);
        }

        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf('.'));
        String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        // 파일 이름 정리: 공백과 특수문자를 '-'로 대체
        String safeBaseName = Normalizer.normalize(baseName, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replaceAll("[^a-zA-Z0-9-]", "-");
        String newFileName = safeBaseName + System.currentTimeMillis() + ext;

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            File dest = new File(uploadDir, newFileName);
            file.transferTo(Paths.get(dest.getAbsolutePath()));

            // URL 인코딩 적용
            String encodedFileName = URLEncoder.encode(newFileName, StandardCharsets.UTF_8.toString());
            String imgUrl = "http://localhost:8080/uploads/bbs-images/" + encodedFileName; // Ensure this path matches static path
            response.put("url", imgUrl);
            log.info("Uploaded image URL: {}", imgUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            log.error("Failed to upload file", e);
            response.put("error", "Failed to upload file");
            return ResponseEntity.status(500).body(response);
        }
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

    @GetMapping("/{game}/{id}")
    public ResponseEntity<?> postDetail(@PathVariable(value = "game") String game, @PathVariable(value = "id") Long id) {
        GameCategory categoryType;
        try {
            categoryType = GameCategory.valueOf(game.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 게임을 찾을 수 없습니다.");
        }

        try {
            PostDTO postDTO = bbsService.getPostById(categoryType, id);
            return ResponseEntity.ok(postDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }

    // 개시글 ID, 작성자 ID(email), 댓글
    @PostMapping("/comment")
    public ResponseEntity<?> getComment(@RequestBody CommentRequest commentRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        try {
            String userEmail = authentication.getName();
            bbsService.writeComment(userEmail, commentRequest);
            return ResponseEntity.ok().body("댓글이 작성되었습니다!");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알 수 없는 에러가 발생하였습니다.");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateMyPost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        String userEmail = authentication.getName();
        try {
            PostDTO updatedPost = bbsService.updatePost(id, userEmail, postRequest);
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
    public ResponseEntity<?> deleteMyPost(@PathVariable Long id) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        String userEmail = authentication.getName();
        try {
            bbsService.deletePost(id, userEmail);
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
