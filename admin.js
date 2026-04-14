// ===== Admin Panel Logic =====
document.addEventListener('DOMContentLoaded', function () {
    const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ar';
    const isEn = () => lang() === 'en';

    // ── Toast helper ──
    function showToast(message, success = true) {
        let toast = document.querySelector('.admin-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'admin-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.background = success ? 'var(--charcoal-black)' : '#c0392b';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
    }

    // ── Load Books (all, including hidden) ──
    const booksWrapper = document.getElementById('books-table-wrapper');
    if (booksWrapper) loadBooks();

    function loadBooks() {
        booksWrapper.innerHTML = `<div class="loading-books"><span class="lang-ar">جاري تحميل الكتب...</span><span class="lang-en">Loading books...</span></div>`;
        fetch('backend/api/books/read.php?all=1')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                if (!data.records || data.records.length === 0) {
                    booksWrapper.innerHTML = `<div class="admin-empty"><span class="lang-ar">لا توجد كتب.</span><span class="lang-en">No books found.</span></div>`;
                    return;
                }
                const en = isEn();
                let html = `<table class="admin-table"><thead><tr>
                    <th>${en ? 'Book #' : 'رقم الكتاب'}</th>
                    <th>${en ? 'Title' : 'العنوان'}</th>
                    <th>${en ? 'Copies' : 'النسخ'}</th>
                    <th>${en ? 'Status' : 'الحالة'}</th>
                    <th>${en ? 'Actions' : 'الإجراءات'}</th>
                </tr></thead><tbody>`;

                data.records.forEach(book => {
                    const isVisible = parseInt(book.is_available) === 1;
                    const statusText = isVisible ? (en ? 'Available' : 'متاح') : (en ? 'Unavailable' : 'غير متاح');
                    const rowClass = isVisible ? '' : 'book-hidden';
                    html += `<tr class="${rowClass}" data-book-id="${book.id}">
                        <td><span class="book-num-badge">${book.book_number}</span></td>
                        <td class="book-title-cell">${book.title}</td>
                        <td>${book.copies}</td>
                        <td><span class="status-badge ${isVisible ? 'approved' : 'rejected'}">${statusText}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit-btn"
                                    data-id="${book.id}"
                                    data-number="${book.book_number}"
                                    data-title="${book.title.replace(/"/g, '&quot;')}"
                                    data-copies="${book.copies}"
                                    data-available="${book.is_available}"
                                    title="${en ? 'Edit' : 'تعديل'}">✏️</button>
                                <button class="action-btn delete-btn"
                                    data-id="${book.id}"
                                    data-title="${book.title.replace(/"/g, '&quot;')}"
                                    title="${en ? 'Delete' : 'حذف'}">🗑️</button>
                            </div>
                        </td>
                    </tr>`;
                });

                html += '</tbody></table>';
                booksWrapper.innerHTML = html;

                // Attach handlers
                booksWrapper.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        openEditModal({
                            id: this.dataset.id,
                            book_number: this.dataset.number,
                            title: this.dataset.title,
                            copies: this.dataset.copies,
                            is_available: this.dataset.available
                        });
                    });
                });

                booksWrapper.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        openDeleteModal(this.dataset.id, this.dataset.title);
                    });
                });
            })
            .catch(() => {
                booksWrapper.innerHTML = `<div class="admin-empty"><span class="lang-ar">حدث خطأ أثناء تحميل الكتب.</span><span class="lang-en">Error loading books.</span></div>`;
            });
    }

    // ── Load Borrow Requests ──
    const reqWrapper = document.getElementById('requests-table-wrapper');
    if (reqWrapper) {
        fetch('backend/api/requests/read.php')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                if (!data.records || data.records.length === 0) {
                    reqWrapper.innerHTML = `<div class="admin-empty"><span class="lang-ar">لا توجد طلبات استعارة حالياً.</span><span class="lang-en">No borrowing requests yet.</span></div>`;
                    return;
                }
                const en = isEn();
                const statusLabels = {
                    pending:  { ar: 'قيد الانتظار', en: 'Pending' },
                    approved: { ar: 'مقبول',        en: 'Approved' },
                    rejected: { ar: 'مرفوض',        en: 'Rejected' },
                    returned: { ar: 'مُعاد',         en: 'Returned' }
                };
                let html = `<table class="admin-table"><thead><tr>
                    <th>#</th>
                    <th>${en ? 'Member #' : 'رقم العضو'}</th>
                    <th>${en ? 'First Name' : 'الاسم الأول'}</th>
                    <th>${en ? 'Last Name' : 'اسم العائلة'}</th>
                    <th>${en ? 'Email' : 'البريد الإلكتروني'}</th>
                    <th>${en ? 'Book' : 'الكتاب'}</th>
                    <th>${en ? 'Status' : 'الحالة'}</th>
                    <th>${en ? 'Date' : 'التاريخ'}</th>
                </tr></thead><tbody>`;

                data.records.forEach((req, i) => {
                    const lbl = statusLabels[req.status] || { ar: req.status, en: req.status };
                    const date = new Date(req.created_at).toLocaleDateString(en ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
                    html += `<tr>
                        <td>${i + 1}</td>
                        <td>${req.member_number}</td>
                        <td>${req.first_name}</td>
                        <td>${req.last_name}</td>
                        <td><a href="mailto:${req.email}">${req.email}</a></td>
                        <td>${req.book_title}</td>
                        <td><span class="status-badge ${req.status}">${en ? lbl.en : lbl.ar}</span></td>
                        <td>${date}</td>
                    </tr>`;
                });

                html += '</tbody></table>';
                reqWrapper.innerHTML = html;
            })
            .catch(() => {
                reqWrapper.innerHTML = `<div class="admin-empty"><span class="lang-ar">حدث خطأ أثناء تحميل الطلبات.</span><span class="lang-en">Error loading requests.</span></div>`;
            });
    }

    // ── Book Modal (Add / Edit) ──
    const bookModal   = document.getElementById('book-modal');
    const bookForm    = document.getElementById('book-form');
    const bookError   = document.getElementById('book-modal-error');
    const bookTitle   = document.getElementById('book-modal-title');
    const bookEditId  = document.getElementById('book-edit-id');
    const bookSubmit  = document.getElementById('book-submit-btn');

    document.getElementById('open-add-book-modal').addEventListener('click', openAddModal);
    document.getElementById('close-book-modal').addEventListener('click', closeBookModal);
    bookModal.addEventListener('click', e => { if (e.target === bookModal) closeBookModal(); });

    function openAddModal() {
        bookEditId.value = '';
        bookForm.reset();
        clearBookError();
        // Reset title text to "Add Book"
        bookTitle.querySelector('.lang-ar').textContent = 'إضافة كتاب';
        bookTitle.querySelector('.lang-en').textContent = 'Add Book';
        bookSubmit.querySelector('.lang-ar').textContent = 'إضافة';
        bookSubmit.querySelector('.lang-en').textContent = 'Add';
        openModal(bookModal);
    }

    function openEditModal(book) {
        bookEditId.value = book.id;
        document.getElementById('book-number-input').value = book.book_number;
        document.getElementById('book-title-input').value  = book.title;
        document.getElementById('book-copies-input').value = book.copies;
        bookForm.querySelector(`input[name="is_available"][value="${book.is_available}"]`).checked = true;
        clearBookError();
        bookTitle.querySelector('.lang-ar').textContent = 'تعديل الكتاب';
        bookTitle.querySelector('.lang-en').textContent = 'Edit Book';
        bookSubmit.querySelector('.lang-ar').textContent = 'حفظ التعديلات';
        bookSubmit.querySelector('.lang-en').textContent = 'Save Changes';
        openModal(bookModal);
    }

    function closeBookModal() { closeModal(bookModal); bookForm.reset(); clearBookError(); }

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const en = isEn();
        const id           = bookEditId.value;
        const book_number  = parseInt(document.getElementById('book-number-input').value);
        const title        = document.getElementById('book-title-input').value.trim();
        const copies       = parseInt(document.getElementById('book-copies-input').value);
        const is_available = parseInt(bookForm.querySelector('input[name="is_available"]:checked').value);

        if (!book_number || !title) {
            setBookError(en ? 'Please fill in all required fields.' : 'يرجى ملء جميع الحقول المطلوبة.');
            return;
        }

        bookSubmit.disabled = true;
        bookSubmit.style.opacity = '0.6';

        const isEdit = !!id;
        const url    = isEdit ? 'backend/api/books/update.php' : 'backend/api/books/create.php';
        const body   = isEdit
            ? { id: parseInt(id), book_number, title, copies, is_available }
            : { book_number, title, copies, is_available };

        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            .then(r => r.json())
            .then(data => {
                bookSubmit.disabled = false;
                bookSubmit.style.opacity = '1';
                if (data.success) {
                    closeBookModal();
                    showToast(en ? data.message_en : data.message_ar);
                    loadBooks();
                } else {
                    setBookError(en ? data.message_en : data.message_ar);
                }
            })
            .catch(() => {
                bookSubmit.disabled = false;
                bookSubmit.style.opacity = '1';
                setBookError(en ? 'Network error. Please try again.' : 'خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
            });
    });

    function setBookError(msg) { bookError.style.color = '#c0392b'; bookError.textContent = msg; }
    function clearBookError() { bookError.textContent = ''; }

    // ── Delete Modal ──
    const deleteModal   = document.getElementById('delete-modal');
    const deleteItemName = document.getElementById('delete-item-name');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let deleteTargetId = null;
    let deleteTargetType = null; // 'book' or 'achievement'

    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
    deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });

    function openDeleteModal(id, title, type = 'book') {
        deleteTargetId = id;
        deleteTargetType = type;
        deleteItemName.textContent = title;
        openModal(deleteModal);
    }

    function closeDeleteModal() { 
        closeModal(deleteModal); 
        deleteTargetId = null; 
        deleteTargetType = null;
    }

    confirmDeleteBtn.addEventListener('click', function () {
        if (!deleteTargetId || !deleteTargetType) return;
        const en = isEn();
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.style.opacity = '0.6';

        const endpoint = deleteTargetType === 'book' ? 'backend/api/books/delete.php' : 'backend/api/achievements/delete.php';

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(deleteTargetId) })
        })
            .then(r => r.json())
            .then(data => {
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.style.opacity = '1';
                closeDeleteModal();
                if (data.success) {
                    showToast(en ? data.message_en : data.message_ar);
                    if (deleteTargetType === 'book') loadBooks();
                    if (deleteTargetType === 'achievement') loadAchievements();
                } else {
                    showToast(en ? data.message_en : data.message_ar, false);
                }
            })
            .catch(() => {
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.style.opacity = '1';
                closeDeleteModal();
                showToast(en ? 'Network error.' : 'خطأ في الاتصال.', false);
            });
    });

    // ── Load Achievements ──
    const achievementsWrapper = document.getElementById('achievements-table-wrapper');
    if (achievementsWrapper) loadAchievements();

    function loadAchievements() {
        achievementsWrapper.innerHTML = `<div class="loading-books"><span class="lang-ar">جاري تحميل الإنجازات...</span><span class="lang-en">Loading achievements...</span></div>`;
        fetch('backend/api/achievements/read.php')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                if (!data.records || data.records.length === 0) {
                    achievementsWrapper.innerHTML = `<div class="admin-empty"><span class="lang-ar">لا توجد إنجازات.</span><span class="lang-en">No achievements found.</span></div>`;
                    return;
                }
                const en = isEn();
                let html = `<table class="admin-table"><thead><tr>
                    <th>#</th>
                    <th>${en ? 'Title (Arabic)' : 'العنوان (بالعربية)'}</th>
                    <th>${en ? 'Title (English)' : 'العنوان (بالإنجليزية)'}</th>
                    <th>${en ? 'Actions' : 'الإجراءات'}</th>
                </tr></thead><tbody>`;

                data.records.forEach((ach, i) => {
                    html += `<tr data-id="${ach.id}">
                        <td><span class="book-num-badge">${i + 1}</span></td>
                        <td class="book-title-cell" dir="rtl">${ach.title_ar}</td>
                        <td class="book-title-cell" dir="ltr">${ach.title_en}</td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit-ach-btn"
                                    data-id="${ach.id}"
                                    data-ar="${ach.title_ar.replace(/"/g, '&quot;')}"
                                    data-en="${ach.title_en.replace(/"/g, '&quot;')}"
                                    title="${en ? 'Edit' : 'تعديل'}">✏️</button>
                                <button class="action-btn delete-ach-btn"
                                    data-id="${ach.id}"
                                    data-title="${(en ? ach.title_en : ach.title_ar).replace(/"/g, '&quot;')}"
                                    title="${en ? 'Delete' : 'حذف'}">🗑️</button>
                            </div>
                        </td>
                    </tr>`;
                });

                html += '</tbody></table>';
                achievementsWrapper.innerHTML = html;

                achievementsWrapper.querySelectorAll('.edit-ach-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        openEditAchievementModal({
                            id: this.dataset.id,
                            title_ar: this.dataset.ar,
                            title_en: this.dataset.en
                        });
                    });
                });

                achievementsWrapper.querySelectorAll('.delete-ach-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        openDeleteModal(this.dataset.id, this.dataset.title, 'achievement');
                    });
                });
            })
            .catch(() => {
                achievementsWrapper.innerHTML = `<div class="admin-empty"><span class="lang-ar">حدث خطأ أثناء تحميل الإنجازات.</span><span class="lang-en">Error loading achievements.</span></div>`;
            });
    }

    // ── Achievement Modal (Add / Edit) ──
    const achModal   = document.getElementById('achievement-modal');
    const achForm    = document.getElementById('achievement-form');
    const achError   = document.getElementById('achievement-modal-error');
    const achTitle   = document.getElementById('achievement-modal-title');
    const achEditId  = document.getElementById('achievement-edit-id');
    const achSubmit  = document.getElementById('achievement-submit-btn');

    const btnOpenAch = document.getElementById('open-add-achievement-modal');
    if (btnOpenAch) btnOpenAch.addEventListener('click', openAddAchievementModal);
    
    const btnCloseAch = document.getElementById('close-achievement-modal');
    if (btnCloseAch) btnCloseAch.addEventListener('click', closeAchModal);
    
    if (achModal) {
        achModal.addEventListener('click', e => { if (e.target === achModal) closeAchModal(); });
    }

    function openAddAchievementModal() {
        if(!achModal) return;
        achEditId.value = '';
        achForm.reset();
        clearAchError();
        achTitle.querySelector('.lang-ar').textContent = 'إضافة إنجاز';
        achTitle.querySelector('.lang-en').textContent = 'Add Achievement';
        achSubmit.querySelector('.lang-ar').textContent = 'إضافة';
        achSubmit.querySelector('.lang-en').textContent = 'Add';
        openModal(achModal);
    }

    function openEditAchievementModal(ach) {
        if(!achModal) return;
        achEditId.value = ach.id;
        document.getElementById('achievement-title-ar-input').value = ach.title_ar;
        document.getElementById('achievement-title-en-input').value = ach.title_en;
        clearAchError();
        achTitle.querySelector('.lang-ar').textContent = 'تعديل الإنجاز';
        achTitle.querySelector('.lang-en').textContent = 'Edit Achievement';
        achSubmit.querySelector('.lang-ar').textContent = 'حفظ التعديلات';
        achSubmit.querySelector('.lang-en').textContent = 'Save Changes';
        openModal(achModal);
    }

    function closeAchModal() { closeModal(achModal); achForm.reset(); clearAchError(); }

    if (achForm) {
        achForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const en = isEn();
            const id = achEditId.value;
            const title_ar = document.getElementById('achievement-title-ar-input').value.trim();
            const title_en = document.getElementById('achievement-title-en-input').value.trim();

            if (!title_ar || !title_en) {
                setAchError(en ? 'Please provide both Arabic and English titles.' : 'يرجى تقديم العنوانين باللغتين العربية والإنجليزية.');
                return;
            }

            achSubmit.disabled = true;
            achSubmit.style.opacity = '0.6';

            const isEdit = !!id;
            const url    = isEdit ? 'backend/api/achievements/update.php' : 'backend/api/achievements/create.php';
            const body   = isEdit ? { id: parseInt(id), title_ar, title_en } : { title_ar, title_en };

            fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                .then(r => r.json())
                .then(data => {
                    achSubmit.disabled = false;
                    achSubmit.style.opacity = '1';
                    if (data.success) {
                        closeAchModal();
                        showToast(en ? data.message_en : data.message_ar);
                        loadAchievements();
                    } else {
                        setAchError(en ? data.message_en : data.message_ar);
                    }
                })
                .catch(() => {
                    achSubmit.disabled = false;
                    achSubmit.style.opacity = '1';
                    setAchError(en ? 'Network error. Please try again.' : 'خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
                });
        });
    }

    function setAchError(msg) { achError.style.color = '#c0392b'; achError.textContent = msg; }
    function clearAchError() { achError.textContent = ''; }


    // ── Modal helpers ──
    function openModal(el) {
        el.classList.add('active');
        el.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const firstInput = el.querySelector('input:not([type="radio"]):not([type="hidden"])');
        if (firstInput) setTimeout(() => firstInput.focus(), 120);
    }

    function closeModal(el) {
        el.classList.remove('active');
        el.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (bookModal && bookModal.classList.contains('active')) closeBookModal();
            if (achModal && achModal.classList.contains('active')) closeAchModal();
            if (deleteModal && deleteModal.classList.contains('active')) closeDeleteModal();
        }
    });
});
