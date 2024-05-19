package com.seasonfree.client.entity;

import com.seasonfree.client.constant.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@ToString(exclude = {"points", "customerServices"}) // 연관관계 필드는 exclude, 무한루프의 위험성 존재
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 무분별한 객체 생성 방지(의미 있는 객체 생성)
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "uid"),
        @UniqueConstraint(columnNames = "email")
})
public class User implements UserDetails {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String userId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50, unique = true)
    private String nickname;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column()
    private String imageUrl;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Point> points;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<CustomerService> customerServices;

    @Builder
    public User(Long id, String userId, String password, String nickname, String email, Role role, String imageUrl, List<Point> points, List<CustomerService> customerServices) {
        this.id = id;
        this.userId = userId;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.role = role;
        this.imageUrl = imageUrl;
        this.points = points;
        this.customerServices = customerServices;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role.toString()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }
}
