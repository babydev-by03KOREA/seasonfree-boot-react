package com.seasonfree.client.dto;

import com.seasonfree.client.constant.PostType;
import com.seasonfree.client.entity.Post;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String urlOne;
    private String urlTwo;
    private PostType postType;
    private LocalDate writeDate;
    private int watch;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.urlOne = post.getUrlOne();
        this.urlTwo = post.getUrlTwo();
        this.postType = post.getPostType();
        this.writeDate = post.getWriteDate();
        this.watch = post.getWatch();
    }
}

