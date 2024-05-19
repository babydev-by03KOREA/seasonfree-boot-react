package com.seasonfree.client.entity;

import com.seasonfree.client.constant.PostType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@ToString(exclude = {"user", "category"}) // 연관관계 필드는 exclude, 무한루프의 위험성 존재
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 무분별한 객체 생성 방지(의미 있는 객체 생성)
@Table(name = "posts")
public class Post {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column
    private String urlOne;

    @Column
    private String urlTwo;

    @Column
    @Enumerated(EnumType.STRING)
    private PostType postType;

    @Column
    private LocalDate writeDate;

    @Column
    private int watch;

    @Builder
    public Post(Long id, User user, Category category, String title, String content, String urlOne, String urlTwo, PostType postType, LocalDate writeDate, int watch) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.title = title;
        this.content = content;
        this.urlOne = urlOne;
        this.urlTwo = urlTwo;
        this.postType = postType;
        this.writeDate = writeDate;
        this.watch = watch;
    }

    // 조회수 증가 메서드
    public Post updateWatch(int watch) {
        return Post.builder()
                .id(this.id)
                .user(this.user)
                .category(this.category)
                .title(this.title)
                .content(this.content)
                .urlOne(this.urlOne)
                .urlTwo(this.urlTwo)
                .postType(this.postType)
                .writeDate(this.writeDate)
                .watch(watch)
                .build();
    }

    // 필드 업데이트 메서드
    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void updateUrlOne(String urlOne) {
        this.urlOne = urlOne;
    }

    public void updateUrlTwo(String urlTwo) {
        this.urlTwo = urlTwo;
    }

    public void updatePostType(PostType postType) {
        this.postType = postType;
    }
}
