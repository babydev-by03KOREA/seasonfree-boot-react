package com.seasonfree.client.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LivePostDTO {
    private Long id;
    // [던파]
    private String category;
    private String title;
}
