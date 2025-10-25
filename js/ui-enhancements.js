// GÖRSEL VE UX İYİLEŞTİRMELERİ

// Sayfa geçiş animasyonları
let isTransitioning = false;
let touchStartX = 0;
let touchStartY = 0;
let currentPage = '';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initializePageTransitions();
    // initializeSwipeNavigation(); // SWIPE NAVIGATION TAMAMEN DEVRE DIŞI
    createFloatingActionButton();
    initializeScrollAnimations();
    initializeParallaxEffects();
    detectCurrentPage();
});

// Mevcut sayfayı tespit et
function detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('puan-durumu.html')) currentPage = 'puan-durumu';
    else if (path.includes('maclar.html')) currentPage = 'maclar';
    else if (path.includes('oyuncu-profili.html')) currentPage = 'oyuncu-profili';
    else currentPage = 'index';
}

// SAYFA GEÇİŞ ANİMASYONLARI
function initializePageTransitions() {
    // Tüm navigation linklerine click event ekle
    const navLinks = document.querySelectorAll('.nav-link, a[href$=".html"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', handlePageTransition);
    });
}

function handlePageTransition(e) {
    if (isTransitioning) return;
    
    const href = e.target.href || e.target.closest('a')?.href;
    if (!href || href.includes('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    
    // Aynı sayfa ise animasyon yapma
    if (href === window.location.href) {
        e.preventDefault();
        return;
    }
    
    e.preventDefault();
    isTransitioning = true;
    
    // Çıkış animasyonu
    const body = document.body;
    body.classList.add('page-transition-out');
    
    // Yükleme göstergesi
    showPageLoader();
    
    setTimeout(() => {
        window.location.href = href;
    }, 500); // Animasyon süresi
}

// Sayfa yüklenme animasyonu
function initializePageEntry() {
    const body = document.body;
    body.classList.add('page-transition-in');
    
    setTimeout(() => {
        body.classList.remove('page-transition-in');
        hidePageLoader();
        
        // Sayfa içi elementleri animasyonla göster
        animatePageElements();
    }, 300);
}

// Sayfa elementlerini animasyonla göster
function animatePageElements() {
    const elements = document.querySelectorAll('.glassmorphism-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Sayfa yükleyici
function showPageLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">Yükleniyor...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.classList.add('active');
    }, 10);
}

function hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.remove('active');
        setTimeout(() => loader.remove(), 300);
    }
}

// MOBİL SWIPE NAVİGASYON - DEVRE DIŞI BIRAKILD
function initializeSwipeNavigation() {
    // Bu fonksiyon artık devre dışı - swipe navigation engellendi
    console.log('Swipe navigation devre dışı bırakıldı');
    return false;
}

function handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    
    const diffX = touchStartX - touchCurrentX;
    const diffY = touchStartY - touchCurrentY;
    
    // Yatay swipe mi kontrol et
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe feedback göster
        showSwipeFeedback(diffX > 0 ? 'left' : 'right');
    }
}

function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Minimum swipe mesafesi
    const minSwipeDistance = 50;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
            // Sola swipe - sonraki sayfa
            navigateToNextPage();
        } else {
            // Sağa swipe - önceki sayfa
            navigateToPreviousPage();
        }
    }
    
    // Touch değişkenlerini sıfırla
    touchStartX = 0;
    touchStartY = 0;
    hideSwipeFeedback();
}

function navigateToNextPage() {
    const pageOrder = ['index', 'puan-durumu', 'maclar'];
    const currentIndex = pageOrder.indexOf(currentPage);
    
    if (currentIndex < pageOrder.length - 1) {
        const nextPage = pageOrder[currentIndex + 1];
        navigateToPage(nextPage);
    }
}

function navigateToPreviousPage() {
    const pageOrder = ['index', 'puan-durumu', 'maclar'];
    const currentIndex = pageOrder.indexOf(currentPage);
    
    if (currentIndex > 0) {
        const prevPage = pageOrder[currentIndex - 1];
        navigateToPage(prevPage);
    }
}

function navigateToPage(page) {
    const urls = {
        'index': 'index.html',
        'puan-durumu': 'puan-durumu.html',
        'maclar': 'maclar.html'
    };
    
    if (urls[page]) {
        window.location.href = urls[page];
    }
}

// Swipe feedback göster - TAMAMEN DEVRE DIŞI
function showSwipeFeedback(direction) {
    // Bu fonksiyon artık devre dışı - "Sonraki Sayfa" / "Önceki Sayfa" engellendi
    console.log('Swipe feedback engellendi:', direction);
    return false;
}
    
    indicator.innerHTML = `
        <div class="swipe-feedback-content">
            <span class="swipe-arrow">${arrow}</span>
            <span class="swipe-text">${text}</span>
        </div>
    `;
    
    indicator.className = `swipe-feedback swipe-${direction} active`;
}

function hideSwipeFeedback() {
    const indicator = document.getElementById('swipe-feedback');
    if (indicator) {
        indicator.classList.remove('active');
    }
}

// Swipe göstergesi oluştur - DEVRE DIŞI
function createSwipeIndicator() {
    // Bu fonksiyon artık devre dışı - swipe göstergesi engellendi
    return false;
}
    indicator.innerHTML = `
        <div class="swipe-hint">
            <span class="swipe-icon">👆</span>
            <span class="swipe-hint-text">Sayfalar arası geçiş için kaydırın</span>
        </div>
    `;
    
    document.body.appendChild(indicator);
    
    // 3 saniye sonra gizle
    setTimeout(() => {
        indicator.classList.add('fade-out');
        setTimeout(() => indicator.remove(), 500);
    }, 3000);
}

// FLOATİNG ACTİON BUTTON
function createFloatingActionButton() {
    const fab = document.createElement('div');
    fab.id = 'floating-action-button';
    fab.className = 'floating-action-button';
    
    fab.innerHTML = `
        <div class="fab-main-button" onclick="toggleFABMenu()">
            <span class="fab-icon">⚡</span>
        </div>
        <div class="fab-menu">
            <button class="fab-option" onclick="quickAddMatch()" title="Hızlı Maç Ekle">
                <span class="fab-option-icon">⚽</span>
                <span class="fab-option-label">Maç Ekle</span>
            </button>
            <button class="fab-option" onclick="showQuickStats()" title="Hızlı İstatistikler">
                <span class="fab-option-icon">📊</span>
                <span class="fab-option-label">İstatistikler</span>
            </button>
            <button class="fab-option" onclick="scrollToTop()" title="Yukarı Çık">
                <span class="fab-option-icon">🔝</span>
                <span class="fab-option-label">Yukarı</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(fab);
    
    // Sayfa scroll'una göre FAB'ı göster/gizle
    window.addEventListener('scroll', handleFABVisibility);
}

function toggleFABMenu() {
    const fab = document.getElementById('floating-action-button');
    fab.classList.toggle('active');
}

function handleFABVisibility() {
    const fab = document.getElementById('floating-action-button');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        fab.classList.add('visible');
    } else {
        fab.classList.remove('visible');
    }
}

// FAB Fonksiyonları
function quickAddMatch() {
    // Hızlı maç ekleme modalı
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content glassmorphism-card">
            <div class="modal-header">
                <h3>Hızlı Maç Ekle</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Bu özellik yakında gelecek! Şu an için maç verilerini manuel olarak data.js dosyasına ekleyebilirsiniz.</p>
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="this.closest('.modal-overlay').remove()" style="padding: 10px 20px; background: var(--primary-accent); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Tamam
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    setTimeout(() => modal.classList.add('active'), 10);
    toggleFABMenu();
}

function showQuickStats() {
    // Hızlı istatistikler modalı
    const stats = calculatePlayerStats();
    const topScorer = stats.reduce((prev, current) => (prev.GF > current.GF) ? prev : current);
    const leader = stats[0];
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content glassmorphism-card">
            <div class="modal-header">
                <h3>Hızlı İstatistikler</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="quick-stats-grid">
                    <div class="quick-stat-item">
                        <span class="quick-stat-icon">👑</span>
                        <span class="quick-stat-label">Lider</span>
                        <span class="quick-stat-value">${leader.name}</span>
                    </div>
                    <div class="quick-stat-item">
                        <span class="quick-stat-icon">⚽</span>
                        <span class="quick-stat-label">En Golcü</span>
                        <span class="quick-stat-value">${topScorer.name} (${topScorer.GF})</span>
                    </div>
                    <div class="quick-stat-item">
                        <span class="quick-stat-icon">🏆</span>
                        <span class="quick-stat-label">Toplam Maç</span>
                        <span class="quick-stat-value">${matches.length}</span>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="this.closest('.modal-overlay').remove()" style="padding: 10px 20px; background: var(--primary-accent); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    setTimeout(() => modal.classList.add('active'), 10);
    toggleFABMenu();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    toggleFABMenu();
}

// SCROLL ANİMASYONLARI
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Scroll animasyonu için elementleri işaretle
    const elements = document.querySelectorAll('.glassmorphism-card, table, .stat-card');
    elements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// PARALLAX EFEKTLERİ
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero'); // Header'ı çıkardık
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${parallax}px)`;
        });
    });
}

// YARDIMCI FONKSİYONLAR
function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Sayfa yüklendiğinde giriş animasyonu
window.addEventListener('load', () => {
    initializePageEntry();
});

// FAB'ın dışına tıklandığında menüyü kapat
document.addEventListener('click', (e) => {
    const fab = document.getElementById('floating-action-button');
    if (fab && !fab.contains(e.target)) {
        fab.classList.remove('active');
    }
});

// Sayfa kapatılırken animasyon
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-transition-out');
});

// SMOOTH SCROLL FİX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export fonksiyonları
window.toggleFABMenu = toggleFABMenu;
window.quickAddMatch = quickAddMatch;
window.showQuickStats = showQuickStats;
window.scrollToTop = scrollToTop;