package com.guardianbank.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CacheStatisticsInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(CacheStatisticsInterceptor.class);
    
    // 定义切点，拦截带有缓存注解的方法
    @Pointcut("@annotation(org.springframework.cache.annotation.Cacheable) || @annotation(org.springframework.cache.annotation.CachePut) || @annotation(org.springframework.cache.annotation.CacheEvict)")
    public void cacheOperationPointcut() {
    }
    
    // 环绕通知，记录缓存操作的执行情况
    @Around("cacheOperationPointcut()")
    public Object logCacheOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        
        try {
            Object result = joinPoint.proceed();
            long endTime = System.currentTimeMillis();
            
            // 记录缓存方法执行时间
            logger.debug("缓存操作 [{}] 执行耗时: {} ms", methodName, (endTime - startTime));
            
            return result;
        } catch (Exception e) {
            logger.error("缓存操作 [{}] 执行失败: {}", methodName, e.getMessage());
            throw e;
        }
    }
}