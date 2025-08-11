<<<<<<< HEAD
# GuardianBank-Program 网站项目

## 项目简介

GuardianBank是一个现代化的金融服务网站，提供各种银行业务功能和用户服务。本项目采用前后端分离架构，后端使用Spring Boot框架，前端使用HTML、CSS和JavaScript。

## 技术栈

### 后端
- Java 17+
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- H2 数据库 (开发环境)

### 前端
- HTML5
- CSS3
- JavaScript
- 响应式设计

## 功能特点

1. **服务展示**：展示银行提供的各种金融服务
2. **联系我们**：用户可以提交联系表单
3. **用户认证**：支持用户登录和基于角色的访问控制
4. **数据管理**：使用数据库存储和管理服务信息
5. **跨域支持**：配置CORS以支持前后端分离开发

## 运行说明

### 后端运行
1. 确保安装了Java 17+和Maven
2. 进入后端目录：`cd backend`
3. 运行命令：`mvn spring-boot:run`
4. 后端服务将在 http://localhost:8080 启动

### 前端运行
1. 进入前端目录：`cd frontend`
2. 启动简单的HTTP服务器（例如使用Node.js的http-server）
3. 前端页面将在 http://localhost:8000 访问

## 项目结构

```
GuardianBank Program/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/guardianbank/
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── HomeController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   ├── model/
│   │   │   │   │   └── Service.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── ServiceRepository.java
│   │   │   │   └── util/
│   │   │   │       └── DataInitializer.java
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── images/
├── CONTINUE_DEV_PLAN.md
└── README.md
```

## 访问控制

系统支持两种用户角色：
- **普通用户**：可以访问基本功能和查看服务信息
- **管理员**：可以访问所有功能，包括管理服务和用户

默认用户：
- 用户名: `user`, 密码: `password`, 角色: USER
- 用户名: `admin`, 密码: `password`, 角色: ADMIN

## API 端点

### 公开端点
- GET /api/services - 获取所有服务
- POST /api/contact - 提交联系表单

### 需要认证的端点
- GET /api/user/profile - 获取当前用户信息
- GET /api/user/admin - 管理员专用端点

## 后续改进方向

1. 优化用户界面，提升用户体验
2. 添加更多的银行业务功能
3. 实现更复杂的用户权限管理
4. 连接到真实的数据库
5. 添加单元测试和集成测试
>>>>>>> master
