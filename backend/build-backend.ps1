# 切换到脚本所在目录
Set-Location -Path $PSScriptRoot

# 清理之前的构建结果
if (Test-Path "target") {
    Remove-Item -Path "target" -Recurse -Force
}

# 构建项目
& mvn clean package

# 检查构建是否成功
if (Test-Path "target\guardianbank-backend-1.0.0.jar") {
    Write-Host "构建成功！可执行jar文件已生成：target\guardianbank-backend-1.0.0.jar"
} else {
    Write-Host "构建失败，未生成可执行jar文件"
}

# 暂停以便查看结果
Read-Host -Prompt "按Enter键继续..."