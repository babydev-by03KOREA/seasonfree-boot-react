package com.seasonfree.client.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {
    private final Key key;
    private long validityInMilliseconds = 3600000; // 1 hour

    public JwtTokenProvider(@Value("${jwt.secret}") String security) {
        byte[] keyBytes = Decoders.BASE64.decode(security);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public JwtToken generateToken(String email, String userNickname, Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
                .map(grantedAuthority -> "ROLE_" + grantedAuthority.getAuthority())
                .collect(Collectors.joining(","));

        long now = System.currentTimeMillis(); // 현재 시간을 밀리초 단위로 가져옴

        // 엑세스 토큰 생성 - 1시간 후 만료
        Date accessTokenExpires = new Date(now + validityInMilliseconds); // 1시간 = 3,600,000 밀리초

        // email
        log.info("authentication.getName: {}", authentication.getName());
        // role
        log.info("authorization: {}", authorities);

        String accessToken = Jwts.builder()
                .setSubject(email)
                .claim("username", email)
                .claim("nickname", userNickname)
                .claim("auth", authorities)
                .setIssuedAt(new Date(now))
                .setExpiration(accessTokenExpires)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // 리프레시 토큰 생성 - 6개월 후 만료
        Date refreshTokenExpires = new Date(now + 15_552_000_000L); // 약 6개월
        String refreshToken = Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(new Date(now))
                .setExpiration(refreshTokenExpires)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return JwtToken.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // Jwt 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
    // Spring Security의 인증된 사용자 세션
    public Authentication getAuthentication(String accessToken) {
        // Jwt 토큰 복호화
        Claims claims = parseClaims(accessToken);

        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 클레임에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // UserDetails 객체를 만들어서 Authentication return
        // UserDetails: interface, User: UserDetails를 구현한 class
        UserDetails principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    // accessToken
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String createToken(String userEmail, String username, String nickname, String auth) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("username", userEmail);
        claims.put("nickname", nickname);
        claims.put("auth", auth);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
