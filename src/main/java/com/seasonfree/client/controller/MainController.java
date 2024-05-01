package com.seasonfree.client.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
    @GetMapping("/api/data")
    public String test() {
        return "Hello SpringBoot + React World!";
    }
}
