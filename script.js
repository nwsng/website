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

// Touch/Swipe navigation for mobile
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold && !isSwiping) {
        isSwiping = true;
        if (diff > 0) {
            // Swipe left - go to next page
            goToPage(currentPage + 1);
        } else {
            // Swipe right - go to previous page
            goToPage(currentPage - 1);
        }
        // Reset swipe flag after animation
        setTimeout(() => {
            isSwiping = false;
        }, 600);
    }
}

// Touch event listeners
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

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
    document.body.style.height = '100%';
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

    // Prevent body scroll on touch devices, but allow vertical scroll in page content
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        const target = e.target;
        const pageContent = target.closest('.page-content');
        
        // Allow scrolling within page content
        if (pageContent) {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = touchY - touchStartY;
            const deltaX = touchX - touchStartX;
            
            // If horizontal swipe (for page navigation), prevent default
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
                return;
            }
            
            // Allow vertical scrolling within page content
            const isScrollable = pageContent.scrollHeight > pageContent.clientHeight;
            if (isScrollable) {
                const isAtTop = pageContent.scrollTop <= 0;
                const isAtBottom = pageContent.scrollTop >= pageContent.scrollHeight - pageContent.clientHeight;
                
                // Prevent body scroll when at boundaries
                if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
                    e.preventDefault();
                }
                return;
            }
        }
        
        // Prevent all other scrolling (body scroll)
        e.preventDefault();
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
