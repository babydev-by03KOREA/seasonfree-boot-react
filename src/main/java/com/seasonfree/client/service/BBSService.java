package com.seasonfree.client.service;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.dto.LivePostDTO;
import com.seasonfree.client.dto.PostDTO;
import com.seasonfree.client.dto.request.CommentRequest;
import com.seasonfree.client.dto.request.PostRequest;
import com.seasonfree.client.entity.Category;
import com.seasonfree.client.entity.Comment;
import com.seasonfree.client.entity.Post;
import com.seasonfree.client.entity.User;
import com.seasonfree.client.repository.BBSRepository;
import com.seasonfree.client.repository.CategoryRepository;
import com.seasonfree.client.repository.CommentRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BBSService {
    private final BBSRepository bbsRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public List<LivePostDTO> getTwoLivePost() {
        Pageable pageable = PageRequest.of(0, 2); // Page request for the top 2 posts
        Page<Post> postsPage = bbsRepository.findTop2ByOrderByWriteDateDesc(pageable);

        return postsPage.stream()
                .map(post -> new LivePostDTO(post.getId(), post.getCategory().getMainCategory().name(), post.getTitle()))
                .collect(Collectors.toList());
    }

    // 게임별 리스트 로직 처리
    @Transactional(readOnly = true)
    public Page<PostDTO> getPostsByCategory(GameCategory categoryType, int page, int size) {
        Category category = categoryRepository.findByMainCategory(categoryType)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = bbsRepository.findByCategory(category, pageable);
        return posts.map(PostDTO::new);
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getPostsByMultipleCategories(List<GameCategory> categoryTypes, int page, int size) {
        List<Category> categories = categoryTypes.stream()
                .map(categoryType -> categoryRepository.findByMainCategory(categoryType)
                        .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + categoryType)))
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = bbsRepository.findByCategoryIn(categories, pageable);
        return posts.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void savePost(String email, GameCategory categoryType, PostRequest postRequest) {
        log.info("email: {}", email);
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

    @Transactional
    public PostDTO getPostById(GameCategory categoryType, Long id) {
        Category category = categoryRepository.findByMainCategory(categoryType)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Post post = bbsRepository.findByIdAndCategory(id, category)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 조회수 증가
        Post updatedPost = post.updateWatch(post.getWatch() + 1);
        bbsRepository.save(updatedPost);

        return new PostDTO(post);
    }

    @Transactional
    public void writeComment(String email, CommentRequest commentRequest) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        Post post = bbsRepository.findById(commentRequest.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .user(user)
                .post(post)
                .content(commentRequest.getComment())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);
    }

    @Transactional
    public PostDTO updatePost(Long id, String userEmail, PostRequest postRequest) {
        Post post = bbsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        post.updateTitle(postRequest.getTitle());
        post.updateContent(postRequest.getContent());
        post.updateUrlOne(postRequest.getUrlOne());
        post.updateUrlTwo(postRequest.getUrlTwo());
        post.updatePostType(postRequest.getPostType());

        bbsRepository.save(post);

        return new PostDTO(post);
    }

    @Transactional
    public void deletePost(Long id, String userEmail) {
        Post post = bbsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("작성자만 삭제할 수 있습니다.");
        }

        bbsRepository.delete(post);
    }
}
