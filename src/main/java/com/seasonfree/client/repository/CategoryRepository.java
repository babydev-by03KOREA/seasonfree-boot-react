package com.seasonfree.client.repository;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByMainCategory(GameCategory mainCategory);
}
