package com.seasonfree.client.service;

import com.seasonfree.client.dto.request.JoinRequest;
import com.seasonfree.client.entity.EmailMessage;
import com.seasonfree.client.entity.User;
import com.seasonfree.client.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Slf4j
@RequiredArgsConstructor    // final 의존성 주입 자동화
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public void signUp(JoinRequest joinRequest) {

    }

    @Transactional
    public boolean checkEmailExistAndSendRandomNumber(String email) {
        Optional<User> user = userRepository.findUserByEmail(email);
        if (user.isPresent()) {
            // 사용자가 이미 존재할 경우 badRequest 전송(가입불가 통지)
            return false;
        } else {
            // 사용자가 존재하지 않을 경우 email 전송(가입시도)
            sendRandomNumberToEmail(email);
            return true;
        }
    }

    private void sendRandomNumberToEmail(String email) {
        String randomCode = createCode();
        String message = String.format("<h2>인증번호는 %s 입니다.</h2> <hr/> <h4>인증번호는 30분간 유효합니다.</h4>", randomCode);

        EmailMessage emailMessage = EmailMessage.builder()
                .to(email)
                .subject("시즌프리 가입 인증번호입니다.")
                .message(message)
                .build();

        emailService.sendMail(emailMessage, randomCode);
    }

    // 인증번호 및 임시 비밀번호 생성 메서드
    private String createCode() {
        Random random = new Random();
        StringBuffer key = new StringBuffer();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(4);

            switch (index) {
                case 0:
                    key.append((char) ((int) random.nextInt(26) + 97));
                    break;
                case 1:
                    key.append((char) ((int) random.nextInt(26) + 65));
                    break;
                default:
                    key.append(random.nextInt(9));
            }
        }
        return key.toString();
    }
}
