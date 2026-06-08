/**
 * AccessibilityService.js
 * ───────────────────────
 * Implementa las funcionalidades de accesibilidad del header:
 *   - Lectura por voz (TTS) usando Web Speech API nativa
 *   - Alto contraste (toggle de clase CSS en body)
 *   - Aumentar texto (ciclo de tamaños de fuente)
 *
 * Principios aplicados:
 *   - SRP: encapsula toda la lógica de accesibilidad.
 *   - Observer: escucha clics de botones sin acoplar al componente Header.
 */

// ─── Estado ─────────────────────────────────────────────────

let ttsActive = false;
let highContrastActive = false;
let textZoomLevel = 0; // 0 = normal, 1 = grande, 2 = muy grande

const ZOOM_LEVELS = ['100%', '115%', '130%'];

const t = (key, defaultValue) => {
    return window._i18n ? window._i18n.t(key, { defaultValue }) : (defaultValue || key);
};

// ─── TTS (Text-to-Speech) ───────────────────────────────────

function toggleTTS() {
    if (!('speechSynthesis' in window)) {
        alert('Tu navegador no soporta la lectura por voz.');
        return;
    }

    ttsActive = !ttsActive;

    if (ttsActive) {
        // Activar: al hacer click en cualquier texto de sección, lo lee
        document.addEventListener('click', handleTTSClick);
        showNotification(t('tts_enabled', 'Lectura por voz activada. Haz clic en cualquier texto para escucharlo.'));
    } else {
        // Desactivar
        window.speechSynthesis.cancel();
        document.removeEventListener('click', handleTTSClick);
        showNotification(t('tts_disabled', 'Lectura por voz desactivada.'));
    }

    // Actualizar estado visual de los botones
    updateTTSButtons();
}

function handleTTSClick(event) {
    if (!ttsActive) return;

    const target = event.target;
    if (target.closest('#tts-toggle-desktop, #tts-toggle-mobile, #contrast-toggle-desktop, #contrast-toggle-mobile, #zoom-toggle-desktop, #zoom-toggle-mobile')) return;

    const text = getTTSReadableText(target)?.trim();
    if (!text || text.length < 2) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
}

function getTTSReadableText(element) {
    if (!element) return '';

    const interactive = element.closest('button, a, select, input, textarea, label, option');
    const target = interactive || element;
    const tag = target.tagName.toLowerCase();

    if (tag === 'input') {
        return target.value || target.placeholder || target.getAttribute('aria-label') || target.name || target.id || '';
    }

    if (tag === 'select') {
        return target.selectedOptions?.[0]?.text || target.getAttribute('aria-label') || target.innerText || '';
    }

    if (tag === 'option') {
        return target.innerText || target.value || '';
    }

    if (tag === 'textarea') {
        return target.value || target.placeholder || target.getAttribute('aria-label') || '';
    }

    if (tag === 'img') {
        return target.alt || target.getAttribute('aria-label') || target.getAttribute('title') || '';
    }

    const buttonText = target.innerText || target.getAttribute('aria-label') || target.getAttribute('title');
    if (buttonText && buttonText.trim().length > 0) return buttonText;

    const label = target.closest('label');
    if (label) return label.innerText || '';

    if (target.hasAttribute('aria-label')) return target.getAttribute('aria-label');
    if (target.hasAttribute('aria-labelledby')) {
        const labelled = document.getElementById(target.getAttribute('aria-labelledby'));
        return labelled?.innerText || '';
    }

    return target.innerText || '';
}

function updateTTSButtons() {
    const buttons = [
        document.getElementById('tts-toggle-desktop'),
        document.getElementById('tts-toggle-mobile')
    ];

    buttons.forEach(btn => {
        if (!btn) return;
        if (ttsActive) {
            btn.innerHTML = `<i class="bi bi-volume-mute-fill me-2 text-danger"></i> <span data-i18n="tts_off">${t('tts_off', 'Desactivar voz')}</span>`;
        } else {
            btn.innerHTML = `<i class="bi bi-volume-up-fill me-2 text-primary"></i> <span data-i18n="tts">${t('tts', 'Lectura por voz')}</span>`;
        }
    });
}

function updateHighContrastButtons() {
    const buttons = [
        document.getElementById('contrast-toggle-desktop'),
        document.getElementById('contrast-toggle-mobile')
    ];

    buttons.forEach(btn => {
        if (!btn) return;
        if (highContrastActive) {
            btn.innerHTML = `<i class="bi bi-circle-half me-2 text-danger"></i> <span data-i18n="contrast_normal">${t('contrast_normal', 'Contraste normal')}</span>`;
        } else {
            btn.innerHTML = `<i class="bi bi-circle-half me-2 text-primary"></i> <span data-i18n="high_contrast">${t('high_contrast', 'Alto contraste')}</span>`;
        }
    });
}

function updateTextZoomButtons() {
    const buttons = [
        document.getElementById('zoom-toggle-desktop'),
        document.getElementById('zoom-toggle-mobile')
    ];

    buttons.forEach(btn => {
        if (!btn) return;
        if (textZoomLevel === 2) {
            btn.innerHTML = `<i class="bi bi-zoom-out me-2 text-danger"></i> <span data-i18n="reduce_text">${t('reduce_text', 'Reducir texto')}</span>`;
        } else {
            btn.innerHTML = `<i class="bi bi-zoom-in me-2 text-primary"></i> <span data-i18n="increase_text">${t('increase_text', 'Aumentar texto')}</span>`;
        }
    });
}

// ─── Gestión de Foco en Modales ───────────────────────────

/**
 * Atrapa el foco dentro de un contenedor modal y maneja navegación por teclado.
 * @param {HTMLElement} modal - El elemento modal
 * @param {HTMLElement} triggerElement - Elemento que abrió el modal (para devolver foco)
 */
export function trapFocusInModal(modal, triggerElement) {
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Enfocar primer elemento cuando se abre el modal
    if (firstElement) {
        setTimeout(() => firstElement.focus(), 100); // Pequeño delay para asegurar que el modal esté visible
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab: ir al último elemento si estamos en el primero
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                // Tab: ir al primero si estamos en el último
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
        if (e.key === 'Escape') {
            // Cerrar modal con Escape
            const closeBtn = modal.querySelector('[data-bs-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
        }
    };

    modal.addEventListener('keydown', handleKeyDown);

    // Limpiar event listeners cuando se cierre el modal
    bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
    modal.addEventListener('hidden.bs.modal', () => {
        modal.removeEventListener('keydown', handleKeyDown);
        // Devolver foco al elemento que abrió el modal
        if (triggerElement) {
            triggerElement.focus();
        }
    });
}

/**
 * Hace que un elemento sea focalizable si no lo es.
 * @param {HTMLElement} element - Elemento a hacer focalizable
 */
export function makeFocusable(element) {
    if (!element) return;
    if (!element.hasAttribute('tabindex') && !['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase())) {
        element.setAttribute('tabindex', '0');
    }

    // Añadir activación por teclado (Enter / Space) para elementos focalizables no nativos
    const keyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click && element.click();
        }
    };

    // Evitar añadir múltiples listeners
    if (!element.__a11y_key_attached) {
        element.addEventListener('keydown', keyHandler);
        element.__a11y_key_attached = true;
    }
}

// ─── Indicadores de Foco Visibles ───────────────────────────

function ensureFocusIndicators() {
    if (!document.getElementById('focus-indicator-styles')) {
        const style = document.createElement('style');
        style.id = 'focus-indicator-styles';
        style.textContent = `
            /* Indicadores de foco mejorados para accesibilidad */
            *:focus {
                outline: 3px solid #4281A4 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 1px #ffffff !important;
            }
            
            /* Para alto contraste */
            body[data-high-contrast="true"] *:focus {
                outline: 3px solid #ffff00 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 2px #000000 !important;
            }
            
            /* Evitar outline en elementos que no deben tenerlo */
            button:focus,
            a:focus,
            input:focus,
            select:focus,
            textarea:focus {
                /* Mantener el outline definido arriba */
            }
        `;
        document.head.appendChild(style);
    }
}

// ─── Alto Contraste Mejorado ───────────────────────────────

function toggleHighContrast() {
    highContrastActive = !highContrastActive;
    const body = document.body;

    if (highContrastActive) {
        body.setAttribute('data-high-contrast', 'true');
        // Inyectar estilos de alto contraste mejorados si no existen
        if (!document.getElementById('high-contrast-styles')) {
            const style = document.createElement('style');
            style.id = 'high-contrast-styles';
            style.textContent = `
                /* Alto contraste mejorado: más sutil pero efectivo */
                body[data-high-contrast="true"] {
                    background-color: #ffffff !important;
                }

                /* Mejorar contraste en texto específicamente */
                body[data-high-contrast="true"] h1,
                body[data-high-contrast="true"] h2,
                body[data-high-contrast="true"] h3,
                body[data-high-contrast="true"] h4,
                body[data-high-contrast="true"] h5,
                body[data-high-contrast="true"] h6 {
                    color: #000000 !important;
                    font-weight: 700 !important;
                }

                /* Ocultar nombre científico en alto contraste por petición del usuario */
                body[data-high-contrast="true"] #speciesModalScientific {
                    visibility: hidden !important;
                }

                body[data-high-contrast="true"] p,
                body[data-high-contrast="true"] span,
                body[data-high-contrast="true"] div {
                    color: #1a1a1a !important;
                }

                /* Botones con mejor contraste */
                body[data-high-contrast="true"] .btn-primary {
                    background-color: #0066cc !important;
                    color: #ffffff !important;
                    border: 2px solid #004499 !important;
                }

                body[data-high-contrast="true"] .btn-outline-light {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border: 2px solid #000000 !important;
                }

                /* Fondos de tarjetas */
                body[data-high-contrast="true"] .card {
                    background-color: #f8f8f8 !important;
                    border: 2px solid #cccccc !important;
                }

                /* Modales */
                body[data-high-contrast="true"] .modal-content {
                    background-color: #ffffff !important;
                    border: 3px solid #000000 !important;
                }

                body[data-high-contrast="true"] .modal-header {
                    background-color: #e0e0e0 !important;
                    border-bottom: 2px solid #000000 !important;
                }

                /* Asegurar que el fondo del modal sea opaco y con buen contraste */
                body[data-high-contrast="true"] .modal-backdrop {
                    background-color: rgba(0, 0, 0, 0.9) !important;
                    opacity: 1 !important;
                }


                /* Formularios */
                body[data-high-contrast="true"] .form-control {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border: 2px solid #666666 !important;
                }

                body[data-high-contrast="true"] .form-control:focus {
                    border-color: #0066cc !important;
                    box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25) !important;
                }

                /* Navegación */
                body[data-high-contrast="true"] .navbar {
                    background-color: #ffffff !important;
                    border-bottom: 2px solid #000000 !important;
                }

                /* Imágenes con ajuste sutil */
                body[data-high-contrast="true"] img {
                    filter: contrast(1.1) brightness(1.05) !important;
                }
            `;
            document.head.appendChild(style);

        }
        showNotification(t('contrast_enabled', 'Alto contraste activado.'));
    } else {
        body.removeAttribute('data-high-contrast');
        showNotification(t('contrast_disabled', 'Alto contraste desactivado.'));
    }

    // Actualizar estado visual de los botones
    updateHighContrastButtons();
}

// ─── Zoom de Texto ──────────────────────────────────────────

function cycleTextZoom() {
    textZoomLevel = (textZoomLevel + 1) % ZOOM_LEVELS.length;
    document.documentElement.style.fontSize = ZOOM_LEVELS[textZoomLevel];

    const labels = [
        t('text_zoom_normal', 'Tamaño de texto: Normal'),
        t('text_zoom_large', 'Tamaño de texto: Grande (115%)'),
        t('text_zoom_xlarge', 'Tamaño de texto: Muy grande (130%)')
    ];
    showNotification(labels[textZoomLevel]);

    // Actualizar estado visual de los botones
    updateTextZoomButtons();
}

// ─── Notificación toast rápida ──────────────────────────────

/**
 * Muestra una notificación tipo toast y la lee si el TTS está activo.
 * @param {string} message - Mensaje a mostrar
 */
export function showNotification(message) {
    // Reutilizar o crear un toast simple
    let toast = document.getElementById('a11y-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'a11y-toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    // Estilos base
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: '99999',
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        fontFamily: "'Poppins', sans-serif"
    });

    // Estilos según alto contraste
    if (highContrastActive) {
        Object.assign(toast.style, {
            background: 'white',
            color: 'black',
            border: '2px solid black'
        });
    } else {
        Object.assign(toast.style, {
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            border: 'none'
        });
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);

    // Leer el mensaje con TTS si está activo
    if (ttsActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

// ─── Inicialización Pública ─────────────────────────────────

/**
 * Conecta los event handlers de accesibilidad a los botones del header.
 * Se llama una vez después del renderizado del DOM.
 */
export function initAccessibility() {
    // Asegurar indicadores de foco visibles
    ensureFocusIndicators();

    // TTS buttons (desktop + mobile)
    const ttsDesktop = document.getElementById('tts-toggle-desktop');
    const ttsMobile  = document.getElementById('tts-toggle-mobile');
    if (ttsDesktop) ttsDesktop.addEventListener('click', (e) => { e.preventDefault(); toggleTTS(); });
    if (ttsMobile)  ttsMobile.addEventListener('click',  (e) => { e.preventDefault(); toggleTTS(); });

    // Alto contraste buttons
    const contrastDesktop = document.getElementById('contrast-toggle-desktop');
    const contrastMobile = document.getElementById('contrast-toggle-mobile');
    if (contrastDesktop) contrastDesktop.addEventListener('click', (e) => { e.preventDefault(); toggleHighContrast(); });
    if (contrastMobile) contrastMobile.addEventListener('click', (e) => { e.preventDefault(); toggleHighContrast(); });

    // Aumentar texto buttons
    const zoomDesktop = document.getElementById('zoom-toggle-desktop');
    const zoomMobile = document.getElementById('zoom-toggle-mobile');
    if (zoomDesktop) zoomDesktop.addEventListener('click', (e) => { e.preventDefault(); cycleTextZoom(); });
    if (zoomMobile) zoomMobile.addEventListener('click', (e) => { e.preventDefault(); cycleTextZoom(); });

    // Inicializar textos de botones
    updateTTSButtons();
    updateHighContrastButtons();
    updateTextZoomButtons();

    // Exponer un refresco de etiquetas para cuando cambie el idioma
    window.updateAccessibilityButtons = () => {
        updateTTSButtons();
        updateHighContrastButtons();
        updateTextZoomButtons();
    };
}

// Añadir manejadores de activación por teclado a elementos con role=button
function upgradeAriaButtons(root = document) {
    const clickableRoles = root.querySelectorAll('[role="button"]');
    clickableRoles.forEach(el => {
        try { makeFocusable(el); } catch { /* no-op */ }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    upgradeAriaButtons(document);
    observeDynamicFocusableButtons();
});

function observeDynamicFocusableButtons() {
    if (!('MutationObserver' in window)) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                if (node.matches('[role="button"]')) {
                    makeFocusable(node);
                }
                node.querySelectorAll && upgradeAriaButtons(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Actualiza el JSON-LD dinámico para contenido específico en SPA.
 * @param {object} data - Objeto JSON-LD a insertar
 */
export function updateJsonLd(data) {
    // Eliminar JSON-LD anterior si existe
    const existingScript = document.getElementById('dynamic-jsonld');
    if (existingScript) {
        existingScript.remove();
    }

    // Crear nuevo script con JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamic-jsonld';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
}
