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
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;


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
    public ResponseEntity<List<String>> getServices() {
        long startTime = System.currentTimeMillis();
        
        // 从数据库中获取所有服务，并提取服务名称
        List<String> services = serviceRepository.findAll()
                .stream()
                .map(Service::getName)
                .collect(Collectors.toList());
        
        long endTime = System.currentTimeMillis();
        logger.info("服务列表查询耗时: {} ms, 服务数量: {}", (endTime - startTime), services.size());
        
        // 添加HTTP缓存控制头，设置缓存有效期为120秒
        CacheControl cacheControl = CacheControl.maxAge(120, TimeUnit.SECONDS)
                .cachePublic()
                .mustRevalidate();
        
        return ResponseEntity.ok()
                .cacheControl(cacheControl)
                .body(services);
    }

    @GetMapping("/api/about")
    public ResponseEntity<String> about() {
        long startTime = System.currentTimeMillis();
        
        String aboutInfo = "GuardianBank 致力于提供最安全、最便捷的金融服务。";
        
        long endTime = System.currentTimeMillis();
        logger.info("关于信息查询耗时: {} ms", (endTime - startTime));
        
        // 添加HTTP缓存控制头，设置缓存有效期为300秒
        CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS)
                .cachePublic();
        
        return ResponseEntity.ok()
                .cacheControl(cacheControl)
                .body(aboutInfo);
    }

    @PostMapping(value = "/api/contact", consumes = "application/json", produces = "application/json; charset=utf-8")
    public ResponseEntity<String> submitContactForm(@RequestBody ContactForm contactForm) {
        long startTime = System.currentTimeMillis();
        
        // 记录表单提交数据
        logger.info("收到联系表单提交: 姓名={}, 邮箱={}, 留言={}", 
            contactForm.getName(), contactForm.getEmail(), contactForm.getMessage());

        // 在实际应用中，这里可以将数据保存到数据库
        
        String response = "{\"status\": \"success\", \"message\": \"感谢您的留言，我们会尽快回复您！\", \"timestamp\": \"" + 
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + "\"}";
        
        long endTime = System.currentTimeMillis();
        logger.info("联系表单处理耗时: {} ms", (endTime - startTime));
        
        return ResponseEntity.ok()
                .body(response);
    }
}