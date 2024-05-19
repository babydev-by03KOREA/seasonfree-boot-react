package com.seasonfree.client.dto.request;

import com.seasonfree.client.constant.PostType;
import lombok.Getter;

@Getter
public class ThumbsUpRequest {
    private Long id;
    private PostType postType;
}
