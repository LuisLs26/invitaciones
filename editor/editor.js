/**
 * MOTOR DEL EDITOR VISUAL PROFESIONAL TIPO CANVA (VANILLA JS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener ID de la URL (?id=demo, ?id=cliente1, ?id=cumpleanos)
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('id') || 'demo';

    // 2. Elementos principales del DOM
    const canvasStage = document.getElementById('canvas-stage');
    const canvasFrame = document.getElementById('canvas-frame');
    const canvasRoot = document.getElementById('canvas-root');
    const selectionBox = document.getElementById('selection-box');
    const rotHandle = document.querySelector('.rot-handle');
    const snapGuideH = document.getElementById('snap-guide-h');
    const snapGuideV = document.getElementById('snap-guide-v');

    // Headers & Buttons
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

    // Inputs de Propiedades
    const themePresetSelect = document.getElementById('theme-preset-select');
    const bgColorPicker = document.getElementById('bg-color-picker');
    const canvasTitleInput = document.getElementById('canvas-title-input');

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
    const btnTextBold = document.getElementById('btn-text-bold');
    const btnTextItalic = document.getElementById('btn-text-italic');

    const propComponentGroup = document.getElementById('prop-component-group');
    const compWaFields = document.getElementById('comp-whatsapp-fields');
    const propWaPhone = document.getElementById('prop-wa-phone');
    const propWaMsg = document.getElementById('prop-wa-msg');

    const compMapFields = document.getElementById('comp-map-fields');
    const propMapName = document.getElementById('prop-map-name');
    const propMapAddress = document.getElementById('prop-map-address');

    const compCountdownFields = document.getElementById('comp-countdown-fields');
    const propCdDate = document.getElementById('prop-cd-date');

    const propAnimEntrance = document.getElementById('prop-anim-entrance');
    const propAnimLoop = document.getElementById('prop-anim-loop');

    const btnPropDuplicate = document.getElementById('btn-prop-duplicate');
    const btnPropDelete = document.getElementById('btn-prop-delete');
    const quickDup = document.getElementById('quick-dup');
    const quickDel = document.getElementById('quick-del');

    const layersList = document.getElementById('layers-list');

    // 3. Estado Global del Editor
    let elementsData = []; // Arreglo de objetos de elementos
    let selectedElementId = null;
    let copiedElementData = null;
    let currentZoom = 1;

    // Historial de Undo / Redo
    let historyStack = [];
    let historyIndex = -1;
    const MAX_HISTORY = 30;

    // Estado de Interacción Drag & Transform
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let activeHandle = null;

    let dragStartX = 0;
    let dragStartY = 0;
    let elemStartX = 0;
    let elemStartY = 0;
    let elemStartW = 0;
    let elemStartH = 0;
    let elemStartRot = 0;

    // 4. Inicializar Editor
    initEditor();

    function initEditor() {
        // A. Cargar datos existentes desde localStorage o Config JS
        loadProjectState();

        // B. Inicializar Pestañas del Sidebar
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                tabButtons.forEach(b => b.classList.remove('active'));
                panelSections.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // C. Configurar Zoom
        zoomSelect.addEventListener('change', (e) => setZoom(parseFloat(e.target.value)));
        btnZoomIn.addEventListener('click', () => setZoom(currentZoom + 0.15));
        btnZoomOut.addEventListener('click', () => setZoom(currentZoom - 0.15));
        btnZoomFit.addEventListener('click', fitZoomToViewport);

        // D. Configurar Atajos de Teclado
        setupKeyboardShortcuts();

        // E. Configurar Transformación en Bounding Box
        setupTransformHandles();

        // F. Configurar Botones de Acción
        setupActionButtons();

        // G. Guardar estado inicial en historial
        saveHistoryState();
    }

    // Cargar Estado del Proyecto
    function loadProjectState() {
        const localData = localStorage.getItem(`invitation_design_${designId}`);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                renderFromState(parsed);
                showToast("Diseño cargado desde almacenamiento local");
                return;
            } catch(e) {
                console.error("Error al cargar localStorage, cargando datos por defecto.");
            }
        }

        // Cargar script de configuración como fallback
        const scriptTag = document.createElement('script');
        scriptTag.src = `../configs/${designId}.js`;
        scriptTag.onload = () => {
            if (typeof INVITATION_CONFIG !== 'undefined') {
                importFromConfigObject(INVITATION_CONFIG);
            }
        };
        scriptTag.onerror = () => {
            // Generar lienzo por defecto
            generateDefaultElements();
        };
        document.head.appendChild(scriptTag);
    }

    // Importar desde INVITATION_CONFIG clásico
    function importFromConfigObject(config) {
        canvasFrame.className = `canvas-frame ${config.theme || 'theme-quinceanos'}`;
        canvasTitleInput.value = config.personName || config.title || 'Invitación';

        elementsData = [
            {
                id: 'elem_hero_img',
                type: 'image',
                src: config.heroImage || '../assets/images/xv/hero.svg',
                x: 60, y: 40, w: 270, h: 340, rot: 0, opacity: 1, zIndex: 1,
                animEntrance: 'reveal', animLoop: 'none'
            },
            {
                id: 'elem_title',
                type: 'text',
                content: config.title || 'Mis XV Años',
                x: 45, y: 395, w: 300, h: 50, rot: 0, opacity: 1, zIndex: 2,
                fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#4a3e4e',
                bold: true, align: 'center', animEntrance: 'fadeIn'
            },
            {
                id: 'elem_name',
                type: 'text',
                content: config.personName || 'Ana María',
                x: 35, y: 445, w: 320, h: 60, rot: 0, opacity: 1, zIndex: 3,
                fontFamily: "'Great Vibes', cursive", fontSize: 48, color: '#d4af37',
                bold: false, align: 'center', animEntrance: 'reveal'
            },
            {
                id: 'elem_butterfly',
                type: 'gif',
                src: '../assets/gifs/xv/butterfly.gif',
                name: 'Mariposa Dorada',
                x: 310, y: 410, w: 55, h: 55, rot: 0, opacity: 0.9, zIndex: 4,
                animEntrance: 'fadeIn', animLoop: 'float'
            },
            {
                id: 'elem_sparkle',
                type: 'gif',
                src: '../assets/gifs/xv/sparkles.gif',
                name: 'Destellos Dorados',
                x: 20, y: 40, w: 65, h: 65, rot: 0, opacity: 0.9, zIndex: 5,
                animEntrance: 'fadeIn', animLoop: 'none'
            },
            {
                id: 'elem_rsvp',
                type: 'component',
                componentType: 'whatsapp',
                x: 30, y: 740, w: 330, h: 60, rot: 0, opacity: 1, zIndex: 6,
                waPhone: config.whatsapp || '51900000000',
                waMsg: config.whatsappMessage || 'Hola, quiero confirmar mi asistencia.',
                animEntrance: 'bounceIn', animLoop: 'pulse'
            }
        ];

        renderCanvas();
        updateLayersList();
        saveHistoryState();
    }

    function generateDefaultElements() {
        elementsData = [
            {
                id: 'elem_title',
                type: 'text',
                content: 'Mis XV Años',
                x: 45, y: 150, w: 300, h: 50, rot: 0, opacity: 1, zIndex: 1,
                fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#d4af37',
                bold: true, align: 'center'
            }
        ];
        renderCanvas();
        updateLayersList();
    }

    // Renderizar Canvas desde Estado
    function renderCanvas() {
        canvasRoot.innerHTML = '';

        elementsData.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).forEach(elem => {
            const el = document.createElement('div');
            el.id = elem.id;
            el.className = `canvas-element ${elem.animLoop !== 'none' ? elem.animLoop : ''}`;
            el.style.left = `${elem.x}px`;
            el.style.top = `${elem.y}px`;
            el.style.width = `${elem.w}px`;
            el.style.height = `${elem.h}px`;
            el.style.transform = `rotate(${elem.rot || 0}deg)`;
            el.style.opacity = elem.opacity !== undefined ? elem.opacity : 1;
            el.style.zIndex = elem.zIndex || 1;

            if (elem.type === 'text') {
                el.style.fontFamily = elem.fontFamily || "'Montserrat', sans-serif";
                el.style.fontSize = `${elem.fontSize || 20}px`;
                el.style.color = elem.color || '#333333';
                el.style.fontWeight = elem.bold ? 'bold' : 'normal';
                el.style.fontStyle = elem.italic ? 'italic' : 'normal';
                el.style.textAlign = elem.align || 'center';
                el.style.lineHeight = '1.2';
                el.textContent = elem.content || 'Texto';
            } else if (elem.type === 'image' || elem.type === 'gif') {
                const img = document.createElement('img');
                img.src = elem.src;
                img.alt = elem.name || 'Elemento visual';
                el.appendChild(img);
            } else if (elem.type === 'component') {
                el.innerHTML = renderComponentHTML(elem);
            } else if (elem.type === 'shape') {
                el.style.background = elem.color || '#d4af37';
                if (elem.shape === 'circle') el.style.borderRadius = '50%';
                if (elem.shape === 'line') el.style.height = '2px';
            }

            // Click listener para seleccionar elemento
            el.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                selectElement(elem.id);
                startDrag(e, elem.id);
            });

            el.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                selectElement(elem.id);
                startDrag(e, elem.id);
            }, { passive: false });

            canvasRoot.appendChild(el);
        });

        if (selectedElementId) {
            updateSelectionBox();
        } else {
            selectionBox.style.display = 'none';
        }
    }

    // Renderizar HTML para Componentes Especiales
    function renderComponentHTML(elem) {
        if (elem.componentType === 'whatsapp') {
            return `<div class="btn btn-whatsapp full-w" style="pointer-events:none; height:100%; display:flex; align-items:center; justify-content:center; gap:8px;">
                <span>CONFIRMAR ASISTENCIA</span>
            </div>`;
        } else if (elem.componentType === 'map') {
            return `<div class="glass-box" style="pointer-events:none; padding:15px; text-align:center; height:100%;">
                <div style="font-size:1.5rem;">📍</div>
                <div style="font-weight:700; color:var(--accent-color);">${elem.mapName || 'Lugar del Evento'}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">${elem.mapAddress || 'Dirección'}</div>
            </div>`;
        } else if (elem.componentType === 'countdown') {
            return `<div class="timer-grid" style="pointer-events:none; height:100%;">
                <div class="timer-box glass-box"><span class="timer-number">05</span><span class="timer-label">DÍAS</span></div>
                <div class="timer-box glass-box"><span class="timer-number">12</span><span class="timer-label">HORAS</span></div>
                <div class="timer-box glass-box"><span class="timer-number">30</span><span class="timer-label">MIN</span></div>
                <div class="timer-box glass-box"><span class="timer-number">00</span><span class="timer-label">SEG</span></div>
            </div>`;
        }
        return `<div class="glass-box" style="pointer-events:none; padding:10px; text-align:center;">Componente ${elem.componentType}</div>`;
    }

    // Seleccionar Elemento
    function selectElement(id) {
        selectedElementId = id;
        const elemData = elementsData.find(e => e.id === id);

        if (!elemData) {
            deselectAll();
            return;
        }

        // Resaltar en lista de capas
        updateLayersList();

        // Mostrar Panel de Propiedades de Elemento
        propCanvasPanel.style.display = 'none';
        propElementPanel.style.display = 'block';
        inspectorTitle.textContent = `Propiedades: ${elemData.type.toUpperCase()}`;

        // Rellenar valores en el inspector
        propX.value = Math.round(elemData.x);
        propY.value = Math.round(elemData.y);
        propW.value = Math.round(elemData.w);
        propH.value = Math.round(elemData.h);
        propRot.value = Math.round(elemData.rot || 0);
        propOpacity.value = Math.round((elemData.opacity !== undefined ? elemData.opacity : 1) * 100);

        // Rellenar grupo de texto
        if (elemData.type === 'text') {
            propTextGroup.style.display = 'block';
            propFontFamily.value = elemData.fontFamily || "'Montserrat', sans-serif";
            propFontSize.value = elemData.fontSize || 24;
            propTextColor.value = elemData.color || '#d4af37';
            btnTextBold.classList.toggle('active', !!elemData.bold);
            btnTextItalic.classList.toggle('active', !!elemData.italic);
        } else {
            propTextGroup.style.display = 'none';
        }

        // Rellenar grupo de componentes
        if (elemData.type === 'component') {
            propComponentGroup.style.display = 'block';
            compWaFields.style.display = elemData.componentType === 'whatsapp' ? 'block' : 'none';
            compMapFields.style.display = elemData.componentType === 'map' ? 'block' : 'none';
            compCountdownFields.style.display = elemData.componentType === 'countdown' ? 'block' : 'none';

            if (elemData.componentType === 'whatsapp') {
                propWaPhone.value = elemData.waPhone || '';
                propWaMsg.value = elemData.waMsg || '';
            } else if (elemData.componentType === 'map') {
                propMapName.value = elemData.mapName || '';
                propMapAddress.value = elemData.mapAddress || '';
            }
        } else {
            propComponentGroup.style.display = 'none';
        }

        propAnimEntrance.value = elemData.animEntrance || 'none';
        propAnimLoop.value = elemData.animLoop || 'none';

        updateSelectionBox();
    }

    function deselectAll() {
        selectedElementId = null;
        selectionBox.style.display = 'none';
        propElementPanel.style.display = 'none';
        propCanvasPanel.style.display = 'block';
        inspectorTitle.textContent = 'Propiedades del Lienzo';
        updateLayersList();
    }

    // Actualizar Bounding Box de Selección
    function updateSelectionBox() {
        const elemData = elementsData.find(e => e.id === selectedElementId);
        if (!elemData) {
            selectionBox.style.display = 'none';
            return;
        }

        selectionBox.style.display = 'block';
        selectionBox.style.left = `${elemData.x}px`;
        selectionBox.style.top = `${elemData.y}px`;
        selectionBox.style.width = `${elemData.w}px`;
        selectionBox.style.height = `${elemData.h}px`;
        selectionBox.style.transform = `rotate(${elemData.rot || 0}deg)`;
    }

    // Lógica Drag & Transformación
    function startDrag(e, id) {
        if (isResizing || isRotating) return;
        isDragging = true;
        const elemData = elementsData.find(e => e.id === id);
        const point = getEventPoint(e);

        dragStartX = point.x;
        dragStartY = point.y;
        elemStartX = elemData.x;
        elemStartY = elemData.y;

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

        const elemData = elementsData.find(e => e.id === selectedElementId);
        let newX = elemStartX + dx;
        let newY = elemStartY + dy;

        // Snap Guides (Alineación Magnética Inteligente al centro)
        const frameW = 390;
        const frameH = 844;
        const elemCenterX = newX + elemData.w / 2;
        const elemCenterY = newY + elemData.h / 2;

        snapGuideH.style.display = 'none';
        snapGuideV.style.display = 'none';

        if (Math.abs(elemCenterX - frameW / 2) < 6) {
            newX = frameW / 2 - elemData.w / 2;
            snapGuideV.style.left = `${frameW / 2}px`;
            snapGuideV.style.display = 'block';
        }

        if (Math.abs(elemCenterY - frameH / 2) < 6) {
            newY = frameH / 2 - elemData.h / 2;
            snapGuideH.style.top = `${frameH / 2}px`;
            snapGuideH.style.display = 'block';
        }

        elemData.x = newX;
        elemData.y = newY;

        propX.value = Math.round(newX);
        propY.value = Math.round(newY);

        renderCanvas();
    }

    function onDragEnd() {
        if (isDragging) {
            isDragging = false;
            snapGuideH.style.display = 'none';
            snapGuideV.style.display = 'none';
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', onDragEnd);
            saveHistoryState();
        }
    }

    // Configurar Handles de Redimensionado y Rotación
    function setupTransformHandles() {
        const handles = document.querySelectorAll('.handle');
        handles.forEach(h => {
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
        const elemData = elementsData.find(e => e.id === selectedElementId);
        const point = getEventPoint(e);

        dragStartX = point.x;
        dragStartY = point.y;
        elemStartX = elemData.x;
        elemStartY = elemData.y;
        elemStartW = elemData.w;
        elemStartH = elemData.h;

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e) {
        if (!isResizing || !selectedElementId) return;
        const point = getEventPoint(e);
        const dx = (point.x - dragStartX) / currentZoom;
        const dy = (point.y - dragStartY) / currentZoom;

        const elemData = elementsData.find(e => e.id === selectedElementId);

        if (activeHandle.includes('e')) elemData.w = Math.max(20, elemStartW + dx);
        if (activeHandle.includes('s')) elemData.h = Math.max(20, elemStartH + dy);
        if (activeHandle.includes('w')) {
            const newW = Math.max(20, elemStartW - dx);
            elemData.x = elemStartX + (elemStartW - newW);
            elemData.w = newW;
        }
        if (activeHandle.includes('n')) {
            const newH = Math.max(20, elemStartH - dy);
            elemData.y = elemStartY + (elemStartH - newH);
            elemData.h = newH;
        }

        propW.value = Math.round(elemData.w);
        propH.value = Math.round(elemData.h);
        renderCanvas();
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
        const elemData = elementsData.find(e => e.id === selectedElementId);
        const rect = selectionBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function onRotateMove(evt) {
            const point = getEventPoint(evt);
            const radians = Math.atan2(point.y - centerY, point.x - centerX);
            let degrees = Math.round(radians * (180 / Math.pi)) + 90;
            if (degrees < 0) degrees += 360;

            elemData.rot = degrees;
            propRot.value = degrees;
            renderCanvas();
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

    // Botones de Acción (Añadir Elementos, Duplicar, Eliminar, Guardar)
    function setupActionButtons() {
        // Deseleccionar al hacer clic en fondo del lienzo
        canvasStage.addEventListener('mousedown', (e) => {
            if (e.target === canvasStage || e.target === canvasFrame || e.target === canvasRoot) {
                deselectAll();
            }
        });

        // Eventos Delegados para Añadir Elementos desde la barra izquierda
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            const action = target.getAttribute('data-action');

            if (action === 'add-text') {
                const preset = target.getAttribute('data-preset');
                addTextElement(preset);
            } else if (action === 'add-image') {
                const src = target.getAttribute('data-src');
                addImageElement(src);
            } else if (action === 'add-gif') {
                const src = target.getAttribute('data-src');
                const name = target.getAttribute('data-name');
                addGifElement(src, name);
            } else if (action === 'add-component') {
                const type = target.getAttribute('data-type');
                addComponentElement(type);
            }
        });

        // Subir Imagen Local
        document.getElementById('btn-trigger-upload').addEventListener('click', () => {
            document.getElementById('img-upload-input').click();
        });
        document.getElementById('img-upload-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => addImageElement(evt.target.result);
                reader.readAsDataURL(file);
            }
        });

        // Subir GIF Personalizado
        document.getElementById('btn-trigger-gif-upload').addEventListener('click', () => {
            document.getElementById('gif-upload-input').click();
        });
        document.getElementById('gif-upload-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => addGifElement(evt.target.result, file.name);
                reader.readAsDataURL(file);
            }
        });

        // Duplicar & Eliminar
        btnPropDuplicate.addEventListener('click', duplicateSelectedElement);
        quickDup.addEventListener('click', duplicateSelectedElement);
        btnPropDelete.addEventListener('click', deleteSelectedElement);
        quickDel.addEventListener('click', deleteSelectedElement);

        // Guardar & Exportar/Importar
        btnSave.addEventListener('click', saveProjectState);
        btnExportJson.addEventListener('click', exportProjectJSON);
        btnImportJson.addEventListener('click', () => jsonFileInput.click());
        jsonFileInput.addEventListener('change', importProjectJSON);
        btnPreview.addEventListener('click', () => {
            window.open(`../invitacion/?id=${designId}`, '_blank');
        });

        // Inputs en tiempo real del Inspector
        setupInspectorRealtimeInputs();
    }

    // Configurar Inputs del Inspector en Tiempo Real
    function setupInspectorRealtimeInputs() {
        propX.addEventListener('input', () => updateSelectedProp('x', parseFloat(propX.value) || 0));
        propY.addEventListener('input', () => updateSelectedProp('y', parseFloat(propY.value) || 0));
        propW.addEventListener('input', () => updateSelectedProp('w', parseFloat(propW.value) || 50));
        propH.addEventListener('input', () => updateSelectedProp('h', parseFloat(propH.value) || 50));
        propRot.addEventListener('input', () => updateSelectedProp('rot', parseFloat(propRot.value) || 0));
        propOpacity.addEventListener('input', () => updateSelectedProp('opacity', (parseFloat(propOpacity.value) || 100) / 100));

        propFontFamily.addEventListener('change', () => updateSelectedProp('fontFamily', propFontFamily.value));
        propFontSize.addEventListener('input', () => updateSelectedProp('fontSize', parseFloat(propFontSize.value) || 20));
        propTextColor.addEventListener('input', () => updateSelectedProp('color', propTextColor.value));

        btnTextBold.addEventListener('click', () => {
            const elem = elementsData.find(e => e.id === selectedElementId);
            if (elem) {
                elem.bold = !elem.bold;
                btnTextBold.classList.toggle('active', elem.bold);
                renderCanvas();
                saveHistoryState();
            }
        });

        propAnimEntrance.addEventListener('change', () => updateSelectedProp('animEntrance', propAnimEntrance.value));
        propAnimLoop.addEventListener('change', () => updateSelectedProp('animLoop', propAnimLoop.value));

        themePresetSelect.addEventListener('change', (e) => {
            canvasFrame.className = `canvas-frame ${e.target.value}`;
            saveHistoryState();
        });

        bgColorPicker.addEventListener('input', (e) => {
            canvasFrame.style.backgroundColor = e.target.value;
            saveHistoryState();
        });
    }

    function updateSelectedProp(key, value) {
        if (!selectedElementId) return;
        const elem = elementsData.find(e => e.id === selectedElementId);
        if (elem) {
            elem[key] = value;
            renderCanvas();
        }
    }

    // Funciones para añadir elementos
    function addTextElement(preset) {
        const id = 'text_' + Date.now();
        let content = 'Nuevo Texto';
        let fontSize = 24;
        let fontFamily = "'Montserrat', sans-serif";

        if (preset === 'title') {
            content = 'Mis XV Años';
            fontSize = 34;
            fontFamily = "'Playfair Display', serif";
        } else if (preset === 'subtitle') {
            content = 'Te invitamos a celebrar';
            fontSize = 20;
        } else if (preset === 'quote') {
            content = '“Un día inolvidable para compartir con quienes más quiero”';
            fontSize = 18;
            fontFamily = "'Cormorant Garamond', serif";
        }

        const newElem = {
            id, type: 'text', content, x: 45, y: 250, w: 300, h: 50, rot: 0, opacity: 1, zIndex: elementsData.length + 1,
            fontFamily, fontSize, color: '#d4af37', bold: true, align: 'center', animEntrance: 'fadeIn', animLoop: 'none'
        };

        elementsData.push(newElem);
        renderCanvas();
        selectElement(id);
        updateLayersList();
        saveHistoryState();
        showToast("Texto añadido");
    }

    function addImageElement(src) {
        const id = 'img_' + Date.now();
        const newElem = {
            id, type: 'image', src, x: 45, y: 150, w: 300, h: 300, rot: 0, opacity: 1, zIndex: elementsData.length + 1,
            animEntrance: 'reveal', animLoop: 'none'
        };
        elementsData.push(newElem);
        renderCanvas();
        selectElement(id);
        updateLayersList();
        saveHistoryState();
        showToast("Imagen añadida");
    }

    function addGifElement(src, name) {
        const id = 'gif_' + Date.now();
        const newElem = {
            id, type: 'gif', src, name: name || 'GIF Animado', x: 150, y: 200, w: 90, h: 90, rot: 0, opacity: 1, zIndex: elementsData.length + 1,
            animEntrance: 'fadeIn', animLoop: 'none'
        };
        elementsData.push(newElem);
        renderCanvas();
        selectElement(id);
        updateLayersList();
        saveHistoryState();
        showToast(`GIF ${name || ''} añadido`);
    }

    function addComponentElement(compType) {
        const id = 'comp_' + Date.now();
        const newElem = {
            id, type: 'component', componentType: compType, x: 30, y: 600, w: 330, h: 60, rot: 0, opacity: 1, zIndex: elementsData.length + 1,
            animEntrance: 'reveal', animLoop: 'none'
        };
        elementsData.push(newElem);
        renderCanvas();
        selectElement(id);
        updateLayersList();
        saveHistoryState();
        showToast(`Componente ${compType} añadido`);
    }

    function duplicateSelectedElement() {
        if (!selectedElementId) return;
        const elem = elementsData.find(e => e.id === selectedElementId);
        if (!elem) return;

        const copy = JSON.parse(JSON.stringify(elem));
        copy.id = 'elem_' + Date.now();
        copy.x += 15;
        copy.y += 15;
        copy.zIndex = elementsData.length + 1;

        elementsData.push(copy);
        renderCanvas();
        selectElement(copy.id);
        updateLayersList();
        saveHistoryState();
        showToast("Elemento duplicado");
    }

    function deleteSelectedElement() {
        if (!selectedElementId) return;
        elementsData = elementsData.filter(e => e.id !== selectedElementId);
        deselectAll();
        renderCanvas();
        updateLayersList();
        saveHistoryState();
        showToast("Elemento eliminado");
    }

    // Administrador de Capas
    function updateLayersList() {
        layersList.innerHTML = '';
        const sorted = [...elementsData].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

        sorted.forEach(elem => {
            const li = document.createElement('li');
            li.className = `layer-item ${elem.id === selectedElementId ? 'active' : ''}`;
            li.innerHTML = `<span>${elem.name || elem.content || elem.type}</span><small>z:${elem.zIndex}</small>`;
            li.addEventListener('click', () => selectElement(elem.id));
            layersList.appendChild(li);
        });
    }

    // Historial Undo / Redo
    function saveHistoryState() {
        if (historyIndex < historyStack.length - 1) {
            historyStack = historyStack.slice(0, historyIndex + 1);
        }
        historyStack.push(JSON.stringify(elementsData));
        if (historyStack.length > MAX_HISTORY) historyStack.shift();
        historyIndex = historyStack.length - 1;

        btnUndo.disabled = historyIndex <= 0;
        btnRedo.disabled = historyIndex >= historyStack.length - 1;
    }

    btnUndo.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            elementsData = JSON.parse(historyStack[historyIndex]);
            renderCanvas();
            updateLayersList();
            btnUndo.disabled = historyIndex <= 0;
            btnRedo.disabled = historyIndex >= historyStack.length - 1;
        }
    });

    btnRedo.addEventListener('click', () => {
        if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            elementsData = JSON.parse(historyStack[historyIndex]);
            renderCanvas();
            updateLayersList();
            btnUndo.disabled = historyIndex <= 0;
            btnRedo.disabled = historyIndex >= historyStack.length - 1;
        }
    });

    // Guardar en localStorage
    function saveProjectState() {
        const payload = {
            id: designId,
            theme: canvasFrame.className.replace('canvas-frame ', ''),
            bgColor: canvasFrame.style.backgroundColor,
            title: canvasTitleInput.value,
            elements: elementsData
        };
        localStorage.setItem(`invitation_design_${designId}`, JSON.stringify(payload));
        saveStatus.textContent = '🟢 Cambios guardados';
        showToast("Diseño guardado en almacenamiento local");
    }

    function exportProjectJSON() {
        const payload = {
            id: designId,
            theme: canvasFrame.className.replace('canvas-frame ', ''),
            title: canvasTitleInput.value,
            elements: elementsData
        };
        const str = JSON.stringify(payload, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${designId}_diseno.json`;
        a.click();
        showToast("Archivo JSON descargado");
    }

    function importProjectJSON(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    renderFromState(parsed);
                    saveHistoryState();
                    showToast("Diseño importado con éxito");
                } catch(err) {
                    alert("Error al leer el archivo JSON.");
                }
            };
            reader.readAsText(file);
        }
    }

    function renderFromState(state) {
        if (state.theme) canvasFrame.className = `canvas-frame ${state.theme}`;
        if (state.bgColor) canvasFrame.style.backgroundColor = state.bgColor;
        if (state.title) canvasTitleInput.value = state.title;
        if (state.elements) elementsData = state.elements;
        renderCanvas();
        updateLayersList();
    }

    // Zoom Helpers
    function setZoom(val) {
        currentZoom = Math.min(2, Math.max(0.25, val));
        zoomSelect.value = currentZoom;
        canvasStage.style.transform = `scale(${currentZoom})`;
    }

    function fitZoomToViewport() {
        setZoom(0.85);
    }

    // Atajos de Teclado
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                deleteSelectedElement();
            } else if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                btnUndo.click();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                btnRedo.click();
            } else if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                duplicateSelectedElement();
            } else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveProjectState();
            } else if (e.key.startsWith('Arrow') && selectedElementId) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                const elem = elementsData.find(el => el.id === selectedElementId);
                if (elem) {
                    if (e.key === 'ArrowLeft') elem.x -= step;
                    if (e.key === 'ArrowRight') elem.x += step;
                    if (e.key === 'ArrowUp') elem.y -= step;
                    if (e.key === 'ArrowDown') elem.y += step;
                    renderCanvas();
                }
            }
        });
    }

    function getEventPoint(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function showToast(msg) {
        const toast = document.getElementById('editor-toast');
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
});
