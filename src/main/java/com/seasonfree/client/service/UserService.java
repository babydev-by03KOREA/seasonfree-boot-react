package com.seasonfree.client.service;

import com.seasonfree.client.constant.Role;
import com.seasonfree.client.dto.request.JoinRequest;
import com.seasonfree.client.dto.request.UserDTO;
import com.seasonfree.client.entity.EmailMessage;
import com.seasonfree.client.entity.Point;
import com.seasonfree.client.entity.User;
import com.seasonfree.client.exception.CustomDuplicateFieldException;
import com.seasonfree.client.jwt.JwtToken;
import com.seasonfree.client.jwt.JwtTokenProvider;
import com.seasonfree.client.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@RequiredArgsConstructor    // final 의존성 주입 자동화
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RedisTemplate<String, String> redisTemplate;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

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
        Optional<String> randomCode = Optional.of(createCode());
        String message = String.format("<h2>인증번호는 %s 입니다.</h2> <hr/> <h4>인증번호는 30분간 유효합니다.</h4>", randomCode);
        EmailMessage emailMessage = EmailMessage.builder()
                .to(email)
                .subject("시즌프리 가입 인증번호입니다.")
                .message(message)
                .build();

        emailService.sendMail(emailMessage, randomCode, 1);
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

    @Transactional
    public boolean validationEmail(String email, String otp) {
        String redisOtpValue = redisTemplate.opsForValue().get(email);
        return otp != null && otp.equals(redisOtpValue);
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findUserByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getAuthorities() // 권한 정보를 포함
        );
    }

    @Transactional
    public void saveUser(JoinRequest user) {
        if (validationEmail(user.getEmail(), user.getOtp())) {
            try {
                String imageUrl = Optional.ofNullable(user.getImage()).orElse(null);
                userRepository.save(User.builder()
                        .userId(user.getUserId())
                        .password(bCryptPasswordEncoder.encode(user.getPassword()))
                        .nickname(user.getNickname())
                        .email(user.getEmail())
                        .imageUrl(imageUrl)
                        .role(Role.USER)
                        .build());
            } catch (DataIntegrityViolationException e) {
                if (e.getCause() instanceof ConstraintViolationException) {
                    String constraintName = ((ConstraintViolationException) e.getCause()).getConstraintName();
                    if (constraintName.contains("email")) {
                        throw new CustomDuplicateFieldException("이미 등록된 이메일입니다.");
                    } else if (constraintName.contains("user_id")) {
                        throw new CustomDuplicateFieldException("이미 사용중인 사용자 ID입니다.");
                    } else if (constraintName.contains("nickname")) {
                        throw new CustomDuplicateFieldException("이미 사용중인 닉네임입니다.");
                    }
                }
                throw e;
            }
        }
    }

    @Transactional
    public JwtToken login(String userId, String password) {
        try {
            // 1. username + password 를 기반으로 Authentication 객체 생성
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, password);

            // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

            // user 정보 claim 에 넣기
            User user = userRepository.findUserByUserId(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저 아이디를 찾을 수 없습니다."));

            log.info("userName: {}, nickname: {}", user.getUsername(), user.getNickname());
            // 3. 인증 정보를 기반으로 JWT 토큰 생성
            return jwtTokenProvider.generateToken(user.getUsername(), user.getNickname(), authentication);

        } catch (UsernameNotFoundException e) {
            log.error("로그인 실패 - 사용자 없음: {}", e.getMessage());
            throw new UsernameNotFoundException("해당하는 유저 아이디를 찾을 수 없습니다.");
        } catch (BadCredentialsException e) {
            log.error("로그인 실패 - 잘못된 자격 증명: {}", e.getMessage());
            throw new BadCredentialsException("비밀번호가 틀렸습니다.");
        } catch (Exception e) {
            log.error("로그인 처리 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("내부 서버 오류가 발생했습니다.");
        }
    }


    @Transactional
    public Optional<String> findUserIdByEmail(String email, String otp) {
        boolean isValid = validationEmail(email, otp);
        if (isValid) {
            return userRepository.findUserIdByEmail(email);
        } else {
            return Optional.empty();
        }
    }

    @Transactional
    public void updatePassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String encodedPassword = bCryptPasswordEncoder.encode(newPassword);
            user.updatePassword(encodedPassword);
            userRepository.save(user);  // 변경 사항을 저장
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    public Map<String, String> newAccessToken(String refreshToken) {
        String userEmail = jwtTokenProvider.getUsernameFromToken(refreshToken);
        log.info("userEmail: {}", userEmail);
        User user = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저 이메일을 찾을 수 없습니다."));
        String newAccessToken = jwtTokenProvider.createToken(userEmail, user.getUsername(), user.getNickname(), user.getRole().getKey());
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        return response;
    }

    public UserDTO getUserInfoByEmail(String email) {
        User user = userRepository.findUserByEmail(email).orElseThrow(() -> new UsernameNotFoundException("해당하는 이메일의 유저를 찾을 수 없습니다. by: " + email));

        // 포인트 계산 로직 추가
        int totalPoints = user.getPoints().stream().mapToInt(Point::getPointChange).sum();

        // Optional imageUrl 생성
        Optional<String> imageUrl = Optional.ofNullable(user.getImageUrl());

        return new UserDTO(user.getNickname(), totalPoints, imageUrl);
    }
}
