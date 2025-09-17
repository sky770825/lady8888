// 2025年現代化美業網站互動功能 - 無障礙優化版
document.addEventListener('DOMContentLoaded', function() {
    console.log('網站載入完成，開始初始化功能...');
    
    try {
        initLoading();
        initThemeToggle();
        initNavigation();
        initScrollEffects();
        initHeroAnimations();
        initServiceFilter();
        initGallery();
        initTestimonials();
        initContactForm();
        initBackToTop();
        initScrollAnimations();
        initEmailJS();
        initAccessibility();
        initImageLazyLoading();
        
        console.log('所有功能初始化完成');
    } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
        // 錯誤追蹤 (可整合 Sentry)
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error);
        }
    }
});

// 初始化EmailJS
function initEmailJS() {
    // EmailJS Public Key
    emailjs.init("KomhlkEK2lewNA7kM");
}

// 載入動畫
function initLoading() {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 500);
    }, 3000);
}

// 主題切換功能
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// 導航功能
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    console.log('初始化導航功能，找到', navLinks.length, '個導航連結');
    
    // 首頁展示卡片點擊事件
    const showcaseItems = document.querySelectorAll('.showcase-item');
    showcaseItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            console.log('首頁卡片被點擊:', index);
            scrollToSection('#rental');
        });
    });
    
    // 漢堡選單切換
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // 滾動時導航欄樣式變化
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        });
    }
    
    // 導航連結點擊事件
    navLinks.forEach((link, index) => {
        console.log(`設置導航連結 ${index + 1}:`, link.getAttribute('href'));
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('導航連結被點擊:', this.getAttribute('href'));
            
            // 關閉手機版選單
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // 獲取目標區塊
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
            
            // 更新活動狀態
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 通用滾動到指定區塊的函數
function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    
    console.log('目標ID:', targetId);
    console.log('找到目標區塊:', targetSection);
    
    if (targetSection) {
        // 計算滾動位置（考慮固定導航欄高度）
        const offsetTop = targetSection.offsetTop - 70;
        
        console.log('滾動到位置:', offsetTop);
        
        // 平滑滾動到目標位置
        window.scrollTo({ 
            top: Math.max(0, offsetTop), 
            behavior: 'smooth' 
        });
        
        console.log('導航完成');
    } else {
        console.error('找不到目標區塊:', targetId);
        // 備用方案：直接滾動到頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 滾動效果
function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Hero區塊動畫
function initHeroAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumbers = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    };
    
    const heroSection = document.getElementById('home');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(heroSection);
    
    const showcaseItems = document.querySelectorAll('.showcase-item');
    let currentIndex = 0;
    
    setInterval(() => {
        showcaseItems.forEach(item => item.classList.remove('active'));
        currentIndex = (currentIndex + 1) % showcaseItems.length;
        showcaseItems[currentIndex].classList.add('active');
    }, 3000);
}

// 服務篩選功能
function initServiceFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// 畫廊燈箱功能
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item, .about-gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxInfo = lightbox.querySelector('.lightbox-info');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            let title, description;
            
            // 檢查是否為關於我們區塊的圖片
            if (this.classList.contains('about-gallery-item')) {
                title = '專業美業環境';
                description = '採用2025年最新設計理念，結合玫瑰金與米色配色，營造時尚優雅的氛圍';
            } else {
                title = this.querySelector('h3').textContent;
                description = this.querySelector('p').textContent;
            }
            
            // 檢查是否有圖片
            const img = this.querySelector('img');
            if (img) {
                // 如果有圖片，顯示圖片
                lightboxImage.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">`;
            } else {
                // 如果沒有圖片，顯示圖標
                const icon = this.querySelector('.gallery-image i').className;
                lightboxImage.innerHTML = `<i class="${icon}"></i>`;
            }
            
            lightboxInfo.querySelector('h3').textContent = title;
            lightboxInfo.querySelector('p').textContent = description;
            
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

// 客戶評價輪播
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentIndex);
    }
    
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    
    setInterval(nextTestimonial, 5000);
}

// 聯絡表單功能
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            sendEmail();
        }
    });
    
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!name) {
            showError('請輸入姓名');
            return false;
        }
        
        if (!phone) {
            showError('請輸入電話號碼');
            return false;
        }
        
        if (!isValidPhone(phone)) {
            showError('請輸入有效的電話號碼');
            return false;
        }
        
        if (!email) {
            showError('請輸入電子郵件');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showError('請輸入有效的電子郵件');
            return false;
        }
        
        return true;
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
        return phoneRegex.test(phone) && phone.length >= 8;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function sendEmail() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // 顯示載入狀態
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>發送中...</span>';
        submitBtn.disabled = true;
        
        // 收集表單數據
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value.trim()
        };
        
        // 使用EmailJS發送郵件
        emailjs.send('service_e9dc8xx', 'template_contact', {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service_type: formData.service || '未選擇',
            appointment_date: formData.date || '未選擇',
            message: formData.message || '無特殊要求',
            to_email: 'liny14705@gmail.com'
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccess('預約成功！我們將盡快與您聯繫。');
            contactForm.reset();
            showBookingModal();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            showError('發送失敗，請稍後再試或直接致電聯繫我們。');
        })
        .finally(function() {
            // 恢復按鈕狀態
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// 顯示預約成功模態框
function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// 關閉模態框
function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// 回到頂部按鈕
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 滾動動畫
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.about-card, .service-card, .gallery-item, .achievement-item, .contact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// 響應式處理
function handleResize() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// 工具函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 無障礙性功能初始化
function initAccessibility() {
    // 跳過導航連結
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '跳至主要內容';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // 改善鍵盤導航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // 改善 focus 樣式
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}

// 圖片懶載入功能
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 降級處理
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// 改善表單驗證
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    function validateField(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        // 清除之前的狀態
        formGroup.classList.remove('error', 'success');
        errorElement.classList.remove('show');
        
        // 驗證邏輯
        if (field.hasAttribute('required') && !field.value.trim()) {
            showError(formGroup, errorElement, '此欄位為必填');
            return false;
        }
        
        if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            showError(formGroup, errorElement, '請輸入有效的電子郵件');
            return false;
        }
        
        if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            showError(formGroup, errorElement, '請輸入有效的電話號碼');
            return false;
        }
        
        // 成功狀態
        if (field.value.trim()) {
            formGroup.classList.add('success');
        }
        
        return true;
    }
    
    function clearError(e) {
        const formGroup = e.target.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
    }
    
    function showError(formGroup, errorElement, message) {
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// 更新現有的聯絡表單功能
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // 初始化表單驗證
    initFormValidation();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            sendEmail();
        }
    });
    
    function validateForm() {
        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message');
            
            if (!input.value.trim()) {
                showError(formGroup, errorElement, '此欄位為必填');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                showError(formGroup, errorElement, '請輸入有效的電子郵件');
                isValid = false;
            } else if (input.type === 'tel' && !isValidPhone(input.value)) {
                showError(formGroup, errorElement, '請輸入有效的電話號碼');
                isValid = false;
            } else {
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
                errorElement.classList.remove('show');
            }
        });
        
        return isValid;
    }
    
    function showError(formGroup, errorElement, message) {
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
        return phoneRegex.test(phone) && phone.length >= 8;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function sendEmail() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // 顯示載入狀態
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>發送中...</span>';
        submitBtn.disabled = true;
        
        // 收集表單數據
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value.trim()
        };
        
        // 使用EmailJS發送郵件
        emailjs.send('service_e9dc8xx', 'template_contact', {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service_type: formData.service || '未選擇',
            appointment_date: formData.date || '未選擇',
            message: formData.message || '無特殊要求',
            to_email: 'liny14705@gmail.com'
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccess('預約成功！我們將盡快與您聯繫。');
            contactForm.reset();
            showBookingModal();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            showError('發送失敗，請稍後再試或直接致電聯繫我們。');
        })
        .finally(function() {
            // 恢復按鈕狀態
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'assertive');
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        successDiv.textContent = message;
        successDiv.setAttribute('role', 'alert');
        successDiv.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
