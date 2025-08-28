package com.guardianbank;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MainApplicationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
        // 测试应用上下文是否正常加载
        assertNotNull(restTemplate, "应用上下文应成功加载并注入TestRestTemplate");
    }

    @Test
    void testHomeEndpoint() {
        // 测试根路径是否可以访问
        String url = "http://localhost:" + port + "/";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        
        assertEquals(200, response.getStatusCode().value(), "根路径应返回200状态码");
        assertEquals("GuardianBank 后端服务已启动！", response.getBody(), "根路径返回内容应正确");
    }

    @Test
    void testServicesEndpoint() {
        // 测试服务列表端点是否可以访问
        String url = "http://localhost:" + port + "/api/services";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        
        assertEquals(200, response.getStatusCode().value(), "服务列表端点应返回200状态码");
        assertNotNull(response.getBody(), "服务列表端点应返回非空内容");
    }

    @Test
    void testAboutEndpoint() {
        // 测试关于信息端点是否可以访问
        String url = "http://localhost:" + port + "/api/about";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        
        assertEquals(200, response.getStatusCode().value(), "关于信息端点应返回200状态码");
        assertNotNull(response.getBody(), "关于信息端点应返回非空内容");
        assertNotNull(response.getBody(), "关于信息端点应返回非空内容");
        assertTrue(response.getBody().contains("GuardianBank"), "关于信息应包含GuardianBank字样");
    }

    @Test
    void testContactEndpoint() {
        // 测试联系表单端点是否可以访问（使用GET方法测试405错误）
        String url = "http://localhost:" + port + "/api/contact";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        
        assertEquals(200, response.getStatusCode().value(), "GET访问联系表单端点应返回200 OK状态码");
    }
}