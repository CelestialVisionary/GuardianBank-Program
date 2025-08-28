package com.guardianbank.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        // 创建EhCache缓存管理器
        return new EhCacheCacheManager(ehCacheManagerFactoryBean().getObject());
    }
    
    @Bean
    public EhCacheManagerFactoryBean ehCacheManagerFactoryBean() {
        // 配置EhCache管理器工厂
        EhCacheManagerFactoryBean factoryBean = new EhCacheManagerFactoryBean();
        factoryBean.setConfigLocation(new ClassPathResource("ehcache.xml"));
        factoryBean.setShared(true);
        return factoryBean;
    }
}