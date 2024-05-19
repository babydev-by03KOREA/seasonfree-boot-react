package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class CommentRequest {
    private Long postId;
    private String comment;
}
