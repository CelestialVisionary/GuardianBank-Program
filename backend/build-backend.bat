@echo off
REM 切换到当前目录
cd /d %~dp0

REM 清理之前的构建结果
if exist target (rmdir /s /q target)

REM 构建项目
mvn clean package

REM 检查构建是否成功
if exist target\guardianbank-backend-1.0.0.jar (
echo 构建成功！可执行jar文件已生成：target\guardianbank-backend-1.0.0.jar
) else (
echo 构建失败，未生成可执行jar文件
)
pause