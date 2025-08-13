@echo off
cls

:: 设置项目根目录
set PROJECT_ROOT=d:\GuardianBank Program

:: 检查是否以管理员身份运行
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo 请以管理员身份运行此批处理文件！
    pause
exit /b 1
)

:: 依赖检查
echo [1/5] 正在检查依赖...
where mvn >nul 2>&1
if %errorLevel% NEQ 0 (
    echo 错误: 未找到 Maven，请确保已安装 Maven 并添加到环境变量中。
    pause
exit /b 1
)

where node >nul 2>&1
if %errorLevel% NEQ 0 (
    echo 错误: 未找到 Node.js，请确保已安装 Node.js 并添加到环境变量中。
    pause
exit /b 1
)

where npm >nul 2>&1
if %errorLevel% NEQ 0 (
    echo 错误: 未找到 npm，请确保已安装 Node.js (包含 npm) 并添加到环境变量中。
    pause
exit /b 1
)

echo 依赖检查完成！

:: 构建后端
echo [2/5] 正在构建后端服务...
cd /d %PROJECT_ROOT%\backend
if %errorLevel% NEQ 0 (
    echo 错误: 无法切换到后端目录。
    pause
exit /b 1
)

mvn clean package -DskipTests
if %errorLevel% NEQ 0 (
    echo 错误: 后端构建失败。
    pause
exit /b 1
)

echo 后端构建完成！

:: 启动后端
echo [3/5] 正在启动后端服务...
start "Backend Server" cmd /k "java -jar target\guardianbank-backend-1.0.0.jar"
if %errorLevel% NEQ 0 (
    echo 错误: 后端服务启动失败。
    pause
exit /b 1
)

echo 后端服务已启动！

:: 安装前端依赖
echo [4/5] 正在安装前端依赖...
cd /d %PROJECT_ROOT%\frontend
if %errorLevel% NEQ 0 (
    echo 错误: 无法切换到前端目录。
    pause
exit /b 1
)

npm install
if %errorLevel% NEQ 0 (
    echo 错误: 前端依赖安装失败。
    pause
exit /b 1
)

echo 前端依赖安装完成！

:: 启动前端
echo [5/5] 正在启动前端服务...
start "Frontend Server" cmd /k "npm start"
if %errorLevel% NEQ 0 (
    echo 错误: 前端服务启动失败。
    pause
exit /b 1
)

echo 前端服务已启动！

:: 等待服务启动
 echo 正在等待服务启动...
 timeout /t 20 /nobreak >nul

:: 显示启动成功信息
cls
echo =====================================
echo 项目启动成功！
echo -------------------------------------
echo 后端服务已在新窗口启动
 echo 前端服务已在新窗口启动
 echo 请确保两个服务都正常运行
 echo
 echo 访问地址:
 echo 前端: http://localhost:3000
 echo 后端: http://localhost:8080
 echo
 echo 按任意键停止所有服务并退出...
 echo =====================================

:: 等待用户按键
pause >nul

:: 停止服务
echo 正在停止所有服务...

taskkill /IM java.exe /F >nul 2>&1
taskkill /IM node.exe /F >nul 2>&1

echo 所有服务已停止。
 echo 感谢使用 GuardianBank 项目启动脚本！

pause