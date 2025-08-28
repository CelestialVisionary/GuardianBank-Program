package com.guardianbank.controller;

// 移除未使用的导入语句 com.guardianbank.model.ContactForm
import com.guardianbank.model.Service;
import com.guardianbank.repository.ServiceRepository;
import org.junit.jupiter.api.Test;
// 由于 org.mockito.Mockito 未被使用，移除该导入语句
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.guardianbank.config.SecurityConfig;
import org.springframework.context.annotation.Import;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;

@WebMvcTest(controllers = HomeController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = {"USER"})
public class HomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServiceRepository serviceRepository;

    @Test
    void testHomeEndpoint() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("GuardianBank 后端服务已启动！"));
    }

    @Test
    void testGetServicesEndpoint() throws Exception {
        // 准备模拟数据
        Service service1 = new Service(1L, "个人储蓄账户", "为个人客户提供安全便捷的储蓄服务", "deposit");
        Service service2 = new Service(2L, "企业贷款", "为企业客户提供灵活的融资方案", "loan");
        List<Service> services = Arrays.asList(service1, service2);
        
        // 配置模拟对象
        when(serviceRepository.findAll()).thenReturn(services);
        
        // 执行测试
        mockMvc.perform(MockMvcRequestBuilders.get("/api/services"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json; charset=utf-8"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("[0]").value("个人储蓄账户"))
                .andExpect(MockMvcResultMatchers.jsonPath("[1]").value("企业贷款"));
    }

    @Test
    void testAboutEndpoint() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/about"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("GuardianBank 致力于提供最安全、最便捷的金融服务。"));
    }

    @Test
    void testSubmitContactFormEndpoint() throws Exception {
        // 准备测试数据
        String contactFormJson = "{\"name\":\"张三\",\"email\":\"zhangsan@example.com\",\"message\":\"我想了解更多关于个人贷款的信息\"}";
        
        // 执行测试
        mockMvc.perform(MockMvcRequestBuilders.post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contactFormJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json; charset=utf-8"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("success"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").exists());
    }

    @Test
    void testSubmitContactFormWithEmptyData() throws Exception {
        // 准备测试数据 - 空的表单数据
        String emptyContactFormJson = "{}";
        
        // 执行测试
        mockMvc.perform(MockMvcRequestBuilders.post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyContactFormJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json; charset=utf-8"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("success"));
    }
}