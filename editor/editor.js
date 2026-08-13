/**
 * MOTOR DE EDITOR VISUAL COMPLETO TIPO CANVA (VANILLA JS)
 * Escáner universal de DOM, GIFs animados reales, transformaciones de 8 puntos,
 * sincronización de capas y control limpio de secciones.
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

    const sectionsList = document.getElementById('sections-list');
    const galleryItemsContainer = document.getElementById('editor-gallery-items');
    const layersList = document.getElementById('layers-list');

    // 3. Estado Global
    let activeConfig = {};
    let scannedElements = []; // Lista de todos los elementos registrados
    let selectedEditorId = null;
    let currentZoom = 1;
    let isLockedMap = {}; // Mapa de elementos bloqueados

    // Historial (50 estados)
    let historyStack = [];
    let historyIndex = -1;
    const MAX_HISTORY = 50;

    // PointerEvents & Transform state
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let activeHandle = null;
    let dragStartX = 0, dragStartY = 0;
    let elemStartX = 0, elemStartY = 0, elemStartW = 0, elemStartH = 0;

    // 4. Inicializar Editor
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

        // Setup Events & Shortcuts
        setupKeyboardShortcuts();
        setupActionEvents();
        setupTransformHandles();
    }

    // Cargar Configuración Real (localStorage -> JSON -> Script JS)
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

        // ESCÁNER UNIVERSAL DE DOM (scanEditableElements)
        scanEditableElements();

        // Configurar Edición WYSIWYG Doble Clic
        setupWYSIWYGInlineTextEditing();

        saveHistoryState();
    }

    function setDOMText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // ==========================================================================
    // 1. ESCÁNER UNIVERSAL DE DOM (scanEditableElements)
    // ==========================================================================
    function scanEditableElements() {
        scannedElements = [];
        const container = document.getElementById('editor-invitation-container');
        if (!container) return;

        // Buscar todos los elementos interactivos del DOM
        const nodes = container.querySelectorAll('*');
        let counter = 1;

        nodes.forEach(node => {
            // Ignorar contenedores puramente de estructura sin contenido visual directo
            if (node.children.length > 5 && !node.classList.contains('section-card')) return;

            let editorId = node.getAttribute('data-editor-id');
            if (!editorId) {
                editorId = node.id || `${node.tagName.toLowerCase()}_${counter++}`;
                node.setAttribute('data-editor-id', editorId);
            }

            // Registrar elemento escaneado
            const type = getNodeType(node);
            scannedElements.push({
                id: editorId,
                node: node,
                type: type,
                name: getNodeName(node, editorId)
            });

            // Asignar listeners de interacción
            node.removeEventListener('click', onNodeClick);
            node.addEventListener('click', onNodeClick);
        });

        updateLayersList();
    }

    function getNodeType(node) {
        if (node.tagName === 'IMG') {
            return node.src.endsWith('.gif') ? 'gif' : 'image';
        }
        if (['H1','H2','H3','H4','P','SPAN','A'].includes(node.tagName)) return 'text';
        if (node.classList.contains('section')) return 'section';
        return 'component';
    }

    function getNodeName(node, id) {
        if (node.textContent && node.textContent.length < 35 && node.children.length === 0) {
            return node.textContent.trim();
        }
        return id;
    }

    function onNodeClick(e) {
        e.stopPropagation();
        const editorId = e.currentTarget.getAttribute('data-editor-id');
        selectElementByEditorId(editorId);
    }

    // ==========================================================================
    // 2. SELECCIÓN UNIVERSAL Y BOUNDING BOX
    // ==========================================================================
    function selectElementByEditorId(editorId) {
        selectedEditorId = editorId;
        const scanned = scannedElements.find(item => item.id === editorId);
        if (!scanned) {
            deselectAll();
            return;
        }

        const node = scanned.node;

        // Mostrar Inspector
        propCanvasPanel.style.display = 'none';
        propElementPanel.style.display = 'block';
        inspectorTitle.textContent = `Inspector: ${scanned.type.toUpperCase()}`;
        selectedElemInfo.textContent = `${scanned.name}`;

        // Rellenar valores de transformación
        const rect = node.getBoundingClientRect();
        const frameRect = canvasFrame.getBoundingClientRect();

        propX.value = Math.round((rect.left - frameRect.left) / currentZoom);
        propY.value = Math.round((rect.top - frameRect.top) / currentZoom);
        propW.value = Math.round(rect.width / currentZoom);
        propH.value = Math.round(rect.height / currentZoom);
        propOpacity.value = Math.round((parseFloat(window.getComputedStyle(node).opacity) || 1) * 100);

        // Mostrar u ocultar grupo de texto
        if (scanned.type === 'text') {
            propTextGroup.style.display = 'block';
            const computed = window.getComputedStyle(node);
            propFontSize.value = parseInt(computed.fontSize);
            propFontFamily.value = computed.fontFamily;
            propTextColor.value = rgbToHex(computed.color);
        } else {
            propTextGroup.style.display = 'none';
        }

        // Resaltar Capa
        updateLayersList();

        // Posicionar Bounding Box
        updateSelectionBox();
    }

    function deselectAll() {
        selectedEditorId = null;
        selectionBox.style.display = 'none';
        propElementPanel.style.display = 'none';
        propCanvasPanel.style.display = 'block';
        inspectorTitle.textContent = 'Propiedades del Diseño';
        updateLayersList();
    }

    function updateSelectionBox() {
        if (!selectedEditorId) {
            selectionBox.style.display = 'none';
            return;
        }
        const scanned = scannedElements.find(item => item.id === selectedEditorId);
        if (!scanned || !scanned.node) return;

        const node = scanned.node;
        const rect = node.getBoundingClientRect();
        const frameRect = canvasFrame.getBoundingClientRect();

        selectionBox.style.display = 'block';
        selectionBox.style.left = `${(rect.left - frameRect.left) / currentZoom}px`;
        selectionBox.style.top = `${(rect.top - frameRect.top) / currentZoom}px`;
        selectionBox.style.width = `${rect.width / currentZoom}px`;
        selectionBox.style.height = `${rect.height / currentZoom}px`;

        // Actualizar botón de bloqueo
        const isLocked = !!isLockedMap[selectedEditorId];
        quickLock.textContent = isLocked ? '🔒' : '🔓';
        btnPropLock.textContent = isLocked ? '🔒 Desbloquear Elemento' : '🔓 Bloquear Elemento';
    }

    // ==========================================================================
    // 3. EDICIÓN EN LÍNEA WYSIWYG (DOBLE CLIC)
    // ==========================================================================
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

    // ==========================================================================
    // 4. GESTOR DE SECCIONES (SOLUCIÓN AL BUG DE VISIBILIDAD)
    // ==========================================================================
    function setupSectionManagerEvents() {
        document.querySelectorAll('.btn-sec-act').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const act = btn.getAttribute('data-act');
                const secId = btn.getAttribute('data-sec');
                const targetSec = document.getElementById(secId);
                if (!targetSec) return;

                if (act === 'edit') {
                    // EDITAR: Enfocar sección en el lienzo y resaltar
                    targetSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.querySelectorAll('.section-editing-highlight').forEach(s => s.classList.remove('section-editing-highlight'));
                    targetSec.classList.add('section-editing-highlight');
                    selectElementByEditorId(secId);
                    showToast(`Editando sección ${secId}`);
                } else if (act === 'vis') {
                    // VISIBILIDAD: Conmutación limpia de display:none / display:block sin romper nodos
                    const isHidden = targetSec.style.display === 'none';
                    targetSec.style.display = isHidden ? 'block' : 'none';
                    btn.classList.toggle('off', !isHidden);
                    btn.textContent = !isHidden ? '🙈' : '👁';
                    showToast(`Sección ${secId} ${!isHidden ? 'ocultada' : 'visible'}`);
                    saveHistoryState();
                } else if (act === 'up') {
                    // REORDENAR ARRIBA EN EL DOM
                    if (targetSec.previousElementSibling) {
                        targetSec.parentNode.insertBefore(targetSec, targetSec.previousElementSibling);
                        showToast(`Sección ${secId} movida arriba`);
                        saveHistoryState();
                    }
                } else if (act === 'down') {
                    // REORDENAR ABAJO EN EL DOM
                    if (targetSec.nextElementSibling) {
                        targetSec.parentNode.insertBefore(targetSec.nextElementSibling, targetSec);
                        showToast(`Sección ${secId} movida abajo`);
                        saveHistoryState();
                    }
                }
            });
        });
    }

    // ==========================================================================
    // 5. SINCRONIZACIÓN DE CAPAS BIDIRECCIONAL & BLOQUEO
    // ==========================================================================
    function updateLayersList() {
        layersList.innerHTML = '';
        scannedElements.slice(0, 40).forEach(item => {
            const li = document.createElement('li');
            li.className = `layer-item ${item.id === selectedEditorId ? 'active' : ''}`;
            const isLocked = !!isLockedMap[item.id];
            li.innerHTML = `<span>${item.name}</span><small>${isLocked ? '🔒' : item.type}</small>`;
            li.addEventListener('click', () => selectElementByEditorId(item.id));
            layersList.appendChild(li);
        });
    }

    function toggleLockSelected() {
        if (!selectedEditorId) return;
        isLockedMap[selectedEditorId] = !isLockedMap[selectedEditorId];
        updateSelectionBox();
        updateLayersList();
        showToast(isLockedMap[selectedEditorId] ? "Elemento bloqueado 🔒" : "Elemento desbloqueado 🔓");
    }

    // ==========================================================================
    // 6. MANEJO DE ARCHIVOS E IMÁGENES / GIFS DESDE EL COMPUTADOR
    // ==========================================================================
    function setupActionEvents() {
        setupSectionManagerEvents();

        canvasStage.addEventListener('mousedown', (e) => {
            if (e.target === canvasStage || e.target === canvasFrame) {
                deselectAll();
            }
        });

        // Subir Imagen / GIF desde PC
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

        // Clic en GIFs de Biblioteca
        document.querySelectorAll('[data-action="add-gif"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const name = btn.getAttribute('data-name');
                addMediaElementToCanvas(src, name, true);
            });
        });

        // Clic en Imágenes de Biblioteca
        document.querySelectorAll('[data-action="add-image"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                addMediaElementToCanvas(src, 'Imagen Servidor', false);
            });
        });

        // Botón Bloqueo / Duplicar / Eliminar
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

        // Sincronización en vivo del Inspector
        setupInspectorRealtimeEvents();
    }

    function addMediaElementToCanvas(src, name, isGif) {
        const id = (isGif ? 'gif_' : 'img_') + Date.now();
        const img = document.createElement('img');
        img.src = src;
        img.alt = name;
        img.setAttribute('data-editor-id', id);
        img.className = isGif ? 'gif-decor' : 'hero-image';
        img.style.position = 'absolute';
        img.style.left = '100px';
        img.style.top = '200px';
        img.style.width = '120px';
        img.style.height = '120px';
        img.style.zIndex = '100';

        dynamicOverlay.appendChild(img);
        scanEditableElements();
        selectElementByEditorId(id);
        saveHistoryState();
        showToast(`${isGif ? 'GIF' : 'Imagen'} ${name} añadido al lienzo`);
    }

    function deleteSelected() {
        if (!selectedEditorId) return;
        const scanned = scannedElements.find(i => i.id === selectedEditorId);
        if (scanned && scanned.node) {
            scanned.node.remove();
            deselectAll();
            scanEditableElements();
            saveHistoryState();
            showToast("Elemento eliminado");
        }
    }

    function duplicateSelected() {
        if (!selectedEditorId) return;
        const scanned = scannedElements.find(i => i.id === selectedEditorId);
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

    // ==========================================================================
    // 7. TRANSFORMACIÓN & DRAG & DROP POINTER EVENTS
    // ==========================================================================
    function startDrag(e, id) {
        if (isResizing || isRotating || isLockedMap[id]) return;
        isDragging = true;
        const scanned = scannedElements.find(i => i.id === id);
        if (!scanned) return;

        const point = getEventPoint(e);
        dragStartX = point.x;
        dragStartY = point.y;

        const rect = scanned.node.getBoundingClientRect();
        const frameRect = canvasFrame.getBoundingClientRect();
        elemStartX = (rect.left - frameRect.left) / currentZoom;
        elemStartY = (rect.top - frameRect.top) / currentZoom;

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging || !selectedEditorId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;

        const scanned = scannedElements.find(i => i.id === selectedEditorId);
        if (!scanned || !scanned.node) return;

        scanned.node.style.position = 'absolute';
        scanned.node.style.left = `${elemStartX + dx}px`;
        scanned.node.style.top = `${elemStartY + dy}px`;

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
        if (isLockedMap[selectedEditorId]) return;
        isResizing = true;
        activeHandle = handleType;
        const scanned = scannedElements.find(i => i.id === selectedEditorId);
        const point = getEventPoint(e);

        dragStartX = point.x;
        dragStartY = point.y;

        const rect = scanned.node.getBoundingClientRect();
        elemStartW = rect.width / currentZoom;
        elemStartH = rect.height / currentZoom;

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e) {
        if (!isResizing || !selectedEditorId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;
        const scanned = scannedElements.find(i => i.id === selectedEditorId);
        if (!scanned || !scanned.node) return;

        if (activeHandle.includes('e')) scanned.node.style.width = `${Math.max(20, elemStartW + dx)}px`;
        if (activeHandle.includes('s')) scanned.node.style.height = `${Math.max(20, elemStartH + dy)}px`;

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
        if (isLockedMap[selectedEditorId]) return;
        isRotating = true;
        const scanned = scannedElements.find(i => i.id === selectedEditorId);
        const rect = selectionBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function onRotateMove(evt) {
            const point = getEventPoint(evt);
            const radians = Math.atan2(point.y - centerY, point.x - centerX);
            let degrees = Math.round(radians * (180 / Math.pi)) + 90;
            if (evt.shiftKey) degrees = Math.round(degrees / 15) * 15;

            scanned.node.style.transform = `rotate(${degrees}deg)`;
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

    // Inspector Realtime Events
    function setupInspectorRealtimeEvents() {
        propFontFamily.addEventListener('change', () => {
            const scanned = scannedElements.find(i => i.id === selectedEditorId);
            if (scanned && scanned.node) {
                scanned.node.style.fontFamily = propFontFamily.value;
                saveHistoryState();
            }
        });

        propFontSize.addEventListener('input', () => {
            const scanned = scannedElements.find(i => i.id === selectedEditorId);
            if (scanned && scanned.node) {
                scanned.node.style.fontSize = `${propFontSize.value}px`;
                saveHistoryState();
            }
        });

        propTextColor.addEventListener('input', () => {
            const scanned = scannedElements.find(i => i.id === selectedEditorId);
            if (scanned && scanned.node) {
                scanned.node.style.color = propTextColor.value;
                saveHistoryState();
            }
        });
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

    // ==========================================================================
    // 8. AUTOSAVE, PERSISTENCIA & HISTORIAL (50 ESTADOS)
    // ==========================================================================
    function saveHistoryState() {
        syncDOMToConfig();
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
        localStorage.setItem(`invitation_design_${designId}`, JSON.stringify(activeConfig));
        saveStatus.textContent = '🟢 Cambios guardados';
        showToast("Diseño guardado localmente");
    }

    function exportProjectJSON() {
        syncDOMToConfig();
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
