/**
 * INVITACIONES DIGITALES - CARGADOR DINÁMICO DE CONFIGURACIÓN Y APLICACIÓN MOBILE
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener parámetro 'id' de la URL (Ej. ?id=demo, ?id=cliente1, ?id=bautizo, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    const invitationId = urlParams.get('id');

    const errorScreen = document.getElementById('error-screen');
    const coverScreen = document.getElementById('cover-screen');
    const invitationApp = document.getElementById('invitation-app');
    const particlesContainer = document.getElementById('particles-container');
    const envelopeWrapper = document.getElementById('envelope-interactive');
    const openBtn = document.getElementById('open-invitation-btn');

    // Mapa de rutas a archivos de configuración por ID de evento
    const configMap = {
        'demo': '../configs/demo.js',
        'xv': '../configs/demo.js',
        'cliente1': '../configs/cliente1.js',
        'boda': '../configs/cliente1.js',
        'cumpleanos': '../configs/cumpleanos.js',
        'babyshower': '../configs/babyshower.js',
        'baby_shower': '../configs/babyshower.js',
        'bautizo': '../configs/bautizo.js',
        'aniversario': '../configs/aniversario.js'
    };

    // 2. Si no hay ID o no está mapeado, mostrar pantalla de error 404
    if (!invitationId || !configMap[invitationId]) {
        showErrorScreen();
        return;
    }

    // 3. Cargar dinámicamente el archivo de configuración JS según el ID
    const configPath = configMap[invitationId];
    const scriptEl = document.createElement('script');
    scriptEl.src = configPath;

    scriptEl.onload = () => {
        if (typeof INVITATION_CONFIG !== 'undefined') {
            initInvitation(INVITATION_CONFIG);
            createFloatingParticles();
        } else {
            showErrorScreen();
        }
    };

    scriptEl.onerror = () => {
        showErrorScreen();
    };

    document.head.appendChild(scriptEl);

    function showErrorScreen() {
        if (errorScreen) errorScreen.style.display = 'flex';
        if (coverScreen) coverScreen.style.display = 'none';
        if (invitationApp) invitationApp.style.display = 'none';
    }

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
        // A. Aplicar Tema Cromático
        const themeClass = config.theme || `theme-${config.type || 'default'}`;
        document.body.className = themeClass;
        document.title = `${config.title} - ${config.personName}`;

        // B. Rellenar Portada (Cover Screen & Envelope)
        document.getElementById('cover-badge').textContent = config.type ? `¡INVITACIÓN ESPECIAL PARA TI!` : 'INVITACIÓN';
        document.getElementById('cover-title').textContent = config.personName;
        const coverQuoteEl = document.getElementById('cover-quote');
        if (coverQuoteEl) coverQuoteEl.textContent = config.coverQuote || '';
        coverScreen.style.display = 'flex';

        // C. Rellenar Sección Hero
        if (config.heroImage) {
            document.getElementById('hero-img').src = config.heroImage;
        }
        document.getElementById('hero-subtitle').textContent = config.subtitle || 'Estás cordialmente invitado a';
        document.getElementById('hero-title').textContent = config.title;
        document.getElementById('hero-name').textContent = config.personName;
        document.getElementById('hero-date').textContent = config.formattedDate || '';
        document.getElementById('hero-time').textContent = config.time || '';

        // D. Rellenar Mensaje Principal
        document.getElementById('main-message-text').textContent = config.mainMessage || '';

        // E. Configurar Cuenta Regresiva
        if (config.showCountdown && config.date) {
            document.getElementById('countdown-section').style.display = 'block';
            startCountdown(config.date);
        } else {
            document.getElementById('countdown-section').style.display = 'none';
        }

        // F1. Configurar Itinerario / Timeline (Programa del Evento)
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

        // F2. Configurar Padrinos & Padres (Sección de Bendición)
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

        // G. Configurar Galería de Fotos
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

        // H. Configurar Video (si está activo)
        if (config.showVideo && config.video) {
            const videoSection = document.getElementById('video-section');
            const videoContainer = document.getElementById('video-container');
            
            if (config.video.endsWith('.mp4')) {
                videoContainer.innerHTML = `<video controls poster="${config.heroImage}"><source src="${config.video}" type="video/mp4">Tu navegador no soporta video.</video>`;
            } else if (config.video.includes('youtube') || config.video.includes('vimeo')) {
                videoContainer.innerHTML = `<iframe src="${config.video}" allowfullscreen></iframe>`;
            } else {
                videoContainer.innerHTML = `<div style="padding:30px; text-align:center;">Video Especial de la Celebración</div>`;
            }
            videoSection.style.display = 'block';
        } else {
            document.getElementById('video-section').style.display = 'none';
        }

        // I. Configurar Ubicación y Mapa
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

        // J. Configurar Detalles (Dresscode & Regalos)
        document.getElementById('dress-code-text').textContent = config.dressCode || 'Formal / Elegante';
        document.getElementById('gift-info-text').textContent = config.giftInfo || 'Cofre para lluvia de sobres en recepción';

        // K. Configurar Enlace de WhatsApp RSVP
        const rsvpBtn = document.getElementById('rsvp-btn');
        const phone = config.whatsapp || '51900000000';
        const msg = encodeURIComponent(config.whatsappMessage || 'Hola, quiero confirmar mi asistencia al evento.');
        rsvpBtn.href = `https://wa.me/${phone}?text=${msg}`;

        // L. Rellenar Mensaje Final Footer
        document.getElementById('final-message-text').textContent = config.finalMessage || '¡Te esperamos!';

        // N. Lógica de Apertura Animada de Carta & Sobres
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

    // Modal Lightbox Handlers
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
