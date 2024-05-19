package com.seasonfree.client.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CustomerServiceDTO {
    private Long id;
    private String title;
    private String userName;
    private LocalDate askDate;
}

