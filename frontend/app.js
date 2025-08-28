// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuBtn = document.querySelector('.menu-btn');
    const navUl = document.querySelector('nav ul');
    
    menuBtn.addEventListener('click', function() {
        navUl.classList.toggle('expanded');
    });
    // 初始化图片懒加载
    lazyLoadImages();
    // 添加滚动事件监听器以继续懒加载
    window.addEventListener('scroll', lazyLoadImages);
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



    // 从后端API获取服务数据 - 优化版
    function fetchServices(retryCount = 0) {
        // 检查缓存
        const cachedData = localStorage.getItem('servicesData');
        if (cachedData) {
            console.log('使用缓存的服务数据');
            renderServices(JSON.parse(cachedData));
            return;
        }

        console.log('开始从后端获取服务数据...');
        console.log('请求URL:', 'http://backend:8080/api/services');
        fetch('http://localhost:8080/api/services')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误! 状态码: ${response.status}`);
                }
                // 确保正确处理中文
                return response.text().then(text => {
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
                // 缓存数据
                localStorage.setItem('servicesData', JSON.stringify(data));
                // 渲染服务
                renderServices(data);
            })
            .catch(error => {
                console.error('获取服务数据失败:', error);
                // 指数退避重试机制
                const maxRetries = 3;
                if (retryCount < maxRetries) {
                    const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                    console.log(`将在${delay}毫秒后重试...`);
                    setTimeout(() => fetchServices(retryCount + 1), delay);
                } else {
                    // 显示错误信息给用户
                    const serviceCards = document.querySelector('.service-cards');
                    serviceCards.innerHTML = `
                        <div class="error-message">
                            <p>无法获取服务数据: ${error.message}</p>
                            <button onclick="fetchServices()">重试</button>
                        </div>
                    `;
                }
            });
    }

    // 渲染服务数据
    function renderServices(data) {
        const serviceCards = document.querySelector('.service-cards');
        // 清空现有内容
        serviceCards.innerHTML = '';
        // 创建文档片段以减少DOM操作
        const fragment = document.createDocumentFragment();
        // 动态生成服务卡片
        data.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            // 为每个卡片添加懒加载图片
            card.innerHTML = `
                <img data-src="https://picsum.photos/300/200?random=${index + 1}" alt="${service}" class="lazy-image">
                <h3>${service}</h3>
                <p>探索我们的${service}服务，满足您的金融需求。</p>
            `;
            fragment.appendChild(card);
        });
        // 一次性添加所有卡片到DOM
        serviceCards.appendChild(fragment);
        // 触发懒加载检查
        lazyLoadImages();
    }

    // 调用函数获取服务数据
    console.log('页面加载完成，准备调用fetchServices函数');
    // 使用requestAnimationFrame优化性能
    window.requestAnimationFrame(fetchServices);

    // 图片懒加载函数
    function lazyLoadImages() {
        // 获取所有带有data-src属性的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // 检查每张图片是否在视口内
        lazyImages.forEach(image => {
            const rect = image.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible) {
                // 如果图片在视口内，加载图片
                image.src = image.getAttribute('data-src');
                // 移除data-src属性，避免重复加载
                image.removeAttribute('data-src');
            }
        });
    }

    // 联系表单验证
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 清除之前的错误提示
            clearErrors();
            
            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            let isValid = true;
            
            // 验证姓名
            if (!name.trim()) {
                showError('name', '姓名不能为空');
                isValid = false;
            }
            
            // 验证邮箱
            if (!email.trim()) {
                showError('email', '邮箱不能为空');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', '请输入有效的邮箱地址');
                isValid = false;
            }
            
            // 验证留言内容
            if (!message.trim()) {
                showError('message', '留言内容不能为空');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', '留言内容至少需要10个字符');
                isValid = false;
            }
            
            // 如果验证通过，提交表单
            if (isValid) {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // 发送数据到服务器
                fetch('http://backend:8080/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    alert('提交成功！我们会尽快回复您。');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('提交失败:', error);
                    alert('提交失败，请稍后再试。');
                });
            }
        });
    }

    // 邮箱验证函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 显示错误信息
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.2rem';
        
        // 将错误信息添加到表单组
        const formGroup = field.closest('.form-group');
        formGroup.appendChild(errorElement);
        
        // 高亮显示错误字段
        field.style.borderColor = 'red';
    }

    // 清除所有错误信息
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // 重置字段样式
        const fields = document.querySelectorAll('#contactForm input, #contactForm textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }
});