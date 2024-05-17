package com.seasonfree.client.entity;

import com.seasonfree.client.constant.GameCategory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@ToString(exclude = "posts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "categories")
public class Category {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 100)
    private GameCategory mainCategory;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private Set<Post> posts = new HashSet<>(); // Category와 Post는 1:N 관계

    public Category(GameCategory mainCategory, Set<Post> posts) {
        this.mainCategory = mainCategory;
        this.posts = posts;
    }
}
