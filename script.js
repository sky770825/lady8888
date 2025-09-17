/* ===========================================
   AI開發術語網站 - 主要JavaScript檔案
   功能：導航控制、智能搜尋、術語詞典、響應式設計
   作者：AI開發術語網站
   版本：1.0.0
   =========================================== */

// ===========================================
// 全域變數與配置 (Global Variables & Config)
// ===========================================
const CONFIG = {
    searchDelay: 300, // 搜尋延遲時間 (ms)
    animationDuration: 300, // 動畫持續時間 (ms)
    maxSearchResults: 10, // 最大搜尋結果數量
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    }
};

// ===========================================
// 主要初始化函數 (Main Initialization)
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // 導航欄功能初始化 (Navigation Bar Functions)
    // ===========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 漢堡選單切換
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 點擊導航連結時關閉選單
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滾動到錨點
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考慮固定導航欄高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // 標籤頁切換功能 (Tab Switching Functions)
    // ===========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // 調試信息
    console.log('標籤頁元素檢查:', {
        tabBtns: tabBtns.length,
        tabPanels: tabPanels.length
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('標籤頁點擊:', this.textContent);
            const targetTab = this.getAttribute('data-tab');
            console.log('目標標籤:', targetTab);
            
            // 移除所有活動狀態
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // 添加活動狀態到當前選項
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log('標籤頁切換成功');
                console.log('目標面板內容:', targetPanel.innerHTML.substring(0, 100) + '...');
            } else {
                console.error('找不到目標面板:', targetTab);
            }
        });
    });

    // ===========================================
    // 滾動效果與動畫 (Scroll Effects & Animations)
    // ===========================================
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(102, 126, 234, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // ===========================================
    // 交錯動畫效果 (Intersection Observer Animation) - 效能優化版
    // ===========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // 使用 debounce 優化效能
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

    const observer = new IntersectionObserver(function(entries) {
        // 使用 requestAnimationFrame 優化動畫效能
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // 動畫完成後停止觀察該元素
                    observer.unobserve(entry.target);
                }
            });
        });
    }, observerOptions);

    // 批次處理動畫元素
    function initializeAnimations() {
        const animatedElements = document.querySelectorAll('.terminology-card, .command-card, .resource-card');
        
        // 分批處理，避免一次性處理太多元素
        const batchSize = 10;
        let currentBatch = 0;
        
        function processBatch() {
            const start = currentBatch * batchSize;
            const end = Math.min(start + batchSize, animatedElements.length);
            
            for (let i = start; i < end; i++) {
                const el = animatedElements[i];
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            }
            
            currentBatch++;
            
            if (end < animatedElements.length) {
                // 使用 setTimeout 讓出控制權，避免阻塞主線程
                setTimeout(processBatch, 16); // 約 60fps
            }
        }
        
        processBatch();
    }

    // 延遲初始化動畫，確保頁面載入完成
    setTimeout(initializeAnimations, 100);

    // 程式碼動畫效果
    function animateCodeLines() {
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'none';
                line.offsetHeight; // 觸發重排
                line.style.animation = 'codeTyping 2s ease-in-out infinite';
            }, index * 200);
        });
    }

    // 頁面載入時啟動程式碼動畫
    setTimeout(animateCodeLines, 1000);

    // 按鈕點擊效果
    const buttons = document.querySelectorAll('.btn, .resource-link');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 創建漣漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 添加漣漪效果樣式
    const style = document.createElement('style');
    style.textContent = `
        .btn, .resource-link {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 搜尋功能（可選）
    function addSearchFunctionality() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜尋術語...';
        searchInput.className = 'search-input';
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.appendChild(searchInput);
        
        // 可以將搜尋框添加到導航欄或其他位置
        // document.querySelector('.nav-container').appendChild(searchContainer);
    }

    // ===========================================
    // 主題切換功能 (Theme Toggle Function)
    // ===========================================
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // 初始化主題
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // 主題切換事件
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // 更新主題圖標
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', '切換到明亮主題');
            themeToggle.setAttribute('title', '切換到明亮主題');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', '切換到暗色主題');
            themeToggle.setAttribute('title', '切換到暗色主題');
        }
    }

    // 載入進度條
    function addLoadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'loading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('load', function() {
            progressBar.style.opacity = '0';
            setTimeout(() => {
                progressBar.remove();
            }, 500);
        });
    }

    // 工具提示功能
    function addTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // 鍵盤快捷鍵
    document.addEventListener('keydown', function(e) {
        // ESC 鍵關閉選單
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // 數字鍵切換標籤頁
        if (e.key >= '1' && e.key <= '6') {
            const tabIndex = parseInt(e.key) - 1;
            if (tabBtns[tabIndex]) {
                tabBtns[tabIndex].click();
            }
        }
    });

    // ===========================================
    // 回到頂部按鈕功能 (Back to Top Button)
    // ===========================================
    const backToTopBtn = document.getElementById('backToTop');
    
    // 監聽滾動事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // 點擊回到頂部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===========================================
    // 功能模組初始化 (Module Initialization)
    // ===========================================
    addLoadingProgress();
    addTooltips();
    initializeGlossary();
    initializeSmartSearch();
    
    // 控制台歡迎訊息
    console.log('%c🎉 歡迎來到AI開發術語網站！', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c💡 提示：使用數字鍵 1-6 可以快速切換標籤頁', 'color: #764ba2; font-size: 14px;');
    console.log('%c🔍 智能搜尋功能已載入', 'color: #ffd700; font-size: 14px;');
    console.log('%c📚 指令資料庫已載入，共20個指令類別', 'color: #ffd700; font-size: 14px;');
    console.log('%c🔄 如果看不到指令，請按 Ctrl+F5 強制重新載入', 'color: #ff6b6b; font-size: 14px;');
    
    // 效能監控（開發環境）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c🔧 開發模式已啟用', 'color: #ffd700; font-size: 14px;');
        
        // 監控頁面載入時間
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⏱️ 頁面載入時間: ${loadTime}ms`);
        });
    }
});

// ===========================================
// 智能指令搜尋模組 (Smart Command Search Module)
// 功能：根據使用者輸入推薦適合的AI指令
// ===========================================
function initializeSmartSearch() {
    const smartSearchInput = document.getElementById('smartSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    // 調試信息
    console.log('智能搜尋元素檢查:', {
        smartSearchInput: !!smartSearchInput,
        searchBtn: !!searchBtn,
        searchResults: !!searchResults
    });

    // 指令資料庫 - 擴展關鍵字
    const commandDatabase = [
        {
            id: 'frontend-component',
            title: '元件開發',
            category: '前端開發',
            keywords: [
                '元件', 'component', '組件', '按鈕', 'button', '表單', 'form', '卡片', 'card', 
                '登入', 'login', '註冊', 'register', '響應式', 'responsive', '輸入框', 'input',
                '下拉選單', 'select', 'checkbox', 'radio', 'textarea', 'modal', 'popup', '彈窗',
                'header', 'footer', 'sidebar', 'navbar', 'menu', '導航', 'navigation', 'breadcrumb',
                'pagination', '分頁', 'carousel', '輪播', 'slider', 'tabs', '標籤頁', 'accordion',
                '手風琴', 'tooltip', '提示', 'dropdown', '下拉', 'modal', 'dialog', '對話框',
                'loading', '載入', 'spinner', '進度條', 'progress', 'alert', '警告', 'notification',
                '通知', 'badge', '徽章', 'avatar', '頭像', 'icon', '圖標', 'logo', '標誌',
                '區塊', 'block', '區塊寬度', 'block width', '區塊高度', 'block height', '區塊大小',
                '寬度調整', 'width adjust', '高度調整', 'height adjust', '大小調整', 'size adjust',
                '欄位', 'column', '欄寬', 'column width', '欄高', 'column height', '欄位大小',
                '容器', 'container', '容器寬度', 'container width', '容器高度', 'container height',
                '外框', 'frame', '邊框', 'border', '邊框寬度', 'border width', '邊框樣式', 'border style',
                '內邊距', 'padding', '外邊距', 'margin', '間距', 'spacing', '空隙', 'gap',
                '對齊', 'align', '置中', 'center', '靠左', 'left', '靠右', 'right', '分散', 'justify',
                '排列', 'arrange', '佈局', 'layout', '排版', 'typography', '位置', 'position',
                '浮動', 'float', '清除', 'clear', '顯示', 'display', '隱藏', 'hide', '可見', 'visible',
                '透明度', 'opacity', '可見性', 'visibility', '層級', 'z-index', '層疊', 'stack'
            ],
            description: '建立可重用的前端元件，支援響應式設計和互動功能',
            template: `請幫我建立一個 [元件名稱] 元件：
- 功能：[具體功能描述]
- 樣式：[設計風格要求]
- 響應式：[斷點設定]
- 可重用性：[參數化需求]`
        },
        {
            id: 'frontend-state',
            title: '狀態管理',
            category: '前端開發',
            keywords: [
                '狀態', 'state', '資料', '管理', '全域', 'global', '本地', 'local', '非同步', 'async',
                'API', '資料擷取', 'data fetching', 'redux', 'vuex', 'mobx', 'zustand', 'recoil',
                'context', 'provider', 'store', 'store', 'action', 'reducer', 'dispatch', 'commit',
                'mutation', 'getter', 'computed', 'watch', 'subscribe', 'observable', 'reactive',
                '響應式', 'reactive', '單向資料流', 'unidirectional', 'flux', 'mvc', 'mvvm',
                '狀態提升', 'lifting state', 'props drilling', '狀態共享', 'state sharing',
                '快取', 'cache', '持久化', 'persistence', 'localStorage', 'sessionStorage',
                '狀態同步', 'state sync', '樂觀更新', 'optimistic update', '悲觀更新', 'pessimistic'
            ],
            description: '設計和管理應用程式的狀態，包括全域和本地狀態',
            template: `請幫我設計狀態管理方案：
- 全域狀態：[需要共享的資料]
- 本地狀態：[元件內部狀態]
- 非同步處理：[API 呼叫邏輯]
- 快取策略：[資料快取需求]`
        },
        {
            id: 'frontend-data',
            title: '資料擷取',
            category: '前端開發',
            keywords: [
                '資料', 'data', 'API', '擷取', 'fetch', '載入', 'loading', '非同步', 'async', 'await',
                'fetch', 'axios', 'request', 'response', 'http', 'https', 'rest', 'graphql',
                'websocket', 'socket', '實時', 'realtime', 'polling', '輪詢', 'subscription',
                '訂閱', 'query', '查詢', 'mutation', '變更', 'get', 'post', 'put', 'delete',
                'patch', 'head', 'options', '狀態碼', 'status code', '200', '404', '500',
                '錯誤處理', 'error handling', 'try', 'catch', 'finally', 'throw', 'error',
                '重試', 'retry', 'timeout', '超時', 'abort', '取消', 'cancel', 'debounce',
                '防抖', 'throttle', '節流', 'cache', '快取', 'memoization', '記憶化',
                'loading state', '載入狀態', 'skeleton', '骨架屏', 'placeholder', '佔位符',
                'optimistic update', '樂觀更新', 'pessimistic update', '悲觀更新'
            ],
            description: '處理資料擷取和API呼叫，確保資料載入完成後才渲染',
            template: `請使用 Async/Await 處理資料擷取：
- 在頁面載入時執行 API Call
- 確保資料載入完成後才渲染
- 添加錯誤處理和載入狀態
- 實作重試機制和超時處理`
        },
        {
            id: 'ui-modal',
            title: '進階互動元件',
            category: 'UI/UX設計',
            keywords: [
                '彈出', 'modal', 'dialog', '視窗', 'window', 'popup', 'overlay', '覆蓋層',
                '彈跳視窗', '彈出視窗', '彈窗', '彈出框', '對話框', '對話視窗', '彈出層',
                '表單', 'form', '登入', 'login', '註冊', 'register', '訂閱', 'subscribe',
                '彈出式', 'popup', 'lightbox', '燈箱', 'drawer', '抽屜', 'sidebar', '側邊欄',
                'tooltip', '提示框', 'hint', '提示', 'dropdown', '下拉選單', 'select', '選擇器',
                'accordion', '手風琴', 'collapse', '摺疊', 'tabs', '標籤頁', 'tab', '頁籤',
                'carousel', '輪播', 'slider', '滑塊', 'swiper', 'swipe', '滑動', 'scroll',
                'scrollbar', '滾動條', 'infinite scroll', '無限滾動', 'lazy loading', '懶載入',
                'skeleton', '骨架屏', 'placeholder', '佔位符', 'loading', '載入中', 'spinner',
                'progress', '進度條', 'stepper', '步驟器', 'wizard', '精靈', 'onboarding',
                '引導', 'tour', '導覽', 'walkthrough', 'tutorial', '教學', 'help', '幫助',
                'notification', '通知', 'alert', '警告', 'toast', '吐司', 'snackbar', '快照',
                'badge', '徽章', 'chip', '標籤', 'tag', 'label', '標籤', 'avatar', '頭像',
                'icon', '圖標', 'button', '按鈕', 'link', '連結', 'breadcrumb', '麵包屑',
                '浮層', '浮動視窗', '遮罩', 'mask', 'backdrop', '背景', '關閉', 'close',
                '確認', 'confirm', '取消', 'cancel', '確定', 'ok', '是', 'yes', '否', 'no'
            ],
            description: '建立彈出式視窗和互動元件，提升使用者體驗',
            template: `請建立 Modal 彈出式視窗：
- 當使用者點擊『訂閱』時顯示
- 包含電子郵件輸入表單
- 支援背景遮蔽和關閉功能
- 響應式設計適配各種螢幕`
        },
        {
            id: 'ui-animation',
            title: '動畫效果',
            category: 'UI/UX設計',
            keywords: [
                '動畫', 'animation', '過渡', 'transition', 'keyframes', '效果', 'effect',
                '旋轉', 'rotate', '淡入', 'fade', '懸停', 'hover', '點擊', 'click',
                '滑動', 'slide', '縮放', 'scale', '變形', 'transform', '位移', 'translate',
                '透明度', 'opacity', '可見性', 'visibility', '顯示', 'show', '隱藏', 'hide',
                '彈跳', 'bounce', '搖擺', 'shake', '震動', 'vibrate', '脈動', 'pulse',
                '閃爍', 'blink', '閃光', 'flash', '發光', 'glow', '陰影', 'shadow',
                '漸變', 'gradient', '背景', 'background', '顏色', 'color', '邊框', 'border',
                '圓角', 'border-radius', '陰影', 'box-shadow', '文字陰影', 'text-shadow',
                '3D', 'perspective', '景深', 'rotateX', 'rotateY', 'rotateZ', 'skew', '傾斜',
                'timing', '時間', 'duration', '延遲', 'delay', 'easing', '緩動', 'cubic-bezier',
                'linear', '線性', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step', '步驟',
                'infinite', '無限', 'alternate', '交替', 'reverse', '反向', 'forwards', '保持',
                'backwards', 'backward', 'both', '兩者', 'none', '無', 'paused', '暫停',
                'running', '運行', 'will-change', 'transform', 'opacity', '效能', 'performance',
                'GPU', '硬體加速', 'hardware acceleration', 'composite', '合成', 'layer', '圖層',
                '彈跳視窗', '彈出動畫', '彈出效果', '彈出動畫', '彈出動畫效果', '彈出動畫效果',
                '滑入', 'slide in', '滑出', 'slide out', '淡入淡出', 'fade in out', '淡入', 'fade in',
                '淡出', 'fade out', '縮放動畫', 'scale animation', '旋轉動畫', 'rotate animation',
                '移動動畫', 'move animation', '變形動畫', 'transform animation', '變換', 'transform',
                '動畫時間', 'animation time', '動畫速度', 'animation speed', '動畫延遲', 'animation delay',
                '動畫持續時間', 'animation duration', '動畫方向', 'animation direction', '動畫填充', 'animation fill',
                '動畫播放', 'animation play', '動畫暫停', 'animation pause', '動畫停止', 'animation stop',
                '動畫重置', 'animation reset', '動畫循環', 'animation loop', '動畫重複', 'animation repeat'
            ],
            description: '使用CSS動畫和過渡效果，提升視覺體驗',
            template: `請使用 CSS Keyframes 製作動畫：
- 為網站 Logo 製作旋轉動畫
- 按鈕懸停時的平滑變色效果
- 頁面載入時的淡入動畫
- 元件切換時的過渡動畫`
        },
        {
            id: 'responsive-design',
            title: '響應式設計',
            category: 'UI/UX設計',
            keywords: [
                '響應式', 'responsive', '斷點', 'breakpoint', '行動', 'mobile', '手機', 'phone',
                '平板', 'tablet', '桌面', 'desktop', '適配', 'adapt', '螢幕', 'screen',
                'viewport', '視窗', '媒體查詢', 'media query', '@media', 'min-width', 'max-width',
                'grid', '網格', 'flexbox', 'flex', 'grid-template', 'grid-area', 'grid-gap',
                'gap', '間距', 'padding', 'margin', 'width', 'height', 'max-width', 'min-width',
                'em', 'rem', 'px', 'vw', 'vh', 'vmin', 'vmax', '百分比', 'percentage', '%',
                '流體', 'fluid', '彈性', 'flexible', '自適應', 'adaptive', 'mobile-first',
                '行動優先', 'desktop-first', '桌面優先', 'progressive enhancement', '漸進增強',
                'graceful degradation', '優雅降級', 'touch', '觸控', 'gesture', '手勢',
                'swipe', '滑動', 'pinch', '縮放', 'zoom', '縮放', 'orientation', '方向',
                'portrait', '直向', 'landscape', '橫向', 'device-pixel-ratio', '像素比',
                'retina', '高解析度', 'high dpi', 'density', '密度', 'resolution', '解析度',
                '區塊', 'block', '欄位', 'column', '欄寬', 'column width', '欄高', 'column height',
                '寬度', 'width', '高度', 'height', '大小', 'size', '尺寸', 'dimension',
                '調整', 'adjust', '設定', 'set', '修改', 'modify', '改變', 'change',
                '佈局', 'layout', '排版', 'typography', '排列', 'arrange', '對齊', 'align',
                '置中', 'center', '靠左', 'left', '靠右', 'right', '分散', 'justify',
                '容器', 'container', '包裝', 'wrapper', '外框', 'frame', '邊框', 'border',
                '內邊距', 'padding', '外邊距', 'margin', '間距', 'spacing', '空隙', 'gap',
                '行高', 'line-height', '字體大小', 'font-size', '字重', 'font-weight',
                '顏色', 'color', '背景色', 'background', '前景色', 'foreground', '文字色', 'text color'
            ],
            description: '設計響應式佈局，適配各種螢幕尺寸',
            template: `請設定響應式斷點：
- 行動裝置：[320px-768px]
- 平板：[768px-1024px]
- 桌面：[1024px+]
- 大螢幕：[1440px+]`
        },
        {
            id: 'backend-api',
            title: 'API設計',
            category: '後端開發',
            keywords: ['API', '後端', '伺服器', '端點', 'REST', '資料', 'CRUD', '資料庫'],
            description: '設計RESTful API，處理資料的增刪改查操作',
            template: `請設計 RESTful API：
- 資源：[資料實體列表]
- 端點：[CRUD 操作]
- 請求格式：[JSON Schema]
- 回應格式：[標準化回應]
- 錯誤處理：[錯誤碼和訊息]`
        },
        {
            id: 'backend-auth',
            title: '身份驗證',
            category: '後端開發',
            keywords: ['登入', '註冊', '驗證', '身份', '認證', 'JWT', 'OAuth', '權限', '安全'],
            description: '實作使用者身份驗證和權限管理系統',
            template: `請實作身份驗證系統：
- 註冊流程：[使用者註冊邏輯]
- 登入驗證：[JWT/OAuth 實作]
- 權限控制：[角色權限管理]
- 安全性：[密碼加密、會話管理]`
        },
        {
            id: 'performance-optimization',
            title: '效能優化',
            category: '效能優化',
            keywords: ['效能', '優化', '速度', '載入', '快取', 'CDN', '壓縮', '圖片', '程式碼'],
            description: '優化網站載入速度和執行效能',
            template: `請優化網站載入速度：
- 程式碼分割：[lazy loading]
- 圖片優化：[WebP、壓縮]
- 快取策略：[browser cache]
- CDN 設定：[內容分發網路]`
        },
        {
            id: 'analytics-user-journey',
            title: '使用者旅程分析',
            category: '數據分析',
            keywords: ['使用者', '旅程', '分析', '流程', '結帳', '轉換', '優化', '體驗'],
            description: '分析使用者行為流程，優化轉換率',
            template: `請根據我們的使用者旅程，設計一個簡潔的結帳流程：
- 減少中途放棄的機率
- 優化每個步驟的使用者體驗
- 添加進度指示器
- 簡化表單欄位`
        },
        {
            id: 'analytics-ab-testing',
            title: 'A/B 測試',
            category: '數據分析',
            keywords: ['A/B', '測試', '比較', '版本', '按鈕', '顏色', '文案', '轉換率'],
            description: '進行A/B測試，比較不同版本的效果',
            template: `請對首頁的 CTA 按鈕進行 A/B 測試：
- 比較紅色和藍色按鈕的點擊率
- 測試不同的按鈕文案
- 分析轉換率差異
- 設定統計顯著性標準`
        },
        {
            id: 'deploy-strategy',
            title: '部署策略',
            category: '部署維護',
            keywords: [
                '部署', 'deploy', '環境', 'environment', 'Docker', 'CI/CD', '自動化', 'automation',
                '生產', 'production', '測試', 'test', '開發', 'development', 'staging', '預發布',
                'container', '容器', 'kubernetes', 'k8s', 'orchestration', '編排', 'service', '服務',
                'microservice', '微服務', 'monolith', '單體', 'serverless', '無伺服器', 'lambda',
                'function', '函數', 'edge', '邊緣', 'CDN', '內容分發', 'cloud', '雲端', 'aws',
                'azure', 'gcp', 'google cloud', '阿里雲', '騰訊雲', '華為雲', 'digital ocean',
                'heroku', 'vercel', 'netlify', 'github pages', 'gitlab pages', 'firebase',
                'hosting', '託管', 'domain', '域名', 'ssl', 'https', 'certificate', '憑證',
                'load balancer', '負載均衡', 'scaling', '擴展', 'horizontal', '水平', 'vertical', '垂直',
                'monitoring', '監控', 'logging', '日誌', 'metrics', '指標', 'alerting', '告警',
                'health check', '健康檢查', 'uptime', '可用性', 'downtime', '停機', 'backup', '備份',
                'disaster recovery', '災難恢復', 'rollback', '回滾', 'blue-green', '藍綠部署',
                'canary', '金絲雀', 'feature flag', '功能開關', 'toggle', '切換', 'config', '配置'
            ],
            description: '設計自動化部署和環境管理策略',
            template: `請設計部署方案：
- 環境配置：[開發/測試/生產]
- 容器化：[Docker 配置]
- CI/CD：[自動化部署]
- 回滾機制：[版本管理]`
        },
        {
            id: 'seo-optimization',
            title: 'SEO 優化',
            category: '效能優化',
            keywords: [
                'SEO', '搜尋引擎', 'search engine', '優化', 'optimization', '排名', 'ranking',
                '關鍵字', 'keyword', 'meta', '標籤', 'tag', 'title', 'description', '描述',
                'heading', '標題', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'alt', '圖片替代文字',
                'sitemap', '網站地圖', 'robots.txt', '爬蟲', 'crawler', '索引', 'index',
                'schema', '結構化資料', 'structured data', 'json-ld', 'microdata', 'rdfa',
                'breadcrumb', '麵包屑', 'canonical', '標準網址', 'url', '網址', 'slug',
                'permalink', '永久連結', 'redirect', '重定向', '301', '302', '404', '錯誤頁面',
                'page speed', '頁面速度', 'core web vitals', '核心網頁指標', 'lcp', 'fid', 'cls',
                'lighthouse', '頁面體驗', 'page experience', 'mobile-friendly', '行動友善',
                'responsive', '響應式', 'amp', 'accelerated mobile pages', 'pwa', '漸進式網頁應用',
                'service worker', '快取', 'cache', 'compression', '壓縮', 'gzip', 'brotli',
                'minification', '壓縮', 'minify', 'css', 'javascript', 'html', '圖片優化',
                'image optimization', 'webp', 'avif', 'lazy loading', '懶載入', 'preload',
                'prefetch', 'dns-prefetch', 'preconnect', 'critical css', '關鍵CSS'
            ],
            description: '優化網站SEO，提升搜尋引擎排名和頁面載入速度',
            template: `請優化網站 SEO：
- 標題標籤：[title、meta 標籤]
- 結構化資料：[Schema.org]
- 網站地圖：[sitemap.xml]
- 內部連結：[連結結構]`
        },
        {
            id: 'accessibility',
            title: '無障礙設計',
            category: 'UI/UX設計',
            keywords: [
                '無障礙', 'accessibility', 'a11y', '可訪問性', '殘障', 'disability', '視障',
                'visual', '聽障', 'hearing', '行動不便', 'motor', '認知', 'cognitive',
                'aria', 'role', 'label', '標籤', 'alt', '替代文字', 'screen reader', '螢幕閱讀器',
                'keyboard', '鍵盤', 'tab', '導航', 'navigation', 'focus', '焦點', 'outline',
                '對比', 'contrast', 'color', '顏色', 'font size', '字體大小', 'line height', '行高',
                'spacing', '間距', 'touch target', '觸控目標', 'minimum size', '最小尺寸',
                'skip link', '跳過連結', 'landmark', '地標', 'heading', '標題', 'list', '列表',
                'table', '表格', 'form', '表單', 'fieldset', 'legend', 'label', '標籤',
                'error', '錯誤', 'validation', '驗證', 'message', '訊息', 'alert', '警告',
                'live region', '動態區域', 'polite', 'assertive', 'off', '關閉',
                'semantic', '語義', 'html5', 'section', 'article', 'aside', 'nav', 'main',
                'header', 'footer', 'figure', 'figcaption', 'time', 'mark', 'highlight',
                'wcag', 'guidelines', 'guideline', 'guidelines', '2.1', '2.2', 'aa', 'aaa',
                'level', '等級', 'conformance', '符合性', 'compliance', '合規', 'audit', '稽核'
            ],
            description: '實作無障礙設計，確保所有使用者都能正常使用網站',
            template: `請實作無障礙功能：
- 鍵盤導航：[Tab 鍵操作]
- 螢幕閱讀器：[ARIA 標籤]
- 色彩對比：[視覺可讀性]
- 文字大小：[可調整字體]`
        },
        {
            id: 'testing-strategy',
            title: '測試策略',
            category: '專案管理與維護',
            keywords: [
                '測試', 'testing', '單元測試', 'unit test', '整合測試', 'integration test',
                '端對端測試', 'e2e', 'end-to-end', '功能測試', 'functional test', '回歸測試',
                'regression test', '冒煙測試', 'smoke test', '驗收測試', 'acceptance test',
                '效能測試', 'performance test', '負載測試', 'load test', '壓力測試', 'stress test',
                '安全測試', 'security test', '滲透測試', 'penetration test', '漏洞掃描',
                'vulnerability scan', 'jest', 'mocha', 'chai', 'cypress', 'playwright',
                'selenium', 'puppeteer', 'testing library', 'enzyme', 'react testing',
                'vue test utils', 'angular testing', 'karma', 'jasmine', 'vitest',
                'coverage', '覆蓋率', 'mocking', '模擬', 'stub', '存根', 'spy', '間諜',
                'fixture', '固定裝置', 'setup', 'teardown', 'before', 'after', 'describe',
                'it', 'test', 'expect', 'assert', 'assertion', 'mock', '模擬', 'fake',
                'double', 'test double', 'dummy', '虛擬', 'fake', '偽造', 'stub', '存根',
                'spy', '間諜', 'mock', '模擬', 'test data', '測試資料', 'test case', '測試案例',
                'test suite', '測試套件', 'test runner', '測試執行器', 'ci', 'cd', 'pipeline'
            ],
            description: '建立完整的測試策略，確保程式碼品質和功能正確性',
            template: `請建立測試策略：
- 單元測試：[Jest/Vitest]
- 測試覆蓋率：[coverage 目標]
- Mock 資料：[測試資料模擬]
- 邊界測試：[異常情況處理]`
        },
        {
            id: 'common-design-terms',
            title: '常用設計術語',
            category: 'UI/UX設計',
            keywords: [
                '彈跳視窗', '彈出視窗', '彈窗', '彈出框', '對話框', '對話視窗', '彈出層',
                '區塊', 'block', '區塊寬度', 'block width', '區塊高度', 'block height', '區塊大小',
                '寬度', 'width', '高度', 'height', '大小', 'size', '尺寸', 'dimension',
                '調整', 'adjust', '設定', 'set', '修改', 'modify', '改變', 'change',
                '欄位', 'column', '欄寬', 'column width', '欄高', 'column height', '欄位大小',
                '容器', 'container', '容器寬度', 'container width', '容器高度', 'container height',
                '外框', 'frame', '邊框', 'border', '邊框寬度', 'border width', '邊框樣式', 'border style',
                '內邊距', 'padding', '外邊距', 'margin', '間距', 'spacing', '空隙', 'gap',
                '對齊', 'align', '置中', 'center', '靠左', 'left', '靠右', 'right', '分散', 'justify',
                '排列', 'arrange', '佈局', 'layout', '排版', 'typography', '位置', 'position',
                '浮動', 'float', '清除', 'clear', '顯示', 'display', '隱藏', 'hide', '可見', 'visible',
                '透明度', 'opacity', '可見性', 'visibility', '層級', 'z-index', '層疊', 'stack',
                '顏色', 'color', '背景色', 'background', '前景色', 'foreground', '文字色', 'text color',
                '字體', 'font', '字體大小', 'font-size', '字重', 'font-weight', '字體樣式', 'font-style',
                '行高', 'line-height', '字間距', 'letter-spacing', '詞間距', 'word-spacing',
                '圓角', 'border-radius', '陰影', 'box-shadow', '文字陰影', 'text-shadow',
                '漸變', 'gradient', '線性漸變', 'linear-gradient', '徑向漸變', 'radial-gradient',
                '動畫', 'animation', '過渡', 'transition', '效果', 'effect', '變換', 'transform',
                '懸停', 'hover', '點擊', 'click', '焦點', 'focus', '活動', 'active', '選中', 'selected',
                '禁用', 'disabled', '啟用', 'enabled', '只讀', 'readonly', '必填', 'required',
                '驗證', 'validation', '錯誤', 'error', '警告', 'warning', '成功', 'success', '資訊', 'info'
            ],
            description: '處理常用的網頁設計術語和佈局調整需求',
            template: `請處理 [設計需求] ：
- 區塊大小：[寬度 x 高度]
- 間距設定：[內邊距/外邊距]
- 對齊方式：[左/中/右/分散]
- 視覺效果：[顏色/陰影/圓角]`
        },
        {
            id: 'git-automation',
            title: 'Git 與 GitHub 自動化腳本',
            category: '專案管理與維護',
            keywords: [
                'git', 'github', '自動化', 'automation', '腳本', 'script', '批次檔', 'bat',
                '版本控制', 'version control', '提交', 'commit', '推送', 'push', '標籤', 'tag',
                '儲存庫', 'repository', '本機', 'local', '遠端', 'remote', '暫存區', 'staging',
                'git add', 'git commit', 'git push', 'git tag', 'git push --tags',
                '提交訊息', 'commit message', '版本標籤', 'version tag', '備份', 'backup',
                '批次處理', 'batch', 'windows', '命令列', 'command line', 'cmd', 'powershell',
                '自動化流程', 'automated workflow', 'ci', 'cd', '持續整合', 'continuous integration',
                '部署', 'deployment', '發布', 'release', '版本管理', 'version management',
                '程式碼管理', 'code management', '協作', 'collaboration', '團隊開發', 'team development',
                '分支', 'branch', '合併', 'merge', '拉取', 'pull', '克隆', 'clone',
                '衝突', 'conflict', '解決', 'resolve', '歷史記錄', 'history', '日誌', 'log',
                '差異', 'diff', '狀態', 'status', '檢查', 'check', '驗證', 'verify',
                '回滾', 'rollback', '復原', 'revert', '重置', 'reset', '清理', 'clean',
                '忽略', 'ignore', 'gitignore', '排除', 'exclude', '包含', 'include',
                '遠端倉庫', 'remote repository', 'origin', 'upstream', 'fork', '分叉',
                'pull request', 'pr', 'merge request', 'mr', 'code review', '程式碼審查',
                'issue', '問題', 'bug', '錯誤', 'feature', '功能', 'enhancement', '增強',
                'hotfix', '熱修復', 'patch', '修補', 'security', '安全', 'vulnerability', '漏洞'
            ],
            description: '建立Git與GitHub自動化腳本，簡化日常開發流程和版本管理',
            template: `請為我編寫一個名為 git-push.bat 的腳本。這個腳本的目的是自動化 Git 提交與推送流程，同時也支援為特定版本建立標籤。

腳本需要能接受一個可選的參數，用於定義提交訊息。如果沒有提供參數，則使用預設訊息 "Auto-commit"。

腳本需要依序執行以下步驟：

1. 執行 git add .，將所有新增與修改的檔案加入 Git 暫存區。
2. 執行 git commit -m "[提交訊息]"，使用傳入的參數作為提交訊息。
3. 執行 git push，將變更推送到遠端 GitHub 儲存庫。
4. 在成功推送後，請顯示一則訊息：程式碼已成功上傳至 GitHub。

此外，請為腳本新增一個額外功能：

如果在執行腳本時提供第二個參數，例如 git-push.bat "Update homepage" "v1.0.1"，則腳本在推送後，會自動創建一個標籤。

這個標籤的名稱為第二個參數，例如 "v1.0.1"。

創建標籤的指令為 git tag [標籤名稱]，並隨後使用 git push --tags 將標籤推送到遠端。

請在每個步驟執行前與執行後加上簡潔明確的文字說明，以便使用者知道目前腳本的執行進度。`
        },
        {
            id: 'css-variables-theme',
            title: 'CSS 變數與主題切換',
            category: 'UI/UX設計',
            keywords: [
                'CSS Variables', 'CSS 變數', '自定義屬性', 'custom properties', '主題', 'theme',
                '主題切換', 'theme toggle', '明暗主題', 'dark theme', 'light theme', '色彩變數',
                'color variables', '動態樣式', 'dynamic styles', ':root', 'var()', 'fallback',
                '預設值', 'default value', '繼承', 'inheritance', '作用域', 'scope',
                '主題色彩', 'theme colors', '主色', 'primary color', '輔色', 'secondary color',
                '強調色', 'accent color', '背景色', 'background color', '文字色', 'text color',
                '邊框色', 'border color', '陰影色', 'shadow color', '漸變', 'gradient',
                '響應式主題', 'responsive theme', '系統主題', 'system theme', '偏好設定',
                'preferences', 'localStorage', 'sessionStorage', '持久化', 'persistence',
                'JavaScript 主題', 'JS theme', '動態切換', 'dynamic toggle', '按鈕切換',
                'button toggle', '圖示切換', 'icon toggle', '月亮', 'moon', '太陽', 'sun',
                '自動偵測', 'auto detect', '媒體查詢', 'media query', 'prefers-color-scheme'
            ],
            description: '使用CSS變數實現主題切換功能，支援明暗主題動態切換',
            template: `請幫我建立一個完整的主題切換系統：

1. CSS 變數設定：
   - 在 :root 中定義明亮主題的變數
   - 在 [data-theme="dark"] 中定義暗色主題的變數
   - 包含主色、輔色、背景色、文字色、邊框色等

2. JavaScript 功能：
   - 主題切換按鈕點擊事件
   - 使用 localStorage 儲存用戶選擇
   - 頁面載入時讀取儲存的主題設定
   - 動態更新 data-theme 屬性

3. 無障礙設計：
   - 按鈕的 aria-label 和 title 屬性
   - 圖示的動態切換（月亮/太陽）
   - 鍵盤導航支援

4. 響應式設計：
   - 按鈕在不同螢幕尺寸下的適配
   - 主題切換的平滑過渡動畫`
        },
        {
            id: 'performance-optimization-advanced',
            title: '進階效能優化',
            category: '效能優化',
            keywords: [
                '效能優化', 'performance optimization', 'Debounce', '防抖動', 'Throttle', '節流',
                'RequestAnimationFrame', 'RAF', 'Intersection Observer', '批次處理', 'batch processing',
                '主線程', 'main thread', '阻塞', 'blocking', '非同步', 'async', '異步處理',
                '動畫優化', 'animation optimization', '滾動優化', 'scroll optimization',
                '懶載入', 'lazy loading', '虛擬滾動', 'virtual scrolling', '分頁', 'pagination',
                '記憶化', 'memoization', '快取', 'cache', 'CDN', '內容分發網路',
                '圖片優化', 'image optimization', 'WebP', 'AVIF', '壓縮', 'compression',
                '程式碼分割', 'code splitting', 'Tree Shaking', '搖樹優化', 'Bundle 優化',
                'Gzip', 'Brotli', '壓縮演算法', 'compression algorithm', 'HTTP/2', 'HTTP/3',
                'Service Worker', 'PWA', '離線快取', 'offline cache', '背景同步', 'background sync',
                'Web Workers', 'Web 工作者', '多線程', 'multithreading', '並行處理', 'parallel processing',
                'Critical CSS', '關鍵 CSS', '內聯樣式', 'inline styles', '預載入', 'preload',
                '預取', 'prefetch', 'DNS 預解析', 'DNS prefetch', '預連接', 'preconnect',
                '資源提示', 'resource hints', '優先級', 'priority', '載入策略', 'loading strategy'
            ],
            description: '使用現代技術優化網站效能，包括防抖動、批次處理、動畫優化等',
            template: `請幫我優化網站效能，實作以下功能：

1. 防抖動與節流：
   - 搜尋輸入框的防抖動處理
   - 滾動事件的節流優化
   - 視窗大小調整的防抖動

2. 動畫效能優化：
   - 使用 RequestAnimationFrame 優化動畫
   - Intersection Observer 實現滾動動畫
   - 批次處理大量動畫元素

3. 載入優化：
   - 圖片懶載入實作
   - 關鍵 CSS 內聯
   - 非關鍵資源延遲載入

4. 快取策略：
   - Service Worker 快取策略
   - 靜態資源長期快取
   - API 資料快取機制

5. 效能監控：
   - Core Web Vitals 監控
   - 載入時間測量
   - 使用者體驗指標追蹤`
        },
        {
            id: 'accessibility-advanced',
            title: '進階無障礙設計',
            category: 'UI/UX設計',
            keywords: [
                '無障礙設計', 'accessibility', 'a11y', '可訪問性', '殘障友善', 'disability friendly',
                'Focus-visible', '焦點樣式', 'focus styles', '鍵盤導航', 'keyboard navigation',
                'Tab 鍵', 'tab key', 'Enter 鍵', 'enter key', 'Escape 鍵', 'escape key',
                'ARIA', 'aria-label', 'aria-describedby', 'aria-live', 'aria-expanded',
                'role', 'role button', 'role menuitem', 'role navigation', 'role main',
                '螢幕閱讀器', 'screen reader', 'NVDA', 'JAWS', 'VoiceOver', 'TalkBack',
                '語義化標籤', 'semantic HTML', 'section', 'article', 'aside', 'nav', 'main',
                'header', 'footer', 'figure', 'figcaption', 'time', 'mark', 'highlight',
                '色彩對比', 'color contrast', 'WCAG', '4.5:1', '3:1', '對比度', 'contrast ratio',
                '字體大小', 'font size', '可調整字體', 'resizable text', '200% 縮放', '200% zoom',
                '觸控目標', 'touch target', '44px', '最小尺寸', 'minimum size', '點擊區域',
                'click area', '間距', 'spacing', '行高', 'line height', '字間距', 'letter spacing',
                '跳過連結', 'skip link', '地標', 'landmark', '標題層級', 'heading hierarchy',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '標題順序', 'heading order',
                '表單無障礙', 'form accessibility', 'label', 'fieldset', 'legend', 'error message',
                '驗證訊息', 'validation message', '必填欄位', 'required field', '錯誤提示',
                'error alert', '成功提示', 'success message', '動態內容', 'dynamic content',
                'live region', 'polite', 'assertive', 'off', '關閉', '動態更新', 'dynamic update'
            ],
            description: '實作完整的無障礙設計，確保所有用戶都能正常使用網站',
            template: `請幫我實作完整的無障礙設計功能：

1. 鍵盤導航：
   - 所有互動元素支援 Tab 鍵導航
   - 使用 :focus-visible 提供清晰的焦點樣式
   - 支援 Enter、Space、Escape 鍵操作

2. 螢幕閱讀器支援：
   - 添加適當的 ARIA 標籤和角色
   - 使用語義化 HTML 標籤
   - 提供 alt 文字和 aria-label

3. 視覺無障礙：
   - 確保色彩對比度符合 WCAG 標準
   - 支援 200% 縮放不影響使用
   - 提供足夠的觸控目標尺寸

4. 表單無障礙：
   - 每個輸入欄位都有對應的 label
   - 提供清楚的錯誤和成功訊息
   - 使用 fieldset 和 legend 組織相關欄位

5. 動態內容：
   - 使用 aria-live 區域通知內容變更
   - 提供適當的載入狀態提示
   - 確保動畫不會造成癲癇發作`
        }
    ];

    // 搜尋功能
    function searchCommands(query) {
        console.log('搜尋指令:', query);
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        // 顯示載入動畫
        showSearchLoading();

        // 模擬搜尋延遲（實際應用中這裡會是真正的搜尋邏輯）
        setTimeout(() => {
            const results = commandDatabase.map(command => {
                const score = calculateMatchScore(query, command);
                return { ...command, score };
            }).filter(command => command.score > 0).sort((a, b) => b.score - a.score);

            hideSearchLoading();
            displayResults(results);
        }, 500); // 500ms 載入時間
    }

    // 顯示搜尋載入動畫
    function showSearchLoading() {
        searchResults.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <p>正在搜尋相關指令...</p>
            </div>
        `;
        searchResults.classList.add('show');
    }

    // 隱藏搜尋載入動畫
    function hideSearchLoading() {
        // 載入動畫會在 displayResults 中被替換
    }

    // 計算匹配分數 - 優化算法
    function calculateMatchScore(query, command) {
        const queryLower = query.toLowerCase().trim();
        const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
        let score = 0;

        // 完全匹配標題 (最高分)
        if (command.title.toLowerCase() === queryLower) {
            score += 100;
        } else if (command.title.toLowerCase().includes(queryLower)) {
            score += 50;
        }

        // 完全匹配類別
        if (command.category.toLowerCase() === queryLower) {
            score += 40;
        } else if (command.category.toLowerCase().includes(queryLower)) {
            score += 20;
        }

        // 關鍵字精確匹配 (高權重)
        command.keywords.forEach(keyword => {
            const keywordLower = keyword.toLowerCase();
            
            // 完全匹配
            if (keywordLower === queryLower) {
                score += 30;
            }
            // 包含匹配
            else if (queryLower.includes(keywordLower) || keywordLower.includes(queryLower)) {
                score += 15;
            }
            // 部分匹配
            else if (keywordLower.includes(queryLower) || queryLower.includes(keywordLower)) {
                score += 8;
            }
        });

        // 多詞匹配 (額外加分)
        let matchedWords = 0;
        queryWords.forEach(word => {
            if (word.length > 1) { // 忽略單字符
                const hasMatch = command.keywords.some(keyword => 
                    keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())
                ) || command.title.toLowerCase().includes(word) || 
                command.description.toLowerCase().includes(word) ||
                command.category.toLowerCase().includes(word);
                
                if (hasMatch) {
                    matchedWords++;
                }
            }
        });

        // 多詞匹配獎勵
        if (matchedWords > 1) {
            score += matchedWords * 5;
        }

        // 描述匹配 (較低權重)
        if (command.description.toLowerCase().includes(queryLower)) {
            score += 10;
        }

        // 部分描述匹配
        queryWords.forEach(word => {
            if (word.length > 2 && command.description.toLowerCase().includes(word)) {
                score += 3;
            }
        });

        // 技術術語加分
        const techTerms = ['api', 'css', 'html', 'js', 'javascript', 'react', 'vue', 'angular', 'node', 'php', 'python', 'java', 'sql', 'mongodb', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp'];
        techTerms.forEach(term => {
            if (queryLower.includes(term) && command.keywords.some(keyword => keyword.toLowerCase().includes(term))) {
                score += 12;
            }
        });

        return score;
    }

    // 顯示搜尋結果
    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; color: #ccc;"></i>
                    <p>沒有找到相關的指令，請嘗試其他關鍵字</p>
                    <div class="search-tips">
                        <p><strong>搜尋提示：</strong></p>
                        <ul>
                            <li>嘗試使用更簡單的關鍵字</li>
                            <li>使用中文或英文術語</li>
                            <li>點擊下方的熱門搜尋標籤</li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            // 限制顯示結果數量
            const maxResults = 5;
            const limitedResults = results.slice(0, maxResults);
            const searchQuery = smartSearchInput.value.trim();
            
            searchResults.innerHTML = `
                <div class="results-header">
                    <span>找到 ${results.length} 個相關指令</span>
                    ${results.length > maxResults ? `<span class="more-results">顯示前 ${maxResults} 個結果</span>` : ''}
                </div>
                ${limitedResults.map(command => `
                    <div class="recommended-command" data-command-id="${command.id}">
                        <div class="command-match">
                            <div>
                                <div class="command-title">${highlightSearchTerms(command.title, searchQuery)}</div>
                                <div style="color: var(--primary-color); font-size: 0.9rem;">${highlightSearchTerms(command.category, searchQuery)}</div>
                            </div>
                            <div class="command-actions">
                                <div class="match-score">${Math.round(command.score)}% 匹配</div>
                                <button class="favorite-btn" data-command-id="${command.id}" title="收藏此指令">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        <div class="command-description">${highlightSearchTerms(command.description, searchQuery)}</div>
                        <div class="command-template">
                            <code>${command.template}</code>
                        </div>
                    </div>
                `).join('')}
            `;
        }
        searchResults.classList.add('show');
        
        // 更新收藏按鈕狀態
        setTimeout(() => {
            favoritesManager.updateFavoriteButtons();
        }, 100);
    }

    // 高亮搜尋關鍵字
    function highlightSearchTerms(text, query) {
        if (!query || !text) return text;
        
        const queryWords = query.trim().split(/\s+/).filter(word => word.length > 0);
        let highlightedText = text;
        
        queryWords.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<span class="search-highlight">$1</span>');
        });
        
        return highlightedText;
    }

    // 清除按鈕和歷史記錄
    const clearBtn = document.getElementById('clearBtn');
    const searchHistory = document.getElementById('searchHistory');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // 搜尋歷史記錄管理
    class SearchHistory {
        constructor() {
            this.history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            this.maxHistory = 10; // 最多保存10條歷史記錄
        }

        add(query) {
            if (!query.trim()) return;
            
            // 移除重複的記錄
            this.history = this.history.filter(item => item !== query);
            
            // 添加到開頭
            this.history.unshift(query);
            
            // 限制數量
            if (this.history.length > this.maxHistory) {
                this.history = this.history.slice(0, this.maxHistory);
            }
            
            this.save();
            this.display();
        }

        remove(query) {
            this.history = this.history.filter(item => item !== query);
            this.save();
            this.display();
        }

        clear() {
            this.history = [];
            this.save();
            this.display();
        }

        save() {
            localStorage.setItem('searchHistory', JSON.stringify(this.history));
        }

        display() {
            if (this.history.length === 0) {
                searchHistory.style.display = 'none';
                return;
            }

            searchHistory.style.display = 'block';
            historyList.innerHTML = this.history.map(query => `
                <div class="history-item">
                    <span class="history-query" data-query="${query}">${query}</span>
                    <button class="remove-history-btn" data-query="${query}" title="移除">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // 綁定歷史記錄點擊事件
            historyList.querySelectorAll('.history-query').forEach(item => {
                item.addEventListener('click', (e) => {
                    const query = e.target.getAttribute('data-query');
                    smartSearchInput.value = query;
                    searchCommands(query);
                });
            });

            // 綁定移除歷史記錄事件
            historyList.querySelectorAll('.remove-history-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const query = e.target.closest('.remove-history-btn').getAttribute('data-query');
                    this.remove(query);
                });
            });
        }
    }

    // 收藏功能管理
    class Favorites {
        constructor() {
            this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        }

        add(commandId) {
            if (!this.favorites.includes(commandId)) {
                this.favorites.push(commandId);
                this.save();
                this.updateFavoriteButtons();
            }
        }

        remove(commandId) {
            this.favorites = this.favorites.filter(id => id !== commandId);
            this.save();
            this.updateFavoriteButtons();
        }

        toggle(commandId) {
            if (this.isFavorite(commandId)) {
                this.remove(commandId);
            } else {
                this.add(commandId);
            }
        }

        isFavorite(commandId) {
            return this.favorites.includes(commandId);
        }

        save() {
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        }

        updateFavoriteButtons() {
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                const commandId = btn.getAttribute('data-command-id');
                const icon = btn.querySelector('i');
                
                if (this.isFavorite(commandId)) {
                    icon.className = 'fas fa-heart';
                    btn.classList.add('favorited');
                } else {
                    icon.className = 'far fa-heart';
                    btn.classList.remove('favorited');
                }
            });
        }

        getFavorites() {
            return this.favorites;
        }
    }

    // 初始化歷史記錄和收藏功能
    const searchHistoryManager = new SearchHistory();
    const favoritesManager = new Favorites();

    // 綁定事件
    searchBtn.addEventListener('click', () => {
        const query = smartSearchInput.value.trim();
        if (query) {
            searchHistoryManager.add(query);
            searchCommands(query);
        }
    });

    clearBtn.addEventListener('click', () => {
        smartSearchInput.value = '';
        searchResults.classList.remove('show');
        clearBtn.style.display = 'none';
        smartSearchInput.focus();
    });

    // 清除歷史記錄
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('確定要清除所有搜尋歷史嗎？')) {
            searchHistoryManager.clear();
        }
    });

    // 收藏按鈕事件處理
    document.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.favorite-btn');
            const commandId = btn.getAttribute('data-command-id');
            favoritesManager.toggle(commandId);
        }
    });

    smartSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = smartSearchInput.value.trim();
            if (query) {
                searchHistoryManager.add(query);
                searchCommands(query);
            }
        }
    });

    // 即時搜尋與建議
    let searchTimeout;
    smartSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        // 顯示/隱藏清除按鈕
        if (query.length > 0) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
        
        if (query.length > 1) {
            searchTimeout = setTimeout(() => {
                searchCommands(query);
            }, CONFIG.searchDelay);
        } else if (query.length === 0) {
            searchResults.classList.remove('show');
        }
    });

    // 添加搜尋建議
    function addSearchSuggestions() {
        const suggestions = [
            '建立登入表單', '響應式設計', 'API 呼叫', '動畫效果', '狀態管理',
            'SEO 優化', '無障礙設計', '測試策略', '部署方案', '效能優化',
            'Modal 彈窗', '資料擷取', 'A/B 測試', '使用者體驗', 'CSS 動畫',
            '彈跳視窗', '區塊寬度', '高度調整', '欄位大小', '容器設定',
            '間距調整', '對齊方式', '顏色設定', '字體大小', '圓角效果',
            'Git 自動化', 'GitHub 腳本', '版本控制', '提交推送', '標籤管理',
            'CSS Variables', 'Focus-visible', 'Debounce', 'Local Storage', 'Theme Toggle',
            'Back to Top', 'Loading Spinner', 'Search Highlight', 'Open Graph', 'Twitter Card',
            'Intersection Observer', 'RequestAnimationFrame', 'Batch Processing', 'Media Query',
            'Accessibility', 'Smooth Scrolling', 'Performance Optimization', 'Responsive Breakpoints'
        ];

        const suggestionContainer = document.createElement('div');
        suggestionContainer.className = 'search-suggestions';
        suggestionContainer.innerHTML = `
            <div class="suggestion-header">
                <span>熱門搜尋：</span>
            </div>
            <div class="suggestion-tags">
                ${suggestions.map(suggestion => 
                    `<span class="suggestion-tag" data-suggestion="${suggestion}">${suggestion}</span>`
                ).join('')}
            </div>
        `;

        smartSearchInput.parentNode.appendChild(suggestionContainer);

        // 點擊建議標籤
        suggestionContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-tag')) {
                const suggestion = e.target.getAttribute('data-suggestion');
                smartSearchInput.value = suggestion;
                searchCommands(suggestion);
            }
        });

        // 輸入時隱藏建議
        smartSearchInput.addEventListener('focus', () => {
            if (smartSearchInput.value.length === 0) {
                suggestionContainer.style.display = 'block';
            }
        });

        smartSearchInput.addEventListener('input', () => {
            if (smartSearchInput.value.length > 0) {
                suggestionContainer.style.display = 'none';
            } else {
                suggestionContainer.style.display = 'block';
            }
        });
    }

    // 初始化搜尋建議
    addSearchSuggestions();
    
    // 初始化歷史記錄顯示
    searchHistoryManager.display();
}

// ===========================================
// 術語詞典模組 (Glossary Module)
// 功能：術語搜尋、顯示、高亮關鍵字
// ===========================================
function initializeGlossary() {
    const glossaryData = [
        {
            term: "Container width",
            category: "版面與視覺",
            description: "容器寬度，用於控制內容區域的最大寬度，確保在不同螢幕尺寸下的可讀性。",
            example: "設定 max-width: 1200px 確保內容在大型螢幕上不會過寬。"
        },
        {
            term: "Grid system",
            category: "版面與視覺",
            description: "網格系統，提供結構化的佈局框架，讓設計師和開發者能夠快速建立一致的版面。",
            example: "使用 CSS Grid 或 Flexbox 建立響應式的 12 欄網格系統。"
        },
        {
            term: "Mobile-first",
            category: "響應式與互動",
            description: "行動裝置優先的設計方法，先設計行動版本，再逐步增強為桌面版本。",
            example: "先設計 320px 寬度的版面，再使用 min-width 媒體查詢擴展到更大螢幕。"
        },
        {
            term: "Breakpoint",
            category: "響應式與互動",
            description: "響應式斷點，定義不同螢幕尺寸的切換點，用於調整佈局和樣式。",
            example: "設定 768px、1024px、1440px 作為主要的響應式斷點。"
        },
        {
            term: "Modal",
            category: "響應式與互動",
            description: "彈出式視窗，用於顯示重要資訊或表單，通常會遮蔽背景內容。",
            example: "當使用者點擊『訂閱』按鈕時，顯示包含電子郵件輸入欄位的 Modal。"
        },
        {
            term: "Tooltip",
            category: "響應式與互動",
            description: "提示框，當滑鼠懸停在元素上時顯示的簡短說明文字。",
            example: "在圖示旁加上 Tooltip，說明該圖示的功能或用途。"
        },
        {
            term: "Accordion",
            category: "響應式與互動",
            description: "手風琴選單，可收合的內容區塊，常用於 FAQ 或分類內容展示。",
            example: "將常見問題列表設計成 Accordion，點擊標題即可展開或收合內容。"
        },
        {
            term: "CSS Transitions",
            category: "響應式與互動",
            description: "CSS 過渡效果，讓元素屬性變化時產生平滑的動畫效果。",
            example: "使用 transition: background-color 0.3s ease 讓按鈕懸停時平滑變色。"
        },
        {
            term: "CSS Keyframes",
            category: "響應式與互動",
            description: "CSS 關鍵影格動畫，用於創建複雜的多步驟動畫效果。",
            example: "使用 @keyframes 為網站 Logo 製作旋轉動畫效果。"
        },
        {
            term: "API Call",
            category: "網站功能與開發",
            description: "API 呼叫，向伺服器發送請求以取得或發送資料的過程。",
            example: "在頁面載入時執行 API Call 從後端資料庫取得商品清單。"
        },
        {
            term: "Async/Await",
            category: "網站功能與開發",
            description: "非同步處理語法，讓非同步程式碼讀起來更像同步執行，避免回呼地獄。",
            example: "使用 async/await 處理資料擷取，確保資料載入完成後才渲染頁面。"
        },
        {
            term: "State Management",
            category: "網站功能與開發",
            description: "狀態管理，管理應用程式中共享資料的方法和工具。",
            example: "使用 Redux 或 Vuex 管理全域的用戶登入狀態和購物車資料。"
        },
        {
            term: "Caching",
            category: "效能與數據",
            description: "快取機制，將常用資料暫存在記憶體中，提高存取速度。",
            example: "實作瀏覽器快取和 CDN 快取，減少重複的資料請求。"
        },
        {
            term: "CDN",
            category: "效能與數據",
            description: "內容傳遞網路，透過全球分散的伺服器節點提供更快的內容存取。",
            example: "使用 Cloudflare 或 AWS CloudFront 加速靜態資源的載入速度。"
        },
        {
            term: "User Journey",
            category: "效能與數據",
            description: "使用者旅程，描述使用者從初次接觸到完成目標的完整路徑。",
            example: "分析從首頁瀏覽到完成購買的完整使用者旅程，找出優化點。"
        },
        {
            term: "A/B Testing",
            category: "效能與數據",
            description: "A/B 測試，同時展示兩個版本並比較效果，找出最佳方案。",
            example: "對首頁的 CTA 按鈕進行 A/B 測試，比較紅色和藍色按鈕的點擊率。"
        },
        {
            term: "Heatmap",
            category: "效能與數據",
            description: "熱力圖，以顏色深淺表示使用者點擊或關注的區域。",
            example: "使用熱力圖分析首頁的使用者行為，優化按鈕位置和內容佈局。"
        },
        {
            term: "Headless CMS",
            category: "新技術與趨勢",
            description: "無頭內容管理系統，只提供內容管理後台和 API，不包含前端介面。",
            example: "使用 Strapi 或 Contentful 讓後端人員管理內容，前端使用 React 呈現。"
        },
        {
            term: "GraphQL",
            category: "新技術與趨勢",
            description: "API 查詢語言，讓客戶端精確指定需要的資料，避免過度或不足的傳輸。",
            example: "使用 GraphQL 取代 REST API，讓前端能更有效率地獲取所需資料。"
        },
        {
            term: "Serverless Architecture",
            category: "新技術與趨勢",
            description: "無伺服器架構，將功能拆分成獨立的微服務，根據需求彈性擴展。",
            example: "將圖片處理功能部署在 AWS Lambda 上，應對高流量時的負載。"
        },
        {
            term: "PWA",
            category: "新技術與趨勢",
            description: "漸進式網頁應用程式，結合網頁和原生應用的優點。",
            example: "將網站升級為 PWA，支援離線瀏覽和推送通知功能。"
        },
        {
            term: "Version Control",
            category: "專案管理與維護",
            description: "版本控制，追蹤和管理程式碼變更的系統。",
            example: "使用 Git 管理程式碼版本，支援多人協作和程式碼回滾。"
        },
        {
            term: "CI/CD",
            category: "專案管理與維護",
            description: "持續整合/持續部署，自動化測試和部署流程。",
            example: "設定 GitHub Actions 自動執行測試並部署到生產環境。"
        },
        {
            term: "CSS Variables",
            category: "版面與視覺",
            description: "CSS 自定義屬性，允許在樣式表中定義可重用的值，支援主題切換和動態樣式。",
            example: "使用 :root { --primary-color: #667eea; } 定義主題色彩變數。"
        },
        {
            term: "Focus-visible",
            category: "響應式與互動",
            description: "CSS 偽類選擇器，只在鍵盤導航時顯示焦點樣式，提升無障礙體驗。",
            example: "使用 :focus-visible 替代 :focus，避免滑鼠點擊時顯示焦點框。"
        },
        {
            term: "Debounce",
            category: "效能與數據",
            description: "防抖動技術，延遲執行函數直到停止觸發事件一段時間後，優化效能。",
            example: "搜尋輸入框使用 debounce 避免每次輸入都觸發 API 請求。"
        },
        {
            term: "RequestAnimationFrame",
            category: "效能與數據",
            description: "瀏覽器 API，在下次重繪前執行動畫，提供更流暢的動畫效果。",
            example: "使用 requestAnimationFrame 優化滾動動畫的效能。"
        },
        {
            term: "Intersection Observer",
            category: "效能與數據",
            description: "瀏覽器 API，非同步監控元素是否進入視窗，用於實現滾動動畫和懶載入。",
            example: "使用 Intersection Observer 實現元素進入視窗時的淡入動畫。"
        },
        {
            term: "Open Graph",
            category: "效能與數據",
            description: "Facebook 開發的 meta 標籤協議，控制社群媒體分享時的預覽內容。",
            example: "設定 og:title 和 og:description 讓分享連結顯示正確的標題和描述。"
        },
        {
            term: "Twitter Card",
            category: "效能與數據",
            description: "Twitter 的 meta 標籤協議，優化推文中的連結預覽顯示效果。",
            example: "使用 twitter:card 和 twitter:image 讓推文顯示豐富的預覽卡片。"
        },
        {
            term: "Local Storage",
            category: "網站功能與開發",
            description: "瀏覽器本地儲存 API，在客戶端持久化儲存資料，支援主題設定和用戶偏好。",
            example: "使用 localStorage.setItem('theme', 'dark') 儲存用戶的主題選擇。"
        },
        {
            term: "Back to Top",
            category: "響應式與互動",
            description: "回到頂部按鈕，長頁面時提供快速導航到頁面頂部的功能。",
            example: "當滾動超過 300px 時顯示回到頂部按鈕，點擊平滑滾動到頂部。"
        },
        {
            term: "Loading Spinner",
            category: "響應式與互動",
            description: "載入動畫，在資料載入過程中顯示的視覺回饋，提升用戶體驗。",
            example: "搜尋時顯示旋轉的載入動畫，讓用戶知道系統正在處理請求。"
        },
        {
            term: "Search Highlight",
            category: "響應式與互動",
            description: "搜尋結果高亮，將搜尋關鍵字在結果中以不同樣式標示，提升可讀性。",
            example: "搜尋 'CSS' 時，結果中的 'CSS' 文字會以黃色背景高亮顯示。"
        },
        {
            term: "Theme Toggle",
            category: "響應式與互動",
            description: "主題切換功能，允許用戶在明暗主題之間切換，提供個人化體驗。",
            example: "點擊月亮圖示切換到暗色主題，太陽圖示切換回明亮主題。"
        },
        {
            term: "Batch Processing",
            category: "效能與數據",
            description: "批次處理技術，將大量操作分成小批次執行，避免阻塞主線程。",
            example: "動畫元素分批處理，每次處理 10 個元素，避免一次性處理造成卡頓。"
        },
        {
            term: "Media Query",
            category: "響應式與互動",
            description: "CSS 媒體查詢，根據設備特性（螢幕尺寸、方向等）應用不同樣式。",
            example: "@media (max-width: 768px) { .container { padding: 0 15px; } }"
        },
        {
            term: "Accessibility (a11y)",
            category: "響應式與互動",
            description: "無障礙設計，確保網站能被所有用戶（包括殘障人士）正常使用。",
            example: "使用 aria-label、role 屬性和鍵盤導航支援螢幕閱讀器用戶。"
        },
        {
            term: "CSS Custom Properties",
            category: "版面與視覺",
            description: "CSS 自定義屬性的另一種稱呼，提供動態樣式變更的能力。",
            example: "定義 --primary-color 變數，可在 JavaScript 中動態修改主題色彩。"
        },
        {
            term: "Smooth Scrolling",
            category: "響應式與互動",
            description: "平滑滾動效果，讓頁面滾動更加流暢自然，提升用戶體驗。",
            example: "使用 scroll-behavior: smooth 或 window.scrollTo({ behavior: 'smooth' }) 實現。"
        },
        {
            term: "Performance Optimization",
            category: "效能與數據",
            description: "效能優化，通過各種技術手段提升網站的載入速度和執行效率。",
            example: "使用 debounce、requestAnimationFrame、批次處理等技術優化動畫效能。"
        },
        {
            term: "Responsive Breakpoints",
            category: "響應式與互動",
            description: "響應式斷點，定義不同螢幕尺寸的切換點，確保網站在各種設備上正常顯示。",
            example: "設定 768px、1024px、1440px 作為手機、平板、桌面的主要斷點。"
        }
    ];

    const searchInput = document.getElementById('searchInput');
    const glossaryGrid = document.getElementById('glossaryGrid');

    // 渲染術語列表
    function renderGlossary(terms = glossaryData) {
        glossaryGrid.innerHTML = terms.map(term => `
            <div class="glossary-item">
                <div class="glossary-term">${term.term}</div>
                <div class="glossary-category">${term.category}</div>
                <div class="glossary-description">${term.description}</div>
                <div class="glossary-example">
                    <strong>範例：</strong>${term.example}
                </div>
            </div>
        `).join('');
    }

    // 搜尋功能
    function searchTerms(query) {
        if (!query.trim()) {
            renderGlossary();
            return;
        }

        const filteredTerms = glossaryData.filter(term => 
            term.term.toLowerCase().includes(query.toLowerCase()) ||
            term.category.toLowerCase().includes(query.toLowerCase()) ||
            term.description.toLowerCase().includes(query.toLowerCase())
        );

        // 高亮搜尋關鍵字
        const highlightedTerms = filteredTerms.map(term => ({
            ...term,
            term: highlightText(term.term, query),
            category: highlightText(term.category, query),
            description: highlightText(term.description, query)
        }));

        renderGlossary(highlightedTerms);
    }

    // 高亮文字
    function highlightText(text, query) {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // 綁定搜尋事件
    searchInput.addEventListener('input', function() {
        searchTerms(this.value);
    });

    // 初始渲染
    renderGlossary();
}

// ===========================================
// 全域錯誤處理 (Global Error Handling)
// ===========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript 錯誤:', e.error);
    // 可以在這裡添加錯誤報告功能
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('未處理的 Promise 拒絕:', e.reason);
    // 可以在這裡添加錯誤報告功能
});

// ===========================================
// 效能監控與分析 (Performance Monitoring)
// ===========================================
if (window.performance && window.performance.mark) {
    window.performance.mark('website-loaded');
}

// ===========================================
// 模組匯出 (Module Exports)
// 注意：在瀏覽器環境中，這些函數會自動成為全域函數
// ===========================================
window.AITerminologyWebsite = {
    CONFIG,
    initializeSmartSearch,
    initializeGlossary,
    addLoadingProgress,
    addTooltips
};
