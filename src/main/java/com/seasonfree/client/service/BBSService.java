package com.seasonfree.client.service;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.dto.PostDTO;
import com.seasonfree.client.dto.request.PostRequest;
import com.seasonfree.client.entity.Category;
import com.seasonfree.client.entity.Post;
import com.seasonfree.client.entity.User;
import com.seasonfree.client.repository.BBSRepository;
import com.seasonfree.client.repository.CategoryRepository;
import com.seasonfree.client.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BBSService {
    private final BBSRepository bbsRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    // 게임별 리스트 로직 처리
    @Transactional(readOnly = true)
    public Page<PostDTO> getPostsByCategory(GameCategory categoryType, int page, int size) {
        Category category = categoryRepository.findByMainCategory(categoryType)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = bbsRepository.findByCategory(category, pageable);
        List<PostDTO> postDTOs = posts.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());

        return new PageImpl<>(postDTOs, pageable, posts.getTotalElements());
    }

    @Transactional
    public void savePost(String email, GameCategory categoryType, PostRequest postRequest) {
        try {
            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

            Category category = categoryRepository.findByMainCategory(categoryType)
                    .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

            Post post = Post.builder()
                    .user(user)
                    .category(category)
                    .title(postRequest.getTitle())
                    .content(postRequest.getContent())
                    .urlOne(postRequest.getUrlOne())
                    .urlTwo(postRequest.getUrlTwo())
                    .postType(postRequest.getPostType())
                    .writeDate(LocalDate.now())
                    .watch(0)
                    .build();

            bbsRepository.save(post);
        } catch (Exception e) {
            log.error("저장하는데 에러 발생: {}", e.getMessage());
            throw e;
        }
    }
}
