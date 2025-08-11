package com.guardianbank.repository;

import com.guardianbank.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    // 根据服务类型查询服务
    List<Service> findByType(String type);

    // 根据服务名称包含指定字符串查询
    List<Service> findByNameContaining(String name);

    // 根据服务类型和名称查询
    List<Service> findByTypeAndNameContaining(String type, String name);
}