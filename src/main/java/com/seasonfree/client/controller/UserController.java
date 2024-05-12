package com.seasonfree.client.controller;

import com.seasonfree.client.dto.request.EmailRequest;
import com.seasonfree.client.dto.request.EmailValidationRequest;
import com.seasonfree.client.dto.request.JoinRequest;
import com.seasonfree.client.dto.request.LoginRequest;
import com.seasonfree.client.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequest joinRequest) {
        log.info("ID {}의 가입시도", joinRequest.getUserId());
        userService.signUp(joinRequest);
        return ResponseEntity.ok("회원가입에 성공하였습니다!");
    }

    // 이메일 인증번호 전송 > 가입이 되었으면 가입 불가 통보 findByEmail
    @PostMapping("/mail-check")
    public ResponseEntity<?> isEmailExist(@RequestBody EmailRequest email) {
        boolean emailSent = userService.checkEmailExistAndSendRandomNumber(email.getEmail());
        if (emailSent) {
            return ResponseEntity.ok("입력하신 이메일로 인증번호를 보냈습니다.\n30분 내로 인증 부탁드립니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 가입된 이메일입니다.");
        }
    }

    // 이메일 인증
    public ResponseEntity<?> validationEmail(@RequestBody EmailValidationRequest validation) {

        return ResponseEntity.ok("이메일 인증에 성공하였습니다.");
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        log.info("ID {} Password {}", loginRequest.getUserId(), loginRequest.getPassword());
        return "Login Success for " + loginRequest.getUserId();
    }

    // ID 찾기

    // PWD 재설정
}
