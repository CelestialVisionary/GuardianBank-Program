@echo off
cd /d d:\GuardianBank Program
rem 删除backend目录下的.git文件夹（如果存在）
if exist backend\.git (rmdir /s /q backend\.git)
rem 在项目根目录初始化git
git init
rem 添加所有文件到暂存区
git add .
rem 提交更改
git commit -m "Initial commit"
echo Git仓库初始化完成！