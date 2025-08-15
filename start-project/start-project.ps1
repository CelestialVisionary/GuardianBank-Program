# GuardianBank项目启动脚本（PowerShell版）

# 设置项目根目录
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = Split-Path -Parent $PROJECT_ROOT

# 检查依赖
Write-Host "[1/5] 正在检查依赖..."
if (-not (Get-Command "mvn" -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 Maven，请确保已安装 Maven 并添加到环境变量中。"
    pause
    exit 1
}

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 Node.js，请确保已安装 Node.js 并添加到环境变量中。"
    pause
    exit 1
}

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 npm，请确保已安装 Node.js (包含 npm) 并添加到环境变量中。"
    pause
    exit 1
}

Write-Host "依赖检查完成！"

# 构建后端
Write-Host "[2/5] 正在构建后端服务..."
Set-Location -Path "$PROJECT_ROOT\backend"
if (-not $?) {
    Write-Host "错误: 无法切换到后端目录。"
    pause
    exit 1
}

mvn clean package -DskipTests
if (-not $?) {
    Write-Host "错误: 后端构建失败。"
    pause
    exit 1
}

Write-Host "后端构建完成！"

# 启动后端
Write-Host "[3/5] 正在启动后端服务..."
Start-Process -FilePath "java" -ArgumentList "-jar", "target\guardianbank-backend-1.0.0.jar" -WindowStyle Normal
if (-not $?) {
    Write-Host "错误: 后端服务启动失败。"
    pause
    exit 1
}

Write-Host "后端服务已启动！"

# 安装前端依赖
Write-Host "[4/5] 正在安装前端依赖..."
Set-Location -Path "$PROJECT_ROOT\frontend"
if (-not $?) {
    Write-Host "错误: 无法切换到前端目录。"
    pause
    exit 1
}

npm install
if (-not $?) {
    Write-Host "错误: 前端依赖安装失败。"
    pause
    exit 1
}

Write-Host "前端依赖安装完成！"

# 启动前端
Write-Host "[5/5] 正在启动前端服务..."
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Normal
if (-not $?) {
    Write-Host "错误: 前端服务启动失败。"
    pause
    exit 1
}

Write-Host "前端服务已启动！"

# 等待服务启动
Write-Host "正在等待服务启动..."
Start-Sleep -Seconds 20

# 显示启动成功信息
Clear-Host
Write-Host "====================================="
Write-Host "项目启动成功！"
Write-Host "-------------------------------------"
Write-Host "后端服务已在新窗口启动"
Write-Host "前端服务已在新窗口启动"
Write-Host "请确保两个服务都正常运行"
Write-Host ""
Write-Host "访问地址:"
Write-Host "前端: http://localhost:3000"
Write-Host "后端: http://localhost:8080"
Write-Host ""
Write-Host "按任意键停止所有服务并退出..."
Write-Host "====================================="

# 等待用户按键
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

# 停止服务
Write-Host "正在停止所有服务..."
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "所有服务已停止。"
Write-Host "感谢使用 GuardianBank 项目启动脚本！"

pause