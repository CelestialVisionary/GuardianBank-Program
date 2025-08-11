package com.guardianbank.config;

import com.guardianbank.model.Service;
import com.guardianbank.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public void run(String... args) throws Exception {
        // 检查数据库中是否已有数据
        if (serviceRepository.count() == 0) {
            // 创建初始服务数据
            Service service1 = new Service();
            service1.setName("个人 banking");
            service1.setDescription("为个人客户提供的全方位 banking 服务，包括储蓄、贷款、信用卡等");
            service1.setType("个人");

            Service service2 = new Service();
            service2.setName("企业金融");
            service2.setDescription("为企业客户提供的金融解决方案，包括企业贷款、现金管理、贸易融资等");
            service2.setType("企业");

            Service service3 = new Service();
            service3.setName("投资理财");
            service3.setDescription("提供多样化的投资理财产品，帮助客户实现资产增值");
            service3.setType("投资");

            // 保存到数据库
            serviceRepository.save(service1);
            serviceRepository.save(service2);
            serviceRepository.save(service3);

            System.out.println("初始化服务数据成功！");
        } else {
            System.out.println("数据库中已有服务数据，无需初始化。");
        }
    }
}