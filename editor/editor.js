/**
 * MOTOR DE EDITOR VISUAL CANVA CON ARRASTRE LIBRE 100% (VANILLA JS)
 * Permite mover imágenes y GIFs animados libremente por todo el lienzo de la invitación.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener ID del diseño de la URL (?id=demo, ?id=cliente1, ?id=cumpleanos)
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('id') || 'demo';

    // 2. Elementos Principales del DOM
    const canvasStage = document.getElementById('canvas-stage');
    const canvasFrame = document.getElementById('canvas-frame');
    const invitationContainer = document.getElementById('editor-invitation-container');
    const dynamicOverlay = document.getElementById('editor-dynamic-overlay');
    const selectionBox = document.getElementById('selection-box');
    const rotHandle = document.querySelector('.rot-handle');
    const snapGuideH = document.getElementById('snap-guide-h');
    const snapGuideV = document.getElementById('snap-guide-v');

    // Headers & Action Buttons
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

    // Sidebar & Inspector Panels
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panelSections = document.querySelectorAll('.panel-section');
    const inspectorTitle = document.getElementById('inspector-title');
    const propCanvasPanel = document.getElementById('prop-canvas-panel');
    const propElementPanel = document.getElementById('prop-element-panel');

    // Form Inputs
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

    const btnPropLock = document.getElementById('btn-prop-lock');
    const btnPropDuplicate = document.getElementById('btn-prop-duplicate');
    const btnPropDelete = document.getElementById('btn-prop-delete');
    const quickLock = document.getElementById('quick-lock');
    const quickDup = document.getElementById('quick-dup');
    const quickDel = document.getElementById('quick-del');

    const layersList = document.getElementById('layers-list');
    const galleryItemsContainer = document.getElementById('editor-gallery-items');

    // 3. Estado Global del Editor
    let activeConfig = {};
    let dynamicElements = []; // Lista de GIFs e imágenes flotantes libres
    let scannedElements = [];
    let selectedElementId = null;
    let currentZoom = 1;
    let isLockedMap = {};

    // Historial Undo / Redo (50 estados)
    let historyStack = [];
    let historyIndex = -1;
    const MAX_HISTORY = 50;

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
        loadRealConfiguration();

        // Pestañas Sidebar
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                tabButtons.forEach(b => b.classList.remove('active'));
                panelSections.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Zoom Controls
        zoomSelect.addEventListener('change', (e) => setZoom(parseFloat(e.target.value)));
        btnZoomIn.addEventListener('click', () => setZoom(currentZoom + 0.15));
        btnZoomOut.addEventListener('click', () => setZoom(currentZoom - 0.15));
        btnZoomFit.addEventListener('click', fitZoomToViewport);

        // Events & Shortcuts
        setupKeyboardShortcuts();
        setupActionEvents();
        setupTransformHandles();
    }

    // Cargar Configuración Real
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

    // Aplicar Configuración al DOM Real
    function applyConfigToRealDOM(config) {
        canvasFrame.className = `canvas-frame ${config.theme || 'theme-quinceanos'}`;
        themePresetSelect.value = config.theme || 'theme-quinceanos';

        setDOMText('cover-title', config.personName || config.title);
        setDOMText('cover-quote', config.coverQuote || '');

        if (config.heroImage) document.getElementById('hero-img').src = config.heroImage;
        setDOMText('hero-subtitle', config.subtitle || 'Estás cordialmente invitado a');
        setDOMText('hero-title', config.title || 'Mis XV Años');
        setDOMText('hero-name', config.personName || 'Ana María');
        setDOMText('hero-date', config.formattedDate || 'Sábado, 12 de Diciembre de 2026');
        setDOMText('hero-time', config.time || '8:00 PM');

        setDOMText('main-message-text', config.mainMessage || '');
        renderGalleryDOM(config.gallery || []);

        setDOMText('location-name', config.locationName || 'Salón Jardín de las Rosas');
        setDOMText('location-address', config.address || 'Av. Las Flores 123');

        setDOMText('dress-code-text', config.dressCode || 'Formal');
        setDOMText('gift-info-text', config.giftInfo || 'Sobres en recepción');
        setDOMText('pass-info-text', config.passInfo || 'Pase Válido para 2 Personas');
        setDOMText('final-message-text', config.finalMessage || '¡Gracias por acompañarnos!');

        // Sincronizar Inputs
        inputConfigTitle.value = config.title || '';
        inputConfigName.value = config.personName || '';
        inputConfigDate.value = config.formattedDate || '';
        inputConfigTime.value = config.time || '';
        inputConfigWaPhone.value = config.whatsapp || '';
        inputConfigWaMsg.value = config.whatsappMessage || '';
        inputConfigLocName.value = config.locationName || '';
        inputConfigLocAddr.value = config.address || '';

        // Cargar Elementos Flotantes Libres (GIFs e Imágenes Libres)
        dynamicElements = config.dynamicElements || [
            { id: 'gif_free_1', type: 'gif', src: '../assets/gifs/xv/butterfly.gif', name: 'Mariposa Dorada', x: 280, y: 40, w: 65, h: 65, rot: 0, opacity: 1, zIndex: 100 },
            { id: 'gif_free_2', type: 'gif', src: '../assets/gifs/xv/sparkles.gif', name: 'Destellos Dorados', x: 20, y: 30, w: 75, h: 75, rot: 0, opacity: 1, zIndex: 101 },
            { id: 'gif_free_3', type: 'gif', src: '../assets/gifs/xv/petals.gif', name: 'Lluvia de Pétalos', x: 10, y: 420, w: 90, h: 110, rot: 0, opacity: 0.85, zIndex: 102 }
        ];

        renderDynamicOverlay();
        scanEditableElements();
        setupWYSIWYGInlineTextEditing();
        saveHistoryState();
    }

    function setDOMText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // RENDERIZAR OVERLAY DINÁMICO (GIFs E IMÁGENES ARRASTRABLES 100% LIBRES)
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
            el.style.zIndex = elem.zIndex || 100;

            const img = document.createElement('img');
            img.src = elem.src;
            img.alt = elem.name || 'Elemento libre';
            el.appendChild(img);

            // Evento para arrastrar libremente
            el.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                selectDynamicElement(elem.id);
                startDrag(e, elem.id);
            });

            el.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                selectDynamicElement(elem.id);
                startDrag(e, elem.id);
            }, { passive: false });

            dynamicOverlay.appendChild(el);
        });
    }

    // Escáner Universal de DOM
    function scanEditableElements() {
        scannedElements = [];
        const container = document.getElementById('editor-invitation-container');
        if (!container) return;

        const nodes = container.querySelectorAll('.editable-text, img, button, a, .section');
        let counter = 1;

        nodes.forEach(node => {
            let editorId = node.getAttribute('data-editor-id');
            if (!editorId) {
                editorId = node.id || `${node.tagName.toLowerCase()}_${counter++}`;
                node.setAttribute('data-editor-id', editorId);
            }

            scannedElements.push({
                id: editorId,
                node: node,
                type: getNodeType(node),
                name: getNodeName(node, editorId)
            });

            node.removeEventListener('click', onNodeClick);
            node.addEventListener('click', onNodeClick);
        });

        updateLayersList();
    }

    function getNodeType(node) {
        if (node.tagName === 'IMG') return node.src.endsWith('.gif') ? 'gif' : 'image';
        if (['H1','H2','H3','H4','P','SPAN','A'].includes(node.tagName)) return 'text';
        if (node.classList.contains('section')) return 'section';
        return 'component';
    }

    function getNodeName(node, id) {
        if (node.textContent && node.textContent.length < 30 && node.children.length === 0) {
            return node.textContent.trim();
        }
        return id;
    }

    function onNodeClick(e) {
        e.stopPropagation();
        const editorId = e.currentTarget.getAttribute('data-editor-id');
        selectElementByEditorId(editorId);
    }

    // SELECCIÓN Y BOUNDING BOX
    function selectDynamicElement(id) {
        selectedElementId = id;
        const elem = dynamicElements.find(e => e.id === id);
        if (!elem) return;

        propCanvasPanel.style.display = 'none';
        propElementPanel.style.display = 'block';
        inspectorTitle.textContent = `Inspector: ${elem.type.toUpperCase()}`;
        selectedElemInfo.textContent = `${elem.name || 'Elemento Flotante'}`;
        propTextGroup.style.display = 'none';

        propX.value = Math.round(elem.x);
        propY.value = Math.round(elem.y);
        propW.value = Math.round(elem.w);
        propH.value = Math.round(elem.h);
        propRot.value = Math.round(elem.rot || 0);
        propOpacity.value = Math.round((elem.opacity !== undefined ? elem.opacity : 1) * 100);

        updateSelectionBox();
        updateLayersList();
    }

    function selectElementByEditorId(editorId) {
        // Verificar si es un elemento dinámico libre primero
        const dyn = dynamicElements.find(d => d.id === editorId);
        if (dyn) {
            selectDynamicElement(editorId);
            return;
        }

        selectedElementId = editorId;
        const scanned = scannedElements.find(item => item.id === editorId);
        if (!scanned) {
            deselectAll();
            return;
        }

        const node = scanned.node;
        propCanvasPanel.style.display = 'none';
        propElementPanel.style.display = 'block';
        inspectorTitle.textContent = `Inspector: ${scanned.type.toUpperCase()}`;
        selectedElemInfo.textContent = `${scanned.name}`;

        const rect = node.getBoundingClientRect();
        const frameRect = canvasFrame.getBoundingClientRect();

        propX.value = Math.round((rect.left - frameRect.left) / currentZoom);
        propY.value = Math.round((rect.top - frameRect.top) / currentZoom);
        propW.value = Math.round(rect.width / currentZoom);
        propH.value = Math.round(rect.height / currentZoom);
        propOpacity.value = Math.round((parseFloat(window.getComputedStyle(node).opacity) || 1) * 100);

        if (scanned.type === 'text') {
            propTextGroup.style.display = 'block';
            const computed = window.getComputedStyle(node);
            propFontSize.value = parseInt(computed.fontSize);
            propFontFamily.value = computed.fontFamily;
            propTextColor.value = rgbToHex(computed.color);
        } else {
            propTextGroup.style.display = 'none';
        }

        updateSelectionBox();
        updateLayersList();
    }

    function deselectAll() {
        selectedElementId = null;
        selectionBox.style.display = 'none';
        propElementPanel.style.display = 'none';
        propCanvasPanel.style.display = 'block';
        inspectorTitle.textContent = 'Propiedades del Diseño';
        updateLayersList();
    }

    function updateSelectionBox() {
        if (!selectedElementId) {
            selectionBox.style.display = 'none';
            return;
        }

        // Si es elemento dinámico libre
        const dyn = dynamicElements.find(d => d.id === selectedElementId);
        if (dyn) {
            selectionBox.style.display = 'block';
            selectionBox.style.left = `${dyn.x}px`;
            selectionBox.style.top = `${dyn.y}px`;
            selectionBox.style.width = `${dyn.w}px`;
            selectionBox.style.height = `${dyn.h}px`;
            selectionBox.style.transform = `rotate(${dyn.rot || 0}deg)`;

            const isLocked = !!isLockedMap[selectedElementId];
            quickLock.textContent = isLocked ? '🔒' : '🔓';
            btnPropLock.textContent = isLocked ? '🔒 Desbloquear Elemento' : '🔓 Bloquear Elemento';
            return;
        }

        // Si es elemento escaneado del DOM
        const scanned = scannedElements.find(item => item.id === selectedElementId);
        if (!scanned || !scanned.node) return;

        const rect = scanned.node.getBoundingClientRect();
        const frameRect = canvasFrame.getBoundingClientRect();

        selectionBox.style.display = 'block';
        selectionBox.style.left = `${(rect.left - frameRect.left) / currentZoom}px`;
        selectionBox.style.top = `${(rect.top - frameRect.top) / currentZoom}px`;
        selectionBox.style.width = `${rect.width / currentZoom}px`;
        selectionBox.style.height = `${rect.height / currentZoom}px`;

        const isLocked = !!isLockedMap[selectedElementId];
        quickLock.textContent = isLocked ? '🔒' : '🔓';
        btnPropLock.textContent = isLocked ? '🔒 Desbloquear Elemento' : '🔓 Bloquear Elemento';
    }

    // ARRASTRE DE ELEMENTOS (100% LIBRE)
    function startDrag(e, id) {
        if (isResizing || isRotating || isLockedMap[id]) return;
        isDragging = true;

        const dyn = dynamicElements.find(el => el.id === id);
        const point = getEventPoint(e);
        dragStartX = point.x;
        dragStartY = point.y;

        if (dyn) {
            elemStartX = dyn.x;
            elemStartY = dyn.y;
        } else {
            const scanned = scannedElements.find(i => i.id === id);
            if (scanned && scanned.node) {
                const rect = scanned.node.getBoundingClientRect();
                const frameRect = canvasFrame.getBoundingClientRect();
                elemStartX = (rect.left - frameRect.left) / currentZoom;
                elemStartY = (rect.top - frameRect.top) / currentZoom;
            }
        }

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging || !selectedElementId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;

        const dyn = dynamicElements.find(el => el.id === selectedElementId);
        if (dyn) {
            dyn.x = elemStartX + dx;
            dyn.y = elemStartY + dy;

            propX.value = Math.round(dyn.x);
            propY.value = Math.round(dyn.y);
            renderDynamicOverlay();
            updateSelectionBox();
            return;
        }

        const scanned = scannedElements.find(i => i.id === selectedElementId);
        if (scanned && scanned.node) {
            scanned.node.style.position = 'absolute';
            scanned.node.style.left = `${elemStartX + dx}px`;
            scanned.node.style.top = `${elemStartY + dy}px`;
            updateSelectionBox();
        }
    }

    function onDragEnd() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', onDragEnd);
            saveHistoryState();
        }
    }

    // TRANSFORMACIÓN: REDIMENSIONADO Y ROTACIÓN (8 HANDLES)
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
        if (isLockedMap[selectedElementId]) return;
        isResizing = true;
        activeHandle = handleType;
        const point = getEventPoint(e);
        dragStartX = point.x;
        dragStartY = point.y;

        const dyn = dynamicElements.find(el => el.id === selectedElementId);
        if (dyn) {
            elemStartW = dyn.w;
            elemStartH = dyn.h;
        } else {
            const scanned = scannedElements.find(i => i.id === selectedElementId);
            if (scanned && scanned.node) {
                const rect = scanned.node.getBoundingClientRect();
                elemStartW = rect.width / currentZoom;
                elemStartH = rect.height / currentZoom;
            }
        }

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e) {
        if (!isResizing || !selectedElementId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;

        const dyn = dynamicElements.find(el => el.id === selectedElementId);
        if (dyn) {
            if (activeHandle.includes('e')) dyn.w = Math.max(20, elemStartW + dx);
            if (activeHandle.includes('s')) dyn.h = Math.max(20, elemStartH + dy);
            if (activeHandle.includes('w')) {
                const newW = Math.max(20, elemStartW - dx);
                dyn.x = elemStartX + (elemStartW - newW);
                dyn.w = newW;
            }
            if (activeHandle.includes('n')) {
                const newH = Math.max(20, elemStartH - dy);
                dyn.y = elemStartY + (elemStartH - newH);
                dyn.h = newH;
            }

            propW.value = Math.round(dyn.w);
            propH.value = Math.round(dyn.h);
            renderDynamicOverlay();
            updateSelectionBox();
            return;
        }

        const scanned = scannedElements.find(i => i.id === selectedElementId);
        if (scanned && scanned.node) {
            if (activeHandle.includes('e')) scanned.node.style.width = `${Math.max(20, elemStartW + dx)}px`;
            if (activeHandle.includes('s')) scanned.node.style.height = `${Math.max(20, elemStartH + dy)}px`;
            updateSelectionBox();
        }
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
        if (isLockedMap[selectedElementId]) return;
        isRotating = true;
        const rect = selectionBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function onRotateMove(evt) {
            const point = getEventPoint(evt);
            const radians = Math.atan2(point.y - centerY, point.x - centerX);
            let degrees = Math.round(radians * (180 / Math.pi)) + 90;
            if (evt.shiftKey) degrees = Math.round(degrees / 15) * 15;

            const dyn = dynamicElements.find(el => el.id === selectedElementId);
            if (dyn) {
                dyn.rot = degrees;
                propRot.value = degrees;
                renderDynamicOverlay();
                updateSelectionBox();
                return;
            }

            const scanned = scannedElements.find(i => i.id === selectedElementId);
            if (scanned && scanned.node) {
                scanned.node.style.transform = `rotate(${degrees}deg)`;
                updateSelectionBox();
            }
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

    // WYSIWYG EDICIÓN DIRECTA EN LÍNEA
    function setupWYSIWYGInlineTextEditing() {
        const editableTexts = document.querySelectorAll('.editable-text');
        editableTexts.forEach(el => {
            el.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                if (isLockedMap[el.getAttribute('data-editor-id')]) return;
                el.contentEditable = "true";
                el.focus();
                showToast("Modo de edición directa de texto activo");
            });

            el.addEventListener('blur', () => {
                el.contentEditable = "false";
                syncDOMToConfig();
                saveHistoryState();
            });
        });
    }

    // GESTOR DE SECCIONES (LIMPIO SIN BUGS)
    function setupSectionManagerEvents() {
        document.querySelectorAll('.btn-sec-act').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const act = btn.getAttribute('data-act');
                const secId = btn.getAttribute('data-sec');
                const targetSec = document.getElementById(secId);
                if (!targetSec) return;

                if (act === 'edit') {
                    targetSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.querySelectorAll('.section-editing-highlight').forEach(s => s.classList.remove('section-editing-highlight'));
                    targetSec.classList.add('section-editing-highlight');
                    selectElementByEditorId(secId);
                    showToast(`Editando sección ${secId}`);
                } else if (act === 'vis') {
                    const isHidden = targetSec.style.display === 'none';
                    targetSec.style.display = isHidden ? 'block' : 'none';
                    btn.classList.toggle('off', !isHidden);
                    btn.textContent = !isHidden ? '🙈' : '👁';
                    showToast(`Sección ${secId} ${!isHidden ? 'ocultada' : 'visible'}`);
                    saveHistoryState();
                } else if (act === 'up') {
                    if (targetSec.previousElementSibling) {
                        targetSec.parentNode.insertBefore(targetSec, targetSec.previousElementSibling);
                        showToast(`Sección ${secId} movida arriba`);
                        saveHistoryState();
                    }
                } else if (act === 'down') {
                    if (targetSec.nextElementSibling) {
                        targetSec.parentNode.insertBefore(targetSec.nextElementSibling, targetSec);
                        showToast(`Sección ${secId} movida abajo`);
                        saveHistoryState();
                    }
                }
            });
        });
    }

    function updateLayersList() {
        layersList.innerHTML = '';

        // Primero elementos libres (GIFs e Imágenes)
        dynamicElements.forEach(item => {
            const li = document.createElement('li');
            li.className = `layer-item ${item.id === selectedElementId ? 'active' : ''}`;
            const isLocked = !!isLockedMap[item.id];
            li.innerHTML = `<span>✨ ${item.name}</span><small>${isLocked ? '🔒' : item.type}</small>`;
            li.addEventListener('click', () => selectDynamicElement(item.id));
            layersList.appendChild(li);
        });

        // Luego elementos del DOM real
        scannedElements.slice(0, 30).forEach(item => {
            const li = document.createElement('li');
            li.className = `layer-item ${item.id === selectedElementId ? 'active' : ''}`;
            const isLocked = !!isLockedMap[item.id];
            li.innerHTML = `<span>${item.name}</span><small>${isLocked ? '🔒' : item.type}</small>`;
            li.addEventListener('click', () => selectElementByEditorId(item.id));
            layersList.appendChild(li);
        });
    }

    function toggleLockSelected() {
        if (!selectedElementId) return;
        isLockedMap[selectedElementId] = !isLockedMap[selectedElementId];
        updateSelectionBox();
        updateLayersList();
        showToast(isLockedMap[selectedElementId] ? "Elemento bloqueado 🔒" : "Elemento desbloqueado 🔓");
    }

    function setupActionEvents() {
        setupSectionManagerEvents();

        canvasStage.addEventListener('mousedown', (e) => {
            if (e.target === canvasStage || e.target === canvasFrame) {
                deselectAll();
            }
        });

        // Subir Imagen desde PC
        document.getElementById('btn-trigger-upload').addEventListener('click', () => {
            document.getElementById('img-upload-input').click();
        });
        document.getElementById('img-upload-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => addMediaElementToCanvas(evt.target.result, file.name, file.type.includes('gif'));
                reader.readAsDataURL(file);
            }
        });

        // Subir GIF desde PC
        document.getElementById('btn-trigger-gif-upload').addEventListener('click', () => {
            document.getElementById('gif-upload-input').click();
        });
        document.getElementById('gif-upload-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => addMediaElementToCanvas(evt.target.result, file.name, true);
                reader.readAsDataURL(file);
            }
        });

        // Añadir GIF de biblioteca
        document.querySelectorAll('[data-action="add-gif"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const name = btn.getAttribute('data-name');
                addMediaElementToCanvas(src, name, true);
            });
        });

        // Añadir Imagen de biblioteca
        document.querySelectorAll('[data-action="add-image"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                addMediaElementToCanvas(src, 'Imagen Servidor', false);
            });
        });

        // Bloqueo / Duplicar / Eliminar
        quickLock.addEventListener('click', toggleLockSelected);
        btnPropLock.addEventListener('click', toggleLockSelected);
        quickDup.addEventListener('click', duplicateSelected);
        btnPropDuplicate.addEventListener('click', duplicateSelected);
        quickDel.addEventListener('click', deleteSelected);
        btnPropDelete.addEventListener('click', deleteSelected);

        // Guardar, Exportar & Importar
        btnSave.addEventListener('click', saveProjectState);
        btnExportJson.addEventListener('click', exportProjectJSON);
        btnImportJson.addEventListener('click', () => jsonFileInput.click());
        jsonFileInput.addEventListener('change', importProjectJSON);
        btnPreview.addEventListener('click', () => window.open(`../invitacion/?id=${designId}`, '_blank'));

        // Inputs Inspector
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

    function addMediaElementToCanvas(src, name, isGif) {
        const id = (isGif ? 'gif_' : 'img_') + Date.now();
        const newElem = {
            id, type: isGif ? 'gif' : 'image', src, name: name || 'Elemento Libre',
            x: 130, y: 250, w: 100, h: 100, rot: 0, opacity: 1, zIndex: 100 + dynamicElements.length
        };
        dynamicElements.push(newElem);
        renderDynamicOverlay();
        selectDynamicElement(id);
        saveHistoryState();
        showToast(`${isGif ? 'GIF' : 'Imagen'} ${name} añadido al lienzo`);
    }

    function deleteSelected() {
        if (!selectedElementId) return;
        const dynIndex = dynamicElements.findIndex(e => e.id === selectedElementId);
        if (dynIndex !== -1) {
            dynamicElements.splice(dynIndex, 1);
            deselectAll();
            renderDynamicOverlay();
            saveHistoryState();
            showToast("Elemento eliminado");
            return;
        }

        const scanned = scannedElements.find(i => i.id === selectedElementId);
        if (scanned && scanned.node) {
            scanned.node.remove();
            deselectAll();
            scanEditableElements();
            saveHistoryState();
            showToast("Elemento eliminado");
        }
    }

    function duplicateSelected() {
        if (!selectedElementId) return;
        const dyn = dynamicElements.find(e => e.id === selectedElementId);
        if (dyn) {
            const copy = JSON.parse(JSON.stringify(dyn));
            copy.id = 'elem_' + Date.now();
            copy.x += 15;
            copy.y += 15;
            dynamicElements.push(copy);
            renderDynamicOverlay();
            selectDynamicElement(copy.id);
            saveHistoryState();
            showToast("Elemento duplicado");
            return;
        }

        const scanned = scannedElements.find(i => i.id === selectedElementId);
        if (scanned && scanned.node) {
            const clone = scanned.node.cloneNode(true);
            const newId = 'elem_' + Date.now();
            clone.setAttribute('data-editor-id', newId);
            clone.style.left = `${(parseInt(clone.style.left) || 50) + 15}px`;
            clone.style.top = `${(parseInt(clone.style.top) || 50) + 15}px`;
            scanned.node.parentNode.appendChild(clone);

            scanEditableElements();
            selectElementByEditorId(newId);
            saveHistoryState();
            showToast("Elemento duplicado");
        }
    }

    function renderGalleryDOM(galleryList) {
        const galleryGrid = document.getElementById('gallery-grid');
        galleryGrid.innerHTML = '';
        galleryItemsContainer.innerHTML = '';

        galleryList.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-editor-id', `gallery-item-${index}`);
            item.innerHTML = `<img src="${photo.url}" alt="${photo.caption || 'Foto'}">`;
            galleryGrid.appendChild(item);
        });
    }

    // HISTORIAL Y PERSISTENCIA (50 ESTADOS)
    function saveHistoryState() {
        syncDOMToConfig();
        activeConfig.dynamicElements = dynamicElements;
        if (historyIndex < historyStack.length - 1) historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push(JSON.stringify(activeConfig));
        if (historyStack.length > MAX_HISTORY) historyStack.shift();
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
        showToast("Diseño guardado localmente");
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
        showToast("Configuración JSON exportada");
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
                    showToast("Configuración importada");
                } catch(err) {
                    alert("Error al importar JSON.");
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

    function fitZoomToViewport() { setZoom(0.85); }

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
