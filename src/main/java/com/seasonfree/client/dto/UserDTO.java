package com.seasonfree.client.dto.request;

import lombok.Getter;

import java.util.Optional;

@Getter
public class UserDTO {
    private String nickname;
    private int points;
    private Optional<String> imageUrl;

    public UserDTO(String nickname, int points, Optional<String> imageUrl) {
        this.nickname = nickname;
        this.points = points;
        this.imageUrl = imageUrl;
    }
}
