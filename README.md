# GuardianBank 金融服务系统

![项目状态](https://img.shields.io/badge/状态-开发中-brightgreen)
![GitHub版本](https://img.shields.io/badge/版本-1.0.0-blue)
![许可证](https://img.shields.io/badge/许可证-MIT-green)

## 项目简介

GuardianBank是一个现代化的金融服务系统，采用前后端分离架构，提供完整的银行业务功能和用户服务。系统后端基于Spring Boot框架构建，前端采用HTML、CSS和JavaScript实现响应式设计，确保在各种设备上都有良好的用户体验。

## 系统架构

![系统架构](https://via.placeholder.com/800x400?text=GuardianBank+系统架构图)

- **前端**：HTML5 + CSS3 + JavaScript
- **后端**：Spring Boot + Spring Security + Spring Data JPA
- **数据库**：H2 (开发环境), MySQL (生产环境)
- **通信**：RESTful API + JSON

## 技术栈

### 后端
- Java 17+
- Spring Boot 3.2.5
- Spring Security
- Spring Data JPA
- H2 数据库 (开发环境)
- MySQL 数据库 (生产环境)
- Maven 3.8+

### 前端
- HTML5
- CSS3
- JavaScript (ES6+)
- 响应式设计
- Font Awesome 图标
- Chart.js (数据可视化)

## 功能特点

1. **用户管理**：注册、登录、个人信息管理
2. **账户服务**：余额查询、交易记录、转账汇款
3. **服务展示**：展示银行提供的各种金融服务
4. **联系我们**：用户可以提交联系表单获取支持
5. **用户认证**：基于JWT的身份验证和基于角色的访问控制
6. **数据管理**：使用数据库存储和管理用户及服务信息
7. **跨域支持**：配置CORS以支持前后端分离开发
8. **安全防护**：密码加密、请求验证、防SQL注入

## 安装指南

### 前提条件
- JDK 17 或更高版本
- Maven 3.8 或更高版本
- Node.js 14 或更高版本 (前端运行)
- Git

### 后端安装
1. 克隆项目仓库：
   ```bash
   git clone https://github.com/yourusername/guardianbank.git
   cd guardianbank/backend
   ```
2. 构建项目：
   ```bash
   mvn clean install
   ```
3. 运行应用：
   ```bash
   mvn spring-boot:run
   ```
4. 后端服务将在 http://localhost:8080 启动

### 前端安装
1. 进入前端目录：
   ```bash
   cd guardianbank/frontend
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm start
   ```
4. 前端页面将在 http://localhost:8000 访问

## 配置说明

### 后端配置
- 开发环境配置：`src/main/resources/application.properties`
- 生产环境配置：`src/main/resources/application-prod.properties`

主要配置项：
```properties
# 服务器配置
server.port=8080
server.servlet.context-path=/

# 数据库配置
spring.datasource.url=jdbc:h2:mem:guardianbank
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA配置
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update

# H2控制台配置
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# 日志配置
logging.level.root=INFO
logging.level.com.guardianbank=DEBUG
```

### 前端配置
- 配置文件：`frontend/config.js`
- API 基础URL配置：
```javascript
const config = {
  apiBaseUrl: 'http://localhost:8080/api'
};
```

## 项目结构

```
GuardianBank Program/
├── .gitignore              # Git忽略文件
├── README.md               # 项目说明文档
├── LICENSE                 # 许可证文件
├── backend/                # 后端项目
│   ├── build-backend.bat   # Windows构建脚本
│   ├── build-backend.ps1   # PowerShell构建脚本
│   ├── pom.xml             # Maven配置文件
│   └── src/                # 源代码
│       ├── main/
│       │   ├── java/com/guardianbank/
│       │   │   ├── MainApplication.java       # 应用入口
│       │   │   ├── config/                    # 配置类
│       │   │   │   ├── CorsConfig.java        # 跨域配置
│       │   │   │   ├── SecurityConfig.java    # 安全配置
│       │   │   │   └── JwtConfig.java         # JWT配置
│       │   │   ├── controller/                # 控制器
│       │   │   │   ├── HomeController.java    # 首页控制器
│       │   │   │   ├── UserController.java    # 用户控制器
│       │   │   │   ├── AccountController.java # 账户控制器
│       │   │   │   └── ContactController.java # 联系控制器
│       │   │   ├── model/                     # 数据模型
│       │   │   │   ├── User.java              # 用户实体
│       │   │   │   ├── Account.java           # 账户实体
│       │   │   │   ├── Transaction.java       # 交易实体
│       │   │   │   ├── Service.java           # 服务实体
│       │   │   │   └── ContactForm.java       # 联系表单实体
│       │   │   ├── repository/                # 数据访问层
│       │   │   │   ├── UserRepository.java    # 用户仓库
│       │   │   │   ├── AccountRepository.java # 账户仓库
│       │   │   │   ├── TransactionRepository.java # 交易仓库
│       │   │   │   └── ServiceRepository.java # 服务仓库
│       │   │   ├── service/                   # 服务层
│       │   │   │   ├── UserService.java       # 用户服务
│       │   │   │   ├── AccountService.java    # 账户服务
│       │   │   │   └── AuthService.java       # 认证服务
│       │   │   └── util/                      # 工具类
│       │   │       ├── DataInitializer.java   # 数据初始化
│       │   │       └── JwtUtil.java            # JWT工具
│       │   └── resources/                     # 资源文件
│       │       ├── application.properties     # 应用配置
│       │       └── static/                    # 静态资源
│       └── test/                              # 测试代码
├── frontend/               # 前端项目
│   ├── index.html          # 首页
│   ├── package.json        # npm配置
│   ├── package-lock.json   # 依赖锁文件
│   ├── server.js           # 前端服务器
│   ├── start-frontend.bat  # 前端启动脚本
│   ├── styles.css          # 样式文件
│   ├── app.js              # 应用入口
│   ├── config.js           # 配置文件
│   └── images/             # 图片资源
├── init-git.bat            # Git初始化脚本
└── project_status/         # 项目状态
    ├── completed_tasks.md  # 已完成任务
    └── pending_tasks.md    # 待完成任务
```

## 访问控制

系统支持三种用户角色：
- **访客**：可以浏览公开信息和服务
- **普通用户**：可以访问基本功能、查看服务信息和管理个人账户
- **管理员**：可以访问所有功能，包括管理服务、用户和系统配置

默认用户：
- 用户名: `user`, 密码: `password`, 角色: USER
- 用户名: `admin`, 密码: `password`, 角色: ADMIN

## API 文档

### 认证相关
#### POST /api/auth/login
- 描述: 用户登录
- 请求体:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- 响应:
  ```json
  {
    "token": "string",
    "username": "string",
    "role": "string"
  }
  ```

#### POST /api/auth/register
- 描述: 用户注册
- 请求体:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "fullName": "string"
  }
  ```
- 响应:
  ```json
  {
    "message": "Registration successful",
    "userId": "number"
  }
  ```

### 用户相关
#### GET /api/user/profile
- 描述: 获取当前用户信息
- 权限: USER, ADMIN
- 响应:
  ```json
  {
    "id": "number",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string",
    "createdAt": "date"
  }
  ```

### 服务相关
#### GET /api/services
- 描述: 获取所有服务
- 权限: 公开
- 响应:
  ```json
  [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "icon": "string",
      "category": "string"
    }
  ]
  ```

#### GET /api/services/{id}
- 描述: 获取单个服务详情
- 权限: 公开
- 响应:
  ```json
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "details": "string",
    "icon": "string",
    "category": "string",
    "requirements": ["string"],
    "benefits": ["string"]
  }
  ```

### 联系相关
#### POST /api/contact
- 描述: 提交联系表单
- 权限: 公开
- 请求体:
  ```json
  {
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string"
  }
  ```
- 响应:
  ```json
  {
    "message": "Your message has been sent successfully",
    "ticketId": "number"
  }
  ```

## 运行截图

### 首页
![首页截图](https://via.placeholder.com/800x400?text=GuardianBank+首页)

### 登录页面
![登录页面](https://via.placeholder.com/800x400?text=登录页面)

### 服务列表
![服务列表](https://via.placeholder.com/800x400?text=服务列表)

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -m 'Add some feature'`
4. 推送到分支: `git push origin feature/your-feature`
5. 提交 Pull Request

## 代码规范

### 后端
- 遵循 Google Java Style Guide
- 类名使用驼峰命名法，首字母大写
- 方法名使用驼峰命名法，首字母小写
- 变量名使用驼峰命名法，首字母小写
- 常量名使用大写字母，下划线分隔
- 每个类和方法添加适当的Javadoc注释

### 前端
- 遵循 Airbnb JavaScript Style Guide
- 使用ES6+语法
- 变量名使用驼峰命名法，首字母小写
- 函数名使用驼峰命名法，首字母小写
- 类名使用驼峰命名法，首字母大写
- 每个组件和函数添加适当的注释

## 许可证

本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目负责人: [CelestialVisionary](mailto:zilvdebao@outlook.com)
- 技术支持: [技术团队](mailto:support@example.com)
- 项目官网: [https://www.guardianbank.example.com](https://www.guardianbank.example.com)

## 鸣谢

感谢所有为项目做出贡献的团队成员和开源社区！

## 部署到GitHub

1. 首先，在GitHub上创建一个新的仓库
2. 确保您的本地项目已经初始化Git仓库（可使用项目中的`init-git.bat`脚本）
3. 运行`push-to-github.bat`脚本
4. 按照提示输入您的GitHub仓库URL
5. 脚本将自动配置远程仓库并推送代码

### 注意事项
- 确保您已安装Git并配置了GitHub凭证
- 仓库URL格式应为：`https://github.com/您的用户名/仓库名.git` 或 `git@github.com:您的用户名/仓库名.git`
- 如果推送失败，请检查网络连接和GitHub仓库权限

## 常见问题

1. **无法推送代码**：请确保您对目标GitHub仓库有写入权限，并且网络连接正常
2. **Git未找到**：请确保Git已安装并添加到系统PATH环境变量中
3. **文件被忽略**：检查`.gitignore`文件，确保没有意外忽略必要的文件