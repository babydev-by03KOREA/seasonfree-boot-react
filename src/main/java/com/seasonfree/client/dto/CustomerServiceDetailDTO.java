package com.seasonfree.client.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CustomerServiceDetailDTO {
    private Long id;
    private String title;
    private String content;
    private String userName;
    private LocalDate askDate;
}
