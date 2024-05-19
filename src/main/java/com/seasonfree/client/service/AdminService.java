package com.seasonfree.client.service;

import com.seasonfree.client.constant.PostType;
import com.seasonfree.client.dto.PostDTO;
import com.seasonfree.client.dto.request.PostRequest;
import com.seasonfree.client.entity.Banner;
import com.seasonfree.client.entity.CustomerService;
import com.seasonfree.client.entity.Post;
import com.seasonfree.client.repository.BBSRepository;
import com.seasonfree.client.repository.BannerRepository;
import com.seasonfree.client.repository.CustomerServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminService {
    private final BannerRepository bannerRepository;
    private final BBSRepository bbsRepository;
    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/admin-banner-images";
    private final CustomerServiceRepository customerServiceRepository;

    @Transactional
    public PostDTO updatePostType(Long postId, PostType postType) {
        Post post = bbsRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        post.updatePostType(postType);
        bbsRepository.save(post);

        return new PostDTO(post);
    }

    @Transactional
    public ResponseEntity<Map<String, String>> uploadImage(MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        if (file.isEmpty()) {
            response.put("error", "파일이 전송되지 않았습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf('.'));
        String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        String safeBaseName = Normalizer.normalize(baseName, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").replaceAll("[^a-zA-Z0-9-]", "-");
        String uuid = UUID.randomUUID().toString();
        String newFileName = safeBaseName + "-" + uuid + ext;

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File dest = new File(dir, newFileName);
            file.transferTo(Paths.get(dest.getAbsolutePath()));

            String encodedFileName = URLEncoder.encode(newFileName, StandardCharsets.UTF_8.toString());
            String imgUrl = "http://localhost:8080/uploads/" + UPLOAD_DIR.substring(UPLOAD_DIR.lastIndexOf('/') + 1) + "/" + encodedFileName;
            response.put("url", imgUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "Failed to upload file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Transactional
    public void adBannerSetting(int order, String width, String height, String image) {
        Banner banner = Banner.builder().order(order).width(width).height(height).bannerUrl(image).build();
        bannerRepository.save(banner);
    }

    @Transactional
    public PostDTO updatePost(Long id, PostRequest postRequest) {
        Post post = bbsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        post.updateTitle(postRequest.getTitle());
        post.updateContent(postRequest.getContent());
        post.updateUrlOne(postRequest.getUrlOne());
        post.updateUrlTwo(postRequest.getUrlTwo());
        post.updatePostType(postRequest.getPostType());

        bbsRepository.save(post);

        return new PostDTO(post);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = bbsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        bbsRepository.delete(post);
    }
}
