// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const ctaBtn = document.querySelector('.cta-btn');
    const loginBtn = document.querySelector('.login-btn a');
    const navLinks = document.querySelectorAll('nav ul li a');

    // 为CTA按钮添加点击事件
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            alert('感谢您的关注！我们的服务即将上线。');
        });
    }

    // 为登录按钮添加点击事件
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('登录功能正在开发中，敬请期待！');
        });
    }

    // 为导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认行为
            e.preventDefault();

            // 获取目标id
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // 滚动到目标位置
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 响应式导航菜单
    function handleResize() {
        const nav = document.querySelector('nav ul');
        const header = document.querySelector('header');

        if (window.innerWidth <= 768) {
            if (header.classList.contains('expanded')) {
                nav.style.display = 'flex';
            } else {
                nav.style.display = 'none';
            }
        } else {
            nav.style.display = 'flex';
        }
    }

    // 初始调整
    handleResize();

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 添加导航菜单切换按钮
    const menuBtn = document.createElement('button');
    menuBtn.classList.add('menu-btn');
    menuBtn.textContent = '菜单';
    menuBtn.style.display = 'none';

    // 添加到header
    const header = document.querySelector('header');
    header.insertBefore(menuBtn, header.firstChild);

    // 菜单按钮点击事件
    menuBtn.addEventListener('click', function() {
        header.classList.toggle('expanded');
        handleResize();
    });

    // 根据屏幕宽度显示/隐藏菜单按钮
    function toggleMenuBtn() {
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        } else {
            menuBtn.style.display = 'none';
            header.classList.remove('expanded');
        }
    }

    // 初始切换
    toggleMenuBtn();

    // 监听窗口大小变化
    window.addEventListener('resize', toggleMenuBtn);

    // 从后端API获取服务数据
    function fetchServices() {
        console.log('开始从后端获取服务数据...');
        console.log('请求URL:', 'http://localhost:8080/api/services');
        fetch('http://localhost:8080/api/services')
            .then(response => {
                console.log('响应对象:', response);
                console.log('响应状态:', response.status);
                console.log('响应状态文本:', response.statusText);
                console.log('响应头部:', response.headers);
                // 确保正确处理中文
                return response.text().then(text => {
                    console.log('响应文本:', text);
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        console.error('JSON解析错误:', e);
                        throw e;
                    }
                });
            })
            .then(data => {
                console.log('成功获取服务数据:', data);
                const serviceCards = document.querySelector('.service-cards');
                // 清空现有内容
                serviceCards.innerHTML = '';
                // 动态生成服务卡片
                data.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <h3>${service}</h3>
                        <p>探索我们的${service}服务，满足您的金融需求。</p>
                    `;
                    serviceCards.appendChild(card);
                });
            })
            .catch(error => {
                console.error('获取服务数据失败:', error);
                console.error('错误名称:', error.name);
                console.error('错误堆栈:', error.stack);
                // 显示错误信息给用户
                const serviceCards = document.querySelector('.service-cards');
                serviceCards.innerHTML = `
                    <div class="error-message">
                        <p>无法获取服务数据: ${error.message}</p>
                        <p>错误名称: ${error.name}</p>
                        <button onclick="fetchServices()">重试</button>
                    </div>
                `;
            });
    }

    // 调用函数获取服务数据
    console.log('页面加载完成，准备调用fetchServices函数');
    fetchServices();
});