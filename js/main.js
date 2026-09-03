document.addEventListener('DOMContentLoaded', function() {
    /* =========================================================
       1. DYNAMIC DATA RENDERING
       ========================================================= */
    let currentVSAData = getVSAData();

    function renderSiteContent() {
        currentVSAData = getVSAData();

        // 1. Render Events
        const eventsContainer = document.getElementById('eventsContainer');
        if (eventsContainer && currentVSAData.events) {
            eventsContainer.innerHTML = currentVSAData.events.map(ev => `
                <div class="event">
                    <h2>${escapeHTML(ev.date)}</h2>
                    <p>${escapeHTML(ev.title)}</p>
                </div>
            `).join('');
        }

        // 2. Render Executive Team Officers
        const leadershipContainer = document.getElementById('leadershipContainer');
        if (leadershipContainer && currentVSAData.officers) {
            leadershipContainer.innerHTML = currentVSAData.officers.map(off => `
                <div class="leader-card">
                    <img src="${escapeHTML(off.image)}" alt="${escapeHTML(off.name)}" class="leader-image" onerror="this.src='assets/V_S_A_3.webp'">
                    <h3>${escapeHTML(off.name)}</h3>
                    <p class="leader-title">${escapeHTML(off.title)}</p>
                    <p>${escapeHTML(off.major)}</p>
                </div>
            `).join('');
        }

        // 3. Render Merchandise Items
        const merchContainer = document.getElementById('merchContainer');
        if (merchContainer && currentVSAData.merch) {
            const formUrl = currentVSAData.general.googleFormUrl || 'https://forms.google.com';
            merchContainer.innerHTML = currentVSAData.merch.map(m => `
                <div class="merch-card">
                    ${m.badge ? `<div class="merch-badge ${m.badgeClass || ''}">${escapeHTML(m.badge)}</div>` : ''}
                    <div class="merch-image-wrapper">
                        <a href="${escapeHTML(formUrl)}" target="_blank" rel="noopener noreferrer">
                            <img src="${escapeHTML(m.image)}" alt="${escapeHTML(m.title)}" class="merch-image" onerror="this.src='assets/merch_hoodie.png'">
                        </a>
                    </div>
                    <div class="merch-details">
                        <h3>${escapeHTML(m.title)}</h3>
                        <p class="merch-desc">${escapeHTML(m.desc)}</p>
                        <div class="merch-footer">
                            <span class="merch-price">${escapeHTML(m.price)}</span>
                            <a href="${escapeHTML(formUrl)}" target="_blank" rel="noopener noreferrer" class="merch-btn">
                                Order via Google Form &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // 4. Render Contact Details
        const contactDetailsContainer = document.getElementById('contactDetailsContainer');
        if (contactDetailsContainer && currentVSAData.general) {
            const g = currentVSAData.general;
            contactDetailsContainer.innerHTML = `
                <div class="info-item">
                    <h3>Email</h3>
                    <p><a href="mailto:${escapeHTML(g.contactEmail)}">${escapeHTML(g.contactEmail)}</a></p>
                </div>
                <div class="info-item">
                    <h3>Phone</h3>
                    <p>${escapeHTML(g.contactPhone)}</p>
                </div>
                <div class="info-item">
                    <h3>Address</h3>
                    <p>${escapeHTML(g.contactAddress).replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }
    }

    // Helper to prevent XSS
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Initial Site Render
    renderSiteContent();

    /* =========================================================
       2. SLIDESHOW INITIALIZATION & LOGIC
       ========================================================= */
    const images = [
        'assets/Interns2023.JPEG',
        'assets/img_7193.jpg'
    ];
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            if (index === 0) slide.classList.add('active');
            slide.style.backgroundImage = `url('${image}')`;
            slideshowContainer.appendChild(slide);
        });
        
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        if (slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    }

    /* =========================================================
       3. STICKY NAVBAR LOGIC
       ========================================================= */
    const nav = document.querySelector('.index-nav');
    function checkScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    /* =========================================================
       4. SCROLLSPY LOGIC
       ========================================================= */
    const sections = document.querySelectorAll('header[id], section[id], div[id]');
    const navLinks = document.querySelectorAll('.index-nav a.nav-link');

    function scrollSpy() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 120) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    /* =========================================================
       5. OFFICER PORTAL ADMIN MODAL LOGIC
       ========================================================= */
    const adminModal = document.getElementById('adminModal');
    const openAdminModalBtn = document.getElementById('openAdminModalBtn');
    const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const adminLoginError = document.getElementById('adminLoginError');
    const adminLoginView = document.getElementById('adminLoginView');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const lockAdminBtn = document.getElementById('lockAdminBtn');

    let isUnlocked = false;

    if (openAdminModalBtn) {
        openAdminModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            adminModal.classList.remove('hidden');
        });
    }

    if (closeAdminModalBtn) {
        closeAdminModalBtn.addEventListener('click', function() {
            adminModal.classList.add('hidden');
        });
    }

    // Close on backdrop click
    window.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.classList.add('hidden');
        }
    });

    // Password login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputPass = adminPasswordInput.value.trim();
            const requiredPass = currentVSAData.general.officerPassword || 'OUVSA2026';

            if (inputPass === requiredPass) {
                isUnlocked = true;
                adminLoginError.classList.add('hidden');
                adminLoginView.classList.add('hidden');
                adminDashboardView.classList.remove('hidden');
                adminPasswordInput.value = '';
                populateAdminDashboard();
            } else {
                adminLoginError.classList.remove('hidden');
            }
        });
    }

    // Lock Portal
    if (lockAdminBtn) {
        lockAdminBtn.addEventListener('click', function() {
            isUnlocked = false;
            adminDashboardView.classList.add('hidden');
            adminLoginView.classList.remove('hidden');
            adminModal.classList.add('hidden');
        });
    }

    // Tab Switching inside Admin Portal
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(tc => tc.classList.remove('active'));

            this.classList.add('active');
            const activeContent = document.getElementById(targetTab);
            if (activeContent) activeContent.classList.add('active');
        });
    });

    /* =========================================================
       6. ADMIN DASHBOARD POPULATE & EDIT HANDLERS
       ========================================================= */
    let tempEditData = null;

    function populateAdminDashboard() {
        tempEditData = JSON.parse(JSON.stringify(currentVSAData));

        // 1. General Tab
        document.getElementById('editGoogleFormUrl').value = tempEditData.general.googleFormUrl || '';
        document.getElementById('editContactEmail').value = tempEditData.general.contactEmail || '';
        document.getElementById('editContactPhone').value = tempEditData.general.contactPhone || '';
        document.getElementById('editContactAddress').value = tempEditData.general.contactAddress || '';
        document.getElementById('editOfficerPassword').value = tempEditData.general.officerPassword || 'OUVSA2026';

        // 2. Events Tab
        renderAdminEventsList();

        // 3. Officers Tab
        renderAdminOfficersList();

        // 4. Merch Tab
        renderAdminMerchList();
    }

    // Render Events List in Admin
    function renderAdminEventsList() {
        const container = document.getElementById('adminEventsList');
        if (!container) return;
        container.innerHTML = tempEditData.events.map((ev, index) => `
            <div class="admin-item-card" data-index="${index}">
                <div class="admin-item-card-header">
                    <span>Event #${index + 1}</span>
                    <button class="admin-btn-delete delete-event-btn" data-index="${index}">Remove</button>
                </div>
                <div class="admin-item-fields">
                    <div class="form-group">
                        <label>Date (e.g. Mar 25)</label>
                        <input type="text" class="event-date-input" value="${escapeHTML(ev.date)}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Event Title</label>
                        <input type="text" class="event-title-input" value="${escapeHTML(ev.title)}" data-index="${index}">
                    </div>
                </div>
            </div>
        `).join('');

        // Event delete listeners
        container.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                tempEditData.events.splice(idx, 1);
                renderAdminEventsList();
            });
        });
    }

    // Render Officers List in Admin
    function renderAdminOfficersList() {
        const container = document.getElementById('adminOfficersList');
        if (!container) return;
        container.innerHTML = tempEditData.officers.map((off, index) => `
            <div class="admin-item-card" data-index="${index}">
                <div class="admin-item-card-header">
                    <span>${escapeHTML(off.name)} (${escapeHTML(off.title)})</span>
                    <button class="admin-btn-delete delete-officer-btn" data-index="${index}">Remove</button>
                </div>
                <div class="admin-item-fields">
                    <div class="form-group">
                        <label>Officer Name</label>
                        <input type="text" class="officer-name-input" value="${escapeHTML(off.name)}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Title / Role</label>
                        <input type="text" class="officer-title-input" value="${escapeHTML(off.title)}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Year & Major</label>
                        <input type="text" class="officer-major-input" value="${escapeHTML(off.major)}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Image Path (e.g. assets/Patrick.JPEG)</label>
                        <input type="text" class="officer-image-input" value="${escapeHTML(off.image)}" data-index="${index}">
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.delete-officer-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                tempEditData.officers.splice(idx, 1);
                renderAdminOfficersList();
            });
        });
    }

    // Render Merch List in Admin
    function renderAdminMerchList() {
        const container = document.getElementById('adminMerchList');
        if (!container) return;
        container.innerHTML = tempEditData.merch.map((m, index) => `
            <div class="admin-item-card" data-index="${index}">
                <div class="admin-item-card-header">
                    <span>Merch #${index + 1}: ${escapeHTML(m.title)}</span>
                    <button class="admin-btn-delete delete-merch-btn" data-index="${index}">Remove</button>
                </div>
                <div class="admin-item-fields">
                    <div class="form-group">
                        <label>Item Title</label>
                        <input type="text" class="merch-title-input" value="${escapeHTML(m.title)}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Price (e.g. $25.00)</label>
                        <input type="text" class="merch-price-input" value="${escapeHTML(m.price)}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Badge (Optional e.g. Best Seller)</label>
                        <input type="text" class="merch-badge-input" value="${escapeHTML(m.badge || '')}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Image Path (e.g. assets/merch_hoodie.png)</label>
                        <input type="text" class="merch-image-input" value="${escapeHTML(m.image)}" data-index="${index}">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <input type="text" class="merch-desc-input" value="${escapeHTML(m.desc)}" data-index="${index}">
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.delete-merch-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                tempEditData.merch.splice(idx, 1);
                renderAdminMerchList();
            });
        });
    }

    // Add New Buttons
    document.getElementById('addEventBtn')?.addEventListener('click', function() {
        tempEditData.events.push({ id: 'ev-' + Date.now(), date: 'New Date', title: 'New Event Title' });
        renderAdminEventsList();
    });

    document.getElementById('addOfficerBtn')?.addEventListener('click', function() {
        tempEditData.officers.push({ id: 'off-' + Date.now(), name: 'New Officer', title: 'Title', major: 'Major', image: 'assets/V_S_A_3.webp' });
        renderAdminOfficersList();
    });

    document.getElementById('addMerchBtn')?.addEventListener('click', function() {
        tempEditData.merch.push({ id: 'm-' + Date.now(), title: 'New Merch Item', desc: 'Item description...', price: '$20.00', image: 'assets/merch_hoodie.png', badge: 'New', badgeClass: 'new' });
        renderAdminMerchList();
    });

    // Save All Changes Button
    document.getElementById('saveAllAdminBtn')?.addEventListener('click', function() {
        // Collect General inputs
        tempEditData.general.googleFormUrl = document.getElementById('editGoogleFormUrl').value.trim();
        tempEditData.general.contactEmail = document.getElementById('editContactEmail').value.trim();
        tempEditData.general.contactPhone = document.getElementById('editContactPhone').value.trim();
        tempEditData.general.contactAddress = document.getElementById('editContactAddress').value.trim();
        tempEditData.general.officerPassword = document.getElementById('editOfficerPassword').value.trim() || 'OUVSA2026';

        // Collect Events inputs
        document.querySelectorAll('#adminEventsList .admin-item-card').forEach((card, idx) => {
            if (tempEditData.events[idx]) {
                tempEditData.events[idx].date = card.querySelector('.event-date-input').value.trim();
                tempEditData.events[idx].title = card.querySelector('.event-title-input').value.trim();
            }
        });

        // Collect Officers inputs
        document.querySelectorAll('#adminOfficersList .admin-item-card').forEach((card, idx) => {
            if (tempEditData.officers[idx]) {
                tempEditData.officers[idx].name = card.querySelector('.officer-name-input').value.trim();
                tempEditData.officers[idx].title = card.querySelector('.officer-title-input').value.trim();
                tempEditData.officers[idx].major = card.querySelector('.officer-major-input').value.trim();
                tempEditData.officers[idx].image = card.querySelector('.officer-image-input').value.trim();
            }
        });

        // Collect Merch inputs
        document.querySelectorAll('#adminMerchList .admin-item-card').forEach((card, idx) => {
            if (tempEditData.merch[idx]) {
                tempEditData.merch[idx].title = card.querySelector('.merch-title-input').value.trim();
                tempEditData.merch[idx].price = card.querySelector('.merch-price-input').value.trim();
                tempEditData.merch[idx].badge = card.querySelector('.merch-badge-input').value.trim();
                tempEditData.merch[idx].image = card.querySelector('.merch-image-input').value.trim();
                tempEditData.merch[idx].desc = card.querySelector('.merch-desc-input').value.trim();
            }
        });

        // Save into localStorage & update live state
        saveVSAData(tempEditData);
        currentVSAData = getVSAData();
        renderSiteContent();

        alert('✅ All changes saved and published live on the page!');
        adminModal.classList.add('hidden');
    });

    // Reset Defaults Button
    document.getElementById('resetDefaultsBtn')?.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all content back to initial defaults?')) {
            resetVSAData();
            currentVSAData = getVSAData();
            populateAdminDashboard();
            renderSiteContent();
            alert('🔄 Reset complete!');
        }
    });
});
