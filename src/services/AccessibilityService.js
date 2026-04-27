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

    // No leer si se clica en un botón interactivo, enlace o input
    const tag = event.target.tagName.toLowerCase();
    if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) return;
    if (event.target.closest('button, a, input, select, textarea, .btn')) return;

    const text = event.target.innerText?.trim();
    if (!text || text.length < 3) return;

    // Cancelar lectura previa
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
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
}

// ─── Zoom de Texto ──────────────────────────────────────────

function cycleTextZoom() {
    textZoomLevel = (textZoomLevel + 1) % ZOOM_LEVELS.length;
    document.documentElement.style.fontSize = ZOOM_LEVELS[textZoomLevel];

    const labels = ['Normal', 'Grande (115%)', 'Muy grande (130%)'];
    showNotification(`Tamaño de texto: ${labels[textZoomLevel]}`);
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
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '99999',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            fontFamily: "'Poppins', sans-serif"
        });
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
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

    // Alto contraste — buscamos por contenido de texto
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const text = item.textContent.trim().toLowerCase();
        if (text.includes('alto contraste')) {
            item.addEventListener('click', (e) => { e.preventDefault(); toggleHighContrast(); });
        }
        if (text.includes('aumentar texto')) {
            item.addEventListener('click', (e) => { e.preventDefault(); cycleTextZoom(); });
        }
    });
}
