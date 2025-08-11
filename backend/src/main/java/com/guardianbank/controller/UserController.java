package com.guardianbank.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // 获取当前登录用户信息
    @GetMapping("/profile")
    public String getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return "当前登录用户: " + userDetails.getUsername() + "\n角色: " + userDetails.getAuthorities();
    }

    // 仅管理员可访问的端点
    @GetMapping("/admin")
    public String adminAccess() {
        return "管理员访问成功！";
    }
}