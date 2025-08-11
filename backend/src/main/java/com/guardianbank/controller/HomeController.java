package com.guardianbank.controller;

import com.guardianbank.model.ContactForm;
import com.guardianbank.model.Service;
import com.guardianbank.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
public class HomeController {
    @Autowired
    private ServiceRepository serviceRepository;
    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);



    @GetMapping("/")
    public String home() {
        return "GuardianBank 后端服务已启动！";
    }

    @GetMapping(value = "/api/services", produces = "application/json; charset=utf-8")
    public List<String> getServices() {
        // 从数据库中获取所有服务，并提取服务名称
        return serviceRepository.findAll()
                .stream()
                .map(Service::getName)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/about")
    public String about() {
        return "GuardianBank 致力于提供最安全、最便捷的金融服务。";
    }

    @PostMapping(value = "/api/contact", consumes = "application/json", produces = "application/json; charset=utf-8")
    public String submitContactForm(@RequestBody ContactForm contactForm) {
        // 记录表单提交数据
        logger.info("收到联系表单提交: 姓名={}, 邮箱={}, 留言={}", 
            contactForm.getName(), contactForm.getEmail(), contactForm.getMessage());

        // 在实际应用中，这里可以将数据保存到数据库

        return "{\"status\": \"success\", \"message\": \"感谢您的留言，我们会尽快回复您！\"}";
    }
}