/**
 * CARGADOR DINÁMICO DE INVITACIONES DIGITALES PREMIUM Y CONTROLADOR UX
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener ID de la URL (?id=demo, ?id=cliente1, ?id=cumpleanos, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    const invitationId = urlParams.get('id') || 'demo';

    // 2. Elementos del DOM
    const errorScreen = document.getElementById('error-screen');
    const coverScreen = document.getElementById('cover-screen');
    const invitationApp = document.getElementById('invitation-app');
    const openBtn = document.getElementById('open-invitation-btn');
    const audioEl = document.getElementById('bg-audio');
    const musicBtn = document.getElementById('music-toggle');
    const musicText = document.getElementById('music-text');
    const particlesContainer = document.getElementById('particles-container');

    // Lightbox Elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryIndex = 0;
    let currentGallery = [];

    // 3. Generar Partículas Flotantes en Portada
    createFloatingParticles();

    // 4. Inyectar script de configuración dinámicamente
    const scriptTag = document.createElement('script');
    scriptTag.src = `../configs/${invitationId}.js`;

    scriptTag.onload = () => {
        if (typeof INVITATION_CONFIG === 'undefined' || !INVITATION_CONFIG) {
            showError();
            return;
        }
        initInvitation(INVITATION_CONFIG);
    };

    scriptTag.onerror = () => {
        showError();
    };

    document.head.appendChild(scriptTag);

    function showError() {
        coverScreen.style.display = 'none';
        invitationApp.style.display = 'none';
        errorScreen.style.display = 'flex';
    }

    function initInvitation(config) {
        // A. Aplicar Tema Cromático
        const themeClass = config.theme || `theme-${config.type || 'default'}`;
        document.body.className = themeClass;
        document.title = `${config.title} - ${config.personName}`;

        // B. Rellenar Portada (Cover Screen)
        document.getElementById('cover-badge').textContent = config.type ? config.type.toUpperCase().replace('_', ' ') : 'INVITACIÓN';
        document.getElementById('cover-title').textContent = config.personName;
        document.getElementById('cover-quote').textContent = config.coverQuote || 'Te invitamos a compartir este día tan especial';
        coverScreen.style.display = 'flex';

        // C. Rellenar Sección Hero
        if (config.heroImage) {
            document.getElementById('hero-img').src = config.heroImage;
        }
        document.getElementById('hero-subtitle').textContent = config.subtitle || 'Estás invitado a';
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

        // F. Configurar Galería de Fotos
        if (config.showGallery && config.gallery && config.gallery.length > 0) {
            currentGallery = config.gallery;
            const gallerySection = document.getElementById('gallery-section');
            const galleryGrid = document.getElementById('gallery-grid');
            galleryGrid.innerHTML = '';

            config.gallery.forEach((photo, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photo.url}" alt="${photo.caption || 'Foto'}" loading="lazy">`;
                item.addEventListener('click', () => {
                    openLightbox(index);
                });
                galleryGrid.appendChild(item);
            });
            gallerySection.style.display = 'block';
        } else {
            document.getElementById('gallery-section').style.display = 'none';
        }

        // G. Configurar Video
        if (config.showVideo && config.video) {
            const videoSection = document.getElementById('video-section');
            const videoContainer = document.getElementById('video-container');
            
            if (config.video.endsWith('.mp4')) {
                videoContainer.innerHTML = `<video controls poster="${config.heroImage}"><source src="${config.video}" type="video/mp4">Tu navegador no soporta video.</video>`;
            } else if (config.video.includes('youtube') || config.video.includes('vimeo')) {
                videoContainer.innerHTML = `<iframe src="${config.video}" allowfullscreen></iframe>`;
            } else {
                videoContainer.innerHTML = `<div style="padding:40px 20px; color:#fff; text-align:center; font-family:'Montserrat',sans-serif;">🎬 <strong>Video Especial Preparado</strong><br><small style="color:#aaa;">Visualización en alta resolución</small></div>`;
            }
            videoSection.style.display = 'block';
        } else {
            document.getElementById('video-section').style.display = 'none';
        }

        // H. Configurar Ubicación, Google Maps y Waze
        if (config.showMap) {
            document.getElementById('map-section').style.display = 'block';
            document.getElementById('location-name').textContent = config.locationName || 'Lugar del Evento';
            document.getElementById('location-address').textContent = config.address || '';
            
            const mapBtn = document.getElementById('map-btn');
            const wazeBtn = document.getElementById('waze-btn');
            
            mapBtn.href = config.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(config.address || '')}`;
            wazeBtn.href = config.wazeUrl || `https://waze.com/ul?q=${encodeURIComponent(config.locationName || config.address || '')}`;
        } else {
            document.getElementById('map-section').style.display = 'none';
        }

        // I. Rellenar Detalles del Evento
        document.getElementById('dress-code-text').textContent = config.dressCode || 'Vestimenta Libre';
        document.getElementById('gift-info-text').textContent = config.giftInfo || 'Su presencia es nuestro mejor regalo';
        document.getElementById('pass-info-text').textContent = config.passInfo || 'Pase Válido para 2 Personas';

        // J. Configurar Enlaces de WhatsApp RSVP (Sección + Botón Flotante Móvil)
        const phone = config.whatsapp || '51900000000';
        const msg = encodeURIComponent(config.whatsappMessage || 'Hola, quiero confirmar mi asistencia al evento.');
        const waUrl = `https://wa.me/${phone}?text=${msg}`;

        document.getElementById('rsvp-btn').href = waUrl;
        document.getElementById('floating-whatsapp').href = waUrl;

        // K. Rellenar Mensaje Final Footer
        document.getElementById('final-message-text').textContent = config.finalMessage || '¡Te esperamos!';

        // L. Configurar Audio / Música
        let isPlaying = false;
        if (config.showMusic && config.music) {
            musicBtn.style.display = 'flex';
            audioEl.src = config.music;

            musicBtn.addEventListener('click', () => {
                if (isPlaying) {
                    audioEl.pause();
                    musicBtn.classList.remove('playing');
                    musicText.textContent = 'Música';
                    isPlaying = false;
                } else {
                    playAudio();
                }
            });
        } else {
            musicBtn.style.display = 'none';
        }

        function playAudio() {
            if (!config.showMusic || !config.music) return;
            audioEl.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
                musicText.textContent = 'Pausar';
            }).catch(err => {
                console.log("Audio listo. Presionar botón para reproducir.");
            });
        }

        // M. Botón "ABRIR INVITACIÓN"
        openBtn.addEventListener('click', () => {
            triggerConfettiBurst();
            coverScreen.classList.add('hide-cover');
            invitationApp.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (config.showMusic) {
                playAudio();
            }

            initScrollReveal();
        });
    }

    // Partículas Flotantes en Portada
    function createFloatingParticles() {
        if (!particlesContainer) return;
        particlesContainer.innerHTML = '';
        const count = 15;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 6 + 6}s`;
            particle.style.animationDelay = `${Math.random() * 4}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // Erupción de Confetti / Destellos al abrir invitación
    function triggerConfettiBurst() {
        for (let i = 0; i < 30; i++) {
            const spark = document.createElement('div');
            spark.style.position = 'fixed';
            spark.style.top = '50%';
            spark.style.left = '50%';
            spark.style.width = '10px';
            spark.style.height = '10px';
            spark.style.background = ['#d4af37', '#00f2fe', '#ff416c', '#ffffff'][Math.floor(Math.random() * 4)];
            spark.style.borderRadius = '50%';
            spark.style.zIndex = '99999';
            spark.style.pointerEvents = 'none';
            spark.style.transform = `translate(-50%, -50%) translate(${(Math.random() - 0.5) * 400}px, ${(Math.random() - 0.5) * 400}px) scale(${Math.random() + 0.5})`;
            spark.style.transition = 'all 1s cubic-bezier(0.1, 1, 0.1, 1)';
            spark.style.opacity = '1';
            document.body.appendChild(spark);

            setTimeout(() => {
                spark.style.opacity = '0';
                setTimeout(() => spark.remove(), 1000);
            }, 50);
        }
    }

    // Scroll Reveal Observer
    function initScrollReveal() {
        const sections = document.querySelectorAll('#invitation-app .reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(sec => observer.observe(sec));
    }

    // Contador Regresivo
    function startCountdown(targetDateStr) {
        const targetDate = new Date(targetDateStr).getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                document.getElementById('cd-days').textContent = '00';
                document.getElementById('cd-hours').textContent = '00';
                document.getElementById('cd-minutes').textContent = '00';
                document.getElementById('cd-seconds').textContent = '00';
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('cd-days').textContent = days < 10 ? '0' + days : days;
            document.getElementById('cd-hours').textContent = hours < 10 ? '0' + hours : hours;
            document.getElementById('cd-minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('cd-seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Lightbox Avanzado con Navegación Teclado/Botones
    function openLightbox(index) {
        if (!currentGallery || currentGallery.length === 0) return;
        currentGalleryIndex = index;
        updateLightboxContent();
        lightboxModal.style.display = 'flex';
    }

    function updateLightboxContent() {
        const photo = currentGallery[currentGalleryIndex];
        if (!photo) return;
        lightboxImg.src = photo.url;
        lightboxCaption.textContent = photo.caption || '';
        lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
    }

    lightboxClose.addEventListener('click', () => {
        lightboxModal.style.display = 'none';
    });

    lightboxPrev.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightboxContent();
    });

    lightboxNext.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
        updateLightboxContent();
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'flex') {
            if (e.key === 'Escape') lightboxModal.style.display = 'none';
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });
});
