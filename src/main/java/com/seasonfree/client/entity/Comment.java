package com.seasonfree.client.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString(exclude = {"user", "post", "parent"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "comments")
public class Comment {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    private Comment parent;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createAt;

    @Column(nullable = false)
    private LocalDateTime updateAt;

    @Builder
    public Comment(Long id, User user, Post post, Comment parent, String content, LocalDateTime createAt, LocalDateTime updateAt) {
        this.id = id;
        this.user = user;
        this.post = post;
        this.parent = parent;
        this.content = content;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }
}
