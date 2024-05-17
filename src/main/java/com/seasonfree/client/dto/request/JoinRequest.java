package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class JoinRequest {
    private String userId;
    private String password;
    private String nickname;
    private String email;
    private String otp;
    private String image;
}
