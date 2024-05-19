package com.seasonfree.client.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "banners")
public class Banner {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int order;

    @Column(nullable = false)
    private String width;

    @Column(nullable = false)
    private String height;

    @Column(nullable = false)
    private String bannerUrl;

    @Builder
    public Banner(Long id, int order, String width, String height, String bannerUrl) {
        this.id = id;
        this.order = order;
        this.width = width;
        this.height = height;
        this.bannerUrl = bannerUrl;
    }
}
