# GuardianBank项目启动指南（Trae AI版）

## 项目概述
GuardianBank是一个包含后端和前端的完整项目。本指南提供了使用Trae AI自动启动项目的步骤。

## 自动启动方法
Trae AI可以通过以下命令自动启动项目：

### 使用批处理文件
```
cd d:\GuardianBank Program\start-project
start-project.bat
```

### 使用PowerShell脚本
```
cd d:\GuardianBank Program\start-project
powershell -File .\start-project.ps1
```

## 批处理文件功能说明
执行上述命令后，批处理文件将自动执行以下操作：
- 检查Maven和Node.js是否已安装
- 构建后端项目
- 启动后端服务
- 安装前端依赖
- 启动前端服务


## 命令行执行注意事项
在PowerShell中执行命令时可能会遇到与号(&)问题，以下是正确的命令格式：

### 失败的命令示例
```
cd d:\GuardianBank Program\backend
mvn clean package -DskipTests
```

### 正确的命令格式
```
powershell -Command cd 'd:\GuardianBank Program\backend'; mvn clean package -DskipTests
```

### 启动后端服务的正确命令
```
powershell -Command cd 'd:\GuardianBank Program\backend\target'; java -jar guardianbank-backend-1.0.0.jar
```

### 验证后端服务启动成功
服务启动后，可以通过查看日志确认：
1. Tomcat服务器已在端口8080启动：`Tomcat started on port 8080 (http) with context path ''`
2. 应用程序已成功启动：`Started MainApplication in 5.012 seconds`
3. 服务数据初始化成功：`初始化服务数据成功！`

确认成功后，可以通过 http://localhost:8080 访问后端服务
## 服务访问地址
启动完成后，可通过以下地址访问服务：
- 前端: http://localhost:3000
- 后端: http://localhost:8080

## 注意事项
1. 第一次运行时，安装前端依赖可能需要一些时间
2. 如果遇到端口冲突，请修改后端或前端的配置文件
3. 服务会在新窗口启动，执行命令的窗口可以关闭

## 故障排除
- Maven或Node.js未找到: 请确保已安装并添加到环境变量
- 端口冲突: 尝试修改配置文件中的端口号
- 构建失败: 检查网络连接，确保依赖可以下载