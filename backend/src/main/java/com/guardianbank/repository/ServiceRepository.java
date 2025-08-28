package com.guardianbank.repository;

import com.guardianbank.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    // 缓存所有服务数据
    @Override
    @Cacheable(value = "servicesCache")
    List<Service> findAll();
    
    // 缓存单个服务数据
    @Override
    @Cacheable(value = "serviceCache")
    Service findById(Long id);
    // 根据服务类型查询服务
    @Cacheable(value = "serviceByTypeCache")
    List<Service> findByType(String type);

    // 根据服务名称包含指定字符串查询
    @Cacheable(value = "serviceByNameCache")
    List<Service> findByNameContaining(String name);

    // 根据服务类型和名称查询
    @Cacheable(value = "serviceByNameCache", key = "#type + '_' + #name")
    List<Service> findByTypeAndNameContaining(String type, String name);
}