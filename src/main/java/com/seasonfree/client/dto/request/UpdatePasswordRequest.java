package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class UpdatePasswordRequest {
    private String email;
    private String newPassword;
}
