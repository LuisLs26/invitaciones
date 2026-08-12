/**
 * CARGADOR DINÁMICO DE INVITACIONES Y CONTROLADOR DE INTERFAZ
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
    
    // Lightbox Elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    // 3. Inyectar script de configuración dinámicamente
    const scriptTag = document.createElement('script');
    scriptTag.src = `../configs/${invitationId}.js`;

    scriptTag.onload = () => {
        // Verificar si la configuración global existe
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

    // Función para mostrar pantalla de error 404
    function showError() {
        coverScreen.style.display = 'none';
        invitationApp.style.display = 'none';
        errorScreen.style.display = 'flex';
    }

    // Inicializar la invitación con los datos de configuración
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

        // E. Configurar Cuenta Regresiva (si está activa)
        if (config.showCountdown && config.date) {
            document.getElementById('countdown-section').style.display = 'block';
            startCountdown(config.date);
        } else {
            document.getElementById('countdown-section').style.display = 'none';
        }

        // F. Configurar Galería de Fotos (si está activa)
        if (config.showGallery && config.gallery && config.gallery.length > 0) {
            const gallerySection = document.getElementById('gallery-section');
            const galleryGrid = document.getElementById('gallery-grid');
            galleryGrid.innerHTML = '';

            config.gallery.forEach((photo, index) => {
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

        // G. Configurar Video (si está activo)
        if (config.showVideo && config.video) {
            const videoSection = document.getElementById('video-section');
            const videoContainer = document.getElementById('video-container');
            
            if (config.video.endsWith('.mp4')) {
                videoContainer.innerHTML = `<video controls poster="${config.heroImage}"><source src="${config.video}" type="video/mp4">Tu navegador no soporta video.</video>`;
            } else if (config.video.includes('youtube') || config.video.includes('vimeo')) {
                videoContainer.innerHTML = `<iframe src="${config.video}" allowfullscreen></iframe>`;
            } else {
                videoContainer.innerHTML = `<div style="padding:30px; color:#fff; text-align:center;">🎬 Sección de Video Lista para Reproducir</div>`;
            }
            videoSection.style.display = 'block';
        } else {
            document.getElementById('video-section').style.display = 'none';
        }

        // H. Configurar Ubicación y Mapa
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

        // I. Rellenar Detalles del Evento
        document.getElementById('dress-code-text').textContent = config.dressCode || 'Vestimenta Libre';
        document.getElementById('gift-info-text').textContent = config.giftInfo || 'Su presencia es nuestro mejor regalo';

        // J. Configurar Enlace de WhatsApp RSVP
        const rsvpBtn = document.getElementById('rsvp-btn');
        const phone = config.whatsapp || '51900000000';
        const msg = encodeURIComponent(config.whatsappMessage || 'Hola, quiero confirmar mi asistencia al evento.');
        rsvpBtn.href = `https://wa.me/${phone}?text=${msg}`;

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
                console.log("Reproducción automática pausada por el navegador. El usuario puede presionar el botón de música.");
            });
        }

        // M. Botón "Abrir Invitación"
        openBtn.addEventListener('click', () => {
            coverScreen.classList.add('hide-cover');
            invitationApp.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Iniciar reproducción de audio al interactuar
            if (config.showMusic) {
                playAudio();
            }

            // Inicializar Scroll Reveal Observer
            initScrollReveal();
        });
    }

    // Lógica de Scroll Reveal con IntersectionObserver
    function initScrollReveal() {
        const sections = document.querySelectorAll('#invitation-app .section');
        sections.forEach(sec => sec.classList.add('reveal-on-scroll'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(sec => observer.observe(sec));
    }

    // Lógica del Contador Regresivo
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

    // Lógica del Lightbox
    function openLightbox(url, caption) {
        lightboxImg.src = url;
        lightboxCaption.textContent = caption || '';
        lightboxModal.style.display = 'flex';
    }

    lightboxClose.addEventListener('click', () => {
        lightboxModal.style.display = 'none';
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.style.display = 'none';
        }
    });
});
