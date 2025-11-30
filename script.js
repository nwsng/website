// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to dark mode
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

// Page Navigation
const notebookContainer = document.querySelector('.notebook-container');
const pages = document.querySelectorAll('.notebook-page');
const pageIndicators = document.querySelectorAll('.page-indicator');
const navLinks = document.querySelectorAll('.nav-link');
let currentPage = 0;

const pageNames = ['home', 'about', 'watch', 'prayer', 'new'];

function goToPage(index) {
    if (index < 0 || index >= pages.length) return;
    
    currentPage = index;
    const offset = -index * 100;
    notebookContainer.style.transform = `translateX(${offset}vw)`;
    
    // Update active states
    pages.forEach((page, i) => {
        page.classList.toggle('page-active', i === index);
    });
    
    pageIndicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === index);
    });
    
    // Update URL hash
    window.history.pushState(null, '', `#page-${pageNames[index]}`);
}

// Initialize from URL hash
function initPage() {
    const hash = window.location.hash;
    if (hash) {
        const pageName = hash.replace('#page-', '');
        const index = pageNames.indexOf(pageName);
        if (index !== -1) {
            goToPage(index);
            return;
        }
    }
    goToPage(0);
}

// Navigation buttons
const pagePrev = document.getElementById('pagePrev');
const pageNext = document.getElementById('pageNext');

if (pagePrev) {
    pagePrev.addEventListener('click', () => {
        goToPage(currentPage - 1);
    });
}

if (pageNext) {
    pageNext.addEventListener('click', () => {
        goToPage(currentPage + 1);
    });
}

// Page indicators
pageIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToPage(index);
    });
});

// Nav links
navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(index);
        // Close mobile menu
        if (menuToggle) {
            menuToggle.classList.remove('active');
            const navLinksContainer = document.querySelector('.nav-links');
            if (navLinksContainer) {
                navLinksContainer.classList.remove('active');
            }
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goToPage(currentPage - 1);
    } else if (e.key === 'ArrowRight') {
        goToPage(currentPage + 1);
    }
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    initPage();
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    
    // Prevent scroll on body and html
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';
    document.body.style.width = '100%';
    document.body.style.position = 'relative';
    
    // Allow scroll within pages
    pages.forEach(page => {
        const pageContent = page.querySelector('.page-content');
        if (pageContent) {
            pageContent.style.overflowY = 'auto';
            pageContent.style.overflowX = 'hidden';
            pageContent.style.height = '100vh';
            pageContent.style.maxWidth = '100%';
        }
    });

    // Prevent horizontal scroll on touch devices
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.querySelector('.nav-links');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuToggle && navLinksContainer && 
        !menuToggle.contains(e.target) && 
        !navLinksContainer.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    }
});

// Navigation scroll effect (for nav bar)
const nav = document.getElementById('nav');
if (nav) {
    // Nav is always visible in notebook layout, but we can still add scrolled class for styling
    nav.classList.add('scrolled');
}

// Smooth scroll for internal links within pages
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle if it's a page link
        if (href.startsWith('#page-')) {
            e.preventDefault();
            const pageName = href.replace('#page-', '');
            const index = pageNames.indexOf(pageName);
            if (index !== -1) {
                goToPage(index);
            }
        }
    });
});
