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
        showNotification('Lectura por voz activada. Haz clic en cualquier texto para escucharlo.');
    } else {
        // Desactivar
        window.speechSynthesis.cancel();
        document.removeEventListener('click', handleTTSClick);
        showNotification('Lectura por voz desactivada.');
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
            btn.innerHTML = '<i class="bi bi-volume-mute-fill me-2 text-danger"></i> Desactivar voz';
        } else {
            btn.innerHTML = '<i class="bi bi-volume-up-fill me-2 text-primary"></i> Lectura por voz';
        }
    });
}

function updateHighContrastButtons() {
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const text = item.textContent.trim().toLowerCase();
        if (text.includes('alto contraste') || text.includes('contraste normal')) {
            if (highContrastActive) {
                item.innerHTML = '<i class="bi bi-circle-half me-2 text-danger"></i> Contraste normal';
            } else {
                item.innerHTML = '<i class="bi bi-circle-half me-2 text-primary"></i> Alto contraste';
            }
        }
    });
}

function updateTextZoomButtons() {
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const text = item.textContent.trim().toLowerCase();
        if (text.includes('aumentar texto') || text.includes('reducir texto')) {
            if (textZoomLevel === 2) {
                item.innerHTML = '<i class="bi bi-zoom-out me-2 text-danger"></i> Reducir texto';
            } else {
                item.innerHTML = '<i class="bi bi-zoom-in me-2 text-primary"></i> Aumentar texto';
            }
        }
    });
}

// ─── Alto Contraste ─────────────────────────────────────────

function toggleHighContrast() {
    highContrastActive = !highContrastActive;
    const body = document.body;

    if (highContrastActive) {
        body.setAttribute('data-high-contrast', 'true');
        // Inyectar estilos de alto contraste si no existen
        if (!document.getElementById('high-contrast-styles')) {
            const style = document.createElement('style');
            style.id = 'high-contrast-styles';
            style.textContent = `
                body[data-high-contrast="true"] {
                    filter: contrast(1.4) !important;
                }
                body[data-high-contrast="true"] img {
                    filter: contrast(0.8) !important;
                }
            `;
            document.head.appendChild(style);
        }
        showNotification('Alto contraste activado.');
    } else {
        body.removeAttribute('data-high-contrast');
        showNotification('Alto contraste desactivado.');
    }

    // Actualizar estado visual de los botones
    updateHighContrastButtons();
}

// ─── Zoom de Texto ──────────────────────────────────────────

function cycleTextZoom() {
    textZoomLevel = (textZoomLevel + 1) % ZOOM_LEVELS.length;
    document.documentElement.style.fontSize = ZOOM_LEVELS[textZoomLevel];

    const labels = ['Normal', 'Grande (115%)', 'Muy grande (130%)'];
    showNotification(`Tamaño de texto: ${labels[textZoomLevel]}`);

    // Actualizar estado visual de los botones
    updateTextZoomButtons();
}

// ─── Notificación toast rápida ──────────────────────────────

function showNotification(message) {
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
