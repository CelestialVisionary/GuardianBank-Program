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
            // 创建一个临时的消息提示
            showNotification('感谢您的关注！我们的服务即将上线。', 'success');
        });
    }

    // 为登录按钮添加点击事件
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('登录功能正在开发中，敬请期待！', 'info');
        });
    }
    
    // 显示通知消息
    function showNotification(message, type = 'info') {
        // 检查是否已存在通知，如果存在则移除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建新通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 添加显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // 动画完成后移除元素
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
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
        // 创建加载指示器
        showLoadingState();
        
        // 尝试连接两个可能的后端URL
        const backendUrls = ['http://localhost:8080/api/services', 'http://backend:8080/api/services'];
        
        // 使用Promise.race来尝试多个URL
        Promise.race(backendUrls.map(url => {
            console.log('尝试请求URL:', url);
            return fetch(url, {
                timeout: 5000 // 5秒超时
            })
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
                        throw new Error('数据解析错误');
                    }
                });
            })
            .catch(error => {
                console.error(`从${url}获取数据失败:`, error);
                throw error;
            });
        }))
        .then(data => {
            console.log('成功获取服务数据:', data);
            // 缓存数据，设置过期时间
            const dataWithExpiry = {
                data: data,
                expiry: new Date().getTime() + (10 * 60 * 1000) // 10分钟过期
            };
            localStorage.setItem('servicesData', JSON.stringify(dataWithExpiry));
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
                
                // 显示重试倒计时
                showRetryCountdown(delay, retryCount + 1);
                
                setTimeout(() => fetchServices(retryCount + 1), delay);
            } else {
                // 显示错误信息给用户
                showErrorState(error);
                
                // 尝试使用默认服务数据
                const defaultServices = ['个人 banking', '企业金融', '投资理财'];
                console.log('使用默认服务数据');
                
                // 创建延迟，让用户看到错误信息后再显示默认数据
                setTimeout(() => {
                    renderServices(defaultServices);
                    
                    // 添加提示信息，告知用户当前使用的是默认数据
                    const serviceCards = document.querySelector('.service-cards');
                    const notification = document.createElement('div');
                    notification.className = 'default-data-notification';
                    notification.textContent = '当前显示的是默认服务数据，您可以稍后刷新页面尝试获取最新数据';
                    serviceCards.prepend(notification);
                    
                    // 5秒后自动隐藏通知
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 300);
                    }, 5000);
                }, 2000);
            }
        })
        .finally(() => {
            // 无论成功或失败，都隐藏加载指示器
            hideLoadingState();
        });
    }
    
    // 显示加载状态
    function showLoadingState() {
        const serviceCards = document.querySelector('.service-cards');
        serviceCards.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>正在加载服务数据...</p>
            </div>
        `;
    }
    
    // 隐藏加载状态
    function hideLoadingState() {
        // 可以在这里添加隐藏动画
    }
    
    // 显示错误状态
    function showErrorState(error) {
        const serviceCards = document.querySelector('.service-cards');
        serviceCards.innerHTML = `
            <div class="error-message">
                <p>无法获取服务数据</p>
                <p class="error-details">${error.message}</p>
                <button class="retry-button" onclick="window.location.reload()">刷新页面</button>
            </div>
        `;
    }
    
    // 显示重试倒计时
    function showRetryCountdown(delay, retryNum) {
        const serviceCards = document.querySelector('.service-cards');
        const seconds = delay / 1000;
        serviceCards.innerHTML = `
            <div class="retry-countdown">
                <p>连接失败，正在第 ${retryNum} 次尝试重连...</p>
                <p>将在 ${seconds} 秒后重试</p>
            </div>
        `;
    }

    // 渲染服务数据
    function renderServices(data) {
        const serviceCards = document.querySelector('.service-cards');
        // 清空现有内容
        serviceCards.innerHTML = '';
        
        // 检查数据格式并进行适配
        let servicesToRender = [];
        
        // 处理从后端获取的完整服务对象数组
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
            servicesToRender = data;
        }
        // 处理从缓存或其他地方获取的服务名称数组
        else if (Array.isArray(data)) {
            // 将名称数组转换为对象数组，以便统一处理
            servicesToRender = data.map((name, index) => ({
                name: name,
                description: `探索我们的${name}服务，满足您的金融需求。`,
                type: getServiceType(name)
            }));
        }
        
        // 创建文档片段以减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 动态生成服务卡片
        servicesToRender.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // 根据服务类型设置不同的图标或样式
            let typeIcon = '';
            if (service.type === '个人' || service.name.includes('个人')) {
                typeIcon = '👤';
            } else if (service.type === '企业' || service.name.includes('企业')) {
                typeIcon = '🏢';
            } else if (service.type === '投资' || service.name.includes('投资')) {
                typeIcon = '📈';
            }
            
            // 为每个卡片添加懒加载图片和更丰富的内容
            card.innerHTML = `
                <div class="card-header">
                    <img data-src="https://picsum.photos/300/200?random=${index + 1}" alt="${service.name}" class="lazy-image">
                    <span class="service-type">${typeIcon}</span>
                </div>
                <h3>${service.name}</h3>
                <p>${service.description || `探索我们的${service.name}服务，满足您的金融需求。`}</p>
                <button class="service-detail-btn">了解详情</button>
            `;
            
            // 为详情按钮添加点击事件
            const detailBtn = card.querySelector('.service-detail-btn');
            detailBtn.addEventListener('click', function() {
                showServiceDetail(service);
            });
            
            fragment.appendChild(card);
        });
        
        // 一次性添加所有卡片到DOM
        serviceCards.appendChild(fragment);
        
        // 触发懒加载检查
        lazyLoadImages();
    }
    
    // 根据服务名称获取服务类型
    function getServiceType(name) {
        if (name.includes('个人')) return '个人';
        if (name.includes('企业')) return '企业';
        if (name.includes('投资')) return '投资';
        return '其他';
    }
    
    // 显示服务详情
    function showServiceDetail(service) {
        // 在实际应用中，这里可以跳转到详情页或显示模态框
        alert(`您正在查看 ${service.name} 的详细信息\n\n${service.description || '暂无详细描述'}`);
    }

    // 账户余额和交易历史功能
    function initAccountFeatures() {
        const accountModal = document.getElementById('accountModal');
        const accountLink = document.querySelector('.account-link');
        const closeBtn = document.querySelector('.close-btn');
        const refreshBalanceBtn = document.getElementById('refreshBalance');

        // 打开账户模态框
        accountLink.addEventListener('click', function(e) {
            e.preventDefault();
            accountModal.style.display = 'block';
            fetchAccountBalance();
            fetchRecentTransactions();
        });

        // 关闭账户模态框
        closeBtn.addEventListener('click', function() {
            accountModal.style.display = 'none';
        });

        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target === accountModal) {
                accountModal.style.display = 'none';
            }
        });

        // 刷新余额按钮
        refreshBalanceBtn.addEventListener('click', fetchAccountBalance);
    }

    // 获取账户余额
    function fetchAccountBalance(retryCount = 0) {
        const balanceDisplay = document.getElementById('balanceDisplay');
        balanceDisplay.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div></div>';

        const backendUrls = ['http://localhost:8080/api/account/balance', 'http://backend:8080/api/account/balance'];

        Promise.race(backendUrls.map(url => {
            return fetch(url, { timeout: 5000 })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
                    return response.json();
                })
                .catch(error => {
                    console.error(`从${url}获取余额失败:`, error);
                    throw error;
                });
        }))
        .then(data => {
            balanceDisplay.innerHTML = `
                <div class="balance-amount">¥${data.balance.toFixed(2)}</div>
                <div class="balance-update">最后更新: ${new Date(data.updateTime).toLocaleString()}</div>
            `;
        })
        .catch(error => {
            if (retryCount < 2) {
                setTimeout(() => fetchAccountBalance(retryCount + 1), Math.pow(2, retryCount) * 1000);
            } else {
                balanceDisplay.innerHTML = `
                    <div class="error-message">
                        <p>无法获取余额数据</p>
                        <button onclick="fetchAccountBalance()">重试</button>
                    </div>
                `;
            }
        });
    }

    // 获取最近交易记录
    function fetchRecentTransactions(retryCount = 0) {
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div></div>';

        const backendUrls = ['http://localhost:8080/api/account/transactions', 'http://backend:8080/api/account/transactions'];

        Promise.race(backendUrls.map(url => {
            return fetch(url, { timeout: 5000 })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
                    return response.json();
                })
                .catch(error => {
                    console.error(`从${url}获取交易记录失败:`, error);
                    throw error;
                });
        }))
        .then(transactions => {
            if (transactions.length === 0) {
                transactionsList.innerHTML = '<p class="no-transactions">暂无交易记录</p>';
                return;
            }

            const fragment = document.createDocumentFragment();
            transactions.slice(0, 5).forEach(transaction => {
                const item = document.createElement('div');
                item.className = `transaction-item ${transaction.type === '支出' ? 'expense' : 'income'}`;
                item.innerHTML = `
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
                    <div class="transaction-desc">${transaction.description}</div>
                    <div class="transaction-amount">${transaction.amount > 0 ? '+' : ''}¥${transaction.amount.toFixed(2)}</div>
                `;
                fragment.appendChild(item);
            });
            transactionsList.appendChild(fragment);
        })
        .catch(error => {
            if (retryCount < 2) {
                setTimeout(() => fetchRecentTransactions(retryCount + 1), Math.pow(2, retryCount) * 1000);
            } else {
                transactionsList.innerHTML = `
                    <div class="error-message">
                        <p>无法获取交易记录</p>
                        <button onclick="fetchRecentTransactions()">重试</button>
                    </div>
                `;
            }
        });
    }

    // 初始化账户功能
    window.requestAnimationFrame(initAccountFeatures);

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

    // 联系表单验证和提交
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // 为输入框添加实时验证
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            // 输入时移除错误提示
            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                const errorElement = formGroup.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
                this.style.borderColor = '';
            });
        });
        
        // 表单提交处理
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
                // 显示提交中状态
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner-small"></span> 提交中...';
                
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // 尝试连接两个可能的后端URL
                const backendUrls = ['http://localhost:8080/api/contact', 'http://backend:8080/api/contact'];
                
                // 使用Promise.race来尝试多个URL
                Promise.race(backendUrls.map(url => {
                    return fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                        timeout: 10000 // 10秒超时
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP错误! 状态码: ${response.status}`);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`从${url}提交数据失败:`, error);
                        throw error;
                    });
                }))
                .then(result => {
                    console.log('提交成功:', result);
                    // 重置表单
                    contactForm.reset();
                    // 显示成功消息
                    showNotification('提交成功！我们会尽快回复您。', 'success');
                })
                .catch(error => {
                    console.error('提交失败:', error);
                    // 显示错误消息
                    showNotification('提交失败，请稍后再试。', 'error');
                })
                .finally(() => {
                    // 恢复按钮状态
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            }
        });
    }
    
    // 验证单个输入框
    function validateInput(input) {
        const id = input.id;
        const value = input.value;
        
        // 清除之前的错误
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.style.borderColor = '';
        
        // 根据字段ID进行相应验证
        if (id === 'name' && !value.trim()) {
            showError('name', '姓名不能为空');
            return false;
        }
        
        if (id === 'email') {
            if (!value.trim()) {
                showError('email', '邮箱不能为空');
                return false;
            } else if (!isValidEmail(value)) {
                showError('email', '请输入有效的邮箱地址');
                return false;
            }
        }
        
        if (id === 'message') {
            if (!value.trim()) {
                showError('message', '留言内容不能为空');
                return false;
            } else if (value.length < 10) {
                showError('message', '留言内容至少需要10个字符');
                return false;
            }
        }
        
        return true;
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