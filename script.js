// ============================================
// PAGE NAVIGATION - STANDARD ROUTING
// ============================================

// Page names in order
const PAGE_NAMES = ['home', 'about', 'team', 'watch', 'prayer', 'serve', 'new', 'give'];
const PAGE_ROUTES = ['/', '/about', '/team', '/watch', '/prayer', '/serve', '/new', '/give'];

// State
let pages;
let navLinks;
let currentPage = 0;

// Get page index from name
function getPageIndex(name) {
    return PAGE_NAMES.indexOf(name);
}

// Show page
function showPage(index, updateUrl = true) {
    if (!pages || pages.length === 0) return;
    if (index < 0 || index >= pages.length) return;
    
    currentPage = index;
    
    // Hide all pages
    pages.forEach((page, i) => {
        page.classList.toggle('page-active', i === index);
    });
    
    // Update active nav link
    const pageName = PAGE_NAMES[index];
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageName);
    });
    
    // Update URL if requested
    if (updateUrl) {
        const route = PAGE_ROUTES[index];
        
        try {
            // Use hash-based routing for better GitHub Pages compatibility
            // This ensures direct links work even on GitHub Pages
            if (window.history && window.history.pushState && !window.location.hostname.includes('github.io')) {
                window.history.pushState({ page: index }, '', route);
            } else {
                window.location.hash = `#${pageName}`;
            }
        } catch (e) {
            window.location.hash = `#${pageName}`;
        }
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize from URL
function initFromUrl() {
    if (!pages || pages.length === 0) return;
    
    let index = 0;
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // Check hash first (for GitHub Pages compatibility)
    if (hash) {
        const name = hash.replace('#', '').trim();
        const hashIndex = getPageIndex(name);
        if (hashIndex !== -1) {
            index = hashIndex;
        }
    } else {
        // Check path
        if (path === '/' || path === '/index.html' || path === '') {
            index = 0;
        } else {
            const routeIndex = PAGE_ROUTES.indexOf(path);
            if (routeIndex !== -1) {
                index = routeIndex;
            }
        }
    }
    
    // Update URL (use hash for GitHub Pages compatibility)
    try {
        // Try to use pushState, but fallback to hash
        if (window.history && window.history.pushState) {
            window.history.replaceState({ page: index }, '', PAGE_ROUTES[index]);
        } else {
            window.location.hash = `#${PAGE_NAMES[index]}`;
        }
    } catch (e) {
        window.location.hash = `#${PAGE_NAMES[index]}`;
    }
    
    // Show the page
    showPage(index, false);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    pages = Array.from(document.querySelectorAll('.page-section'));
    navLinks = Array.from(document.querySelectorAll('.nav-link'));
    
    // Verify pages are in expected order
    const actualOrder = pages.map(p => p.id.replace('page-', ''));
    const expectedOrder = PAGE_NAMES;
    
    if (JSON.stringify(actualOrder) !== JSON.stringify(expectedOrder)) {
        console.warn('⚠️ DOM order mismatch! Reordering pages array...');
        pages = [];
        PAGE_NAMES.forEach((pageName) => {
            const pageId = `page-${pageName}`;
            const page = document.getElementById(pageId);
            if (page) {
                pages.push(page);
            } else {
                console.error('❌ Page not found:', pageId);
            }
        });
    }
    
    // Nav links
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Allow external links to work normally
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                // Don't prevent default for external links
                // Close mobile menu
                const menuToggle = document.getElementById('menuToggle');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    document.querySelector('.nav-links')?.classList.remove('active');
                }
                return; // Let the link work normally
            }
            
            // If href is just "#", don't navigate (for dropdown triggers)
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            const index = getPageIndex(pageName);
            if (index !== -1) {
                showPage(index);
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
        showPage(0);
    });
    
    // Internal links
    document.querySelectorAll('a[href^="/"], a[href^="#"]').forEach(anchor => {
        if (anchor.classList.contains('nav-link') || anchor.classList.contains('logo-link')) return;
        
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            if (href.startsWith('/')) {
                e.preventDefault();
                const routeIndex = PAGE_ROUTES.indexOf(href);
                if (routeIndex !== -1) showPage(routeIndex);
            } else if (href.startsWith('#')) {
                e.preventDefault();
                const name = href.replace('#', '');
                const nameIndex = getPageIndex(name);
                if (nameIndex !== -1) showPage(nameIndex);
            }
        });
    });
    
    // Browser navigation
    window.addEventListener('popstate', (e) => {
        if (e.state?.page !== undefined) {
            showPage(e.state.page, false);
        } else {
            initFromUrl();
        }
    });
    
    // Hash change (for GitHub Pages compatibility)
    window.addEventListener('hashchange', () => {
        initFromUrl();
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
    
    // Nav scroll effect
    let lastScroll = 0;
    const nav = document.getElementById('nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
    
    // Statement toggles
    document.querySelectorAll('.statement-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const statementCard = toggle.closest('.statement-card');
            const expanded = statementCard.querySelector('.statement-expanded');
            const isActive = expanded.classList.contains('active');
            
            if (isActive) {
                expanded.classList.remove('active');
                toggle.classList.remove('active');
            } else {
                expanded.classList.add('active');
                toggle.classList.add('active');
            }
        });
    });
    
    // Announcement bar close
    const announcementBar = document.getElementById('announcementBar');
    const announcementClose = document.getElementById('announcementClose');
    
    if (announcementClose && announcementBar) {
        announcementClose.addEventListener('click', () => {
            announcementBar.classList.add('hidden');
            // Adjust nav and content positions
            const nav = document.getElementById('nav');
            if (nav) {
                nav.classList.add('no-announcement');
            }
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.top = '70px';
            }
            document.querySelectorAll('.page-section:not(#page-home)').forEach(section => {
                section.style.paddingTop = '80px';
            });
            const hero = document.querySelector('#page-home .hero');
            if (hero) {
                hero.style.paddingTop = '80px';
            }
        });
    }
    
    // Initialize
    initFromUrl();
});
