package com.seasonfree.client.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/image")
@CrossOrigin
public class ImageController {
    private static final String UPLOAD_DIR = "src/main/resources/static/uploads";

    @PostMapping("/bbs-upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        log.info("이미지 URL 간소화 접근!");
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
            String imgUrl = "http://localhost:8080/uploads/" + encodedFileName; // Ensure this path matches static path
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
}
