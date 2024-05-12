package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String userId;
    private String password;
}
