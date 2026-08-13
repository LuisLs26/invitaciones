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

    let selectedElementId = null;

    init();

    async function init() {
        $('#design-id').textContent = designId;
        bindNavigation();
        bindActions();
        bindFields();
        bindGallery();
        bindGIFs();
        bindLayers();
        bindInspector();
        bindJSONImportExport();
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
        result.dynamicElements = Array.isArray(result.dynamicElements) ? result.dynamicElements : [
            { id: 'gif_1', type: 'gif', src: '../assets/gifs/xv/butterfly.gif', name: 'Mariposa Dorada', x: 280, y: 35, w: 70, h: 70, rot: 0, opacity: 1, zIndex: 15 },
            { id: 'gif_2', type: 'gif', src: '../assets/gifs/xv/sparkles.gif', name: 'Destellos Dorados', x: 20, y: 25, w: 75, h: 75, rot: 0, opacity: 1, zIndex: 16 }
        ];
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
            $('#field-theme').value = button.dataset.theme;
            updateField('theme', button.dataset.theme);
            pushHistory();
        }));
    }

    function bindActions() {
        $('#btn-save').addEventListener('click', () => saveProject(true));
        $('#btn-preview').addEventListener('click', () => window.open(`../invitacion/?id=${encodeURIComponent(designId)}`, '_blank', 'noopener,noreferrer'));
        $('#btn-refresh-preview').addEventListener('click', () => refreshPreview(true));
        $('#btn-fit-preview').addEventListener('click', () => $('.preview-stage').scrollTo({ top: 0, behavior: 'smooth' }));
        $('#btn-undo').addEventListener('click', () => moveHistory(-1));
        $('#btn-redo').addEventListener('click', () => moveHistory(1));
        $('#btn-reset').addEventListener('click', resetToOriginal);
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveProject(true); }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) { event.preventDefault(); moveHistory(-1); }
            if (((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') || ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z')) { event.preventDefault(); moveHistory(1); }
        });
    }

    function bindFields() {
        Object.entries(fieldMap).forEach(([key, selector]) => {
            const control = $(selector);
            control.addEventListener('input', () => { updateField(key, control.value); queueDraft(); });
            control.addEventListener('change', () => pushHistory());
        });
        $('#field-date').addEventListener('input', () => { updateDateTime(); queueDraft(); });
        $('#field-date').addEventListener('change', () => pushHistory());
        $('#field-time').addEventListener('input', () => { updateDateTime(); queueDraft(); });
        $('#field-time').addEventListener('change', () => pushHistory());
        toggleMap.forEach((key) => {
            const control = $(`#toggle-${key}`);
            control.addEventListener('change', () => { config[key] = control.checked; commitChange(); });
        });
        $('#field-theme').addEventListener('change', () => { updateField('theme', $('#field-theme').value); commitChange(); });
    }

    function bindGallery() {
        $('#gallery-upload').addEventListener('change', (event) => {
            const files = [...event.target.files];
            if (!files.length) return;
            Promise.all(files.map(fileToDataUrl)).then((photos) => {
                config.gallery = [...(config.gallery || []), ...photos.map((url, index) => ({ url, caption: files[index].name.replace(/\.[^/.]+$/, '') }))];
                renderGallery();
                commitChange();
                event.target.value = '';
            });
        });
        $$('.small-button[data-add-sample]').forEach((button) => button.addEventListener('click', () => {
            config.gallery = [...(config.gallery || []), { url: button.dataset.addSample, caption: 'Un recuerdo especial' }];
            renderGallery();
            commitChange();
        }));
        $('#btn-clear-gallery').addEventListener('click', () => {
            config.gallery = [];
            renderGallery();
            commitChange();
        });
    }

    function bindGIFs() {
        $$('.gif-preset-card').forEach((card) => {
            card.addEventListener('click', () => {
                const src = card.dataset.gifSrc;
                const name = card.dataset.gifName || 'GIF Decorativo';
                addDynamicElement('gif', src, name);
            });
        });

        const uploadInput = $('#gif-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                fileToDataUrl(file).then((url) => {
                    addDynamicElement('gif', url, file.name.replace(/\.[^/.]+$/, ''));
                    event.target.value = '';
                });
            });
        }
    }

    function addDynamicElement(type, src, name) {
        const id = 'elem_' + Date.now();
        const newElem = {
            id,
            type: type || 'gif',
            src,
            name: name || 'Elemento',
            x: 140,
            y: 160,
            w: 85,
            h: 85,
            rot: 0,
            opacity: 1,
            zIndex: 10 + (config.dynamicElements ? config.dynamicElements.length : 0)
        };
        config.dynamicElements = config.dynamicElements || [];
        config.dynamicElements.push(newElem);
        renderLayers();
        selectElement(id);
        commitChange();
        showToast(`✨ ${name} añadido al lienzo`);
    }

    function bindLayers() {
        renderLayers();
    }

    function renderLayers() {
        const container = $('#layers-tree');
        if (!container) return;
        container.innerHTML = '';

        const elements = config.dynamicElements || [];
        if (!elements.length) {
            container.innerHTML = '<div class="tip-card soft"><span>✦</span><p>No hay elementos flotantes en el lienzo. Añade un GIF o sticker desde la pestaña GIFs.</p></div>';
            return;
        }

        elements.forEach((item) => {
            const row = document.createElement('div');
            row.className = `layer-row ${item.id === selectedElementId ? 'active' : ''}`;
            row.innerHTML = `
                <div class="layer-row-info">
                    <span>${item.type === 'gif' ? '🎬' : '🖼'}</span>
                    <strong>${escapeHtml(item.name || 'Elemento')}</strong>
                </div>
                <div class="layer-row-actions">
                    <button type="button" class="btn-layer-lock" title="Bloquear">${item.locked ? '🔒' : '🔓'}</button>
                    <button type="button" class="btn-layer-del" title="Eliminar">🗑️</button>
                </div>
            `;
            row.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                selectElement(item.id);
            });
            row.querySelector('.btn-layer-lock').addEventListener('click', () => {
                item.locked = !item.locked;
                renderLayers();
                commitChange();
            });
            row.querySelector('.btn-layer-del').addEventListener('click', () => {
                deleteElement(item.id);
            });
            container.appendChild(row);
        });
    }

    function selectElement(id) {
        selectedElementId = id;
        renderLayers();
        renderInspector();
    }

    function bindInspector() {
        $('#insp-x').addEventListener('input', (e) => updateSelectedProp('x', parseFloat(e.target.value) || 0));
        $('#insp-y').addEventListener('input', (e) => updateSelectedProp('y', parseFloat(e.target.value) || 0));
        $('#insp-w').addEventListener('input', (e) => updateSelectedProp('w', parseFloat(e.target.value) || 10));
        $('#insp-h').addEventListener('input', (e) => updateSelectedProp('h', parseFloat(e.target.value) || 10));
        $('#insp-rot').addEventListener('input', (e) => updateSelectedProp('rot', parseFloat(e.target.value) || 0));
        $('#insp-opacity').addEventListener('input', (e) => updateSelectedProp('opacity', (parseFloat(e.target.value) || 100) / 100));
        $('#insp-zindex').addEventListener('input', (e) => updateSelectedProp('zIndex', parseInt(e.target.value, 10) || 1));

        $('#btn-insp-dup').addEventListener('click', () => {
            if (!selectedElementId) return;
            const elem = (config.dynamicElements || []).find((el) => el.id === selectedElementId);
            if (elem) {
                addDynamicElement(elem.type, elem.src, (elem.name || 'Copia') + ' Copia');
            }
        });
        $('#btn-insp-lock').addEventListener('click', () => {
            if (!selectedElementId) return;
            const elem = (config.dynamicElements || []).find((el) => el.id === selectedElementId);
            if (elem) {
                elem.locked = !elem.locked;
                renderLayers();
                renderInspector();
                commitChange();
            }
        });
        $('#btn-insp-del').addEventListener('click', () => {
            if (selectedElementId) deleteElement(selectedElementId);
        });
    }

    function updateSelectedProp(prop, val) {
        if (!selectedElementId) return;
        const elem = (config.dynamicElements || []).find((el) => el.id === selectedElementId);
        if (elem) {
            elem[prop] = val;
            commitChange();
        }
    }

    function deleteElement(id) {
        config.dynamicElements = (config.dynamicElements || []).filter((el) => el.id !== id);
        if (selectedElementId === id) selectedElementId = null;
        renderLayers();
        renderInspector();
        commitChange();
        showToast('Elemento eliminado');
    }

    function renderInspector() {
        const empty = $('#inspector-empty');
        const form = $('#inspector-form');
        if (!selectedElementId) {
            empty.hidden = false;
            form.hidden = true;
            return;
        }
        const elem = (config.dynamicElements || []).find((el) => el.id === selectedElementId);
        if (!elem) {
            empty.hidden = false;
            form.hidden = true;
            return;
        }
        empty.hidden = true;
        form.hidden = false;
        $('#insp-x').value = Math.round(elem.x || 0);
        $('#insp-y').value = Math.round(elem.y || 0);
        $('#insp-w').value = Math.round(elem.w || 80);
        $('#insp-h').value = Math.round(elem.h || 80);
        $('#insp-rot').value = Math.round(elem.rot || 0);
        $('#insp-opacity').value = Math.round((elem.opacity ?? 1) * 100);
        $('#insp-zindex').value = elem.zIndex || 10;
        $('#btn-insp-lock').textContent = elem.locked ? '🔓 Desbloquear' : '🔒 Bloquear';
    }

    function bindJSONImportExport() {
        const exportBtn = $('#btn-export-json');
        const importBtn = $('#btn-import-json');
        const importInput = $('#json-file-input');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const str = JSON.stringify(config, null, 2);
                const blob = new Blob([str], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${designId}.json`;
                a.click();
                showToast('📤 Configuración JSON exportada');
            });
        }

        if (importBtn && importInput) {
            importBtn.addEventListener('click', () => importInput.click());
            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                    try {
                        const parsed = JSON.parse(evt.target.result);
                        config = normalizeConfig(parsed);
                        renderEditor();
                        commitChange();
                        showToast('📥 JSON cargado exitosamente');
                    } catch (err) {
                        alert('Error al leer el archivo JSON');
                    }
                };
                reader.readAsText(file);
                importInput.value = '';
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
        $('#design-name').textContent = config.personName || config.title;
        Object.entries(fieldMap).forEach(([key, selector]) => { $(selector).value = config[key] || ''; });
        $('#field-date').value = dateInputValue(config.date);
        $('#field-time').value = timeInputValue(config.date, config.time);
        $('#field-theme').value = config.theme;
        toggleMap.forEach((key) => { $(`#toggle-${key}`).checked = Boolean(config[key]); });
        $$('.theme-card').forEach((card) => card.classList.toggle('active', card.dataset.theme === config.theme));
        renderGallery();
        renderLayers();
        renderInspector();
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
});
