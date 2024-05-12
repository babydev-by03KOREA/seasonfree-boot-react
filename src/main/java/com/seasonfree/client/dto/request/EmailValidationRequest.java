package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class EmailValidationRequest {
    private String email;
    private String otp;
}
