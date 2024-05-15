package com.seasonfree.client.dto.request;

import lombok.Getter;

@Getter
public class AttendanceCheckRequest {
    private String id;
    private String today;
    private String comment;
}
