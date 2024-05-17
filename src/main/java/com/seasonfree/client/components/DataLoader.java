package com.seasonfree.client.components;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.entity.Category;
import com.seasonfree.client.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

    private final CategoryRepository categoryRepository;

    public DataLoader(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Bean
    CommandLineRunner loadCategories() {
        return args -> {
            for (GameCategory gameCategory : GameCategory.values()) {
                if (!categoryRepository.findByMainCategory(gameCategory).isPresent()) {
                    categoryRepository.save(new Category(gameCategory, null));
                }
            }
        };
    }
}

