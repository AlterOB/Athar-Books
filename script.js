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
    } catch (_) { }
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
        btn.addEventListener('click', function () {
            const newLang = this.getAttribute('data-lang');
            if (newLang) applyLanguage(newLang);
        });
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
    initLanguage();

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function () {
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
    window.addEventListener('scroll', function () {
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

    const observer = new IntersectionObserver(function (entries) {
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
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Logo animation on hover
    document.querySelectorAll('.logo-img').forEach(logo => {
        logo.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
        });

        logo.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Fetch books from backend API
    const booksContainer = document.getElementById('dynamic-books-container');
    if (booksContainer) {
        fetch('backend/api/books/read.php')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                booksContainer.innerHTML = ''; // clear loading message
                if (data.records && data.records.length > 0) {
                    data.records.forEach(book => {
                        const bookEl = document.createElement('div');
                        bookEl.className = 'book-card';

                        const numberEl = document.createElement('div');
                        numberEl.className = 'book-number';
                        const currentLang = document.documentElement.lang;
                        numberEl.textContent = currentLang === 'en' ? `Book #${book.book_number}` : `كتاب #${book.book_number}`;

                        const titleEl = document.createElement('div');
                        titleEl.className = 'book-title arabic';
                        titleEl.textContent = book.title;

                        const copiesEl = document.createElement('div');
                        copiesEl.className = 'book-copies';
                        copiesEl.innerHTML = currentLang === 'en'
                            ? `Copies: <strong>${book.copies}</strong>`
                            : `النسخ: <strong>${book.copies}</strong>`;

                        bookEl.appendChild(numberEl);
                        bookEl.appendChild(titleEl);
                        bookEl.appendChild(copiesEl);
                        booksContainer.appendChild(bookEl);
                    });
                } else {
                    booksContainer.innerHTML = '<div class="error-books"><span class="lang-ar">لا توجد كتب متاحة حالياً.</span><span class="lang-en">No books currently available.</span></div>';
                }
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                booksContainer.innerHTML = '<div class="error-books"><span class="lang-ar">حدث خطأ أثناء تحميل الكتب.</span><span class="lang-en">Error loading books.</span></div>';
            });
    }

    // ===== Load Public Achievements =====
    const achievementsContainer = document.getElementById('achievements-public-wrapper');
    if (achievementsContainer) {
        loadPublicAchievements();
    }

    function loadPublicAchievements() {
        const lang = getStoredLang();
        achievementsContainer.innerHTML = `<div class="loading-books"><span class="lang-ar">جاري تحميل الإنجازات...</span><span class="lang-en">Loading achievements...</span></div>`;

        fetch('backend/api/achievements/read.php')
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch achievements');
                return r.json();
            })
            .then(data => {
                achievementsContainer.innerHTML = '';
                if (data.records && data.records.length > 0) {
                    data.records.forEach(ach => {
                        const card = document.createElement('div');
                        card.className = 'achievement-card';

                        const arText = ach.title_ar.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        const enText = ach.title_en.replace(/</g, '&lt;').replace(/>/g, '&gt;');

                        card.innerHTML = `<h3><span class="lang-ar">${arText}</span><span class="lang-en">${enText}</span></h3>`;
                        achievementsContainer.appendChild(card);
                    });
                } else {
                    achievementsContainer.innerHTML = '<div class="error-books"><span class="lang-ar">لا توجد إنجازات مسجلة حالياً.</span><span class="lang-en">No achievements currently recorded.</span></div>';
                }
            })
            .catch(error => {
                console.error('Error fetching achievements:', error);
                achievementsContainer.innerHTML = '<div class="error-books"><span class="lang-ar">حدث خطأ أثناء تحميل الإنجازات.</span><span class="lang-en">Error loading achievements.</span></div>';
            });
    }

    // ===== Borrow Modal Logic =====
    const borrowModal = document.getElementById('borrow-modal');
    const openModalBtn = document.getElementById('open-borrow-modal');
    const closeModalBtn = document.getElementById('close-borrow-modal');
    const borrowForm = document.getElementById('borrow-form');
    const borrowError = document.getElementById('borrow-modal-error');

    function openBorrowModal() {
        if (!borrowModal) return;
        borrowModal.classList.add('active');
        borrowModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // Focus the first input
        const firstInput = borrowModal.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeBorrowModal() {
        if (!borrowModal) return;
        borrowModal.classList.remove('active');
        borrowModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (borrowForm) borrowForm.reset();
        if (borrowError) borrowError.textContent = '';
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openBorrowModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeBorrowModal);
    }

    // Close on overlay click
    if (borrowModal) {
        borrowModal.addEventListener('click', function (e) {
            if (e.target === borrowModal) closeBorrowModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && borrowModal && borrowModal.classList.contains('active')) {
            closeBorrowModal();
        }
    });

    // Form submission
    if (borrowForm) {
        borrowForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const bookId = document.getElementById('borrow-book-id').value.trim();
            const memberNumber = document.getElementById('borrow-member-number').value.trim();
            const lang = getStoredLang();

            // Validate book ID
            if (!bookId || isNaN(bookId) || parseInt(bookId) < 1) {
                borrowError.textContent = lang === 'en'
                    ? 'Please enter a valid book number.'
                    : 'يرجى إدخال رقم كتاب صالح.';
                return;
            }

            // Validate member number (must be exactly 4 digits)
            if (!/^\d{4}$/.test(memberNumber)) {
                borrowError.textContent = lang === 'en'
                    ? 'Member number must be exactly 4 digits.'
                    : 'رقم العضوية يجب أن يتكون من 4 أرقام.';
                return;
            }

            borrowError.textContent = '';

            // Disable submit button while processing
            const submitBtn = borrowForm.querySelector('.modal-submit');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';

            // POST to backend API
            fetch('backend/api/requests/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    member_number: memberNumber,
                    book_id: parseInt(bookId)
                })
            })
                .then(r => r.json())
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    if (data.success) {
                        borrowError.style.color = '#27ae60';
                        borrowError.textContent = lang === 'en' ? data.message_en : data.message_ar;
                        setTimeout(() => {
                            borrowError.style.color = '';
                            closeBorrowModal();
                        }, 2000);
                    } else {
                        borrowError.style.color = '#c0392b';
                        borrowError.textContent = lang === 'en' ? data.message_en : data.message_ar;
                    }
                })
                .catch(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    borrowError.textContent = lang === 'en'
                        ? 'Network error. Please try again.'
                        : 'خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
                });
        });
    }

    // ===== Admin Login Modal Logic =====
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-modal');
    const adminForm = document.getElementById('admin-login-form');
    const adminError = document.getElementById('admin-modal-error');

    function openAdminModal() {
        if (!adminModal) return;
        adminModal.classList.add('active');
        adminModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const firstInput = adminModal.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeAdminModal() {
        if (!adminModal) return;
        adminModal.classList.remove('active');
        adminModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (adminForm) adminForm.reset();
        if (adminError) { adminError.textContent = ''; adminError.style.color = ''; }
    }

    if (openAdminBtn) openAdminBtn.addEventListener('click', openAdminModal);
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminModal);

    if (adminModal) {
        adminModal.addEventListener('click', function (e) {
            if (e.target === adminModal) closeAdminModal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && adminModal && adminModal.classList.contains('active')) {
            closeAdminModal();
        }
    });

    if (adminForm) {
        adminForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const adminId = document.getElementById('admin-id-input').value.trim();
            const lang = getStoredLang();

            if (!adminId) {
                adminError.style.color = '#c0392b';
                adminError.textContent = lang === 'en' ? 'Please enter your admin ID.' : 'يرجى إدخال معرّف المدير.';
                return;
            }

            adminError.textContent = '';
            const submitBtn = adminForm.querySelector('.modal-submit');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';

            fetch('backend/api/auth/admin_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: adminId })
            })
                .then(r => r.json())
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    if (data.success) {
                        adminError.style.color = '#27ae60';
                        adminError.textContent = lang === 'en' ? data.message_en : data.message_ar;
                        setTimeout(() => { window.location.href = 'admin.html'; }, 800);
                    } else {
                        adminError.style.color = '#c0392b';
                        adminError.textContent = lang === 'en' ? data.message_en : data.message_ar;
                    }
                })
                .catch(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    adminError.style.color = '#c0392b';
                    adminError.textContent = lang === 'en'
                        ? 'Network error. Please try again.'
                        : 'خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
                });
        });
    }
});
