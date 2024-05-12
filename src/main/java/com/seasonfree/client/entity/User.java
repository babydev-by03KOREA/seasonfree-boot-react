package com.seasonfree.client.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@ToString(exclude = "points") // 연관관계 필드는 exclude, 무한루프의 위험성 존재
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 무분별한 객체 생성 방지(의미 있는 객체 생성)
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "uid"),
        @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String userId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50, unique = true)
    private String nickname;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Point> points;

    @Builder
    public User(String userId, String password, String nickname, String email, List<Point> points) {
        this.userId = userId;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.points = points;
    }
}
