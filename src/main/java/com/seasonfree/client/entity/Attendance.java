package com.seasonfree.client.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString(exclude = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "attendance")
public class Attendance {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime checkDateTime;

    @Column(nullable = true)
    private String comment;

    @Builder
    public Attendance(Long id, User user, LocalDateTime checkDateTime, String comment) {
        this.id = id;
        this.user = user;
        this.checkDateTime = checkDateTime;
        this.comment = comment;
    }
}
