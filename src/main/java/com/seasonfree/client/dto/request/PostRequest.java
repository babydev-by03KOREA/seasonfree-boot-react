package com.seasonfree.client.dto.request;

import com.seasonfree.client.constant.GameCategory;
import com.seasonfree.client.constant.PostType;
import lombok.Getter;

@Getter
public class PostRequest {
    private String title;
    private String content;
    private String urlOne;
    private String urlTwo;
    private PostType postType;
    private GameCategory categoryType;
}
