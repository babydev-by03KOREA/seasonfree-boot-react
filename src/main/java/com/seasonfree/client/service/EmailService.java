package com.seasonfree.client.service;

import com.seasonfree.client.entity.EmailMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public void sendMail(EmailMessage emailMessage, String randomCode) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(emailMessage.getTo()); // 메일 수신자
            mimeMessageHelper.setSubject(emailMessage.getSubject()); // 메일 제목
            mimeMessageHelper.setText(emailMessage.getMessage(), true); // 메일 본문 내용, HTML 여부

            // 메일 전송
            javaMailSender.send(mimeMessage);

            // REDIS 30분간 저장
            ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
            valueOps.set(emailMessage.getTo(), randomCode, 30, TimeUnit.MINUTES);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
