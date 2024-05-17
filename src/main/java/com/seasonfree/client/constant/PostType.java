package com.seasonfree.client.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostType {
    GENERAL("GENERAL_POST", "일반 게시글"),
    RECOMMEND("RECOMMEND_POST", "추천 게시글");

    private final String key;
    private final String value;
}
