package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class BannerRequest {
    // 정렬 순번
    private int order;
    // 가로 길이
    private String width;
    // 세로 길이
    private String height;
    // 이미지 URL
    private String imageUrl;
}
