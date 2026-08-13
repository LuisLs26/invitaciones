/* Editor Studio: una fuente de verdad, borrador automático y vista previa aislada. */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const designId = params.get('id') || 'demo';
    const STORAGE_KEY = `invitation_config_v2_${designId}`;
    const LEGACY_KEYS = [`invitation_design_${designId}`, `invitation_config_${designId}`, `invitation_${designId}`];
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];
    const clone = (value) => JSON.parse(JSON.stringify(value));
    let config = null;
    let originalConfig = null;
    let history = [];
    let historyIndex = -1;
    let persistTimer = null;
    let previewTimer = null;
    let toastTimer = null;

    const fieldMap = {
        personName: '#field-personName', title: '#field-title', subtitle: '#field-subtitle',
        coverQuote: '#field-coverQuote', mainMessage: '#field-mainMessage', locationName: '#field-locationName',
        address: '#field-address', whatsapp: '#field-whatsapp', whatsappMessage: '#field-whatsappMessage',
        dressCode: '#field-dressCode', passInfo: '#field-passInfo', giftInfo: '#field-giftInfo', finalMessage: '#field-finalMessage'
    };
    const toggleMap = ['showCountdown', 'showGallery', 'showVideo', 'showMap', 'showMusic'];

    init();

    async function init() {
        $('#design-id').textContent = designId;
        initProjectSelector();
        bindNavigation();
        bindActions();
        bindFields();
        bindGallery();
        bindGifs();
        bindPreviewMessages();
        try {
            config = await loadConfig();
            originalConfig = clone(config);
            renderEditor();
            pushHistory(false);
            setStatus('Borrador listo', false);
        } catch (error) {
            showToast('No se pudo cargar esta invitación');
            setStatus('Error al cargar', true);
        }
    }


    async function loadConfig() {
        const stored = readStoredConfig();
        if (stored) return normalizeConfig(stored);
        const response = await fetch(`../configs/editor/${encodeURIComponent(designId)}.json`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Configuración no encontrada');
        return normalizeConfig(await response.json());
    }

    function readStoredConfig() {
        const keys = [STORAGE_KEY, ...LEGACY_KEYS];
        for (const key of keys) {
            try {
                const raw = localStorage.getItem(key);
                if (raw) return JSON.parse(raw);
            } catch (error) {
                console.warn(`No se pudo leer ${key}`, error);
            }
        }
        return null;
    }

    function normalizeConfig(input) {
        const result = clone(input || {});
        result.id = result.id || designId;
        result.type = result.type || 'quinceanos';
        result.theme = result.theme || themeForType(result.type);
        result.personName = result.personName || 'Tu nombre';
        result.title = result.title || 'Una celebración especial';
        result.subtitle = result.subtitle || 'Estás cordialmente invitado a';
        result.coverQuote = result.coverQuote || 'Ven a compartir una noche que recordaremos para siempre.';
        result.date = result.date || '2026-12-12T20:00:00';
        result.time = result.time || formatTime(result.date);
        result.formattedDate = result.formattedDate || formatDate(result.date);
        result.mainMessage = result.mainMessage || 'Será una alegría celebrar este momento contigo.';
        result.gallery = Array.isArray(result.gallery) ? result.gallery : [];
        result.showCountdown = result.showCountdown !== false;
        result.showGallery = result.showGallery !== false;
        result.showVideo = result.showVideo === true;
        result.showMap = result.showMap !== false;
        result.showMusic = result.showMusic !== false && Boolean(result.music);
        result.dynamicElements = Array.isArray(result.dynamicElements) ? result.dynamicElements : [];
        return result;
    }

    function themeForType(type) {
        return type === 'boda' ? 'theme-boda' : type === 'cumpleanos' ? 'theme-cumpleanos' : 'theme-quinceanos';
    }

    function bindNavigation() {
        $$('.rail-item[data-panel]').forEach((button) => button.addEventListener('click', () => {
            $$('.rail-item[data-panel]').forEach((item) => item.classList.toggle('active', item === button));
            $$('.settings-view').forEach((panel) => panel.classList.toggle('active', panel.id === button.dataset.panel));
        }));
        $$('.theme-card').forEach((button) => button.addEventListener('click', () => {
            const themeField = $('#field-theme');
            if (themeField) themeField.value = button.dataset.theme;
            updateField('theme', button.dataset.theme);
            pushHistory();
        }));
    }

    function bindActions() {
        const btnSave = $('#btn-save');
        if (btnSave) btnSave.addEventListener('click', () => saveProject(true));

        const btnPreview = $('#btn-preview');
        if (btnPreview) btnPreview.addEventListener('click', () => window.open(`../invitacion/?id=${encodeURIComponent(designId)}`, '_blank', 'noopener,noreferrer'));

        const btnExport = $('#btn-export');
        if (btnExport) btnExport.addEventListener('click', exportConfig);

        const btnRefresh = $('#btn-refresh-preview');
        if (btnRefresh) btnRefresh.addEventListener('click', () => refreshPreview(true));

        const btnFit = $('#btn-fit-preview');
        if (btnFit) btnFit.addEventListener('click', () => {
            const stage = $('.preview-stage');
            if (stage) stage.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const btnUndo = $('#btn-undo');
        if (btnUndo) btnUndo.addEventListener('click', () => moveHistory(-1));

        const btnRedo = $('#btn-redo');
        if (btnRedo) btnRedo.addEventListener('click', () => moveHistory(1));

        const btnReset = $('#btn-reset');
        if (btnReset) btnReset.addEventListener('click', resetToOriginal);

        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveProject(true); }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) { event.preventDefault(); moveHistory(-1); }
            if (((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') || ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z')) { event.preventDefault(); moveHistory(1); }
        });
    }

    function bindFields() {
        Object.entries(fieldMap).forEach(([key, selector]) => {
            const control = $(selector);
            if (!control) return;
            control.addEventListener('input', () => { updateField(key, control.value); queueDraft(); });
            control.addEventListener('change', () => pushHistory());
        });

        const dateField = $('#field-date');
        if (dateField) {
            dateField.addEventListener('input', () => { updateDateTime(); queueDraft(); });
            dateField.addEventListener('change', () => pushHistory());
        }

        const timeField = $('#field-time');
        if (timeField) {
            timeField.addEventListener('input', () => { updateDateTime(); queueDraft(); });
            timeField.addEventListener('change', () => pushHistory());
        }

        toggleMap.forEach((key) => {
            const control = $(`#toggle-${key}`);
            if (!control) return;
            control.addEventListener('change', () => { if (config) config[key] = control.checked; commitChange(); });
        });

        const themeField = $('#field-theme');
        if (themeField) {
            themeField.addEventListener('change', () => { updateField('theme', themeField.value); commitChange(); });
        }
    }

    function bindGallery() {
        const upload = $('#gallery-upload');
        if (upload) {
            upload.addEventListener('change', (event) => {
                const files = [...event.target.files];
                if (!files.length) return;
                Promise.all(files.map(fileToDataUrl)).then((photos) => {
                    if (!config) return;
                    config.gallery = [...(config.gallery || []), ...photos.map((url, index) => ({ url, caption: files[index].name.replace(/\.[^/.]+$/, '') }))];
                    renderGallery();
                    commitChange();
                    event.target.value = '';
                });
            });
        }

        $$('.small-button[data-add-sample]').forEach((button) => button.addEventListener('click', () => {
            if (!config) return;
            config.gallery = [...(config.gallery || []), { url: button.dataset.addSample, caption: 'Un recuerdo especial' }];
            renderGallery();
            commitChange();
        }));

        const clearBtn = $('#btn-clear-gallery');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (!config) return;
                config.gallery = [];
                renderGallery();
                commitChange();
            });
        }
    }


    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function renderEditor() {
        if (!config) return;
        const nameEl = $('#design-name');
        if (nameEl) nameEl.textContent = config.personName || config.title || 'Mi invitación';

        Object.entries(fieldMap).forEach(([key, selector]) => {
            const el = $(selector);
            if (el) el.value = config[key] || '';
        });

        const dateEl = $('#field-date');
        if (dateEl) dateEl.value = dateInputValue(config.date);

        const timeEl = $('#field-time');
        if (timeEl) timeEl.value = timeInputValue(config.date, config.time);

        const themeEl = $('#field-theme');
        if (themeEl) themeEl.value = config.theme || 'theme-quinceanos';

        toggleMap.forEach((key) => {
            const el = $(`#toggle-${key}`);
            if (el) el.checked = Boolean(config[key]);
        });

        $$('.theme-card').forEach((card) => card.classList.toggle('active', card.dataset.theme === config.theme));
        renderGallery();
        renderGifsList();
        refreshPreview(false);
    }



    function renderGallery() {
        const list = $('#gallery-editor-list');
        list.innerHTML = '';
        (config.gallery || []).forEach((photo, index) => {
            const row = document.createElement('div');
            row.className = 'gallery-row';
            const image = document.createElement('img');
            image.src = photo.url;
            image.alt = photo.caption || 'Foto';
            const input = document.createElement('input');
            input.value = photo.caption || '';
            input.placeholder = 'Título del recuerdo';
            input.addEventListener('input', () => { config.gallery[index].caption = input.value; queueDraft(); });
            input.addEventListener('change', () => pushHistory());
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = '×';
            remove.title = 'Quitar foto';
            remove.addEventListener('click', () => { config.gallery.splice(index, 1); renderGallery(); commitChange(); });
            row.append(image, input, remove);
            list.appendChild(row);
        });
        if (!list.children.length) {
            const empty = document.createElement('div');
            empty.className = 'tip-card soft';
            empty.innerHTML = '<span>＋</span><p>Aún no hay fotos. Puedes subirlas o añadir una imagen demo.</p>';
            list.appendChild(empty);
        }
    }

    function updateField(key, value) {
        config[key] = value;
        if (key === 'personName') $('#design-name').textContent = value || 'Mi invitación';
        if (key === 'theme') $$('.theme-card').forEach((card) => card.classList.toggle('active', card.dataset.theme === value));
        refreshPreview(false);
    }

    function updateDateTime() {
        const date = $('#field-date').value;
        const time = $('#field-time').value || '20:00';
        if (!date) return;
        config.date = `${date}T${time}:00`;
        config.formattedDate = formatDate(config.date);
        config.time = formatTime(config.date);
    }

    function commitChange() {
        pushHistory();
        queueDraft();
    }

    function pushHistory(render = true) {
        if (!config) return;
        const snapshot = JSON.stringify(config);
        if (history[historyIndex] === snapshot) return;
        history = history.slice(0, historyIndex + 1);
        history.push(snapshot);
        if (history.length > 60) history.shift();
        historyIndex = history.length - 1;
        updateHistoryButtons();
        if (render) { queueDraft(); refreshPreview(false); }
    }

    function moveHistory(direction) {
        const next = historyIndex + direction;
        if (next < 0 || next >= history.length) return;
        historyIndex = next;
        config = normalizeConfig(JSON.parse(history[historyIndex]));
        renderEditor();
        queueDraft();
        showToast(direction < 0 ? 'Cambio deshecho' : 'Cambio rehecho');
        updateHistoryButtons();
    }

    function updateHistoryButtons() {
        $('#btn-undo').disabled = historyIndex <= 0;
        $('#btn-redo').disabled = historyIndex >= history.length - 1;
    }

    async function resetToOriginal() {
        try {
            const response = await fetch(`../configs/editor/${encodeURIComponent(designId)}.json`, { cache: 'no-store' });
            if (!response.ok) throw new Error('Configuración base no disponible');
            originalConfig = normalizeConfig(await response.json());
            config = clone(originalConfig);
            renderEditor();
            commitChange();
            saveProject(false);
            showToast('Se restauró la configuración original');
        } catch (error) {
            showToast('No se pudo restaurar la configuración base');
        }
    }

    function queueDraft() {
        setStatus('Guardando borrador…', false);
        clearTimeout(persistTimer);
        persistTimer = setTimeout(() => persistConfig(false), 250);
    }

    function saveProject(showMessage) {
        clearTimeout(persistTimer);
        persistConfig(true);
        if (showMessage) showToast('✓ Invitación guardada y publicada en el demo');
    }

    function exportConfig() {
        if (!config) return;
        const payload = JSON.stringify({ ...config, editorVersion: 2, updatedAt: new Date().toISOString() }, null, 2);
        const file = new Blob([payload], { type: 'application/json' });
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${designId}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        showToast('JSON descargado. Reemplázalo en configs/editor y ejecuta subir-github.bat');
    }

    function bindPreviewMessages() {
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin || !event.data || event.data.type !== 'invitation:move-dynamic' || !config) return;
            const element = (config.dynamicElements || []).find((item) => item.id === event.data.id);
            if (!element) return;
            element.x = Math.max(0, Math.round(Number(event.data.x) || 0));
            element.y = Math.max(0, Math.round(Number(event.data.y) || 0));
            if (event.data.phase === 'end') {
                renderGifsList();
                commitChange();
                showToast('Posición del GIF guardada');
            } else {
                queueDraft();
            }
        });
    }

    function persistConfig(published) {
        try {
            const payload = JSON.stringify({ ...config, editorVersion: 2, updatedAt: new Date().toISOString() });
            localStorage.setItem(STORAGE_KEY, payload);
            // Mantener compatibilidad con las URLs y versiones anteriores del proyecto.
            localStorage.setItem(`invitation_design_${designId}`, payload);
            localStorage.setItem(`invitation_config_${designId}`, payload);
            localStorage.setItem(`invitation_${designId}`, payload);
            setStatus(published ? 'Publicado' : 'Borrador guardado', false);
            refreshPreview(published);
        } catch (error) {
            setStatus('No se pudo guardar', true);
            showToast('El navegador no permitió guardar este diseño');
        }
    }

    function refreshPreview(force) {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(() => {
            const frame = $('#preview-frame');
            const nextUrl = `../invitacion/?id=${encodeURIComponent(designId)}&editorPreview=1&v=${Date.now()}`;
            if (force || !frame.src || !frame.src.includes(`id=${encodeURIComponent(designId)}`)) frame.src = nextUrl;
            else if (frame.contentWindow) frame.contentWindow.location.replace(nextUrl);
        }, force ? 0 : 180);
    }

    function setStatus(text, isError) {
        $('#save-status').textContent = text;
        $('.status-dot').style.background = isError ? '#ff6f91' : '#57e59f';
        $('.status-dot').style.boxShadow = `0 0 12px ${isError ? '#ff6f91' : '#57e59f'}`;
        if (!isError && text.includes('guard')) $('#saved-time').textContent = `· ${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    }

    function showToast(message) {
        const toast = $('#editor-toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    function dateInputValue(value) { return value ? String(value).split('T')[0] : ''; }
    function timeInputValue(dateValue, fallback) {
        const match = String(dateValue || '').match(/T(\d{2}:\d{2})/);
        return match ? match[1] : to24Hour(fallback);
    }
    function to24Hour(value) {
        const match = String(value || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!match) return '20:00';
        let hour = Number(match[1]);
        if (match[3] && match[3].toUpperCase() === 'PM' && hour < 12) hour += 12;
        if (match[3] && match[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:${match[2]}`;
    }
    function formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        const formatted = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    function formatTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date).replace('a. m.', 'AM').replace('p. m.', 'PM');
    }

    const knownProjects = [
        { id: 'demo', label: '✨ XV Años — Ana María' },
        { id: 'cliente1', label: '💍 Boda — María & Carlos' },
        { id: 'cumpleanos', label: '🎂 Cumpleaños — Juan' }
    ];

    function initProjectSelector() {
        const selector = $('#project-selector');
        if (!selector) return;

        const extraIds = new Set();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('invitation_config_v2_') || key.startsWith('invitation_design_'))) {
                const pId = key.replace(/^(invitation_config_v2_|invitation_design_|invitation_config_|invitation_)/, '');
                if (pId && !knownProjects.some(p => p.id === pId)) {
                    extraIds.add(pId);
                }
            }
        }

        const allProjects = [...knownProjects];
        for (const extraId of extraIds) {
            allProjects.push({ id: extraId, label: `✦ Proyecto — ${extraId}` });
        }

        selector.innerHTML = '';
        allProjects.forEach(proj => {
            const opt = document.createElement('option');
            opt.value = proj.id;
            opt.textContent = proj.label;
            if (proj.id === designId) opt.selected = true;
            selector.appendChild(opt);
        });

        const divider = document.createElement('option');
        divider.value = '__divider__';
        divider.disabled = true;
        divider.textContent = '────────────────────';
        selector.appendChild(divider);

        const newOpt = document.createElement('option');
        newOpt.value = '__new_project__';
        newOpt.textContent = '+ Nuevo proyecto';
        selector.appendChild(newOpt);

        selector.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '__new_project__') {
                showToast('+ Nuevo proyecto estará disponible próximamente');
                selector.value = designId;
                return;
            }
            if (val && val !== designId && val !== '__divider__') {
                window.location.href = `./?id=${encodeURIComponent(val)}`;
            }
        });
    }

    function bindGifs() {
        $$('.gif-thumb-card').forEach((card) => {
            card.addEventListener('click', () => {
                const src = card.dataset.gifSrc;
                const name = card.dataset.gifName;
                addGifToCanvas(src, name);
            });
        });

        const input = $('#gif-upload-input');
        if (input) {
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.includes('gif') && !file.name.endsWith('.gif')) {
                    showToast('Por favor selecciona un archivo .gif');
                    return;
                }
                try {
                    const dataUrl = await fileToDataUrl(file);
                    addGifToCanvas(dataUrl, file.name.replace(/\.[^/.]+$/, ''));
                    input.value = '';
                } catch (err) {
                    showToast('Error al procesar el archivo GIF');
                }
            });
        }
    }

    function addGifToCanvas(src, name) {
        const newGif = {
            id: 'gif_' + Date.now(),
            type: 'gif',
            src: src,
            name: name || 'GIF Decorativo',
            x: 100,
            y: 180,
            w: 120,
            h: 120,
            rot: 0,
            opacity: 1,
            zIndex: 100 + (config.dynamicElements ? config.dynamicElements.length : 0)
        };
        config.dynamicElements = [...(config.dynamicElements || []), newGif];
        renderGifsList();
        commitChange();
        showToast(`✨ ${newGif.name} añadido a la invitación`);
    }

    function renderGifsList() {
        const list = $('#active-gifs-list');
        if (!list) return;
        list.innerHTML = '';

        const gifs = (config.dynamicElements || []).filter(el => el.type === 'gif');

        if (!gifs.length) {
            const empty = document.createElement('div');
            empty.className = 'tip-card soft';
            empty.innerHTML = '<span>✨</span><p>No hay GIFs en esta invitación. Haz clic en una miniatura arriba para añadir uno.</p>';
            list.appendChild(empty);
            return;
        }

        gifs.forEach((gif) => {
            const card = document.createElement('div');
            card.className = 'active-gif-card';

            const header = document.createElement('div');
            header.className = 'active-gif-header';

            const info = document.createElement('div');
            info.className = 'active-gif-info';
            info.innerHTML = `<img src="${gif.src}" alt="${gif.name}"><b>${gif.name || 'GIF Decorativo'}</b>`;

            const actions = document.createElement('div');
            actions.className = 'active-gif-actions';

            const btnDup = document.createElement('button');
            btnDup.type = 'button';
            btnDup.title = 'Duplicar GIF';
            btnDup.textContent = '📋';
            btnDup.addEventListener('click', () => {
                const dup = { ...gif, id: 'gif_' + Date.now(), x: (gif.x || 100) + 20, y: (gif.y || 180) + 20 };
                config.dynamicElements.push(dup);
                renderGifsList();
                commitChange();
                showToast('GIF duplicado');
            });

            const btnDel = document.createElement('button');
            btnDel.type = 'button';
            btnDel.className = 'danger';
            btnDel.title = 'Eliminar GIF';
            btnDel.textContent = '×';
            btnDel.addEventListener('click', () => {
                const realIdx = config.dynamicElements.findIndex(el => el.id === gif.id);
                if (realIdx !== -1) {
                    config.dynamicElements.splice(realIdx, 1);
                    renderGifsList();
                    commitChange();
                    showToast('GIF eliminado');
                }
            });

            actions.append(btnDup, btnDel);
            header.append(info, actions);

            const controls = document.createElement('div');
            controls.className = 'active-gif-controls';

            controls.innerHTML = `
                <label class="field"><span>Posición X (px)</span><input type="number" value="${gif.x || 0}" class="gif-prop-x"></label>
                <label class="field"><span>Posición Y (px)</span><input type="number" value="${gif.y || 0}" class="gif-prop-y"></label>
                <label class="field"><span>Ancho (px)</span><input type="number" value="${gif.w || 120}" class="gif-prop-w"></label>
                <label class="field"><span>Alto (px)</span><input type="number" value="${gif.h || 120}" class="gif-prop-h"></label>
            `;

            const propX = controls.querySelector('.gif-prop-x');
            const propY = controls.querySelector('.gif-prop-y');
            const propW = controls.querySelector('.gif-prop-w');
            const propH = controls.querySelector('.gif-prop-h');

            [propX, propY, propW, propH].forEach(inp => {
                inp.addEventListener('input', () => {
                    gif.x = parseInt(propX.value) || 0;
                    gif.y = parseInt(propY.value) || 0;
                    gif.w = parseInt(propW.value) || 50;
                    gif.h = parseInt(propH.value) || 50;
                    queueDraft();
                    refreshPreview(false);
                });
                inp.addEventListener('change', () => pushHistory());
            });

            card.append(header, controls);
            list.appendChild(card);
        });
    }
});

