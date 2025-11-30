// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// PAGE NAVIGATION - SIMPLE & RELIABLE
// ============================================

// Page names in order (matches HTML order)
const PAGE_NAMES = ['home', 'about', 'watch', 'prayer', 'new'];
const PAGE_ROUTES = ['/home', '/about', '/watch', '/prayer', '/new'];

// State
let notebookContainer;
let pages;
let pageIndicators;
let navLinks;
let currentPage = 0;
let isNavigating = false;
const isFileProtocol = window.location.protocol === 'file:';

// Get page index from name
function getPageIndex(name) {
    return PAGE_NAMES.indexOf(name);
}

// Navigate to page
function goToPage(index, updateUrl = true) {
    if (!notebookContainer || !pages || pages.length === 0) return;
    if (index < 0 || index >= pages.length) return;
    if (isNavigating || index === currentPage) return;
    
    isNavigating = true;
    currentPage = index;
    
    // Ensure transition is enabled
    notebookContainer.style.transition = '';
    
    // Move to page
    const transform = `translateX(${-index * 100}vw)`;
    notebookContainer.style.transform = transform;
    
    // Verify the transform was applied and check page positions
    const computedTransform = window.getComputedStyle(notebookContainer).transform;
    const containerRect = notebookContainer.getBoundingClientRect();
    const pagePositions = pages.map((p, i) => {
        const rect = p.getBoundingClientRect();
        return { index: i, id: p.id, left: rect.left, width: rect.width };
    });
    
    console.log(`=== NAVIGATION ===`);
    console.log(`goToPage(${index}):`);
    console.log(`  - Transform: ${transform}`);
    console.log(`  - Applied transform: ${computedTransform}`);
    console.log(`  - Container left: ${containerRect.left}`);
    console.log(`  - Target page ID: ${pages[index]?.id}`);
    console.log(`  - Page positions:`, pagePositions);
    console.log(`  - Current pages array:`, pages.map((p, i) => `[${i}]=${p.id}`));
    
    // Force a reflow to ensure transform is applied
    void notebookContainer.offsetHeight;
    
    // Update active states
    const pageName = PAGE_NAMES[index];
    pages.forEach((p, i) => p.classList.toggle('page-active', i === index));
    pageIndicators.forEach((ind) => {
        ind.classList.toggle('active', ind.getAttribute('data-page') === pageName);
    });
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageName);
    });
    
    // Update URL if requested
    if (updateUrl) {
        const pageName = PAGE_NAMES[index];
        const route = PAGE_ROUTES[index];
        
        if (isFileProtocol) {
            window.location.hash = `#page-${pageName}`;
        } else {
            try {
                window.history.pushState({ page: index }, '', route);
            } catch (e) {
                window.location.hash = `#page-${pageName}`;
            }
        }
    }
    
    setTimeout(() => { isNavigating = false; }, 600);
}

// Initialize from URL
function initFromUrl() {
    if (!pages || pages.length === 0 || !notebookContainer) return;
    
    let index = 0;
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (isFileProtocol) {
        // Use hash
        if (hash) {
            const name = hash.replace('#page-', '').trim();
            const found = getPageIndex(name);
            if (found !== -1) index = found;
        }
        window.location.hash = `#page-${PAGE_NAMES[index]}`;
    } else {
        // Use path or hash
        if (path === '/' || path === '/index.html' || path === '') {
            index = 0;
        } else {
            const routeIndex = PAGE_ROUTES.indexOf(path);
            if (routeIndex !== -1) {
                index = routeIndex;
            } else if (hash) {
                const name = hash.replace('#page-', '').trim();
                const hashIndex = getPageIndex(name);
                if (hashIndex !== -1) index = hashIndex;
            }
        }
        
        // Update URL
        try {
            window.history.replaceState({ page: index }, '', PAGE_ROUTES[index]);
        } catch (e) {
            window.location.hash = `#page-${PAGE_NAMES[index]}`;
        }
    }
    
    // Set initial position immediately (no animation)
    currentPage = index;
    notebookContainer.style.transition = 'none';
    notebookContainer.style.transform = `translateX(${-index * 100}vw)`;
    
    // Update active states
    const pageName = PAGE_NAMES[index];
    pages.forEach((p, i) => p.classList.toggle('page-active', i === index));
    pageIndicators.forEach((ind) => {
        ind.classList.toggle('active', ind.getAttribute('data-page') === pageName);
    });
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageName);
    });
    
    // Re-enable transition after a brief delay
    setTimeout(() => {
        notebookContainer.style.transition = '';
    }, 50);
    
    console.log(`Initialized to page ${index} (${PAGE_NAMES[index]})`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    notebookContainer = document.querySelector('.notebook-container');
    const allPages = Array.from(document.querySelectorAll('.notebook-page'));
    pageIndicators = Array.from(document.querySelectorAll('.page-indicator'));
    navLinks = Array.from(document.querySelectorAll('.nav-link'));
    
    // Ensure container starts at position 0
    if (notebookContainer) {
        notebookContainer.style.transform = 'translateX(0vw)';
        currentPage = 0;
    }
    
    // Use DOM order directly - pages should be in the same order as they appear in HTML
    pages = allPages;
    
    // Verify pages are in expected order
    const actualOrder = pages.map(p => p.id);
    const expectedOrder = PAGE_NAMES.map(n => `page-${n}`);
    console.log('=== PAGE INITIALIZATION ===');
    console.log('Actual DOM order:', actualOrder);
    console.log('Expected order:', expectedOrder);
    console.log('Pages array:', pages.map((p, i) => `[${i}]=${p.id}`));
    
    // If order doesn't match, reorder pages array
    if (JSON.stringify(actualOrder) !== JSON.stringify(expectedOrder)) {
        console.warn('⚠️ DOM order mismatch! Reordering pages array...');
        pages = [];
        PAGE_NAMES.forEach((pageName) => {
            const pageId = `page-${pageName}`;
            const page = allPages.find(p => p.id === pageId);
            if (page) {
                pages.push(page);
            } else {
                console.error('❌ Page not found:', pageId);
            }
        });
        console.log('✅ Reordered pages:', pages.map((p, i) => `[${i}]=${p.id}`));
    } else {
        console.log('✅ Page order matches!');
    }
    
    // Nav links - use data-page directly
    navLinks.forEach((link) => {
        // Prevent duplicate handlers
        if (link.dataset.handlerAttached === 'true') return;
        link.dataset.handlerAttached = 'true';
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pageName = link.getAttribute('data-page');
            const index = getPageIndex(pageName);
            console.log('Nav click:', pageName, '-> index:', index, '-> page:', pages[index]?.id, 'currentPage:', currentPage);
            if (index !== -1) {
                goToPage(index);
            } else {
                console.error('Invalid page index for:', pageName);
            }
            
            // Close mobile menu
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                document.querySelector('.nav-links')?.classList.remove('active');
            }
        });
    });
    
    // Logo
    document.querySelector('.logo-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(0);
    });
    
    // Prev/Next buttons
    document.getElementById('pagePrev')?.addEventListener('click', () => {
        if (currentPage > 0) goToPage(currentPage - 1);
    });
    
    document.getElementById('pageNext')?.addEventListener('click', () => {
        if (currentPage < pages.length - 1) goToPage(currentPage + 1);
    });
    
    // Page indicators
    pageIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToPage(index));
    });
    
    // Internal links
    document.querySelectorAll('a[href^="/"], a[href^="#page-"]').forEach(anchor => {
        if (anchor.classList.contains('nav-link') || anchor.classList.contains('logo-link')) return;
        
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            if (href.startsWith('/')) {
                e.preventDefault();
                const routeIndex = PAGE_ROUTES.indexOf(href);
                if (routeIndex !== -1) goToPage(routeIndex);
            } else if (href.startsWith('#page-')) {
                e.preventDefault();
                const name = href.replace('#page-', '');
                const nameIndex = getPageIndex(name);
                if (nameIndex !== -1) goToPage(nameIndex);
            }
        });
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPage > 0) goToPage(currentPage - 1);
        if (e.key === 'ArrowRight' && currentPage < pages.length - 1) goToPage(currentPage + 1);
    });
    
    // Swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50 && !isNavigating) {
            if (diff > 0 && currentPage < pages.length - 1) {
                goToPage(currentPage + 1);
            } else if (diff < 0 && currentPage > 0) {
                goToPage(currentPage - 1);
            }
        }
    }, { passive: true });
    
    // Scroll handling
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';
    
    pages.forEach(page => {
        const content = page.querySelector('.page-content');
        if (content) {
            content.style.overflowY = 'auto';
            content.style.overflowX = 'hidden';
        }
    });
    
    // Touch scroll prevention
    let touchX = 0, touchY = 0;
    document.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        const target = e.target;
        if (target.closest('.page-content')) return;
        
        const deltaX = Math.abs(e.touches[0].clientX - touchX);
        const deltaY = Math.abs(e.touches[0].clientY - touchY);
        
        if (deltaX > deltaY && deltaX > 20) return; // Allow horizontal swipe
        
        e.preventDefault();
    }, { passive: false });
    
    // Browser navigation
    window.addEventListener('popstate', (e) => {
        if (e.state?.page !== undefined) {
            goToPage(e.state.page);
        } else {
            initFromUrl();
        }
    });
    
    window.addEventListener('hashchange', () => {
        if (isFileProtocol) initFromUrl();
    });
    
    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }
    
    document.getElementById('nav')?.classList.add('scrolled');
    
    // Initialize
    initFromUrl();
});
