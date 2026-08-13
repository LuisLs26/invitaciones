document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('id') || 'demo';
    const editorPreview = params.get('editorPreview') === '1';
    const openedDirectly = params.get('opened') === '1';
    const $ = (selector) => document.querySelector(selector);
    const STORAGE_KEYS = [`invitation_config_v2_${invitationId}`, `invitation_design_${invitationId}`, `invitation_config_${invitationId}`, `invitation_${invitationId}`];
    let config;
    let currentGallery = [];
    let currentGalleryIndex = 0;

    try {
        config = await loadConfig();
        renderInvitation(config);
    } catch (error) {
        $('#cover-screen').hidden = true;
        $('#invitation-app').hidden = true;
        $('#error-screen').hidden = false;
        console.error(error);
    }

    async function loadConfig() {
        for (const key of STORAGE_KEYS) {
            try {
                const raw = localStorage.getItem(key);
                if (raw) return normalize(JSON.parse(raw));
            } catch (error) { console.warn(`Configuración local inválida: ${key}`); }
        }
        const response = await fetch(`../configs/editor/${encodeURIComponent(invitationId)}.json`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Invitación no encontrada');
        return normalize(await response.json());
    }

    function normalize(value) {
        const result = { ...value };
        result.gallery = Array.isArray(result.gallery) ? result.gallery : [];
        result.showMusic = result.showMusic !== false && Boolean(result.music);
        return result;
    }

    function renderInvitation(data) {
        document.body.className = data.theme || 'theme-default';
        document.title = `${data.title || 'Invitación'} · ${data.personName || ''}`;
        setText('#cover-badge', badgeForType(data.type));
        setText('#cover-title', data.personName || 'Una celebración especial');
        setText('#cover-quote', data.coverQuote || data.subtitle || 'Te esperamos para celebrar juntos.');
        setAttr('#hero-img', 'src', data.heroImage || '../assets/images/xv/hero.svg');
        setText('#hero-subtitle', data.subtitle || 'Estás cordialmente invitado a');
        setText('#hero-title', data.title || 'Una celebración especial');
        setText('#hero-name', data.personName || '');
        setText('#hero-date', data.formattedDate || formatDate(data.date));
        setText('#hero-time', data.time || formatTime(data.date));
        setText('#main-message-text', data.mainMessage || 'Será una alegría compartir este momento contigo.');
        setText('#location-name', data.locationName || 'Lugar del evento');
        setText('#location-address', data.address || '');
        setText('#dress-code-text', data.dressCode || 'Vestimenta libre');
        setText('#gift-info-text', data.giftInfo || 'Tu presencia es nuestro mejor regalo');
        setText('#pass-info-text', data.passInfo || 'Pase válido para 2 personas');
        setText('#final-message-text', data.finalMessage || 'Gracias por ser parte de esta historia.');

        configureVisibility(data);
        configureLinks(data);
        renderGallery(data.gallery);
        renderVideo(data);
        configureMusic(data);
        renderDynamicElements(data.dynamicElements || []);
        createParticles();

        $('#invitation-app').hidden = false;
        if (editorPreview || openedDirectly) {
            $('#cover-screen').hidden = true;
            $('#invitation-app').classList.add('is-open');
            if (editorPreview) document.body.classList.add('editor-preview-mode');
            requestAnimationFrame(() => document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible')));
        } else {
            $('#cover-screen').hidden = false;
            bindOpening(data);
        }
        if (data.showCountdown && data.date) startCountdown(data.date);
        bindLightbox();
    }

    function configureVisibility(data) {
        $('#countdown-section').hidden = data.showCountdown === false;
        $('#gallery-section').hidden = data.showGallery === false || !data.gallery?.length;
        $('#map-section').hidden = data.showMap === false;
        $('#video-section').hidden = data.showVideo === false || !data.video;
    }

    function configureLinks(data) {
        const map = data.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(data.address || data.locationName || '')}`;
        const waze = data.wazeUrl || `https://waze.com/ul?q=${encodeURIComponent(data.locationName || data.address || '')}`;
        const whatsapp = `https://wa.me/${String(data.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(data.whatsappMessage || 'Hola, quiero confirmar mi asistencia.')}`;
        setAttr('#map-btn', 'href', map); setAttr('#waze-btn', 'href', waze); setAttr('#rsvp-btn', 'href', whatsapp); setAttr('#floating-whatsapp', 'href', whatsapp);
    }

    function renderGallery(gallery) {
        currentGallery = gallery || [];
        const grid = $('#gallery-grid');
        grid.innerHTML = '';
        currentGallery.forEach((photo, index) => {
            const item = document.createElement('button');
            item.className = 'gallery-item'; item.type = 'button';
            item.innerHTML = `<img src="${escapeAttr(photo.url)}" alt="${escapeAttr(photo.caption || 'Recuerdo')}" loading="lazy"><span>${escapeHtml(photo.caption || 'Recuerdo')}</span>`;
            item.addEventListener('click', () => openLightbox(index));
            grid.appendChild(item);
        });
    }

    function renderVideo(data) {
        if (!data.showVideo || !data.video) return;
        const box = $('#video-container');
        if (data.video.includes('youtube') || data.video.includes('vimeo')) box.innerHTML = `<iframe src="${escapeAttr(data.video)}" title="Video especial" allowfullscreen loading="lazy"></iframe>`;
        else box.innerHTML = '<div class="video-placeholder"><span>▶</span><p>Un video especial para volver a vivir este momento.</p></div>';
    }

    function configureMusic(data) {
        const button = $('#music-toggle');
        const audio = $('#bg-audio');
        if (!data.showMusic || !data.music) { button.hidden = true; return; }
        button.hidden = false; audio.src = data.music;
        let playing = false;
        button.addEventListener('click', () => {
            if (playing) { audio.pause(); playing = false; button.classList.remove('playing'); setText('#music-text', 'Música'); return; }
            audio.play().then(() => { playing = true; button.classList.add('playing'); setText('#music-text', 'Pausar'); }).catch(() => showMusicHint());
        });
    }

    function bindOpening() {
        const card = $('#envelope-card-3d'); const button = $('#open-invitation-btn');
        let opened = false;
        const open = () => {
            if (opened) return;
            opened = true;
            card.classList.add('open-anim');
            const next = new URLSearchParams(window.location.search);
            next.set('id', invitationId);
            next.set('opened', '1');
            next.set('v', '20260812-4');
            setTimeout(() => { window.location.replace(`${window.location.pathname}?${next.toString()}`); }, 180);
        };
        button.addEventListener('click', open, { once: true });
        card.addEventListener('click', (event) => { if (event.target !== button && !button.contains(event.target)) open(); }, { once: true });
    }

    function renderDynamicElements(elements) {
        if (!elements.length) return;
        let overlay = $('#public-dynamic-overlay');
        if (!overlay) { overlay = document.createElement('div'); overlay.id = 'public-dynamic-overlay'; $('#invitation-app').appendChild(overlay); }
        overlay.innerHTML = '';
        elements.forEach((item) => {
            const wrapper = document.createElement('div'); wrapper.className = 'dynamic-item';
            Object.assign(wrapper.style, { left: `${item.x || 0}px`, top: `${item.y || 0}px`, width: `${item.w || 80}px`, height: `${item.h || 80}px`, transform: `rotate(${item.rot || 0}deg)`, opacity: item.opacity ?? 1, zIndex: item.zIndex || 10 });
            if (item.type === 'text') { wrapper.textContent = item.text || ''; wrapper.style.color = item.color || 'currentColor'; wrapper.style.fontFamily = item.font || 'inherit'; wrapper.style.fontSize = `${item.size || 22}px`; }
            else { const image = document.createElement('img'); image.src = item.src; image.alt = item.name || 'Decoración'; wrapper.appendChild(image); }
            overlay.appendChild(wrapper);
        });
    }

    function createParticles() {
        const container = $('#particles-container'); container.innerHTML = '';
        for (let index = 0; index < 18; index += 1) { const dot = document.createElement('i'); dot.className = 'particle'; dot.style.left = `${Math.random() * 100}%`; dot.style.animationDelay = `${Math.random() * 6}s`; dot.style.animationDuration = `${7 + Math.random() * 6}s`; dot.style.width = `${3 + Math.random() * 5}px`; dot.style.height = dot.style.width; container.appendChild(dot); }
    }

    function startCountdown(value) {
        const target = new Date(value).getTime();
        const update = () => { const distance = target - Date.now(); const units = distance <= 0 ? [0, 0, 0, 0] : [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60]; ['#cd-days','#cd-hours','#cd-minutes','#cd-seconds'].forEach((selector, index) => setText(selector, String(units[index]).padStart(2, '0'))); };
        update(); setInterval(update, 1000);
    }

    function bindLightbox() {
        const modal = $('#lightbox-modal');
        $('#lightbox-close').addEventListener('click', () => { modal.hidden = true; });
        $('#lightbox-prev').addEventListener('click', () => moveGallery(-1)); $('#lightbox-next').addEventListener('click', () => moveGallery(1));
        modal.addEventListener('click', (event) => { if (event.target === modal) modal.hidden = true; });
        document.addEventListener('keydown', (event) => { if (modal.hidden) return; if (event.key === 'Escape') modal.hidden = true; if (event.key === 'ArrowLeft') moveGallery(-1); if (event.key === 'ArrowRight') moveGallery(1); });
    }
    function openLightbox(index) { currentGalleryIndex = index; updateLightbox(); $('#lightbox-modal').hidden = false; }
    function moveGallery(step) { currentGalleryIndex = (currentGalleryIndex + step + currentGallery.length) % currentGallery.length; updateLightbox(); }
    function updateLightbox() { const photo = currentGallery[currentGalleryIndex]; if (!photo) return; setAttr('#lightbox-img', 'src', photo.url); setText('#lightbox-caption', photo.caption || ''); setText('#lightbox-counter', `${currentGalleryIndex + 1} / ${currentGallery.length}`); }

    function showMusicHint() { setText('#music-text', 'Toca para reproducir'); }
    function badgeForType(type) { return type === 'boda' ? 'NUESTRA HISTORIA' : type === 'cumpleanos' ? 'LA FIESTA COMIENZA' : 'UNA NOCHE ESPECIAL'; }
    function formatDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date); }
    function formatTime(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date).replace('a. m.', 'AM').replace('p. m.', 'PM'); }
    function setText(selector, text) { const element = $(selector); if (element) element.textContent = text ?? ''; }
    function setAttr(selector, attribute, value) { const element = $(selector); if (element) element.setAttribute(attribute, value || ''); }
    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char])); }
    function escapeAttr(value) { return escapeHtml(value); }
});
