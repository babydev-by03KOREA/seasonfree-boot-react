package com.seasonfree.client.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString(exclude = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "points")
public class Point {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int pointChange;

    @Column(nullable = false)
    private LocalDateTime changeDate;

    @Column(nullable = false)
    private String changeReason;

    @PrePersist
    private void prePersist() {
        this.changeDate = LocalDateTime.now();  // 날짜 자동 설정
    }
}
