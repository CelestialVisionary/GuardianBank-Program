package com.guardianbank.repository;

import com.guardianbank.model.Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;

import java.util.List;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
public class ServiceRepositoryTest {

    @Autowired
    private ServiceRepository serviceRepository;

    @BeforeEach
    void setUp() {
        // 清理测试数据并插入测试数据
        serviceRepository.deleteAll();
        
        Service service1 = new Service(null, "个人贷款", "灵活的个人贷款方案", "loan");
        Service service2 = new Service(null, "企业贷款", "专业的企业贷款服务", "loan");
        Service service3 = new Service(null, "活期账户存款", "灵活的活期账户存款", "deposit");
        Service service4 = new Service(null, "信用卡服务", "便捷的信用卡服务", "credit");
        serviceRepository.saveAll(Arrays.asList(service1, service2, service3, service4));
      }

    @Test
    void findAll_ShouldReturnAllServices() {
        List<Service> services = serviceRepository.findAll();
        assertEquals(4, services.size(), "应返回4个服务记录");
    }

    @Test
    void findById_WithValidId_ShouldReturnService() {
        Long serviceId = serviceRepository.findAll().get(0).getId();
        Service service = serviceRepository.findById(serviceId).orElse(null);
        assertNotNull(service, "根据有效ID应返回服务记录");
        assertEquals(serviceId, service.getId(), "返回的服务ID应与查询ID一致");
    }

    @Test
    void findByType_ShouldReturnFilteredServices() {
        List<Service> loanServices = serviceRepository.findByType("loan");
        assertEquals(2, loanServices.size(), "应返回2个贷款类型的服务");
        
        List<Service> depositServices = serviceRepository.findByType("deposit");
        assertEquals(1, depositServices.size(), "应返回1个存款类型的服务");
    }

    @Test
    void findByNameContaining_ShouldReturnMatchingServices() {
        List<Service> loanServices = serviceRepository.findByNameContaining("贷款");
        assertEquals(2, loanServices.size(), "名称包含'贷款'的服务应返回2个");
    }

    @Test
    void findByTypeAndNameContaining_ShouldReturnMatchingServices() {
        List<Service> personalLoanServices = serviceRepository.findByTypeAndNameContaining("loan", "个人");
        assertEquals(1, personalLoanServices.size(), "类型为'loan'且名称包含'个人'的服务应返回1个");
    }
}