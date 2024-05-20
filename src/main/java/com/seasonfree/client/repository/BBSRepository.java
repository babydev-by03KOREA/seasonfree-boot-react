package com.seasonfree.client.repository;

import com.seasonfree.client.entity.Category;
import com.seasonfree.client.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BBSRepository extends JpaRepository<Post, Long> {
    Page<Post> findTop2ByOrderByWriteDateDesc(Pageable pageable);
    Page<Post> findByCategory(Category category, Pageable pageable);
    Optional<Post> findByIdAndCategory(Long id, Category category);
    Page<Post> findByCategoryIn(List<Category> categories, Pageable pageable);
}
