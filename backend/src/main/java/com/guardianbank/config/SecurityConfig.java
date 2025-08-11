package com.guardianbank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 开发环境下禁用CSRF保护
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/api/about", "/api/contact", "/api/services").permitAll() // 允许匿名访问的端点
                .requestMatchers("/api/user/profile").hasAnyRole("USER", "ADMIN") // 需要USER或ADMIN角色
                .requestMatchers("/api/user/admin").hasRole("ADMIN") // 仅需要ADMIN角色
                .anyRequest().authenticated() // 其他所有请求都需要认证
            )
            .formLogin(form -> form
                .permitAll() // 允许所有人访问登录页面
            )
            .logout(logout -> logout
                .permitAll() // 允许所有人访问登出功能
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 暂时使用内存中的用户存储，后续会替换为数据库存储
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
            .username("user")
            .password(passwordEncoder().encode("password"))
            .roles("USER")
            .build();

        UserDetails admin = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("admin"))
            .roles("ADMIN", "USER")
            .build();

        return new InMemoryUserDetailsManager(user, admin);
    }
}