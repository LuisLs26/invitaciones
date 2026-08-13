/**
 * MOTOR DE EDITOR VISUAL REAL DE PÁGINA COMPLETA (VANILLA JS)
 * Carga y edita la invitación real completa en tiempo real.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener ID del diseño (?id=demo, ?id=cliente1, ?id=cumpleanos)
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('id') || 'demo';

    // 2. Elementos DOM del Editor
    const canvasStage = document.getElementById('canvas-stage');
    const canvasFrame = document.getElementById('canvas-frame');
    const dynamicOverlay = document.getElementById('editor-dynamic-overlay');
    const selectionBox = document.getElementById('selection-box');
    const rotHandle = document.querySelector('.rot-handle');
    const snapGuideH = document.getElementById('snap-guide-h');
    const snapGuideV = document.getElementById('snap-guide-v');

    // Header Controls
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    const btnSave = document.getElementById('btn-save');
    const btnExportJson = document.getElementById('btn-export-json');
    const btnImportJson = document.getElementById('btn-import-json');
    const jsonFileInput = document.getElementById('json-file-input');
    const btnPreview = document.getElementById('btn-preview');
    const saveStatus = document.getElementById('save-status');

    // Zoom Controls
    const zoomSelect = document.getElementById('zoom-select');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomFit = document.getElementById('btn-zoom-fit');

    // Sidebar & Inspector
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panelSections = document.querySelectorAll('.panel-section');
    const inspectorTitle = document.getElementById('inspector-title');
    const propCanvasPanel = document.getElementById('prop-canvas-panel');
    const propElementPanel = document.getElementById('prop-element-panel');

    // Form Inputs Inspector
    const themePresetSelect = document.getElementById('theme-preset-select');
    const inputConfigTitle = document.getElementById('input-config-title');
    const inputConfigName = document.getElementById('input-config-name');
    const inputConfigDate = document.getElementById('input-config-date');
    const inputConfigTime = document.getElementById('input-config-time');
    const inputConfigWaPhone = document.getElementById('input-config-wa-phone');
    const inputConfigWaMsg = document.getElementById('input-config-wa-msg');
    const inputConfigLocName = document.getElementById('input-config-loc-name');
    const inputConfigLocAddr = document.getElementById('input-config-loc-addr');

    const selectedElemInfo = document.getElementById('selected-elem-info');
    const propX = document.getElementById('prop-x');
    const propY = document.getElementById('prop-y');
    const propW = document.getElementById('prop-w');
    const propH = document.getElementById('prop-h');
    const propRot = document.getElementById('prop-rot');
    const propOpacity = document.getElementById('prop-opacity');

    const propTextGroup = document.getElementById('prop-text-group');
    const propFontFamily = document.getElementById('prop-font-family');
    const propFontSize = document.getElementById('prop-font-size');
    const propTextColor = document.getElementById('prop-text-color');

    const btnPropDuplicate = document.getElementById('btn-prop-duplicate');
    const btnPropDelete = document.getElementById('btn-prop-delete');
    const quickDup = document.getElementById('quick-dup');
    const quickDel = document.getElementById('quick-del');

    const sectionsList = document.getElementById('sections-list');
    const galleryItemsContainer = document.getElementById('editor-gallery-items');
    const layersList = document.getElementById('layers-list');

    // 3. Estado Global del Diseño
    let activeConfig = {};
    let dynamicElements = []; // GIFs y elementos libres superpuestos
    let selectedElementId = null;
    let currentZoom = 1;

    // Historial Undo / Redo
    let historyStack = [];
    let historyIndex = -1;

    // Drag & Transform state
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let activeHandle = null;
    let dragStartX = 0, dragStartY = 0;
    let elemStartX = 0, elemStartY = 0, elemStartW = 0, elemStartH = 0;

    // 4. Inicialización
    initEditor();

    function initEditor() {
        // Cargar Configuración Real
        loadRealConfiguration();

        // Configurar Pestañas Sidebar
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                tabButtons.forEach(b => b.classList.remove('active'));
                panelSections.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Configurar Zoom
        zoomSelect.addEventListener('change', (e) => setZoom(parseFloat(e.target.value)));
        btnZoomIn.addEventListener('click', () => setZoom(currentZoom + 0.15));
        btnZoomOut.addEventListener('click', () => setZoom(currentZoom - 0.15));
        btnZoomFit.addEventListener('click', fitZoomToViewport);

        // Atajos de teclado & Acciones
        setupKeyboardShortcuts();
        setupActionEvents();
        setupTransformHandles();
    }

    // Cargar Configuración Real (localStorage -> JSON -> Config JS)
    function loadRealConfiguration() {
        const localDraft = localStorage.getItem(`invitation_design_${designId}`);
        if (localDraft) {
            try {
                activeConfig = JSON.parse(localDraft);
                applyConfigToRealDOM(activeConfig);
                showToast("Borrador local cargado");
                return;
            } catch (e) {}
        }

        fetch(`../configs/editor/${designId}.json`)
            .then(res => {
                if (!res.ok) throw new Error('No JSON');
                return res.json();
            })
            .then(jsonConfig => {
                activeConfig = jsonConfig;
                applyConfigToRealDOM(activeConfig);
                showToast(`Configuración de ${designId} cargada`);
            })
            .catch(() => {
                const scriptTag = document.createElement('script');
                scriptTag.src = `../configs/${designId}.js`;
                scriptTag.onload = () => {
                    if (typeof INVITATION_CONFIG !== 'undefined') {
                        activeConfig = INVITATION_CONFIG;
                        applyConfigToRealDOM(activeConfig);
                    }
                };
                document.head.appendChild(scriptTag);
            });
    }

    // Aplicar Configuración al DOM Real de la Invitación
    function applyConfigToRealDOM(config) {
        // A. Aplicar Tema Cromático
        canvasFrame.className = `canvas-frame ${config.theme || 'theme-quinceanos'}`;
        themePresetSelect.value = config.theme || 'theme-quinceanos';

        // B. Rellenar Textos del DOM Real
        setDOMText('cover-title', config.personName || config.title);
        setDOMText('cover-quote', config.coverQuote || '');

        if (config.heroImage) document.getElementById('hero-img').src = config.heroImage;
        setDOMText('hero-subtitle', config.subtitle || 'Estás cordialmente invitado a');
        setDOMText('hero-title', config.title || 'Invitación Especial');
        setDOMText('hero-name', config.personName || '');
        setDOMText('hero-date', config.formattedDate || '');
        setDOMText('hero-time', config.time || '');

        setDOMText('main-message-text', config.mainMessage || '');

        // C. Rellenar Galería Real
        renderGalleryDOM(config.gallery || []);

        // D. Ubicación y Mapas
        setDOMText('location-name', config.locationName || 'Lugar del Evento');
        setDOMText('location-address', config.address || '');

        // E. Detalles
        setDOMText('dress-code-text', config.dressCode || 'Formal');
        setDOMText('gift-info-text', config.giftInfo || 'Sobres en recepción');
        setDOMText('pass-info-text', config.passInfo || 'Pase Válido para 2 Personas');
        setDOMText('final-message-text', config.finalMessage || '¡Gracias por acompañarnos!');

        // F. Sincronizar Inputs del Inspector
        inputConfigTitle.value = config.title || '';
        inputConfigName.value = config.personName || '';
        inputConfigDate.value = config.formattedDate || '';
        inputConfigTime.value = config.time || '';
        inputConfigWaPhone.value = config.whatsapp || '';
        inputConfigWaMsg.value = config.whatsappMessage || '';
        inputConfigLocName.value = config.locationName || '';
        inputConfigLocAddr.value = config.address || '';

        // G. Configurar Edición de Texto WYSIWYG Directa en Lienzo
        setupWYSIWYGInlineTextEditing();

        // H. Cargar Elementos Dinámicos (GIFs superpuestos)
        dynamicElements = config.dynamicElements || [
            { id: 'gif_b1', type: 'gif', src: '../assets/gifs/xv/butterfly.gif', name: 'Mariposa', x: 290, y: 30, w: 60, h: 60, rot: 0, opacity: 1, zIndex: 10 },
            { id: 'gif_s1', type: 'gif', src: '../assets/gifs/xv/sparkles.gif', name: 'Destellos', x: 20, y: 40, w: 70, h: 70, rot: 0, opacity: 1, zIndex: 11 }
        ];
        renderDynamicOverlay();
        saveHistoryState();
    }

    function setDOMText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // Configurar Edición Directa Doble Clic en el Lienzo (WYSIWYG)
    function setupWYSIWYGInlineTextEditing() {
        const editableTexts = document.querySelectorAll('.editable-text');
        editableTexts.forEach(el => {
            el.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                el.contentEditable = "true";
                el.focus();
                showToast("Modo de edición de texto directo activo");
            });

            el.addEventListener('blur', () => {
                el.contentEditable = "false";
                syncDOMToConfig();
                saveHistoryState();
            });

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                selectRealDOMElement(el);
            });
        });
    }

    function syncDOMToConfig() {
        activeConfig.personName = document.getElementById('hero-name')?.textContent || '';
        activeConfig.title = document.getElementById('hero-title')?.textContent || '';
        activeConfig.subtitle = document.getElementById('hero-subtitle')?.textContent || '';
        activeConfig.coverQuote = document.getElementById('cover-quote')?.textContent || '';
        activeConfig.formattedDate = document.getElementById('hero-date')?.textContent || '';
        activeConfig.time = document.getElementById('hero-time')?.textContent || '';
        activeConfig.mainMessage = document.getElementById('main-message-text')?.textContent || '';
        activeConfig.locationName = document.getElementById('location-name')?.textContent || '';
        activeConfig.address = document.getElementById('location-address')?.textContent || '';
        activeConfig.dressCode = document.getElementById('dress-code-text')?.textContent || '';
        activeConfig.giftInfo = document.getElementById('gift-info-text')?.textContent || '';
        activeConfig.passInfo = document.getElementById('pass-info-text')?.textContent || '';
        activeConfig.finalMessage = document.getElementById('final-message-text')?.textContent || '';
    }

    // Renderizar Galería en el DOM Real
    function renderGalleryDOM(galleryList) {
        const galleryGrid = document.getElementById('gallery-grid');
        galleryGrid.innerHTML = '';
        galleryItemsContainer.innerHTML = '';

        galleryList.forEach((photo, index) => {
            // Galería en Canvas Real
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${photo.url}" alt="${photo.caption || 'Foto'}">`;
            galleryGrid.appendChild(item);

            // Galería en Sidebar Editor
            const editorItem = document.createElement('div');
            editorItem.className = 'sample-item';
            editorItem.style.marginBottom = '8px';
            editorItem.innerHTML = `<img src="${photo.url}" alt="Foto ${index+1}"><span>Foto ${index+1}</span><button data-del-gal="${index}" style="color:#fca5a5; background:none; border:none; cursor:pointer; font-size:0.75rem;">Eliminar</button>`;
            galleryItemsContainer.appendChild(editorItem);
        });

        // Event listener para eliminar fotos de la galería
        galleryItemsContainer.querySelectorAll('[data-del-gal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-del-gal'));
                activeConfig.gallery.splice(idx, 1);
                renderGalleryDOM(activeConfig.gallery);
                saveHistoryState();
                showToast("Foto eliminada de la galería");
            });
        });
    }

    // Renderizar Overlay Dinámico (GIFs y Elementos Flotantes Libremente)
    function renderDynamicOverlay() {
        dynamicOverlay.innerHTML = '';
        dynamicElements.forEach(elem => {
            const el = document.createElement('div');
            el.id = elem.id;
            el.className = 'canvas-element';
            el.style.left = `${elem.x}px`;
            el.style.top = `${elem.y}px`;
            el.style.width = `${elem.w}px`;
            el.style.height = `${elem.h}px`;
            el.style.transform = `rotate(${elem.rot || 0}deg)`;
            el.style.opacity = elem.opacity !== undefined ? elem.opacity : 1;
            el.style.zIndex = elem.zIndex || 10;

            const img = document.createElement('img');
            img.src = elem.src;
            img.alt = elem.name || 'GIF Decorativo';
            el.appendChild(img);

            el.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                selectDynamicElement(elem.id);
                startDrag(e, elem.id);
            });

            dynamicOverlay.appendChild(el);
        });
    }

    // Selección de Elemento DOM Real vs Overlay
    function selectRealDOMElement(el) {
        selectedElementId = el.id;
        propCanvasPanel.style.display = 'none';
        propElementPanel.style.display = 'block';
        inspectorTitle.textContent = "Inspector de Texto";
        selectedElemInfo.textContent = `Texto (${el.id})`;
        propTextGroup.style.display = 'block';

        const computed = window.getComputedStyle(el);
        propFontSize.value = parseInt(computed.fontSize);
        propFontFamily.value = computed.fontFamily;
        propTextColor.value = rgbToHex(computed.color);

        selectionBox.style.display = 'none';
    }

    function selectDynamicElement(id) {
        selectedElementId = id;
        const elem = dynamicElements.find(e => e.id === id);
        if (!elem) return;

        propCanvasPanel.style.display = 'none';
        propElementPanel.style.display = 'block';
        inspectorTitle.textContent = `Inspector: ${elem.type.toUpperCase()}`;
        selectedElemInfo.textContent = `${elem.name || 'Elemento'}`;
        propTextGroup.style.display = 'none';

        propX.value = Math.round(elem.x);
        propY.value = Math.round(elem.y);
        propW.value = Math.round(elem.w);
        propH.value = Math.round(elem.h);
        propRot.value = Math.round(elem.rot || 0);
        propOpacity.value = Math.round((elem.opacity !== undefined ? elem.opacity : 1) * 100);

        updateSelectionBox();
    }

    function deselectAll() {
        selectedElementId = null;
        selectionBox.style.display = 'none';
        propElementPanel.style.display = 'none';
        propCanvasPanel.style.display = 'block';
        inspectorTitle.textContent = 'Propiedades del Diseño';
    }

    function updateSelectionBox() {
        const elem = dynamicElements.find(e => e.id === selectedElementId);
        if (!elem) {
            selectionBox.style.display = 'none';
            return;
        }

        selectionBox.style.display = 'block';
        selectionBox.style.left = `${elem.x}px`;
        selectionBox.style.top = `${elem.y}px`;
        selectionBox.style.width = `${elem.w}px`;
        selectionBox.style.height = `${elem.h}px`;
        selectionBox.style.transform = `rotate(${elem.rot || 0}deg)`;
    }

    // Drag & Transformación
    function startDrag(e, id) {
        if (isResizing || isRotating) return;
        isDragging = true;
        const elem = dynamicElements.find(el => el.id === id);
        const point = getEventPoint(e);

        dragStartX = point.x;
        dragStartY = point.y;
        elemStartX = elem.x;
        elemStartY = elem.y;

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging || !selectedElementId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;

        const elem = dynamicElements.find(el => el.id === selectedElementId);
        if (!elem) return;

        elem.x = elemStartX + dx;
        elem.y = elemStartY + dy;

        propX.value = Math.round(elem.x);
        propY.value = Math.round(elem.y);

        renderDynamicOverlay();
        updateSelectionBox();
    }

    function onDragEnd() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            saveHistoryState();
        }
    }

    function setupTransformHandles() {
        document.querySelectorAll('.handle').forEach(h => {
            h.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startResize(e, h.getAttribute('data-handle'));
            });
        });

        rotHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startRotate(e);
        });
    }

    function startResize(e, handleType) {
        isResizing = true;
        activeHandle = handleType;
        const elem = dynamicElements.find(el => el.id === selectedElementId);
        const point = getEventPoint(e);

        dragStartX = point.x;
        dragStartY = point.y;
        elemStartX = elem.x;
        elemStartY = elem.y;
        elemStartW = elem.w;
        elemStartH = elem.h;

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e) {
        if (!isResizing || !selectedElementId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;
        const elem = dynamicElements.find(el => el.id === selectedElementId);

        if (activeHandle.includes('e')) elem.w = Math.max(20, elemStartW + dx);
        if (activeHandle.includes('s')) elem.h = Math.max(20, elemStartH + dy);
        if (activeHandle.includes('w')) {
            const newW = Math.max(20, elemStartW - dx);
            elem.x = elemStartX + (elemStartW - newW);
            elem.w = newW;
        }
        if (activeHandle.includes('n')) {
            const newH = Math.max(20, elemStartH - dy);
            elem.y = elemStartY + (elemStartH - newH);
            elem.h = newH;
        }

        propW.value = Math.round(elem.w);
        propH.value = Math.round(elem.h);
        renderDynamicOverlay();
        updateSelectionBox();
    }

    function onResizeEnd() {
        if (isResizing) {
            isResizing = false;
            document.removeEventListener('mousemove', onResizeMove);
            document.removeEventListener('mouseup', onResizeEnd);
            saveHistoryState();
        }
    }

    function startRotate(e) {
        isRotating = true;
        const elem = dynamicElements.find(el => el.id === selectedElementId);
        const rect = selectionBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function onRotateMove(evt) {
            const point = getEventPoint(evt);
            const radians = Math.atan2(point.y - centerY, point.x - centerX);
            let degrees = Math.round(radians * (180 / Math.pi)) + 90;
            if (degrees < 0) degrees += 360;

            elem.rot = degrees;
            propRot.value = degrees;
            renderDynamicOverlay();
            updateSelectionBox();
        }

        function onRotateEnd() {
            isRotating = false;
            document.removeEventListener('mousemove', onRotateMove);
            document.removeEventListener('mouseup', onRotateEnd);
            saveHistoryState();
        }

        document.addEventListener('mousemove', onRotateMove);
        document.addEventListener('mouseup', onRotateEnd);
    }

    // Configurar Eventos de Acciones
    function setupActionEvents() {
        canvasStage.addEventListener('mousedown', (e) => {
            if (e.target === canvasStage || e.target === canvasFrame) {
                deselectAll();
            }
        });

        // Añadir GIF
        document.querySelectorAll('[data-action="add-gif"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const name = btn.getAttribute('data-name');
                addGif(src, name);
            });
        });

        // Subir GIF Personalizado
        document.getElementById('btn-trigger-gif-upload').addEventListener('click', () => {
            document.getElementById('gif-upload-input').click();
        });
        document.getElementById('gif-upload-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => addGif(evt.target.result, file.name);
                reader.readAsDataURL(file);
            }
        });

        // Toggle Secciones
        document.querySelectorAll('.btn-toggle-sec').forEach(btn => {
            btn.addEventListener('click', () => {
                const secId = btn.getAttribute('data-sec-target');
                const targetSec = document.getElementById(`sec-${secId}`) || document.getElementById(`${secId}-screen`);
                if (targetSec) {
                    const isVisible = targetSec.style.display !== 'none';
                    targetSec.style.display = isVisible ? 'none' : 'block';
                    btn.classList.toggle('off', isVisible);
                    btn.textContent = isVisible ? '🙈 Oculto' : '👁 Visible';
                    showToast(`Sección ${secId} ${isVisible ? 'ocultada' : 'visible'}`);
                }
            });
        });

        // Guardar & Exportar
        btnSave.addEventListener('click', saveProjectState);
        btnExportJson.addEventListener('click', exportProjectJSON);
        btnImportJson.addEventListener('click', () => jsonFileInput.click());
        jsonFileInput.addEventListener('change', importProjectJSON);
        btnPreview.addEventListener('click', () => window.open(`../invitacion/?id=${designId}`, '_blank'));

        btnPropDelete.addEventListener('click', deleteSelected);
        quickDel.addEventListener('click', deleteSelected);
        btnPropDuplicate.addEventListener('click', duplicateSelected);
        quickDup.addEventListener('click', duplicateSelected);

        // Inputs en Tiempo Real del Inspector General
        inputConfigName.addEventListener('input', (e) => {
            setDOMText('hero-name', e.target.value);
            setDOMText('cover-title', e.target.value);
            activeConfig.personName = e.target.value;
            saveHistoryState();
        });

        inputConfigTitle.addEventListener('input', (e) => {
            setDOMText('hero-title', e.target.value);
            activeConfig.title = e.target.value;
            saveHistoryState();
        });
    }

    function addGif(src, name) {
        const id = 'gif_' + Date.now();
        const newElem = {
            id, type: 'gif', src, name: name || 'GIF Animado',
            x: 140, y: 200, w: 80, h: 80, rot: 0, opacity: 1, zIndex: 20
        };
        dynamicElements.push(newElem);
        renderDynamicOverlay();
        selectDynamicElement(id);
        saveHistoryState();
        showToast(`GIF ${name || ''} añadido al lienzo`);
    }

    function deleteSelected() {
        if (!selectedElementId) return;
        dynamicElements = dynamicElements.filter(e => e.id !== selectedElementId);
        deselectAll();
        renderDynamicOverlay();
        saveHistoryState();
        showToast("Elemento eliminado");
    }

    function duplicateSelected() {
        if (!selectedElementId) return;
        const elem = dynamicElements.find(e => e.id === selectedElementId);
        if (!elem) return;
        const copy = JSON.parse(JSON.stringify(elem));
        copy.id = 'elem_' + Date.now();
        copy.x += 15;
        copy.y += 15;
        dynamicElements.push(copy);
        renderDynamicOverlay();
        selectDynamicElement(copy.id);
        saveHistoryState();
        showToast("Elemento duplicado");
    }

    // Persistencia y Historial
    function saveHistoryState() {
        syncDOMToConfig();
        activeConfig.dynamicElements = dynamicElements;
        if (historyIndex < historyStack.length - 1) historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push(JSON.stringify(activeConfig));
        if (historyStack.length > 30) historyStack.shift();
        historyIndex = historyStack.length - 1;

        btnUndo.disabled = historyIndex <= 0;
        btnRedo.disabled = historyIndex >= historyStack.length - 1;
    }

    btnUndo.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            activeConfig = JSON.parse(historyStack[historyIndex]);
            applyConfigToRealDOM(activeConfig);
            btnUndo.disabled = historyIndex <= 0;
            btnRedo.disabled = historyIndex >= historyStack.length - 1;
        }
    });

    btnRedo.addEventListener('click', () => {
        if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            activeConfig = JSON.parse(historyStack[historyIndex]);
            applyConfigToRealDOM(activeConfig);
            btnUndo.disabled = historyIndex <= 0;
            btnRedo.disabled = historyIndex >= historyStack.length - 1;
        }
    });

    function saveProjectState() {
        syncDOMToConfig();
        activeConfig.dynamicElements = dynamicElements;
        localStorage.setItem(`invitation_design_${designId}`, JSON.stringify(activeConfig));
        saveStatus.textContent = '🟢 Cambios guardados';
        showToast("Borrador del diseño guardado en localStorage");
    }

    function exportProjectJSON() {
        syncDOMToConfig();
        activeConfig.dynamicElements = dynamicElements;
        const str = JSON.stringify(activeConfig, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${designId}.json`;
        a.click();
        showToast("Configuración JSON descargada");
    }

    function importProjectJSON(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    activeConfig = JSON.parse(evt.target.result);
                    applyConfigToRealDOM(activeConfig);
                    saveHistoryState();
                    showToast("Configuración importada con éxito");
                } catch(err) {
                    alert("Error al leer el archivo JSON.");
                }
            };
            reader.readAsText(file);
        }
    }

    function setZoom(val) {
        currentZoom = Math.min(1.5, Math.max(0.25, val));
        zoomSelect.value = currentZoom;
        canvasStage.style.transform = `scale(${currentZoom})`;
    }

    function fitZoomToViewport() {
        setZoom(0.85);
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                deleteSelected();
            } else if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                btnUndo.click();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                btnRedo.click();
            } else if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                duplicateSelected();
            } else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveProjectState();
            }
        });
    }

    function getEventPoint(e) {
        if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    function rgbToHex(rgb) {
        if (!rgb || !rgb.startsWith('rgb')) return '#d4af37';
        const nums = rgb.match(/\d+/g);
        if (!nums || nums.length < 3) return '#d4af37';
        return '#' + nums.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    function showToast(msg) {
        const toast = document.getElementById('editor-toast');
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
});
