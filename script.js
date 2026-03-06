// Language switcher: whole site in Arabic OR English (no mix)
const LANG_STORAGE_KEY = 'athar-site-lang';

function getStoredLang() {
    try {
        return localStorage.getItem(LANG_STORAGE_KEY) || 'ar';
    } catch (_) {
        return 'ar';
    }
}

function setStoredLang(lang) {
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (_) {}
}

function applyLanguage(lang) {
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute('lang', lang === 'en' ? 'en' : 'ar');
    html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    html.classList.remove('site-lang-ar', 'site-lang-en');
    html.classList.add(lang === 'en' ? 'site-lang-en' : 'site-lang-ar');
    body.classList.remove('site-lang-ar', 'site-lang-en');
    body.classList.add(lang === 'en' ? 'site-lang-en' : 'site-lang-ar');
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    setStoredLang(lang);
}

function initLanguage() {
    const lang = getStoredLang();
    applyLanguage(lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            if (newLang) applyLanguage(newLang);
        });
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling for anchor links
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

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(139, 0, 0, 0.95), rgba(165, 42, 42, 0.95))';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #8B0000, #A52A2A)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe content boxes for animation
    document.querySelectorAll('.content-box').forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(30px)';
        box.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(box);
    });

    // Contact links interaction
    document.querySelectorAll('.contact-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Logo animation on hover
    document.querySelectorAll('.logo-img').forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
