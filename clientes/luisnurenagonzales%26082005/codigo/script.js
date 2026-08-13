/**
 * INVITACIONES DIGITALES - SCRIPT DE DEMO STANDALONE
 */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof INVITATION_CONFIG === 'undefined') return;
    const config = INVITATION_CONFIG;

    const coverScreen = document.getElementById('cover-screen');
    const invitationApp = document.getElementById('invitation-app');
    const particlesContainer = document.getElementById('particles-container');
    const envelopeWrapper = document.getElementById('envelope-interactive');
    const openBtn = document.getElementById('open-invitation-btn');

    initInvitation(config);
    createFloatingParticles();

    function createFloatingParticles() {
        if (!particlesContainer) return;
        particlesContainer.innerHTML = '';
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 6 + 3;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDuration = `${Math.random() * 6 + 6}s`;
            p.style.animationDelay = `${Math.random() * 4}s`;
            particlesContainer.appendChild(p);
        }
    }

    function initInvitation(config) {
        const themeClass = config.theme || `theme-${config.type || 'default'}`;
        document.body.className = themeClass;
        document.title = `${config.title} - ${config.personName}`;

        document.getElementById('cover-badge').textContent = config.type ? `¡INVITACIÓN ESPECIAL PARA TI!` : 'INVITACIÓN';
        document.getElementById('cover-title').textContent = config.personName;
        const coverQuoteEl = document.getElementById('cover-quote');
        if (coverQuoteEl) coverQuoteEl.textContent = config.coverQuote || '';
        coverScreen.style.display = 'flex';

        if (config.heroImage) {
            document.getElementById('hero-img').src = config.heroImage;
        }
        document.getElementById('hero-subtitle').textContent = config.subtitle || 'Estás cordialmente invitado a';
        document.getElementById('hero-title').textContent = config.title;
        document.getElementById('hero-name').textContent = config.personName;
        document.getElementById('hero-date').textContent = config.formattedDate || '';
        document.getElementById('hero-time').textContent = config.time || '';

        document.getElementById('main-message-text').textContent = config.mainMessage || '';

        if (config.showCountdown && config.date) {
            document.getElementById('countdown-section').style.display = 'block';
            startCountdown(config.date);
        } else {
            document.getElementById('countdown-section').style.display = 'none';
        }

        const timelineSection = document.getElementById('timeline-section');
        const timelineGrid = document.getElementById('timeline-grid');
        if (config.timeline && config.timeline.length > 0) {
            timelineGrid.innerHTML = config.timeline.map(item => `
                <div class="timeline-item">
                    <div class="timeline-badge">${item.time}</div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
            timelineSection.style.display = 'block';
        } else {
            timelineSection.style.display = 'none';
        }

        const padrinosSection = document.getElementById('padrinos-section');
        const padrinosContent = document.getElementById('padrinos-content');
        if (config.padrinos && config.padrinos.length > 0) {
            padrinosContent.innerHTML = config.padrinos.map(item => `
                <div class="padrino-card">
                    <span class="padrino-role">${item.role}</span>
                    <h4 class="padrino-name">${item.name}</h4>
                </div>
            `).join('');
            padrinosSection.style.display = 'block';
        } else {
            padrinosSection.style.display = 'none';
        }

        if (config.showGallery && config.gallery && config.gallery.length > 0) {
            const gallerySection = document.getElementById('gallery-section');
            const galleryGrid = document.getElementById('gallery-grid');
            galleryGrid.innerHTML = '';

            config.gallery.forEach((photo) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photo.url}" alt="${photo.caption || 'Foto'}">`;
                item.addEventListener('click', () => {
                    openLightbox(photo.url, photo.caption);
                });
                galleryGrid.appendChild(item);
            });
            gallerySection.style.display = 'block';
        } else {
            document.getElementById('gallery-section').style.display = 'none';
        }

        if (config.showMap) {
            document.getElementById('map-section').style.display = 'block';
            document.getElementById('location-name').textContent = config.locationName || 'Lugar del Evento';
            document.getElementById('location-address').textContent = config.address || '';
            
            const mapBtn = document.getElementById('map-btn');
            if (config.mapUrl) {
                mapBtn.href = config.mapUrl;
            } else {
                mapBtn.href = `https://maps.google.com/?q=${encodeURIComponent(config.address || '')}`;
            }
        } else {
            document.getElementById('map-section').style.display = 'none';
        }

        document.getElementById('dress-code-text').textContent = config.dressCode || 'Formal / Elegante';
        document.getElementById('gift-info-text').textContent = config.giftInfo || 'Cofre para lluvia de sobres en recepción';

        const rsvpBtn = document.getElementById('rsvp-btn');
        const phone = config.whatsapp || '51900000000';
        const msg = encodeURIComponent(config.whatsappMessage || 'Hola, quiero confirmar mi asistencia al evento.');
        rsvpBtn.href = `https://wa.me/${phone}?text=${msg}`;

        document.getElementById('final-message-text').textContent = config.finalMessage || '¡Te esperamos!';

        let hasOpened = false;
        function triggerEnvelopeOpen() {
            if (hasOpened) return;
            hasOpened = true;

            if (envelopeWrapper) {
                envelopeWrapper.classList.add('open');
            }

            setTimeout(() => {
                coverScreen.classList.add('hide-cover');
                invitationApp.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                initScrollReveal();
            }, 850);
        }

        if (envelopeWrapper) envelopeWrapper.addEventListener('click', triggerEnvelopeOpen);
        if (openBtn) openBtn.addEventListener('click', triggerEnvelopeOpen);
    }

    function initScrollReveal() {
        const sections = document.querySelectorAll('#invitation-app .section');
        sections.forEach(sec => sec.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.15 });

        sections.forEach(sec => observer.observe(sec));
    }

    function startCountdown(targetDateStr) {
        const targetDate = new Date(targetDateStr).getTime();
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-minutes');
        const secsEl = document.getElementById('cd-seconds');

        function update() {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.textContent = String(d).padStart(2, '0');
            hoursEl.textContent = String(h).padStart(2, '0');
            minsEl.textContent = String(m).padStart(2, '0');
            secsEl.textContent = String(s).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(url, caption) {
        if (!lightboxModal) return;
        lightboxImg.src = url;
        lightboxCaption.textContent = caption || '';
        lightboxModal.style.display = 'flex';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.style.display = 'none';
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
            }
        });
    }
});
