// 2025年現代化美業網站互動功能 - 無障礙優化版
function initializeWebsite() {
    console.log('網站載入完成，開始初始化功能...');
    
    try {
        // 關鍵功能 - 立即初始化
        initLoading();
        initNavigation();
        initBackToTop();
        
        // 延遲初始化非關鍵功能
        setTimeout(() => {
            initThemeToggle();
            initScrollEffects();
            initHeroAnimations();
            initScrollAnimations();
            initAccessibility();
            initImageLazyLoading();
        }, 100);
        
        // 進一步延遲初始化複雜功能
        setTimeout(() => {
            initServiceFilter();
            initServiceGallery();
            initGallery();
            initTestimonials();
            initContactForm();
            initEmailJS();
        }, 300);
        
        console.log('核心功能初始化完成，其他功能延遲載入');
    } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
        // 錯誤追蹤 (可整合 Sentry)
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error);
        }
    }
}

// 處理異步載入的情況
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    // 如果DOM已經載入完成，立即執行
    initializeWebsite();
}

// 初始化EmailJS - 異步載入優化
function initEmailJS() {
    // 檢查EmailJS是否已載入
    if (typeof emailjs !== 'undefined') {
        emailjs.init("KomhlkEK2lewNA7kM");
        console.log('EmailJS 初始化完成');
    } else {
        // 如果EmailJS尚未載入，等待載入完成
        const checkEmailJS = setInterval(() => {
            if (typeof emailjs !== 'undefined') {
                emailjs.init("KomhlkEK2lewNA7kM");
                console.log('EmailJS 延遲初始化完成');
                clearInterval(checkEmailJS);
            }
        }, 100);
        
        // 最多等待5秒
        setTimeout(() => {
            clearInterval(checkEmailJS);
            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS 載入超時');
            }
        }, 5000);
    }
}

// 載入動畫 - 修復卡住問題
function initLoading() {
    const loading = document.getElementById('loading');
    
    if (!loading) {
        console.warn('載入動畫元素未找到');
        return;
    }
    
    // 簡化載入邏輯，避免複雜的Promise處理
    const hideLoading = () => {
        loading.classList.add('hidden');
        setTimeout(() => {
            if (loading.parentNode) {
                loading.remove();
            }
        }, 300);
    };
    
    // 檢查頁面是否已經完全載入
    if (document.readyState === 'complete') {
        hideLoading();
        return;
    }
    
    // 監聽頁面載入完成
    window.addEventListener('load', hideLoading);
    
    // 備用計時器，確保載入動畫不會永遠顯示
    setTimeout(hideLoading, 2000);
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

// 服務篩選功能 - 優化版：動態排序
function initServiceFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const servicesGrid = document.querySelector('.services-grid');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // 儲存原始順序
    const originalCards = Array.from(serviceCards);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按鈕狀態
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 篩選卡片
            let filteredCards;
            if (filter === 'all') {
                filteredCards = originalCards;
            } else {
                filteredCards = originalCards.filter(card => 
                    card.getAttribute('data-category') === filter
                );
            }
            
            // 動畫隱藏所有卡片
            serviceCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';
                card.style.transition = 'all 0.3s ease';
            });
            
            // 重新排序和顯示卡片
            setTimeout(() => {
                // 清空網格
                servicesGrid.innerHTML = '';
                
                // 重新添加卡片（已排序）
                filteredCards.forEach((card, index) => {
                    // 重置卡片樣式
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8) translateY(20px)';
                    card.style.transition = 'all 0.3s ease';
                    
                    // 添加到網格
                    servicesGrid.appendChild(card);
                    
                    // 延遲動畫顯示
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, index * 100); // 每個卡片間隔100ms
                });
                
                // 如果沒有匹配的卡片，顯示提示
                if (filteredCards.length === 0) {
                    showNoServicesMessage(filter);
                } else {
                    hideNoServicesMessage();
                }
            }, 300);
        });
    });
    
    // 顯示無服務提示
    function showNoServicesMessage(filter) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-services-message';
        messageDiv.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem 2rem;
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            border: 2px dashed var(--primary-color);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        
        const filterNames = {
            'hair': '美髮服務',
            'nail': '美甲服務', 
            'beauty': '美容服務',
            'makeup': '化妝服務'
        };
        
        messageDiv.innerHTML = `
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">
                <i class="fas fa-search"></i>
            </div>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">
                暫無 ${filterNames[filter] || '此類'} 服務
            </h3>
            <p style="color: var(--text-secondary);">
                我們正在為您準備更多優質的 ${filterNames[filter] || '相關'} 服務，敬請期待！
            </p>
        `;
        
        servicesGrid.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // 隱藏無服務提示
    function hideNoServicesMessage() {
        const existingMessage = servicesGrid.querySelector('.no-services-message');
        if (existingMessage) {
            existingMessage.style.opacity = '0';
            existingMessage.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                existingMessage.remove();
            }, 300);
        }
    }
}

// 服務縮圖畫廊功能
function initServiceGallery() {
    const serviceGalleries = document.querySelectorAll('.service-gallery');
    
    serviceGalleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.main-image img');
        const thumbnails = gallery.querySelectorAll('.thumbnail');
        
        // 為每個縮圖添加點擊和觸控事件
        thumbnails.forEach(thumbnail => {
            const handleThumbnailClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // 阻止事件冒泡到父元素
                
                console.log('縮圖被點擊:', thumbnail);
                
                const newSrc = thumbnail.getAttribute('data-src');
                const newAlt = thumbnail.querySelector('img').getAttribute('alt');
                
                // 更新主圖片
                if (mainImage) {
                    mainImage.src = newSrc;
                    mainImage.alt = newAlt;
                }
                
                // 更新縮圖狀態
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
                
                // 添加觸控反饋
                thumbnail.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    thumbnail.style.transform = '';
                }, 150);
            };
            
            // 添加點擊事件
            thumbnail.addEventListener('click', handleThumbnailClick, true); // 使用捕獲階段
            
            // 添加觸控事件（防止雙重觸發）
            let touchStartTime = 0;
            thumbnail.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                e.preventDefault();
                e.stopPropagation();
            }, true);
            
            thumbnail.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 500) { // 短觸控
                    handleThumbnailClick(e);
                }
            }, true);
        });
    });
}

// 畫廊燈箱功能
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item, .about-gallery-item, .service-gallery-item');
    const mainImages = document.querySelectorAll('.main-image');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxInfo = lightbox.querySelector('.lightbox-info');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const currentImageSpan = lightbox.querySelector('.current-image');
    const totalImagesSpan = lightbox.querySelector('.total-images');
    
    // 燈箱狀態
    let currentServiceCard = null;
    let currentImageIndex = 0;
    let currentImages = [];
    
    console.log('燈箱初始化，找到', galleryItems.length, '個畫廊項目和', mainImages.length, '個主圖片');
    
    // 獲取服務卡片的所有圖片
    function getServiceImages(serviceCard) {
        const thumbnails = serviceCard.querySelectorAll('.thumbnail');
        return Array.from(thumbnails).map(thumb => ({
            src: thumb.getAttribute('data-src'),
            alt: thumb.querySelector('img').getAttribute('alt')
        }));
    }
    
    // 更新燈箱圖片
    function updateLightboxImage(imageData, index) {
        if (imageData) {
            lightboxImage.innerHTML = `<img src="${imageData.src}" alt="${imageData.alt}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">`;
            currentImageIndex = index;
            currentImageSpan.textContent = index + 1;
        }
    }
    
    // 顯示上一張圖片
    function showPreviousImage() {
        if (currentImages.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage(currentImages[currentImageIndex], currentImageIndex);
        }
    }
    
    // 顯示下一張圖片
    function showNextImage() {
        if (currentImages.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            updateLightboxImage(currentImages[currentImageIndex], currentImageIndex);
        }
    }
    
    // 測試燈箱功能
    if (lightbox) {
        console.log('燈箱元素找到:', lightbox);
    } else {
        console.error('燈箱元素未找到!');
    }
    
    galleryItems.forEach((item, index) => {
        console.log(`為項目 ${index} 添加點擊事件:`, item);
        
        const handleImageClick = (e) => {
            // 檢查是否點擊的是縮圖或縮圖區域
            if (e.target.closest('.thumbnail') || e.target.closest('.thumbnail-gallery')) {
                console.log('點擊的是縮圖區域，不觸發燈箱');
                return;
            }
            
            // 檢查是否點擊的是主圖片本身
            if (!e.target.closest('.main-image img') && !e.target.closest('.gallery-item img')) {
                console.log('點擊的不是主圖片，不觸發燈箱');
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log('燈箱被點擊:', this);
            
            let title, description;
            
            // 檢查是否為服務卡片的圖片
            if (this.classList.contains('main-image')) {
                const serviceCard = this.closest('.service-card');
                title = serviceCard.querySelector('h3').textContent;
                description = serviceCard.querySelector('p').textContent;
                console.log('服務卡片圖片:', title, description);
            }
            // 檢查是否為關於我們區塊的圖片
            else if (this.classList.contains('about-gallery-item')) {
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
                console.log('顯示圖片:', img.src);
            } else {
                // 如果沒有圖片，顯示圖標
                const icon = this.querySelector('.gallery-image i').className;
                lightboxImage.innerHTML = `<i class="${icon}"></i>`;
            }
            
            lightboxInfo.querySelector('h3').textContent = title;
            lightboxInfo.querySelector('p').textContent = description;
            
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            console.log('燈箱已顯示');
            console.log('燈箱類別:', lightbox.className);
            console.log('燈箱樣式:', window.getComputedStyle(lightbox).display);
        };
        
        // 添加點擊事件（使用捕獲階段，在縮圖事件之後處理）
        item.addEventListener('click', handleImageClick, false);
        
        // 添加觸控事件（防止雙重觸發）
        let touchStartTime = 0;
        item.addEventListener('touchstart', (e) => {
            // 檢查是否點擊的是縮圖
            if (e.target.closest('.thumbnail')) {
                return;
            }
            touchStartTime = Date.now();
            e.preventDefault();
        }, false);
        
        item.addEventListener('touchend', (e) => {
            // 檢查是否點擊的是縮圖
            if (e.target.closest('.thumbnail')) {
                return;
            }
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 500) { // 短觸控
                handleImageClick.call(item, e);
            }
        }, false);
    });
    
    // 為主圖片添加專門的點擊處理器
    mainImages.forEach((mainImage, index) => {
        console.log(`為主圖片 ${index} 添加點擊事件:`, mainImage);
        
        const handleMainImageClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('主圖片被點擊:', mainImage);
            
            let title, description;
            
            // 獲取服務卡片信息
            const serviceCard = mainImage.closest('.service-card');
            if (serviceCard) {
                title = serviceCard.querySelector('h3').textContent;
                description = serviceCard.querySelector('p').textContent;
                console.log('服務卡片圖片:', title, description);
                
                // 初始化燈箱狀態
                currentServiceCard = serviceCard;
                currentImages = getServiceImages(serviceCard);
                currentImageIndex = 0;
                
                // 更新總圖片數
                totalImagesSpan.textContent = currentImages.length;
                
                // 顯示第一張圖片
                if (currentImages.length > 0) {
                    updateLightboxImage(currentImages[0], 0);
                }
            }
            
            // 檢查是否有圖片
            const img = mainImage.querySelector('img');
            if (img && currentImages.length === 0) {
                // 如果沒有縮圖，顯示主圖片
                lightboxImage.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">`;
                console.log('顯示圖片:', img.src);
            } else if (currentImages.length === 0) {
                // 如果沒有圖片，顯示圖標
                const icon = mainImage.querySelector('.gallery-image i').className;
                lightboxImage.innerHTML = `<i class="${icon}"></i>`;
            }
            
            lightboxInfo.querySelector('h3').textContent = title;
            lightboxInfo.querySelector('p').textContent = description;
            
            // 顯示/隱藏導航按鈕
            if (currentImages.length > 1) {
                lightboxPrev.style.display = 'flex';
                lightboxNext.style.display = 'flex';
            } else {
                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';
            }
            
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            console.log('燈箱已顯示');
            console.log('燈箱類別:', lightbox.className);
            console.log('燈箱樣式:', window.getComputedStyle(lightbox).display);
        };
        
        // 添加點擊事件
        mainImage.addEventListener('click', handleMainImageClick);
        
        // 添加觸控事件
        let touchStartTime = 0;
        mainImage.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            e.preventDefault();
        });
        
        mainImage.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 500) { // 短觸控
                handleMainImageClick(e);
            }
        });
    });
    
    // 添加導航按鈕事件
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 添加觸控關閉和滑動切換功能
    let lightboxTouchStartX = 0;
    let lightboxTouchStartY = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        lightboxTouchStartX = e.touches[0].clientX;
        lightboxTouchStartY = e.touches[0].clientY;
    });
    
    lightbox.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchDistanceX = Math.abs(touchEndX - lightboxTouchStartX);
        const touchDistanceY = Math.abs(touchEndY - lightboxTouchStartY);
        
        // 如果向下滑動超過50px，關閉燈箱
        if (touchEndY > lightboxTouchStartY && touchDistanceY > 50 && touchDistanceX < 50) {
            closeLightbox();
        }
        // 如果左右滑動超過50px，切換圖片
        else if (touchDistanceX > 50 && touchDistanceY < 50) {
            if (touchEndX < lightboxTouchStartX) {
                // 向左滑動，下一張
                showNextImage();
            } else if (touchEndX > lightboxTouchStartX) {
                // 向右滑動，上一張
                showPreviousImage();
            }
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    showNextImage();
                    break;
            }
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

// 網站初始化完成

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
