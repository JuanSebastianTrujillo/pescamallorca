import { showNotification } from './AccessibilityService.js';

/**
 * VoiceService.js
 * ──────────────
 * Servicio centralizado para el control por voz (STT) y síntesis de voz (TTS).
 * Basado en la Web Speech API.
 */

// ─── Feature Detection ──────────────────────────────────────

export const hasTTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
export const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const hasSTT = !!SpeechRecognition;

// ─── Síntesis de Voz (TTS) ──────────────────────────────────

let currentUtterance = null;

/**
 * Sintetiza texto a voz.
 * @param {string} text - El texto a leer.
 * @param {string} lang - Código de idioma (es-ES, ca-ES, en-GB).
 */
export function speak(text, lang = "es-ES") {
    if (!hasTTS || !text) return;

    // Cancelar cualquier lectura previa para evitar colas infinitas
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Estrategia de selección de voz (preferir local o coincidencia exacta de idioma)
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang === lang && v.localService) ||
        voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
        voices.find(v => v.default);

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
}

/**
 * Detiene la síntesis de voz actual.
 */
export function stopSpeaking() {
    if (hasTTS) {
        speechSynthesis.cancel();
    }
}

// ─── Reproducción de Audio ──────────────────────────────────

let currentAudio = null;

/**
 * Reproduce un archivo de audio.
 * @param {string} audioSrc - La URL del archivo de audio.
 */
export function playAudio(audioSrc) {
    if (!audioSrc) return;

    // Limpiar ruta: quitar / inicial si existe
    const cleanSrc = audioSrc.startsWith('/') ? audioSrc.substring(1) : audioSrc;

    // Detener cualquier audio anterior
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Determine if the source is a base path (without extension) or a direct file
    currentAudio = document.createElement('audio');
    currentAudio.dataset.basePath = cleanSrc;
    
    if (cleanSrc.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        currentAudio.src = cleanSrc;
    } else {
        const sourceMp3 = document.createElement('source');
        sourceMp3.src = `${cleanSrc}.mp3`;
        sourceMp3.type = 'audio/mpeg';
        
        const sourceOgg = document.createElement('source');
        sourceOgg.src = `${cleanSrc}.ogg`;
        sourceOgg.type = 'audio/ogg';
        
        const sourceWav = document.createElement('source');
        sourceWav.src = `${cleanSrc}.wav`;
        sourceWav.type = 'audio/wav';
        
        currentAudio.appendChild(sourceMp3);
        currentAudio.appendChild(sourceOgg);
        currentAudio.appendChild(sourceWav);
    }

    currentAudio.play().catch(err => {
        console.error("Error reproduciendo audio:", err);
    });
}

/**
 * Detiene la reproducción de audio actual.
 */
export function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

/**
 * Devuelve el objeto Audio actual para sincronización externa.
 */
export function getVoiceAudio() {
    return currentAudio;
}

window.getVoiceAudio = getVoiceAudio;

// ─── Reconocimiento de Voz (STT) y Comandos ─────────────────

class VoiceController {
    constructor() {
        if (!hasSTT) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = "es-ES";
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this._active = false;
        this._silenceTimer = null;
        this._lastProcessedIndex = -1;
        this._accumulatedTranscript = "";

        this.onResultCallback = null;
        this.onStatusChange = null;
        this.onErrorCallback = null;

        this._bindEvents();
    }

    _bindEvents() {
        this.recognition.onstart = () => {
            this._active = true;
            this._lastProcessedIndex = -1;
            this._accumulatedTranscript = "";
            if (this.onStatusChange) this.onStatusChange('listening');
        };

        this.recognition.onresult = (e) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    finalTranscript += e.results[i][0].transcript;
                } else {
                    interimTranscript += e.results[i][0].transcript;
                }
            }

            // Si hay algo de texto (interim o final), resetear el timer de silencio
            if (finalTranscript || interimTranscript) {
                this._accumulatedTranscript = finalTranscript || interimTranscript;
                this._resetSilenceTimer();
            }

            if (this.onResultCallback) {
                this.onResultCallback({
                    final: finalTranscript,
                    interim: interimTranscript,
                    accumulated: this._accumulatedTranscript,
                    isFinal: e.results[e.results.length - 1].isFinal
                });
            }
        };

        this.recognition.onerror = (e) => {
            if (e.error === 'no-speech') return; // Ignorar errores de silencio, manejados por nuestro timer
            console.error("Error ASR:", e.error);
            this._active = false;
            if (this.onErrorCallback) this.onErrorCallback(e.error);
            if (this.onStatusChange) this.onStatusChange('error');
        };

        this.recognition.onend = () => {
            // Si el reconocimiento se detiene solo (browser timeout), lo reiniciamos si deberia estar activo
            if (this._active) {
                try {
                    this.recognition.start();
                } catch (err) {
                    this._active = false;
                    if (this.onStatusChange) this.onStatusChange('idle');
                }
            } else {
                if (this.onStatusChange) this.onStatusChange('idle');
            }
        };
    }

    _resetSilenceTimer() {
        if (this._silenceTimer) clearTimeout(this._silenceTimer);
        this._silenceTimer = setTimeout(() => {
            if (this._accumulatedTranscript.trim() && this.onCommandTimeout) {
                this.onCommandTimeout(this._accumulatedTranscript);
                this._accumulatedTranscript = "";
                // Reiniciamos reconocimiento para "limpiar" el buffer interno de resultados
                this.recognition.stop();
            }
        }, 2000); // 2 segundos de silencio para procesar
    }

    start() {
        if (this._active) return;
        try {
            this.recognition.start();
        } catch (err) {
            console.error("Fallo al iniciar reconocimiento:", err);
        }
    }

    stop() {
        this._active = false;
        if (this._silenceTimer) clearTimeout(this._silenceTimer);
        this.recognition.stop();
    }
}

// ─── Detector de Comandos ───────────────────────────────────

function normalizar(texto) {
    return texto
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,;:!?¡¿]/g, "")
        .replace(/\s+/g, " ");
}

/**
 * Procesa un texto reconocido para ejecutar una acción.
 * @param {string} transcript - El texto final del usuario.
 * @param {object} appState - Acceso a funciones de la app (opcional si usamos window).
 */
export function processCommand(transcript) {
    const text = normalizar(transcript);
    console.log("Procesando comando:", text);

    // 1. Comandos de Navegación "Ir a..."
    if (text.startsWith("ir a") || text.startsWith("navegar a") || text === "ver peces" || text === "ver zonas" || text === "ver mapa" || text.includes("rampas") || text.includes("normativa") || text.includes("autores") || text.includes("contacto")) {
        if (text.includes("peces") || text.includes("especies") || text.includes("pecedex")) {
            window.location.hash = "especies";
            showNotification("Navegando a especies...");
            return "Navegando a la sección de especies";
        }
        if (text.includes("zonas") || text.includes("spots") || text.includes("lugares")) {
            window.location.hash = "zonas";
            showNotification("Navegando a zonas...");
            return "Navegando a zonas de pesca";
        }
        if (text.includes("mapa") || text.includes("cartografia")) {
            window.location.hash = "mapa";
            showNotification("Navegando al mapa...");
            return "Navegando al mapa";
        }
        if (text.includes("tiendas") || text.includes("comercios")) {
            window.location.hash = "tiendas";
            showNotification("Navegando a tiendas...");
            return "Navegando a tiendas";
        }
        if (text.includes("rampas") || text.includes("botadura")) {
            window.location.hash = "rampas";
            showNotification("Navegando a rampas...");
            return "Navegando a rampas";
        }
        if (text.includes("normativa") || text.includes("reglas") || text.includes("normas")) {
            window.location.hash = "normativa";
            showNotification("Navegando a normativa...");
            return "Navegando a normativa";
        }
        if (text.includes("autores") || text.includes("quienes somos") || text.includes("equipo")) {
            window.location.hash = "autores";
            showNotification("Navegando a autores...");
            return "Navegando a autores";
        }
        if (text.includes("contacto") || text.includes("ayuda fisica") || text.includes("soporte")) {
            window.location.hash = "contacto";
            showNotification("Navegando a contacto...");
            return "Navegando a contacto";
        }
        if (text.includes("tiempo") || text.includes("clima") || text.includes("meteo")) {
            window.location.hash = "meteo";
            showNotification("Navegando al tiempo...");
            return "Navegando al tiempo";
        }
        if (text.includes("quiz") || text.includes("juego") || text.includes("cuestionario")) {
            window.location.hash = "quiz";
            showNotification("Abriendo el quiz...");
            return "Abriendo el quiz";
        }
    }

    // 2. Comandos de Búsqueda y Apertura

    // 2.1 Búsqueda General (Ej: "buscar dorada")
    const searchMatch = text.match(/^(?:busca|buscar|encuentra|localiza)\s+(.+)$/);
    if (searchMatch && searchMatch[1]) {
        const query = searchMatch[1];
        const searchInput = document.getElementById('filter-text');
        if (searchInput) {
            searchInput.value = query;
            searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
            window.location.hash = "especies";
            showNotification(`Buscando: ${query}`);
            return `Buscando ${query}`;
        }
    }

    // 2.2 Ver Ficha o Zona (Ej: "ver dorada", "ver cala figuera")
    if (text.startsWith("ver ") || text.startsWith("abrir ")) {
        const query = text.replace(/ver |abrir |ficha de |zona /g, "").trim();
        if (query) {
            // Intentar abrir pez
            const isFish = window.globalSpeciesList?.some(s =>
                normalizar(s.name).includes(normalizar(query)) ||
                normalizar(s.alternateName || '').includes(normalizar(query))
            );

            if (isFish) {
                window.openSpeciesModalByName(query);
                showNotification(`Abriendo ficha de ${query}`);
                return `Abriendo ficha de ${query}`;
            }

            // Intentar abrir zona
            const isSpot = window.globalZonesData?.some(z => {
                const zName = normalizar(z.name);
                const qName = normalizar(query);
                return zName.includes(qName) || qName.includes(zName);
            });

            if (isSpot) {
                window.openSpotModalByName(query);
                showNotification(`Abriendo zona ${query}`);
                return `Abriendo zona ${query}`;
            }

            // Intentar abrir tienda
            const isShop = window.currentShopsData?.some(s => {
                const sName = normalizar(s.name);
                const qName = normalizar(query);
                return sName.includes(qName) || qName.includes(sName);
            });

            if (isShop) {
                window.openShopModalByName(query);
                showNotification(`Abriendo tienda ${query}`);
                return `Abriendo tienda ${query}`;
            }

            // Intentar abrir rampa
            const isRamp = window.currentRampsData?.some(r => {
                const rName = normalizar(r.name);
                const qName = normalizar(query);
                return rName.includes(qName) || qName.includes(rName);
            });

            if (isRamp) {
                window.openRampModalByName(query);
                showNotification(`Abriendo rampa ${query}`);
                return `Abriendo rampa ${query}`;
            }
        }
    }

    // 2.3 Cerrar Modales
    if (text.includes("cerrar") || text.includes("quitar") || text.includes("salir")) {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const instance = bootstrap.Modal.getInstance(modal);
            if (instance) instance.hide();
        });
        showNotification("Ventana cerrada.");
        return "Cerrando ventanas";
    }

    // 3. Comandos de Control de Voz
    if (text === "parar" || text === "detener" || text === "callate" || text === "silencio") {
        stopSpeaking();
        stopAudio();
        showNotification("Audio detenido.");
        return "Lectura y audio detenidos";
    }

    // 4. Comando para reproducir sonido de pez
    const soundMatch = text.match(/^(?:reproduce|reproducir|suena|sonido|pon|ponme|escuchar)\s+(?:el\s+)?(?:sonido\s+)?(?:de\s+)?(?:la\s+|el\s+)?(.+)$/);
    if (soundMatch && soundMatch[1]) {
        const fishName = normalizar(soundMatch[1]);
        const species = window.globalSpeciesList?.find(s =>
            normalizar(s.name).includes(fishName) ||
            normalizar(s.alternateName || '').includes(fishName)
        );
        if (species && species.audio) {
            playAudio(species.audio);
            showNotification(`Reproduciendo sonido de ${species.name}`);
            return `Reproduciendo sonido de ${species.name}`;
        } else {
            const errorMsg = `No encontré el sonido para ${fishName}`;
            showNotification(errorMsg);
            return errorMsg;
        }
    }

    // 5. Comandos de Accesibilidad
    if (text.includes("alto contraste") || text.includes("modo accesible")) {
        const accBtn = document.getElementById('contrast-toggle-desktop') || document.getElementById('contrast-toggle-mobile');
        if (accBtn) {
            accBtn.click();
            return "Cambiando modo de contraste";
        }
    }

    // 6. Comando de Ayuda
    if (text.includes("ayuda") || text.includes("que puedo decir") || text.includes("opciones")) {
        window.closeMobileMenu();
        const helpModalEl = document.getElementById('voiceHelpModal');
        if (helpModalEl) {
            const instance = bootstrap.Modal.getInstance(helpModalEl) || new bootstrap.Modal(helpModalEl);
            instance.show();
            return "Mostrando panel de ayuda";
        }
    }

    return null;
}

// Exportar instancia única del controlador
export const voiceController = hasSTT ? new VoiceController() : null;
