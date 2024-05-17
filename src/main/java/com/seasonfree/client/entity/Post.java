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

    // 관련 url1
    @Column
    private String urlOne;

    // 관련 url2
    @Column
    private String urlTwo;

    // 추천글 / 일반글
    @Column
    @Enumerated(EnumType.STRING)
    private PostType postType;

    // 작성일
    @Column
    private LocalDate writeDate;

    // 조회수
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
}
