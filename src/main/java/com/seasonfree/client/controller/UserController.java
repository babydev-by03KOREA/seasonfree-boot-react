package com.seasonfree.client.controller;

import com.seasonfree.client.dto.request.*;
import com.seasonfree.client.dto.request.UserDTO;
import com.seasonfree.client.exception.CustomDuplicateFieldException;
import com.seasonfree.client.jwt.JwtToken;
import com.seasonfree.client.jwt.JwtTokenProvider;
import com.seasonfree.client.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> signIn(@RequestBody LoginRequest loginRequest) {
        try {
            JwtToken token = userService.login(loginRequest.getUserId(), loginRequest.getPassword());
            return ResponseEntity.ok().body(token);  // JWT 토큰을 응답 본문에 포함
        } catch (UsernameNotFoundException e) {
            log.error("로그인 실패 - 사용자 없음: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("가입되지 않은 사용자입니다.");
        } catch (BadCredentialsException e) {
            log.error("로그인 실패 - 잘못된 자격 증명: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 틀렸습니다.");
        } catch (Exception e) {
            log.error("로그인 처리 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("내부 서버 오류가 발생했습니다.");
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequest joinRequest) {
        log.info("ID {}의 가입시도", joinRequest.getUserId());
        try {
            userService.saveUser(joinRequest);
            return ResponseEntity.ok("회원가입에 성공하였습니다!");
        } catch (CustomDuplicateFieldException e) {
            log.error("커스텀 Exception: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생하였습니다.");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> userInfo() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.error("인증 정보가 존재하지 않음.");
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        String userEmail = authentication.getName();
        UserDTO userDTO = userService.getUserInfoByEmail(userEmail);

        return ResponseEntity.ok(userDTO);
    }

    // 이메일 인증번호 전송 > 가입이 되었으면 가입 불가 통보 findByEmail
    @PostMapping("/email-check")
    public ResponseEntity<?> isEmailExist(@RequestBody EmailRequest email) {
        log.info("{}의 이메일 인증 시도", email);
        boolean emailSent = userService.checkEmailExistAndSendRandomNumber(email.getEmail());
        if (emailSent) {
            return ResponseEntity.ok("입력하신 이메일로 인증번호를 보냈습니다.\n30분 내로 인증 부탁드립니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 가입된 이메일입니다.");
        }
    }

    // 이메일 인증
    @PostMapping("/email-validation")
    public ResponseEntity<?> validationEmail(@RequestBody EmailValidationRequest validation) {
        log.info("{}가 {}로 인증 시도", validation.getEmail(), validation.getOtp());
        boolean emailValidation = userService.validationEmail(validation.getEmail(), validation.getOtp());
        if (emailValidation) {
            return ResponseEntity.ok("이메일 인증에 성공하였습니다.");
        } else {
            return ResponseEntity.badRequest().body("이메일 인증에 실패하였습니다.\n인증번호를 다시 확인 해 주세요.");
        }
    }

    // 이메일 인증번호 전송 > 가입과 관계없이 아이디 찾기 위해
    @PostMapping("/find-id-email")
    public ResponseEntity<?> findIdEmail(@RequestBody EmailRequest email) {
        log.info("{}의 아이디 찾기 인증 시도", email);
        boolean emailSent = userService.checkEmailExistAndSendRandomNumber(email.getEmail());
        if (emailSent) {
            return ResponseEntity.badRequest().body("가입되지 않은 이메일입니다. 다시 확인해 주세요.");
        } else {
            return ResponseEntity.ok("입력하신 이메일로 인증번호를 보냈습니다.\n30분 내로 인증 부탁드립니다.");
        }
    }

    // ID 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody EmailRequest email) {
        Optional<String> userIdOptional = userService.findUserIdByEmail(email.getEmail(), email.getOtp());
        if (!userIdOptional.isPresent()) {
            return ResponseEntity.badRequest().body("인증번호가 잘못되었습니다. 다시 확인 해 주세요.");
        } else {
            return ResponseEntity.ok().body(String.format("가입하신 Id는 %s 입니다.", userIdOptional.get()));
        }
    }

    // PWD 재설정
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest) {
        try {
            userService.updatePassword(updatePasswordRequest.getEmail(), updatePasswordRequest.getNewPassword());
            return ResponseEntity.ok("Password updated successfully.");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating password.");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        log.info("JWT 재발급 로직 접근");
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("잘못된 토큰입니다.");
        }

        Map<String, String> newAccessToken = userService.newAccessToken(refreshToken);
        return ResponseEntity.ok(newAccessToken);
    }
}
