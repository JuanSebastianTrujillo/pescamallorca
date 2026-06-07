import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { HeroSection } from "./components/HeroSection.js";
import { SpotsSection } from "./components/SpotsSection.js";
import { MapSection, initMapSection } from "./components/MapSection.js";
import { refreshMapTranslations } from "./services/MapService.js";
import { SpeciesSection } from "./components/SpeciesSection.js";
import { RulesSection } from "./components/RulesSection.js";
import { WeatherSection, initWeather } from "./components/WeatherSection.js";
import { RampsSection, initRamps } from "./components/RampsSection.js";
import { AuthorsSection } from "./components/AuthorsSection.js";
import { ContactSection } from "./components/ContactSection.js";
import { QuizSection, initQuiz } from "./components/QuizSection.js";
import { PecedexSection } from "./components/PecedexSection.js";
import "./components/ChatbotWidget.js";
import { AuthService } from "./services/AuthService.js";
import { LoginModal, initLoginModal } from "./components/LoginModal.js";
import { initTheme } from "../assets/js/main.js";
import { initI18n } from "./services/i18n.js";
import { initAccessibility, updateJsonLd, trapFocusInModal } from "./services/AccessibilityService.js";
import { voiceController, processCommand, speak, stopSpeaking, hasSTT, playAudio, stopAudio } from "./services/VoiceService.js";
import { SemanticService } from "./services/SemanticService.js";
import { ImageOptimizationService } from "./services/ImageOptimizationService.js";

import { VoiceHelpModal } from "./components/VoiceHelpModal.js";
import { BeachesSection } from "./components/BeachesSection.js";

const app = document.getElementById('app');

window.closeMobileMenu = () => {
    if (document.body.classList.contains('mobile-nav-active')) {
        const btn = document.querySelector('.mobile-nav-toggle');
        if (btn) btn.click();
    }
};

// Datos globales compartidos entre módulos (mapa, quiz)
window.globalZonesData = [];

const t = (key, defaultValue) => {
    return (window._i18n && typeof window._i18n.t === 'function')
        ? window._i18n.t(key, { defaultValue })
        : (defaultValue || key);
};

function getImageBasePath(imagePath) {
    if (!imagePath) return '';
    let path = imagePath;
    if (path.startsWith('https://www.pescamallorca.online/assets/img/peces/webp/')) {
        path = path.replace('https://www.pescamallorca.online/assets/img/peces/webp/', 'assets/img/peces/todos/');
    } else if (path.startsWith('https://www.pescamallorca.online/assets/img/peces/')) {
        path = path.replace('https://www.pescamallorca.online/assets/img/peces/', 'assets/img/peces/');
    } else if (!path.includes('/') && path.length > 0) {
        path = `assets/img/peces/todos/${path}`;
    }

    path = path.replace(/[-_](?:min|400|800|1200)(?=\.(?:avif|webp|jpg|jpeg|png)$)/gi, '');
    return path.substring(0, path.lastIndexOf('.'));
}

// Inicializar la estructura general renderizando todas las secciones de golpe
// Renderizado completo en un solo paso: evita el CLS del footer que se desplazaba
// cuando las secciones deferred se inyectaban después de la carga inicial.
const renderApp = () => {
    app.innerHTML = `
        ${Header()}
        <main class="main" id="main-content">
            ${HeroSection()}
            ${SpeciesSection()}
            ${PecedexSection()}
            ${SpotsSection()}
            ${RampsSection()}
            ${BeachesSection()}
            ${MapSection()}
            ${WeatherSection()}
            ${QuizSection()}
            ${RulesSection()}
            ${AuthorsSection()}
            ${ContactSection()}
        </main>
        ${Footer()}
        ${VoiceHelpModal()}
        ${LoginModal()}
    `;

    // Inicializar secciones (data fetching async, no bloquea el hilo principal)
    initAfterDeferred();
    window.updateI18nTexts?.();
};

// Función para inicializar todo lo que depende del DOM inyectado después
async function initAfterDeferred() {
    initWeather();
    initRamps();
    initLoginModal();
    initAccessibility();
    initTheme(); // Ahora AOS medirá secciones que ya existen
    initVoiceControl();

    await loadRampsData();
    await loadSpotsData();
    await loadBeachesData();
    await loadSpeciesData();
    await loadMonthSpecies();

    if (window._i18n && typeof window._i18n.on === 'function') {
        window.handleLanguageChange = async () => {
            await loadSpotsData();
            await loadBeachesData();
            await loadSpeciesData();
            await loadMonthSpecies();
            await loadRampsData();
            if (window.currentSpotsList?.length || window.currentRampsData?.length) {
                refreshMapTranslations(window.currentSpotsList || [], window.currentRampsData || []);
            }
        };
    }

    // Listeners globales para apagar multimedia al cerrar modales
    const fishModal = document.getElementById('speciesModal');
    if (fishModal) {
        fishModal.addEventListener('hide.bs.modal', () => {
            // Evento 'hide' dispara ANTES de que se cierre, garantiza limpieza inmediata
            stopSpeaking();
            
            if (window.currentFishAudio) {
                window.currentFishAudio.pause();
                window.currentFishAudio.currentTime = 0;
                window.currentFishAudio = null;
            }

            const videoContainer = fishModal.querySelector('#speciesModalVideo');
            if (videoContainer) {
                const placeholder = videoContainer.querySelector('#videoPlaceholder');
                if (placeholder) {
                    // Pausa TODOS los vídeos e iframes con agresividad
                    placeholder.querySelectorAll('video, iframe').forEach(media => {
                        try {
                            if (media.tagName === 'VIDEO') {
                                media.pause();
                                media.muted = true;
                                media.currentTime = 0;
                                media.removeAttribute('autoplay');
                                media.removeAttribute('src');
                                media.style.display = 'none';
                            } else if (media.tagName === 'IFRAME') {
                                media.src = 'about:blank';
                                media.style.display = 'none';
                            }
                        } catch (error) {
                            console.warn('Error deteniendo media:', error);
                        }
                    });
                    // Limpiar el placeholder completamente
                    placeholder.innerHTML = '';
                }
            }
        });

        fishModal.addEventListener('hidden.bs.modal', () => {
            // Evento 'hidden' dispara DESPUÉS de cerrarse, asegura limpieza final
            SemanticService.clearEntityJsonLd();
            const readBtn = fishModal.querySelector('button[data-speak-modal="species"]');
            if (readBtn) {
                readBtn.innerHTML = '<i class="bi bi-volume-up-fill me-1"></i> Leer ficha';
                readBtn.classList.replace('btn-danger', 'btn-outline-light');
            }
        });
    }

    const spotModal = document.getElementById('spotModal');
    if (spotModal) {
        spotModal.addEventListener('hidden.bs.modal', () => {
            stopSpeaking();
            SemanticService.clearEntityJsonLd(); // Limpiar JSON-LD de entidad
            const readBtn = spotModal.querySelector('button[data-speak-modal="spot"]');
            if (readBtn) {
                readBtn.innerHTML = '<i class="bi bi-volume-up-fill me-1"></i> Leer';
                readBtn.classList.replace('btn-danger', 'btn-outline-light');
            }
        });
    }

    const beachModal = document.getElementById('beachModal');
    if (beachModal) {
        beachModal.addEventListener('hidden.bs.modal', () => {
            stopSpeaking();
            SemanticService.clearEntityJsonLd(); // Limpiar JSON-LD de entidad
            const readBtn = beachModal.querySelector('button[data-speak-modal="beach"]');
            if (readBtn) {
                const label = (window._i18n && window._i18n.t) ? window._i18n.t('beach_modal_read') : 'Leer';
                readBtn.innerHTML = `<i class="bi bi-volume-up-fill me-1"></i> ${label}`;
                readBtn.classList.replace('btn-danger', 'btn-outline-light');
            }
        });
    }

    // Delegación de acciones por atributos data- (click y teclado)
    function attachDataActionListeners() {
        document.addEventListener('click', (ev) => {
            const el = ev.target.closest('[data-open-spot],[data-open-beach],[data-open-species-index],[data-open-species-name],[data-open-species-global],[data-open-ramp],[data-toggle-fish-audio],[data-toggle-catch],[data-auth-logout],[data-close-mobile],[data-mock-login],[data-set-star],[data-speak-modal],[data-stop-voice],[data-pecedex-reset],[data-pecedex-confirm]');
            if (!el) return;
            ev.preventDefault();
            // Open spot
            if (el.dataset.openSpot !== undefined) {
                const idx = Number(el.dataset.openSpot);
                const hide = el.dataset.hideTarget;
                if (hide) bootstrap.Modal.getInstance(document.getElementById(hide))?.hide();
                setTimeout(() => openSpotModal(idx), hide ? 400 : 0);
                return;
            }
            if (el.dataset.stopVoice !== undefined) { window.stopVoiceRecognition(); return; }
            if (el.dataset.pecedexReset !== undefined) { showResetPecedexModal(); return; }
            if (el.dataset.pecedexConfirm !== undefined) { confirmResetPecedex(); return; }
            if (el.dataset.speakModal !== undefined) { window.speakModalDescription(el.dataset.speakModal, el); return; }
            if (el.dataset.openBeach !== undefined) { openBeachModal(Number(el.dataset.openBeach)); return; }
            if (el.dataset.openSpeciesIndex !== undefined) { openSpeciesModal(Number(el.dataset.openSpeciesIndex)); return; }
            if (el.dataset.openSpeciesName) { openSpeciesModalByName(el.dataset.openSpeciesName); return; }
            if (el.dataset.openSpeciesGlobal !== undefined) { openSpeciesModalGlobal(Number(el.dataset.openSpeciesGlobal)); return; }
            if (el.dataset.openRamp !== undefined) { openRampModal(Number(el.dataset.openRamp)); return; }
            if (el.dataset.toggleFishAudio !== undefined) { window.toggleFishAudio(el, el.dataset.audioPath); return; }
            if (el.dataset.toggleCatch !== undefined) { toggleCatchSpecies(ev, el.dataset.toggleCatch); return; }
            if (el.dataset.authLogout !== undefined) { AuthService.logout(); return; }
            if (el.dataset.closeMobile !== undefined) { window.closeMobileMenu(); return; }
            if (el.dataset.mockLogin !== undefined) { window.mockLogin(); bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide(); return; }
            if (el.dataset.setStar !== undefined) { window.setStarRating(ev, el, el.dataset.setStar); return; }
        });

        // Support teclado (Enter / Space) para los elementos con data-attributes
        document.addEventListener('keydown', (ev) => {
            if (ev.key !== 'Enter' && ev.key !== ' ') return;
            const el = ev.target.closest('[data-open-spot],[data-open-beach],[data-open-species-index],[data-open-species-name],[data-open-species-global],[data-open-ramp],[data-toggle-fish-audio],[data-toggle-catch],[data-auth-logout],[data-close-mobile],[data-mock-login],[data-set-star],[data-speak-modal],[data-stop-voice],[data-pecedex-reset],[data-pecedex-confirm]');
            if (!el) return;
            ev.preventDefault();
            el.click();
        });
    }

    attachDataActionListeners();
}

document.addEventListener("DOMContentLoaded", async () => {
    AuthService.init();
    ImageOptimizationService.enableWebPWithFallback();
    ImageOptimizationService.init();
    try {
        await initI18n();
    } catch (e) {
        console.warn('i18n init failed', e);
    }
    renderApp();
    window.updateI18nTexts?.();
    AuthService.updateHeaderUI();
});

// ─── CONTROL DE VOZ ─────────────────────────────────────────

function initVoiceControl() {
    if (!hasSTT || !voiceController) {
        console.warn("Reconocimiento de voz no soportado en este navegador.");
        return;
    }

    const statusContainer = document.getElementById('voice-status-container');
    const statusText = document.getElementById('voice-status-text');

    voiceController.onStatusChange = (status) => {
        if (status === 'listening') {
            statusContainer.classList.remove('d-none');
            statusText.innerText = (window._i18n && window._i18n.t) ? window._i18n.t('voice_listening') : 'Escuchando...';
        } else if (status === 'idle') {
            if (!voiceController._active) {
                statusContainer.classList.add('d-none');
            }
        } else if (status === 'error') {
            statusText.innerText = (window._i18n && window._i18n.t) ? window._i18n.t('voice_error') : 'Error de voz';
            setTimeout(() => { if (!voiceController._active) statusContainer.classList.add('d-none'); }, 3000);
        }
    };

    voiceController.onResultCallback = (result) => {
        statusText.innerText = result.accumulated || result.interim || ((window._i18n && window._i18n.t) ? window._i18n.t('voice_listening') : 'Escuchando...');
    };

    voiceController.onCommandTimeout = (finalTranscript) => {
        statusText.innerText = (window._i18n && window._i18n.t) ? window._i18n.t('voice_processing') : 'Procesando...';
        const feedback = processCommand(finalTranscript);
        if (feedback) {
            statusText.innerText = feedback;
            // Después de procesar, si sigue activo, volver a "Escuchando" tras un momento
            setTimeout(() => {
                if (voiceController._active) statusText.innerText = "Escuchando...";
            }, 2000);
        }
    };

    // Listeners para botones de la UI
    const voiceBtns = ['voice-command-toggle-desktop', 'voice-command-toggle-mobile'];
    voiceBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                voiceController.start();
            });
        }
    });

    window.stopVoiceRecognition = () => voiceController.stop();
}

window.speakText = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
        speak(el.innerText);
    }
};

window.speakModalDescription = (type, btn) => {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (btn) {
            const label = type === 'species'
                ? ((window._i18n && window._i18n.t) ? window._i18n.t('species_modal_read') : 'Leer ficha')
                : (type === 'beach'
                    ? ((window._i18n && window._i18n.t) ? window._i18n.t('beach_modal_read') : 'Leer')
                    : ((window._i18n && window._i18n.t) ? window._i18n.t('spot_modal_read') : 'Leer'));
            btn.innerHTML = `<i class="bi bi-volume-up-fill me-1"></i> ${label}`;
            btn.classList.replace('btn-danger', 'btn-outline-light');
        }
        return;
    }

    let text = "";
    let btnLabel = "";
    if (type === 'species') {
        const name = document.getElementById('speciesModalLabel').innerText;
        const desc = document.getElementById('speciesModalDescription').innerText;
        text = `${name}. ${desc}`;
        btnLabel = "Leer ficha";
    } else if (type === 'spot') {
        const name = document.getElementById('spotModalLabel').innerText;
        const desc = document.getElementById('spotModalDescription').innerText;
        text = `${name}. ${desc}`;
        btnLabel = "Leer";
    } else if (type === 'beach') {
        const name = document.getElementById('beachModalLabel').innerText;
        const desc = document.getElementById('beachModalDescription').innerText;
        text = `${name}. ${desc}`;
        btnLabel = "Leer";
    }

    if (btn) {
        const stopLabel = (window._i18n && window._i18n.t) ? window._i18n.t('voice_stop') : 'Detener';
        btn.innerHTML = `<i class="bi bi-stop-circle-fill me-1"></i> ${stopLabel}`;
        btn.classList.replace('btn-outline-light', 'btn-danger');
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.onend = () => {
        if (btn) {
            const label = type === 'species'
                ? ((window._i18n && window._i18n.t) ? window._i18n.t('species_modal_read') : 'Leer ficha')
                : (type === 'beach'
                    ? ((window._i18n && window._i18n.t) ? window._i18n.t('beach_modal_read') : 'Leer')
                    : ((window._i18n && window._i18n.t) ? window._i18n.t('spot_modal_read') : 'Leer'));
            btn.innerHTML = `<i class="bi bi-volume-up-fill me-1"></i> ${label}`;
            btn.classList.replace('btn-danger', 'btn-outline-light');
        }
    };
    window.speechSynthesis.speak(utterance);
};

window.submitContactForm = async function (event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const lastname = document.getElementById('contact-lastname').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !lastname || !email || !subject || !message) {
        alert((window._i18n && window._i18n.t) ? window._i18n.t('contact_fill_all') : 'Por favor, rellena todos los campos antes de enviar.');
        return;
    }

    const formData = { name, lastname, email, subject, message };
    const responseEl = document.getElementById('contact-response');

    try {
        const response = await fetch('forms/save_contact.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            responseEl.innerText = (window._i18n && window._i18n.t) ? window._i18n.t('contact_sent_success') : '¡Mensaje enviado correctamente! Gracias por contactar con nosotros.';
            responseEl.className = 'text-success mt-3';
            document.getElementById('contact-form').reset();
        } else {
            throw new Error((window._i18n && window._i18n.t) ? window._i18n.t('contact_server_error') : 'Error en el servidor');
        }
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        // Fallback: Si no hay PHP, al menos simulamos el éxito para el usuario
        responseEl.innerText = (window._i18n && window._i18n.t) ? window._i18n.t('contact_sent_local') : '¡Mensaje enviado correctamente! (Modo local)';
        responseEl.className = 'text-info mt-3';
        document.getElementById('contact-form').reset();
    }

    responseEl.style.display = 'inline-block';
    setTimeout(() => { responseEl.style.display = 'none'; }, 5000);
};

async function loadMonthSpecies() {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentLocale = (window._i18n && window._i18n.language) ? window._i18n.language : 'es-ES';
    const currentMonthName = new Date().toLocaleString(currentLocale, { month: 'long' });
    const formattedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

    try {
        const activeLang = (window._i18n && window._i18n.language) ? window._i18n.language.substring(0, 2) : 'es';
        const response = await fetch(`assets/data/especies_${activeLang}.json?v=${new Date().getTime()}`);
        const schema = await response.json();
        const allSpecies = schema['@graph'] || [];

        // Filtrar especies disponibles en el mes actual
        const monthSpecies = allSpecies.filter(species => {
            const monthStart = species.additionalProperty?.find(p => ['Inicio temporada', 'Start of season', 'Inici de temporada', 'Saisonstart'].includes(p.name));
            const monthEnd = species.additionalProperty?.find(p => ['Fin temporada', 'End of season', 'Fi de temporada', 'Saisonende'].includes(p.name));

            if (!monthStart || !monthEnd) return false;

            const startMonth = parseInt(monthStart.value);
            const endMonth = parseInt(monthEnd.value);

            // Si el rango cruza el año (ej: noviembre-mayo)
            if (endMonth < startMonth) {
                return currentMonth >= startMonth || currentMonth <= endMonth;
            } else {
                // Rango normal dentro del mismo año
                return currentMonth >= startMonth && currentMonth <= endMonth;
            }
        });

        if (monthSpecies.length === 0) {
            return; // Sin peces este mes
        }

        const carouselEl = document.getElementById('hero-carousel');
        const indicatorsContainer = document.getElementById('hero-carousel-indicators');
        const carouselInner = document.getElementById('hero-carousel-inner');

        if (!carouselEl || !indicatorsContainer || !carouselInner) {
            return;
        }

        // 1. Destruir la instancia actual del carrusel para evitar bloqueos
        if (window.bootstrap) {
            const currentCarousel = bootstrap.Carousel.getInstance(carouselEl);
            if (currentCarousel) currentCarousel.dispose();
        }

        // 2. Limpiar elementos dinámicos anteriores y el div obsoleto si existe
        carouselInner.querySelectorAll('.dynamic-slide').forEach(el => el.remove());
        const obsoleteContainer = document.getElementById('month-species-container');
        if (obsoleteContainer) obsoleteContainer.remove();
        indicatorsContainer.innerHTML = '';

        // 3. Crear una diapositiva por cada pez del mes
        monthSpecies.forEach((sp) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-item dynamic-slide';
            slide.setAttribute('data-species-name', sp.name);
            const rutaLimpiaSlide = getImageBasePath(sp.image || '');
            slide.innerHTML = `
                <picture style="position: absolute; width: 100%; height: 100%;">
                  <source type="image/avif" srcset="${rutaLimpiaSlide}-400.avif 400w, ${rutaLimpiaSlide}-800.avif 800w" sizes="100vw">
                  <source type="image/webp" srcset="${rutaLimpiaSlide}-400.webp 400w, ${rutaLimpiaSlide}-800.webp 800w" sizes="100vw">
                  <source type="image/jpeg" srcset="${rutaLimpiaSlide}-400.jpg 400w, ${rutaLimpiaSlide}-800.jpg 800w" sizes="100vw">
                  <img src="${rutaLimpiaSlide}-800.jpg" alt="Foto de ${sp.name}" style="position: absolute; width: 100%; height: 100%; object-fit: cover;" loading="eager" decoding="async">
                </picture>
                <div class="carousel-container">
                    <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.8rem, 5vw, 3rem);">${(window._i18n && window._i18n.t) ? window._i18n.t('month_species_title', { month: formattedMonth }) : `Peces del Mes - ${formattedMonth}`}</h2>
                    <h3 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.5rem, 4vw, 2.5rem); margin-top: clamp(3rem, 15vw, 10rem);">${sp.name}</h3>
                    <div style="margin-top: 1.5rem;">
                        <button class="btn btn-primary rounded-pill px-4 py-2 shadow-sm border-0 text-white" data-open-species-name="${sp.name}" style="pointer-events: auto; position: relative; z-index: 50; font-weight: 600;">
                            <i class="bi bi-info-circle me-1"></i><span data-i18n="view_species_sheet">Ver Ficha Técnica</span>
                        </button>
                    </div>
                </div>
            `;
            carouselInner.appendChild(slide);
        });

        const slides = Array.from(carouselInner.querySelectorAll('.carousel-item'));
        let activeIndex = slides.findIndex(s => s.classList.contains('active'));
        
        // Si hemos borrado las diapositivas estáticas y ninguna es 'active', forzamos a que la primera lo sea
        if (activeIndex === -1 && slides.length > 0) {
            slides[0].classList.add('active');
            activeIndex = 0;
        }
        // 4. Listeners accesibles para botones
        carouselInner.querySelectorAll('.dynamic-slide [data-open-species-name]').forEach(btn => {
            const name = btn.getAttribute('data-open-species-name');
            btn.addEventListener('click', () => openSpeciesModalByName(name));
            btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSpeciesModalByName(name); } });
        });



        indicatorsContainer.innerHTML = ''; // Lo limpiamos justo antes de crear para evitar desajustes
        const totalSlides = slides.length;

        for (let i = 0; i < totalSlides; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('data-bs-target', '#hero-carousel');
            btn.setAttribute('data-bs-slide-to', i.toString());
            btn.setAttribute('aria-label', `Ver diapositiva ${i + 1}`);
            if (i === activeIndex) {
                btn.classList.add('active');
                btn.setAttribute('aria-current', 'true');
            }
            indicatorsContainer.appendChild(btn);
        }

        // 6. Reinicializar el carrusel
        if (window.bootstrap) {
            new bootstrap.Carousel(carouselEl, {
                ride: 'carousel',
                interval: 3000,
                pause: 'hover'
            });
        }

    } catch (e) {
        console.error("Error al cargar peces del mes:", e);
    }
}

let currentSpotsList = [];
window.currentSpotsList = [];

async function loadSpotsData() {
    const spotsContainer = document.getElementById('spots-container');
    if (!spotsContainer) return;

    try {
        const activeLang = (window._i18n && window._i18n.language) ? window._i18n.language.substring(0, 2) : 'es';
        const response = await fetch(`assets/data/zonas_${activeLang}.json?v=${new Date().getTime()}`);
        const schema = await response.json();

        // Extraer los spots
        const spots = schema['@graph'].filter(item => item['@type'] === 'Place' && !item.name.includes('Reserva'));

        // Guardamos los spots filtrados en la variable global
        currentSpotsList = spots;
        window.currentSpotsList = spots;
        globalZonesData = spots;

        // Pintamos todas las zonas por primera vez
        renderSpotsCards(currentSpotsList);

        // Inicializar mapa interactivo con los spots cargados
        // (Las rampas se pasan desde su data mock directamente)
        try {
            const rampsForMap = window.currentRampsData || [];
            initMapSection(spots, rampsForMap);
        } catch (mapErr) {
            console.warn('MapSection init deferred or failed:', mapErr);
        }

    } catch (e) {
        console.error("Error al cargar JSON de la zona:", e);
        spotsContainer.innerHTML = '<div class="alert alert-danger">' + ((window._i18n && window._i18n.t) ? window._i18n.t('spots_error_loading') : 'Error cargando información de Spots. Asegúrate de estar usando un servidor local.') + '</div>';
    }
}

window.currentRampsData = [];
async function loadRampsData() {
    try {
        const activeLang = (window._i18n && window._i18n.language) ? window._i18n.language.substring(0, 2) : 'es';
        const response = await fetch(`assets/data/rampas_${activeLang}.json?v=${new Date().getTime()}`);
        const schema = await response.json();

        const ramps = schema['@graph'].filter(item => item['@type'] === 'Place').map((item, index) => {
            const kw = item.keywords || "";
            const isHormigon = kw.toLowerCase().includes('hormigón') || kw.toLowerCase().includes('hormigon');
            const isArena = kw.toLowerCase().includes('arena');
            const isRoca = kw.toLowerCase().includes('roca');
            const type = isHormigon ? 'hormigon' : isArena ? 'arena' : 'roca';

            const isFree = kw.toLowerCase().includes('gratuita') || kw.toLowerCase().includes('free') || kw.toLowerCase().includes('gratuïta') || kw.toLowerCase().includes('kostenlos');
            const isPaid = kw.toLowerCase().includes('pago') || kw.toLowerCase().includes('paid') || kw.toLowerCase().includes('pagament') || kw.toLowerCase().includes('kostenpflichtig');
            const isExclusive = kw.toLowerCase().includes('exclusiva') || kw.toLowerCase().includes('socios');
            const priceTag = isExclusive ? 'Exclusiva Socios' : isPaid ? 'De pago' : 'Gratuita';
            const priceColor = isExclusive ? 'danger' : isPaid ? 'warning' : 'success';

            const suit = kw.includes('remolque') ? (kw.includes('grandes') ? 'Apta remolques grandes' : 'Apta para remolques') : 'Solo Kayaks / Ligero';
            const suitColor = suit.includes('grandes') ? 'primary' : suit.includes('remolque') ? 'success' : 'secondary';

            const descParts = (item.disambiguatingDescription || "").split(/CARACTERÍSTICAS Y BATIMETRÍA:|LOGÍSTICA DE APARCAMIENTO:|TARIFAS Y BUROCRACIA:|SERVICIOS ANEXOS:|AVISOS Y PELIGROS LOCALES:/).map(s => s.trim());

            return {
                id: index,
                name: item.name,
                location: item.address?.addressLocality || "",
                zone: "all",
                type: type,
                typeLabel: kw.split(',')[0] || type,
                priceTag: priceTag,
                priceColor: priceColor,
                suitabilityTag: suit,
                suitabilityColor: suitColor,
                image: Array.isArray(item.image) ? item.image[0] : item.image,
                gallery: Array.isArray(item.image) ? item.image : [item.image],
                draft: descParts[1] || "Ver descripción",
                width: "",
                incline: item.description,
                parkingLogistics: descParts[2] || "",
                tariffs: descParts[3] || "",
                services: descParts[4] || "",
                warnings: descParts[5] || "",
                gps: item.geo ? `${item.geo.latitude}, ${item.geo.longitude}` : "",
                mapsLink: item.hasMap || ""
            };
        });

        window.currentRampsData = ramps;
        if (typeof window.renderRamps === 'function') {
            window.renderRamps();
        }
    } catch (e) {
        console.error("Error loading ramps:", e);
    }
}


// Nueva función exclusiva para pintar tarjetas
function renderSpotsCards(spotsArray) {
    const spotsContainer = document.getElementById('spots-container');
    if (!spotsContainer) return;

    if (window.spotsSwiperInstance) {
        window.spotsSwiperInstance.destroy(true, true);
        window.spotsSwiperInstance = null;
    }

    if (spotsArray.length === 0) {
        spotsContainer.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="bi bi-emoji-frown fs-1"></i>
                <h4 class="mt-3">No hay zonas que coincidan con tu búsqueda</h4>
                <p>Prueba a quitar algún filtro o buscar otra especie.</p>
            </div>`;
        return;
    }

    let htmlCards = '';
    spotsArray.forEach((spot) => {
        const originalIndex = currentSpotsList.indexOf(spot); // Indice para abrir el modal correcto
        const imgSrc = Array.isArray(spot.image) ? spot.image[0] : spot.image;
        const rutaLimpia = imgSrc.substring(0, imgSrc.lastIndexOf('.'));
        htmlCards += `
          <div class="swiper-slide d-flex" style="height:auto;">
            <div class="card h-100 shadow-sm border-0 w-100 spot-card" role="button" tabindex="0" aria-label="Ver detalles de ${spot.name}" data-open-spot="${originalIndex}" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <div class="position-relative">
                <picture>
                  <source
                    type="image/avif"
                    srcset="${rutaLimpia}-400.avif 400w, ${rutaLimpia}-800.avif 800w"
                    sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                  <source
                    type="image/webp"
                    srcset="${rutaLimpia}-400.webp 400w, ${rutaLimpia}-800.webp 800w"
                    sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                  <source
                    type="image/jpeg"
                    srcset="${rutaLimpia}-400.jpg 400w, ${rutaLimpia}-800.jpg 800w"
                    sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                  <img
                    src="${rutaLimpia}-800.jpg"
                    class="card-img-top object-fit-cover"
                    alt="${spot.name}, ubicada en ${spot.address?.addressLocality || 'Mallorca'}"
                    style="height:220px"
                    loading="lazy"
                    decoding="async">
                </picture>
              </div>
              <div class="card-body d-flex flex-column">
                <h3 class="card-title text-primary fw-bold mb-1 fs-5">${spot.name}</h3>
                <p class="card-text text-muted small mb-3"><i class="bi bi-geo-alt-fill text-danger me-1"></i> ${spot.address?.addressLocality || 'Desconocido'}</p>
                <div class="mb-3 d-flex flex-wrap gap-2">
                    ${spot.keywords ? spot.keywords.split(',').slice(0, 2).map(tag => `<span class="badge bg-light text-dark border"><i class="bi bi-tag-fill text-primary me-1"></i>${tag.trim()}</span>`).join('') : ''}
                </div>
                <p class="card-text text-truncate text-muted small mb-3">${spot.description}</p>
                <div class="mt-auto pt-3 border-top">
                    <button class="btn btn-outline-primary w-100 fw-bold" data-open-spot="${originalIndex}"><i class="bi bi-file-earmark-text me-2"></i>Ver Detalles T&eacute;cnicos</button>
                </div>
              </div>
            </div>
          </div>
        `;
    });

    spotsContainer.innerHTML = htmlCards;

    // Añadir listeners accesibles para elementos que antes usaban onclick en el HTML
    const spotTriggers = spotsContainer.querySelectorAll('[data-open-spot]');
    spotTriggers.forEach(el => {
        const idx = Number(el.getAttribute('data-open-spot'));
        el.addEventListener('click', () => openSpotModal(idx));
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSpotModal(idx); }
        });
    });

    if (typeof AOS !== 'undefined') AOS.init();

    if (typeof Swiper !== 'undefined') {
        window.spotsSwiperInstance = new Swiper('.spots-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.spots-swiper-next',
                prevEl: '.spots-swiper-prev'
            },
            pagination: { el: '.spots-swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 40 }
            }
        });
    }
}

// LÓGICA DEL RECOMENDADOR
window.applyRecommender = () => {
    const filtroZona = document.getElementById('rec-zona').value.toLowerCase();
    const filtroTiempo = document.getElementById('rec-tiempo').value.toLowerCase(); // ¡Añadido nuevo filtro!
    const filtroTecnica = document.getElementById('rec-tipo').value.toLowerCase();
    const filtroPez = document.getElementById('rec-pez').value.toLowerCase();

    const zonasRecomendadas = currentSpotsList.filter(spot => {
        let esValida = true;

        const leerPropiedad = (nombresProp) => {
            if (!spot.additionalProperty) return "";
            const prop = spot.additionalProperty.find(p => nombresProp.includes(p.name));
            // Quitamos tildes
            return prop ? prop.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
        };

        const localidad = spot.address?.addressLocality?.toLowerCase() || "";
        const tiempoDisponibles = leerPropiedad(['Momento del Día', 'Momento del Dia', 'Time of Day', 'Tageszeit']);
        const tecnicasDisponibles = leerPropiedad(['Técnicas Recomendadas', 'Tècniques Recomanades', 'Recommended Techniques', 'Empfohlene Methoden']);
        const especiesDisponibles = leerPropiedad(['Especies Frecuentes', 'Espècies Freqüents', 'Frequent Species', 'Häufige Arten']);

        // 1. Filtrar Zona
        if (filtroZona !== "" && !localidad.includes(filtroZona)) esValida = false;

        // 2. Filtrar Tiempo
        if (filtroTiempo !== "" && esValida) {
            if (!tiempoDisponibles.includes(filtroTiempo)) esValida = false;
        }

        // 3. Filtrar Técnica
        if (filtroTecnica !== "" && esValida) {
            if (!tecnicasDisponibles.includes(filtroTecnica)) esValida = false;
        }

        // 4. Filtrar Pez
        if (filtroPez !== "" && esValida) {
            const pezLimpio = filtroPez.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!especiesDisponibles.includes(pezLimpio)) esValida = false;
        }

        return esValida;
    });

    renderSpotsCards(zonasRecomendadas);
};

window.resetRecommender = () => {
    document.getElementById('rec-zona').value = "";
    document.getElementById('rec-tiempo').value = "";
    document.getElementById('rec-tipo').value = "";
    document.getElementById('rec-pez').value = "";
    renderSpotsCards(currentSpotsList);
};

// MODAL DE ZONAS
window.openSpotModal = (index) => {
    const spot = currentSpotsList[index];
    if (!spot) return;

    document.getElementById('spotModalLabel').innerText = spot.name;
    document.getElementById('spotModalLocality').innerHTML = `<i class="bi bi-geo-alt text-danger"></i> ${spot.address?.addressLocality || 'Ubicación no especificada'}`;
    document.getElementById('spotModalDescription').innerText = spot.description || '';

    const galleryContainer = document.getElementById('spotModalGallery');
    const images = Array.isArray(spot.image) ? spot.image : [spot.image];


    let galleryHtml = '';
    images.forEach(img => {
        const rutaLimpia = img.substring(0, img.lastIndexOf('.'));
        galleryHtml += `
            <div class="${images.length > 1 ? 'col-6' : 'col-12'} mb-2">
                <img 
                    src="${rutaLimpia}-800.webp" 
                    class="img-fluid rounded shadow-sm w-100 object-fit-cover" 
                    style="height: 200px;" 
                    alt="Fotografía detallada de la zona de pesca ${spot.name}, ubicada en ${spot.address?.addressLocality || 'Mallorca'}" 
                    loading="lazy">
            </div>
        `;
    });
    galleryContainer.innerHTML = galleryHtml;

    const getPropValue = (nombresProp) => {
        const prop = spot.additionalProperty?.find(p => nombresProp.includes(p.name));
        return prop ? prop.value : '<span class="text-muted fst-italic">Información no disponible</span>';
    };

    document.getElementById('spotModalAccess').innerHTML = getPropValue(['Acceso', 'Accés', 'Access', 'Zugang']);
    document.getElementById('spotModalSeabed').innerHTML = getPropValue(['Fondo Marino', 'Fons Marí', 'Seabed', 'Meeresboden']);
    document.getElementById('spotModalTechniques').innerHTML = getPropValue(['Técnicas Recomendadas', 'Tècniques Recomanades', 'Recommended Techniques', 'Empfohlene Methoden']);
    // Pintamos el nuevo atributo en el modal
    document.getElementById('spotModalTime').innerHTML = getPropValue(['Momento del Día', 'Momento del Dia', 'Time of Day', 'Tageszeit']);

    const speciesRaw = getPropValue(['Especies Frecuentes', 'Espècies Freqüents', 'Frequent Species', 'Häufige Arten']);
    if (speciesRaw.includes('Información no')) {
        document.getElementById('spotModalSpecies').innerHTML = speciesRaw;
    } else {
        const badges = speciesRaw.split(',').map(s => {
            let fishSlug = s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // Handle historical Spanish names appearing in some spot translations
            if (fishSlug.includes("cap-roig")) fishSlug = "cap-roig";
            else if (fishSlug.includes("sargo")) fishSlug = "sargo";
            else if (fishSlug.includes("dorada")) fishSlug = "dorada";
            else if (fishSlug.includes("mero")) fishSlug = "mero";
            else if (fishSlug.includes("denton")) fishSlug = "denton";
            else if (fishSlug.includes("salpa")) fishSlug = "salpa";
            else if (fishSlug.includes("oblada")) fishSlug = "oblada";
            else if (fishSlug.includes("serrano")) fishSlug = "serrano";
            else if (fishSlug.includes("llampuga")) fishSlug = "llampuga";
            else if (fishSlug.includes("lubina")) fishSlug = "lubina";
            else if (fishSlug.includes("corvallo")) fishSlug = "corvallo";
            else if (fishSlug.includes("serviola") || fishSlug.includes("amberjack")) fishSlug = "serviola";
            else if (fishSlug.includes("atun")) fishSlug = "atun-rojo";
            else if (fishSlug.includes("caballa") || fishSlug.includes("mackerel")) fishSlug = "caballa";
            else if (fishSlug.includes("bonito")) fishSlug = "bonito";

            // Find species in global list by matching ID slug
            const species = globalSpeciesList.find(sp => sp['@id'] && sp['@id'].endsWith('/' + fishSlug));
            const displayName = species ? species.name : s.trim();
            const targetName = species ? fishSlug : s.trim();

            return `<span class="badge bg-success me-1 mb-1 fs-6 px-3 py-2 shadow-sm" role="button" tabindex="0" aria-label="Ver detalles de ${displayName}" style="cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.classList.replace('bg-success', 'bg-primary')" onmouseout="this.style.transform='scale(1)'; this.classList.replace('bg-primary', 'bg-success')" data-open-species-name="${targetName}"><i class="bi bi-link-45deg me-1"></i>${displayName}</span>`;
        }).join('');
        document.getElementById('spotModalSpecies').innerHTML = badges;

        // Adjuntar listeners a los badges que abren fichas (accesibilidad teclado/ratón)
        const badgeEls = document.querySelectorAll('#spotModalSpecies [data-open-species-name]');
        badgeEls.forEach(el => {
            const name = el.getAttribute('data-open-species-name');
            el.addEventListener('click', () => {
                const modalEl = document.getElementById('spotModal');
                bootstrap.Modal.getInstance(modalEl)?.hide();
                setTimeout(() => openSpeciesModalByName(name), 400);
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
            });
        });
    }

    // Comentarios y reportes comunitarios de la zona
    window.currentSpotIndex = index;
    setTimeout(() => {
        window.renderSpotComments(spot.name);
    }, 100);

    // Actualizar JSON-LD para la zona
    SemanticService.updateSpotJsonLd(spot);

    const modalEl = document.getElementById('spotModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    // Trap focus inside modal and preserve opener
    try { trapFocusInModal(modalEl, document.activeElement); } catch (e) { /* noop */ }
    modal.show();
};

window.openSpotModalByName = (name) => {
    if (!name) return;
    const cleanQuery = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const spot = currentSpotsList.find(s => {
        const sName = s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return sName.includes(cleanQuery) || cleanQuery.includes(sName);
    });
    if (!spot) return;
    const index = currentSpotsList.indexOf(spot);
    window.openSpotModal(index);
};

window.openRampModalByName = (name) => {
    if (!name || !window.currentRampsData) return;
    const cleanQuery = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const ramp = window.currentRampsData.find(r => {
        const rName = r.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return rName.includes(cleanQuery) || cleanQuery.includes(rName);
    });
    if (!ramp) return;
    window.openRampModal(ramp.id);
};

window.openBeachModalByName = (name) => {
    if (!name || !window.currentRampsData) return;
    const cleanQuery = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const ramp = window.currentRampsData.find(r => {
        const rName = r.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return rName.includes(cleanQuery) || cleanQuery.includes(rName);
    });
    if (!ramp) return;
    window.openRampModal(ramp.id);
};

window.openBeachModalByName = (name) => {
    if (!name || !window.currentBeachesList) return;
    const cleanQuery = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const beach = window.currentBeachesList.find(b => {
        const bName = b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return bName.includes(cleanQuery) || cleanQuery.includes(bName);
    });
    if (!beach) return;
    const index = window.currentBeachesList.indexOf(beach);
    window.openBeachModal(index);
};

window.renderSpotComments = async (spotName) => {
    const container = document.getElementById('spotModalCommentsContainer');
    if (!container) return;

    // Cambiar la visibilidad del formulario según si está logueado
    const commentForm = document.querySelector('#spotModal form');
    const authPrompt = document.getElementById('spotAuthPrompt');

    if (AuthService.isLoggedIn()) {
        if (commentForm) commentForm.classList.remove('d-none');
        if (authPrompt) authPrompt.classList.add('d-none');
    } else {
        if (commentForm) commentForm.classList.add('d-none');
        if (!authPrompt) {
            const prompt = document.createElement('div');
            prompt.id = 'spotAuthPrompt';
            prompt.className = 'text-center py-4 bg-white rounded shadow-sm mb-4';
            const t_login_report = (window._i18n && window._i18n.t) ? window._i18n.t('spot_login_report') : 'Inicia sesión para reportar capturas';
            const t_btn_login = (window._i18n && window._i18n.t) ? window._i18n.t('spot_btn_login') : 'Identificarse';
            prompt.innerHTML = `
                <i class="bi bi-lock text-primary fs-2 mb-2"></i>
                <h6 class="fw-bold">${t_login_report}</h6>
                <button class="btn btn-primary btn-sm rounded-pill mt-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                    <i class="bi bi-person-circle me-1"></i> ${t_btn_login}
                </button>
            `;
            container.parentNode.insertBefore(prompt, container);
        } else {
            authPrompt.classList.remove('d-none');
        }
    }

    // 1. Cargar comentarios locales (Web Storage)
    const safeKey = `pm_spot_comments_${spotName.replace(/\s+/g, '_')}`;
    const localComments = JSON.parse(localStorage.getItem(safeKey)) || [];

    // 2. Cargar comentarios del servidor (JSON central)
    let serverComments = [];
    try {
        const response = await fetch('assets/data/comments.json');
        if (response.ok) {
            const data = await response.json();
            serverComments = data.comments.filter(c => c.type === 'spot' && c.targetId === spotName);
        }
    } catch (err) {
        console.warn("No se pudo cargar comments.json", err);
    }

    // Unificar y ordenar por fecha
    const allComments = [...serverComments, ...localComments].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allComments.length === 0) {
        container.innerHTML = '<p class="text-muted small fst-italic text-center py-3"><i class="bi bi-info-circle me-1"></i>No hay reportes recientes. ¡Sé el primero en compartir qué tipo de capturas entraron hoy!</p>';
        return;
    }

    let html = '';
    allComments.forEach(c => {
        html += `
        <div class="mb-3 p-3 bg-white border border-light rounded shadow-sm border-start border-primary border-4">
            <div class="d-flex align-items-center mb-2">
                <img src="${c.avatar || 'https://i.pravatar.cc/150?u=demo'}" alt="Avatar de ${c.user || 'Pescador Local'}" class="rounded-circle me-2" style="width: 30px; height: 30px; object-fit: cover;">
                <strong class="text-dark">${c.user || 'Pescador Local'}</strong>
                <span class="ms-auto small text-muted"><i class="bi bi-clock me-1"></i>${c.date}</span>
            </div>
            <p class="mb-0 text-secondary" style="white-space: pre-wrap; font-size: 0.95rem;">${c.text}</p>
        </div>`;
    });
    container.innerHTML = html;
};

window.submitSpotComment = () => {
    if (window.currentSpotIndex === undefined) return;
    const user = AuthService.getUser();
    if (!user) return;

    const input = document.getElementById('spotCommentInput');
    const text = input ? input.value.trim() : '';
    if (!text) return;

    const spotName = currentSpotsList[window.currentSpotIndex].name;
    const safeKey = `pm_spot_comments_${spotName.replace(/\s+/g, '_')}`;
    const comments = JSON.parse(localStorage.getItem(safeKey)) || [];

    const newComment = {
        id: Date.now(),
        type: 'spot',
        targetId: spotName,
        text,
        date: new Date().toISOString().split('T')[0],
        user: user.name,
        avatar: user.picture
    };

    comments.unshift(newComment);
    localStorage.setItem(safeKey, JSON.stringify(comments));
    input.value = '';
    window.renderSpotComments(spotName);

    // Envío real al servidor
    fetch('forms/save_comments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
    })
        .then(res => res.json())
        .then(data => console.log("Servidor:", data))
        .catch(err => console.error("Error al guardar en servidor:", err));
};

window.toggleFishAudio = (btn, audioPath) => {
    if (!btn || !audioPath) return;

    // Limpiar ruta: quitar / inicial si existe para que sea relativa
    const cleanPath = audioPath.startsWith('/') ? audioPath.substring(1) : audioPath;

    // Usar el controlador centralizado de VoiceService
    const currentAudio = window.getVoiceAudio();

    const isCurrentlyPlaying = currentAudio && !currentAudio.paused &&
        (currentAudio.src.includes(cleanPath) ||
            currentAudio.currentSrc.includes(cleanPath) ||
            (currentAudio.dataset && currentAudio.dataset.basePath === cleanPath));

    if (isCurrentlyPlaying) {
        stopAudio();
        return;
    }

    // Parar lo que sea que esté sonando
    stopAudio();

    // Reproducir usando el servicio central
    playAudio(cleanPath);

    // El servicio de voz no gestiona el estado del botón, así que lo hacemos aquí
    const audio = window.getVoiceAudio();
    if (audio) {
        audio.onplay = () => {
            btn.innerHTML = '<i class="bi bi-stop-circle-fill me-2"></i> ' + ((window._i18n && window._i18n.t) ? window._i18n.t('audio_stop') : 'Detener Sonido');
            btn.classList.replace('btn-outline-primary', 'btn-primary');
            btn.classList.add('text-white');
        };
        audio.onended = () => {
            btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> ' + ((window._i18n && window._i18n.t) ? window._i18n.t('audio_listen') : 'Pronunciación mallorquina');
            btn.classList.replace('btn-primary', 'btn-outline-primary');
            btn.classList.remove('text-white');
        };
        audio.onpause = () => {
            btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> ' + ((window._i18n && window._i18n.t) ? window._i18n.t('audio_listen') : 'Pronunciación mallorquina');
            btn.classList.replace('btn-primary', 'btn-outline-primary');
            btn.classList.remove('text-white');
        };
    }
};

// ==========================================
// SECCIÓN DE PLAYAS
// ==========================================

let currentBeachesList = [];
window.currentBeachesList = [];
let beachesSwiperInstance = null;

async function loadBeachesData() {
    const beachesContainer = document.getElementById('beaches-container');
    if (!beachesContainer) return;

    const EXTERNAL_URL = 'https://www.mallorcalas.online/data/playas.json';
    const LOCAL_URL    = 'assets/data/playas.json';

    // Estrategia: intentar primero la URL externa directa.
    // En cuanto los compañeros activen CORS en su servidor, esto funcionará
    // automáticamente y los datos estarán siempre actualizados.
    // Mientras tanto, el navegador lanza un error de CORS que capturamos
    // y caemos al fichero local descargado en data/playas.json.
    let data;
    try {
        const res = await fetch(EXTERNAL_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        console.log('[Playas] Datos cargados desde mallorcalas.online ✓');
    } catch {
        console.info('[Playas] CORS bloqueado o sin conexión → usando copia local.');
        const res = await fetch(LOCAL_URL);
        if (!res.ok) throw new Error(`No se encontró data/playas.json (HTTP ${res.status})`);
        data = await res.json();
    }

    try {
        // Extraer el array de playas sea cual sea la forma del JSON recibido
        let allBeaches;
        if (Array.isArray(data)) {
            allBeaches = data;
        } else if (Array.isArray(data['@graph'])) {
            allBeaches = data['@graph'];
        } else if (Array.isArray(data.playas)) {
            allBeaches = data.playas;
        } else if (Array.isArray(data.beaches)) {
            allBeaches = data.beaches;
        } else if (Array.isArray(data.data)) {
            allBeaches = data.data;
        } else {
            console.warn('[Playas] Formato JSON inesperado:', typeof data, Object.keys(data || {}));
            allBeaches = [];
        }
        allBeaches = allBeaches.map(normalizeBeachFromJsonLd);
        console.log(`[Playas] ${allBeaches.length} playas cargadas.`);
        currentBeachesList = allBeaches;
        window.currentBeachesList = allBeaches;
        renderBeachesSwiper(allBeaches);

        const applyFilters = () => {
            const dif = document.getElementById('filter-beach-dificultad').value.toLowerCase();
            const tipo = document.getElementById('filter-beach-tipo').value.toLowerCase();
            const txtRaw = document.getElementById('filter-beach-text').value.trim();
            const txt = txtRaw.toLowerCase();

            const normalized = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

            const filtered = allBeaches.filter(beach => {
                let pass = true;

                // Filtro dificultad: usa accessDifficulty o access del JSON externo
                if (dif !== 'todo') {
                    const val = normalized(beach.accessDifficulty || beach.access || '');
                    if (!val.includes(normalized(dif))) pass = false;
                }

                // Filtro tipo: usa el campo 'type' del JSON externo
                if (tipo !== 'todo' && pass) {
                    const val = normalized(beach.type || '');
                    if (!val.includes(normalized(tipo))) pass = false;
                }

                // Filtro texto libre
                if (txt.length > 0 && pass) {
                    const search = normalized(txt);
                    const haystack = normalized(
                        `${beach.name} ${beach.region} ${beach.zone} ${beach.description} ${beach.type}`
                    );
                    if (!haystack.includes(search)) pass = false;
                }

                return pass;
            });

            renderBeachesSwiper(filtered);
        };

        const filterElements = document.querySelectorAll('.beaches-filter');
        filterElements.forEach(el => {
            el.addEventListener('change', applyFilters);
            el.addEventListener('keyup', applyFilters);
            el.addEventListener('input', applyFilters);
        });

    } catch (e) {
        console.error('[Playas] Error al cargar datos:', e);
        beachesContainer.innerHTML = `
            <div class="alert alert-warning w-100 p-4 text-center">
                <i class="bi bi-cloud-slash fs-2 text-warning d-block mb-2"></i>
                <strong>No se pudieron cargar las playas</strong>
                <p class="text-muted small mb-0 mt-2">
                    Comprueba tu conexión e inténtalo de nuevo.
                </p>
            </div>`;
    }
}

// Convierte la imagen de una playa a URL absoluta.
function resolveBeachImg(path) {
    if (!path) return null;
    if (Array.isArray(path)) path = path[0];
    if (path && typeof path === 'object') {
        path = path.url || path.contentUrl || path['@id'] || null;
    }
    if (!path || typeof path !== 'string') return null;
    if (path.startsWith('http')) return path;
    const clean = path.replace(/^\.\//, '');
    return 'https://www.mallorcalas.online/' + clean;
}

// Convierte un objeto Beach en formato JSON-LD (schema.org) al formato plano que usa la UI.
// Si el objeto ya tiene campos planos (formato local), lo devuelve sin cambios.
function normalizeBeachFromJsonLd(beach) {
    if (beach.lat !== undefined || beach.access !== undefined) return beach;

    const prop = (name) => {
        const p = (beach.additionalProperty || []).find(ap => ap.name === name);
        return p ? p.value : undefined;
    };

    const sustratoMap = {
        arena_fina: 'Arena', arena: 'Arena',
        rocosa: 'Rocosa', piedras: 'Rocosa',
        mixta: 'Mixta',
    };

    return {
        name:             beach.name,
        description:      beach.description,
        region:           beach.address?.addressLocality,
        zone:             prop('zone'),
        lat:              beach.geo?.latitude,
        lng:              beach.geo?.longitude,
        img:              Array.isArray(beach.image) ? beach.image[0] : beach.image,
        heroImg:          Array.isArray(beach.image) ? beach.image[1] : undefined,
        rating:           beach.aggregateRating?.ratingValue,
        reviews:          beach.aggregateRating?.reviewCount,
        access:           prop('access'),
        accessDifficulty: prop('access'),
        features:         prop('features') || [],
        type:             sustratoMap[(prop('sustrato') || '').toLowerCase()] || null,
    };
}

function renderBeachesSwiper(beachesArray) {
    const container = document.getElementById('beaches-container');
    currentBeachesList = beachesArray;

    if (beachesSwiperInstance) {
        beachesSwiperInstance.destroy(true, true);
        beachesSwiperInstance = null;
    }

    if (beachesArray.length === 0) {
        const noResults = (window._i18n && window._i18n.t) ? window._i18n.t('beach_no_results', { defaultValue: 'No se encontraron playas con esos filtros.' }) : 'No se encontraron playas con esos filtros.';
        container.innerHTML = `<div class="w-100 text-center text-muted my-5"><i class="bi bi-search fs-1"></i><p class="mt-2">${noResults}</p></div>`;
        return;
    }

    // Helpers para renderizar la tarjeta con los nuevos campos del JSON externo
    const accessIcon = (access) => {
        const a = (access || '').toLowerCase();
        if (a === 'facil' || a === 'fácil') return '<i class="bi bi-check-circle-fill text-success me-1"></i>';
        if (a === 'media') return '<i class="bi bi-exclamation-circle-fill text-warning me-1"></i>';
        if (a === 'dificil' || a === 'difícil') return '<i class="bi bi-x-circle-fill text-danger me-1"></i>';
        return '<i class="bi bi-circle text-secondary me-1"></i>';
    };

    const featureIcons = {
        parking:      { icon: 'bi-p-square-fill',    label: 'Parking',      color: 'text-primary' },
        restaurante:  { icon: 'bi-cup-hot-fill',      label: 'Restaurante',  color: 'text-warning' },
        accesible:    { icon: 'bi-person-wheelchair', label: 'Accesible',    color: 'text-success' },
        chiringuito:  { icon: 'bi-umbrella-fill',     label: 'Chiringuito',  color: 'text-info'    },
        ducha:        { icon: 'bi-droplet-fill',      label: 'Ducha',        color: 'text-info'    },
    };

    const renderFeatureBadges = (features) => {
        if (!Array.isArray(features) || features.length === 0) return '';
        return features.slice(0, 3).map(f => {
            const meta = featureIcons[f.toLowerCase()] || { icon: 'bi-tag-fill', label: f, color: 'text-secondary' };
            return `<span class="badge bg-light text-dark border me-1 mb-1"><i class="bi ${meta.icon} ${meta.color} me-1"></i>${meta.label}</span>`;
        }).join('');
    };

    const renderStars = (rating) => {
        const r = Math.round(Number(rating) * 2) / 2; // redondea a 0.5
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (r >= i) stars += '<i class="bi bi-star-fill text-warning" style="font-size:0.75rem;"></i>';
            else if (r >= i - 0.5) stars += '<i class="bi bi-star-half text-warning" style="font-size:0.75rem;"></i>';
            else stars += '<i class="bi bi-star text-warning" style="font-size:0.75rem;"></i>';
        }
        return stars;
    };

    let htmlCards = '';
    beachesArray.forEach((beach, index) => {
        // El JSON externo usa rutas relativas → las convertimos a absolutas
        const imgSrc = resolveBeachImg(beach.img || beach.image) || 'assets/img/hero-carousel/hero-carousel-1-640.webp';
        const locality = beach.region || beach.zone || 'Mallorca';
        const access = beach.accessDifficulty || beach.access || '';
        const typeLabel = beach.type === 'Rocosa' ? 'Rocosa' : (beach.type || 'Arena');
        const typeColor = beach.type === 'Rocosa' ? 'secondary' : 'info';
        const ratingVal = beach.rating ? Number(beach.rating).toFixed(1) : null;

        htmlCards += `
          <div class="swiper-slide py-3">
             <div class="card h-100 shadow border-0 beach-card" role="button" tabindex="0" aria-label="Ver detalles de ${beach.name}" data-open-beach="${index}" style="transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow=''">

               <div class="position-relative overflow-hidden" style="height:220px;">
                 <img
                   src="${imgSrc}"
                   class="w-100 h-100 object-fit-cover"
                   alt="Fotografía de ${beach.name}"
                   style="transition: transform 0.4s;"
                   loading="lazy">
                 <div class="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1">
                   <span class="badge bg-${typeColor} bg-opacity-90 shadow-sm">
                     <i class="bi bi-geo me-1"></i>${typeLabel}
                   </span>
                   ${beach.isFavorite ? '<span class="badge bg-danger bg-opacity-90 shadow-sm"><i class="bi bi-heart-fill me-1"></i>Destacada</span>' : ''}
                 </div>
               </div>

               <div class="card-body d-flex flex-column bg-white">
                 <h3 class="card-title text-primary fw-bold mb-1 fs-5">${beach.name}</h3>
                 <p class="text-muted small mb-2">
                   <i class="bi bi-geo-alt-fill text-danger me-1"></i>${locality}
                   ${beach.zone ? `<span class="ms-2 text-muted fst-italic small">${beach.zone}</span>` : ''}
                 </p>

                 ${ratingVal ? `
                 <div class="d-flex align-items-center gap-1 mb-2">
                   ${renderStars(beach.rating)}
                   <span class="small fw-bold text-dark ms-1">${ratingVal}</span>
                   <span class="small text-muted">(${beach.reviews || 0})</span>
                 </div>` : ''}

                 <div class="mb-2">
                   ${accessIcon(access)}<small class="text-muted">Acceso: <strong>${access || 'N/A'}</strong></small>
                 </div>

                 <div class="mb-3 d-flex flex-wrap gap-1">
                   ${renderFeatureBadges(beach.features)}
                 </div>

                 <p class="card-text text-muted small mb-3 flex-grow-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                   ${beach.description || ''}
                 </p>

                 <div class="mt-auto pt-2 border-top">
                   <button class="btn btn-outline-primary w-100 fw-bold btn-sm" data-open-beach="${index}">
                     <i class="bi bi-info-circle me-1"></i>Ver detalles
                   </button>
                 </div>
               </div>
             </div>
          </div>
        `;
    });

    container.innerHTML = htmlCards;

    const beachTriggers = container.querySelectorAll('[data-open-beach]');
    beachTriggers.forEach(el => {
        const idx = Number(el.getAttribute('data-open-beach'));
        el.addEventListener('click', () => openBeachModal(idx));
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBeachModal(idx); } });
    });

    if (typeof Swiper !== 'undefined') {
        beachesSwiperInstance = new Swiper('.beaches-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.beaches-swiper-next',
                prevEl: '.beaches-swiper-prev'
            },
            pagination: { el: '.beaches-swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 40 },
                1200: { slidesPerView: 4, spaceBetween: 40 }
            }
        });
    }
}

window.openBeachModal = (index) => {
    const beach = currentBeachesList[index];
    if (!beach) return;

    // Campos del JSON externo de mallorcalas.online
    const locality = beach.region || beach.zone || 'Mallorca';
    // Imagen de detalle: usa heroImg si existe, si no img — convierte ruta relativa a absoluta
    const heroImg = resolveBeachImg(beach.heroImg || beach.img || beach.image) || 'assets/img/hero-carousel/hero-carousel-1-640.webp';

    document.getElementById('beachModalLabel').innerText = beach.name;
    document.getElementById('beachModalLocality').innerHTML =
        `<i class="bi bi-geo-alt-fill me-2 text-danger"></i><span>${locality}${beach.zone ? ` · ${beach.zone}` : ''}</span>`;
    document.getElementById('beachModalDescription').innerText = beach.description || '';

    const imgEl = document.getElementById('beachModalImage');
    imgEl.src = heroImg;

    const propsContainer = document.getElementById('beachModalProperties');
    let propsHtml = '';

    // ── Valoración ──────────────────────────────────────────────────────────
    if (beach.rating) {
        propsHtml += `
            <div class="col-sm-6 col-lg-4 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm h-100">
                    <small class="text-muted d-block"><i class="bi bi-star-fill text-warning me-1"></i>Valoración</small>
                    <span class="fw-bold text-dark fs-5">${Number(beach.rating).toFixed(1)}</span>
                    <span class="text-muted small"> / 5 (${beach.reviews || 0} reseñas)</span>
                </div>
            </div>`;
    }

    // ── Tipo de playa ────────────────────────────────────────────────────────
    if (beach.type) {
        propsHtml += `
            <div class="col-sm-6 col-lg-4 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm h-100">
                    <small class="text-muted d-block"><i class="bi bi-layers-fill text-info me-1"></i>Tipo</small>
                    <span class="fw-bold text-dark">${beach.type}</span>
                </div>
            </div>`;
    }

    // ── Acceso ───────────────────────────────────────────────────────────────
    const accessLabel = beach.accessDifficulty || beach.access;
    if (accessLabel) {
        const colorMap = { facil: 'success', fácil: 'success', media: 'warning', dificil: 'danger', difícil: 'danger' };
        const col = colorMap[(accessLabel || '').toLowerCase()] || 'secondary';
        propsHtml += `
            <div class="col-sm-6 col-lg-4 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm h-100">
                    <small class="text-muted d-block"><i class="bi bi-signpost-fill text-${col} me-1"></i>Dificultad de acceso</small>
                    <span class="badge bg-${col} fw-bold">${accessLabel}</span>
                </div>
            </div>`;
    }

    // ── Olas ─────────────────────────────────────────────────────────────────
    if (beach.waves) {
        propsHtml += `
            <div class="col-sm-6 col-lg-4 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm h-100">
                    <small class="text-muted d-block"><i class="bi bi-water text-info me-1"></i>Oleaje habitual</small>
                    <span class="fw-bold text-dark">${beach.waves}</span>
                </div>
            </div>`;
    }

    // ── Atardecer ────────────────────────────────────────────────────────────
    if (beach.sunsetWindow) {
        propsHtml += `
            <div class="col-sm-6 col-lg-4 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm h-100">
                    <small class="text-muted d-block"><i class="bi bi-sunset text-warning me-1"></i>Ventana de atardecer</small>
                    <span class="fw-bold text-dark">${beach.sunsetWindow}</span>
                </div>
            </div>`;
    }

    // ── Coordenadas / GPS ────────────────────────────────────────────────────
    if (beach.lat && beach.lng) {
        propsHtml += `
            <div class="col-sm-6 col-lg-4 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm h-100">
                    <small class="text-muted d-block"><i class="bi bi-pin-map-fill text-danger me-1"></i>Coordenadas</small>
                    <a href="https://maps.google.com/?q=${beach.lat},${beach.lng}" target="_blank" rel="noopener" class="fw-bold text-primary small">
                        ${beach.lat.toFixed(4)}, ${beach.lng.toFixed(4)} <i class="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                </div>
            </div>`;
    }

    // ── Parking ──────────────────────────────────────────────────────────────
    if (beach.parking) {
        propsHtml += `
            <div class="col-12 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm">
                    <small class="text-muted d-block"><i class="bi bi-p-square-fill text-primary me-1"></i>Parking</small>
                    <span class="fw-bold text-dark small">${beach.parking}</span>
                </div>
            </div>`;
    }

    // ── Accesibilidad ────────────────────────────────────────────────────────
    if (beach.accessibility) {
        propsHtml += `
            <div class="col-12 mb-2">
                <div class="p-2 border rounded bg-white shadow-sm">
                    <small class="text-muted d-block"><i class="bi bi-person-wheelchair text-success me-1"></i>Accesibilidad</small>
                    <span class="fw-bold text-dark small">${beach.accessibility}</span>
                </div>
            </div>`;
    }

    // ── Servicios / Features ─────────────────────────────────────────────────
    if (Array.isArray(beach.features) && beach.features.length > 0) {
        const featureMeta = {
            parking:     { icon: 'bi-p-square-fill',    label: 'Parking',      color: 'primary' },
            restaurante: { icon: 'bi-cup-hot-fill',      label: 'Restaurante',  color: 'warning' },
            accesible:   { icon: 'bi-person-wheelchair', label: 'Accesible',    color: 'success' },
            chiringuito: { icon: 'bi-umbrella-fill',     label: 'Chiringuito',  color: 'info'    },
            ducha:       { icon: 'bi-droplet-fill',      label: 'Duchas',       color: 'info'    },
        };
        propsHtml += `<div class="col-12 mb-3"><small class="text-muted d-block mb-1"><i class="bi bi-check-circle-fill text-success me-1"></i>Servicios</small><div class="d-flex flex-wrap gap-2">`;
        beach.features.forEach(f => {
            const m = featureMeta[f.toLowerCase()] || { icon: 'bi-tag-fill', label: f, color: 'secondary' };
            propsHtml += `<span class="badge bg-${m.color} bg-opacity-15 text-dark border border-${m.color} px-2 py-1">
                <i class="bi ${m.icon} text-${m.color} me-1"></i>${m.label}
            </span>`;
        });
        propsHtml += `</div></div>`;
    }

    // ── Consejos (tips) ──────────────────────────────────────────────────────
    if (Array.isArray(beach.tips) && beach.tips.length > 0) {
        propsHtml += `
            <div class="col-12 mb-2">
                <div class="p-3 border rounded shadow-sm" style="border-left: 4px solid var(--bs-primary) !important; background:#f8f9fa;">
                    <small class="text-muted d-block mb-2 fw-bold"><i class="bi bi-lightbulb-fill text-warning me-1"></i>Consejos</small>
                    <ul class="mb-0 ps-3 small text-dark">
                        ${beach.tips.map(tip => `<li class="mb-1">${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
    }

    propsContainer.innerHTML = propsHtml;

    // Actualizar JSON-LD para la playa (adaptamos el objeto al formato esperado)
    try {
        const beachForJsonLd = {
            name: beach.name,
            description: beach.description,
            image: heroImg,
            address: { addressLocality: locality },
            aggregateRating: beach.rating ? { ratingValue: beach.rating, reviewCount: beach.reviews || 0 } : undefined,
            geo: (beach.lat && beach.lng) ? { latitude: beach.lat, longitude: beach.lng } : undefined,
        };
        SemanticService.updateBeachJsonLd(beachForJsonLd);
    } catch (e) { /* noop */ }

    const modalEl = document.getElementById('beachModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    // Trap focus inside modal and preserve opener
    try { trapFocusInModal(modalEl, document.activeElement); } catch (e) { /* noop */ }
    modal.show();
};


// ==========================================
// SECCIÓN DE ESPECIES (ICTIOLOGÍA)
// ==========================================

// Variables globales para la gestion dinámica del swiper y modal de especies
let speciesSwiperInstance = null;
let currentSpeciesList = [];
let globalSpeciesList = [];

async function loadSpeciesData() {
    const speciesContainer = document.getElementById('species-container');
    if (!speciesContainer) return;

    try {
        const activeLang = (window._i18n && window._i18n.language) ? window._i18n.language.substring(0, 2) : 'es';
        const response = await fetch(`assets/data/especies_${activeLang}.json?v=${new Date().getTime()}`);
        const schema = await response.json();

        let allSpecies = schema['@graph'] || [];
        globalSpeciesList = allSpecies;
        window.globalSpeciesList = allSpecies;
        renderSpeciesSwiper(allSpecies);
        initPecedex(allSpecies);

        // Inicializar el quiz con los datos cargados
        try {
            initQuiz(allSpecies, globalZonesData);
        } catch (quizErr) {
            console.warn('QuizSection init error:', quizErr);
        }

        // Configuración avanzada de búsqueda
        const applyFilters = () => {
            const dif = document.getElementById('filter-dificultad').value.toLowerCase();
            const cal = document.getElementById('filter-calidad').value.toLowerCase();
            const txtRaw = document.getElementById('filter-text').value.trim();
            const txt = txtRaw.toLowerCase();

            // Mapas de traducción de filtros para soporte multiidioma
            const diffMap = {
                baja: ['baja', 'baixa', 'low', 'niedrig'],
                media: ['media', 'mitjana', 'medium', 'mittel'],
                alta: ['alta', 'alta', 'high', 'hoch'],
                'muy alta': ['muy alta', 'molt alta', 'very high', 'sehr hoch']
            };

            const qualMap = {
                baja: ['baja', 'baixa', 'low', 'schlecht'],
                buena: ['buena', 'bona', 'good', 'gut'],
                'muy buena': ['muy buena', 'molt bona', 'very good', 'sehr gut'],
                excelente: ['excelente', 'excel·lent', 'excellent', 'hervorragend'],
                moderada: ['moderada', 'moderada', 'moderate', 'mittelmäßig']
            };

            // Si el texto coincide con nombres de zonas cargadas, construimos lista de especies de esas zonas
            let speciesFromZones = null;
            if (txt.length > 0 && window.globalZonesData && Array.isArray(window.globalZonesData)) {
                const normalize = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
                const matchedSpots = window.globalZonesData.filter(spot => {
                    const name = normalize(spot.name);
                    const locality = normalize(spot.address?.addressLocality);
                    const keywords = normalize(spot.keywords);
                    return (name && name.includes(txt)) || (locality && locality.includes(txt)) || (keywords && keywords.includes(txt));
                });
                if (matchedSpots.length > 0) {
                    speciesFromZones = new Set();
                    matchedSpots.forEach(spot => {
                        const prop = spot.additionalProperty?.find(p => ['Especies Frecuentes', 'Especies', 'Frequent Species', 'Espècies Freqüents', 'Häufige Arten'].includes(p.name));
                        if (prop && prop.value) {
                            prop.value.split(',').forEach(s => {
                                const clean = s.trim().toLowerCase();
                                if (clean) speciesFromZones.add(clean.normalize("NFD").replace(/[^\w\s-]/g, '').trim());
                            });
                        }
                    });
                    if (speciesFromZones.size === 0) speciesFromZones = null;
                }
            }

            const filtered = allSpecies.filter(sp => {
                let pass = true;

                // Filtro Dificultad
                if (dif !== 'todo') {
                    const prop = sp.additionalProperty?.find(p => ['Dificultad', 'Difficulty', 'Dificultat', 'Schwierigkeit'].includes(p.name));
                    const val = prop ? prop.value.toLowerCase() : '';
                    const allowedVals = diffMap[dif] || [];
                    if (!allowedVals.includes(val)) pass = false;
                }

                // Filtro Calidad Culinaria
                if (cal !== 'todo' && pass) {
                    const prop = sp.additionalProperty?.find(p => ['Calidad culinaria', 'Culinary quality', 'Qualitat culinària', 'Kulinarische Qualität'].includes(p.name));
                    if (!prop) { pass = false; }
                    else {
                        const val = prop.value.toLowerCase();
                        const allowedVals = qualMap[cal] || [];
                        if (cal === 'moderada') {
                            if (!allowedVals.some(v => val.includes(v))) pass = false;
                        } else {
                            if (!allowedVals.some(v => val.includes(v))) pass = false;
                        }
                    }
                }

                // Filtro por zonas específicas: si speciesFromZones está definido, comprobamos que el nombre de la especie
                // exista en esa lista (o en alternateName)
                if (speciesFromZones && pass) {
                    const nameClean = (sp.name || '').toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, '').trim();
                    const alt = (sp.alternateName || '').toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, '').trim();
                    if (!speciesFromZones.has(nameClean) && !(alt && speciesFromZones.has(alt))) pass = false;
                }

                // Filtro Texto Libre (Nombre, metodos, descripcion) si no estamos filtrando por zona
                if (!speciesFromZones && txt.length > 0 && pass) {
                    const jsonString = JSON.stringify(sp).toLowerCase();
                    if (!jsonString.includes(txt)) pass = false;
                }

                return pass;
            });

            renderSpeciesSwiper(filtered.length ? filtered : []);
        };

        const filterElements = document.querySelectorAll('.species-filter');
        filterElements.forEach(el => {
            el.addEventListener('change', applyFilters);
            el.addEventListener('keyup', applyFilters);
            el.addEventListener('input', applyFilters);
        });

    } catch (e) {
        console.error("Error al cargar JSON de especies:", e);
        speciesContainer.innerHTML = '<div class="alert alert-danger w-100">' + ((window._i18n && window._i18n.t) ? window._i18n.t('species_error_loading') : 'Error cargando información de Especies.') + '</div>';
    }
}

function renderSpeciesSwiper(speciesArray) {
    const container = document.getElementById('species-container');
    currentSpeciesList = speciesArray;

    if (speciesSwiperInstance) {
        speciesSwiperInstance.destroy(true, true);
        speciesSwiperInstance = null;
    }

    if (speciesArray.length === 0) {
        container.innerHTML = '<div class="w-100 text-center text-muted my-5"><i class="bi bi-search fs-1"></i><p class="mt-2">No se encontraron especies con esos filtros.</p></div>';
        return;
    }

    let htmlCards = '';
    speciesArray.forEach((species, index) => {
        const rutaLimpia = getImageBasePath(species.image || '');
        htmlCards += `
          <div class="swiper-slide py-3">
             <div class="card h-100 shadow border-0 cursor-pointer species-card" role="button" tabindex="0" aria-label="Ver detalles de ${species.name}" data-open-species-index="${index}" style="transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
               <picture>
                 <source
                    type="image/avif"
                    srcset="${rutaLimpia}-400.avif 400w, ${rutaLimpia}-800.avif 800w"
                    sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                 <source
                   type="image/webp"
                   srcset="${rutaLimpia}-400.webp 400w, ${rutaLimpia}-800.webp 800w"
                   sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                 <source
                   type="image/jpeg"
                   srcset="${rutaLimpia}-400.jpg 400w, ${rutaLimpia}-800.jpg 800w"
                   sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                 <img
                   src="${rutaLimpia}-800.jpg"
                   class="card-img-top object-fit-cover"
                   alt="${species.name}"
                   style="height:250px"
                   loading="lazy">
               </picture>              
               <div class="card-body text-center bg-white rounded-bottom">
                 <h3 class="card-title text-primary fw-bold mb-1 fs-5">${species.name}</h3>
               </div>
             </div>
          </div>
        `;
    });

    container.innerHTML = htmlCards;

    // Añadir listeners accesibles para las tarjetas de especies (reemplaza onclick inline)
    const speciesTriggers = container.querySelectorAll('[data-open-species-index]');
    speciesTriggers.forEach(el => {
        const idx = Number(el.getAttribute('data-open-species-index'));
        el.addEventListener('click', () => openSpeciesModal(idx));
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSpeciesModal(idx); } });
    });

    if (speciesSwiperInstance) {
        speciesSwiperInstance.destroy(true, true);
    }

    if (typeof Swiper !== 'undefined') {
        speciesSwiperInstance = new Swiper('.species-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.species-swiper-next',
                prevEl: '.species-swiper-prev'
            },
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 40 }
            }
        });
    }
}

window.openSpeciesModal = (index) => {
    const species = currentSpeciesList[index];
    if (!species) return;
    fillAndShowSpeciesModal(species);
};

window.openSpeciesModalGlobal = (index) => {
    const species = globalSpeciesList[index];
    if (!species) return;
    fillAndShowSpeciesModal(species);
};

window.openSpeciesModalByName = (name) => {
    if (!name) return;
    const cleanQuery = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const species = globalSpeciesList.find(s => {
        if (s['@id'] && s['@id'].endsWith('/' + cleanQuery)) return true;
        const sName = s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const sAlt = (s.alternateName || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return sName.includes(cleanQuery) || cleanQuery.includes(sName) || sAlt.includes(cleanQuery);
    });
    if (!species) return;
    fillAndShowSpeciesModal(species);
};

function fillAndShowSpeciesModal(species) {
    // Limpiar cualquier vídeo/audio anterior antes de cargar la nueva ficha
    const oldVideoContainer = document.getElementById('speciesModalVideo');
    if (oldVideoContainer) {
        oldVideoContainer.querySelectorAll('video, iframe').forEach(media => {
            try {
                if (media.tagName === 'VIDEO') {
                    media.pause();
                    media.muted = true;
                    media.currentTime = 0;
                    media.src = '';
                    media.style.display = 'none';
                } else if (media.tagName === 'IFRAME') {
                    media.src = 'about:blank';
                    media.style.display = 'none';
                }
            } catch (err) { }
        });
        const placeholder = oldVideoContainer.querySelector('#videoPlaceholder');
        if (placeholder) placeholder.innerHTML = '';
    }
    if (window.currentFishAudio) {
        window.currentFishAudio.pause();
        window.currentFishAudio = null;
    }

    document.getElementById('speciesModalLabel').innerText = species.name;
    document.getElementById('speciesModalScientific').innerText = species.alternateName || '';
    document.getElementById('speciesModalDescription').innerText = species.description || '';

    const imgEl = document.getElementById('speciesModalImage');
    if (!imgEl) return;
    imgEl.style.transition = 'opacity 0.35s ease-in-out';

    const galleryImages = (Array.isArray(species.images) && species.images.length ? species.images : [species.image]).filter(Boolean);
    let currentImagePosition = 0;

    const dotsContainer = document.getElementById('speciesCarouselDots');
    const prevBtn = document.getElementById('speciesCarouselPrev');
    const nextBtn = document.getElementById('speciesCarouselNext');

    const renderDots = () => {
        if (!dotsContainer) return;

        if (galleryImages.length <= 1) {
            dotsContainer.style.display = 'none';
            dotsContainer.innerHTML = '';
            return;
        }

        dotsContainer.style.display = 'flex';
        dotsContainer.innerHTML = galleryImages.map((_, i) => {
            const isActive = i === currentImagePosition;
            return `
                <button type="button" class="btn ${isActive ? 'bg-white' : 'bg-light'}" style="width: 32px; height: 4px; min-width: 32px; border-radius: 2px; border: none; opacity: ${isActive ? '1' : '0.65'};" aria-label="Ir a imagen ${i + 1}" data-index="${i}"></button>
            `;
        }).join('');

        dotsContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const index = Number(event.currentTarget.dataset.index);
                updateCarouselImage(index);
            });
        });
    };

    const updateNavVisibility = () => {
        if (galleryImages.length > 1) {
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) nextBtn.style.display = 'block';
        } else {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    };

    const updateCarouselImage = (pos) => {
        if (!galleryImages.length || !imgEl) return;
        currentImagePosition = ((pos % galleryImages.length) + galleryImages.length) % galleryImages.length;
        const selected = galleryImages[currentImagePosition];

        imgEl.style.opacity = '0';
        setTimeout(() => {
            const rutaCompleta = selected.includes('/') ? selected : `assets/img/peces/webp/${selected}`;
            const rutaLimpia = getImageBasePath(rutaCompleta);
            imgEl.src = `${rutaLimpia}-800.webp`;

            imgEl.alt = `Fotografía detallada de ${species.name}, una especie marina de las aguas de Mallorca`;
            imgEl.style.opacity = '1';
        }, 150);

        renderDots();
        updateNavVisibility();
    };

    if (prevBtn) prevBtn.onclick = () => updateCarouselImage(currentImagePosition - 1);
    if (nextBtn) nextBtn.onclick = () => updateCarouselImage(currentImagePosition + 1);

    updateCarouselImage(0);

    // 1. AUDIO (Dinámico)
    const audioContainer = document.getElementById('speciesModalAudioContainer');
    if (audioContainer) {
        const audioMap = {
            "dorada": "dorada",
            "llampuga": "llampuga",
            "mero": "mero",
            "cap-roig": "cabracho",
            "sargo": "sargo",
            "serrano": "serrano",
            "denton": "denton",
            "oblada": "oblada",
            "salpa": "salpa",
            "lubina": "lubina",
            "serviola": "serviola",
            "espeton": "espeton",
            "corvallo": "corvallo",
            "bonito": "bonito",
            "atun-rojo": "atun",
            "bacoreta": "bacoreta",
            "caballa": "caballa",
            "jurel": "jurel",
            "pez-san-pedro": "pezSanPedro",
            "salmonete": "salmonete",
            "raor": "raor",
            "breca": "breca",
            "herrera": "herrera",
            "congrio": "congrio",
            "morena": "morena"
        };

        let slug = '';
        if (species['@id']) {
            slug = species['@id'].split('/').pop();
        }

        const mappedAudio = audioMap[slug];
        let finalAudioPath = null;

        if (mappedAudio) {
            finalAudioPath = `assets/audio/peces-mallorquin/${mappedAudio}/${mappedAudio}`;
        } else if (species.audio) {
            finalAudioPath = species.audio.includes('/') ? species.audio : `assets/audio/${species.audio}`;
        }

        if (finalAudioPath) {
            audioContainer.innerHTML = `
                <button id="btnAudioToggle_${species.name.replace(/\s+/g, '')}" class="btn btn-outline-primary btn-sm rounded-pill ms-3 shadow-sm px-3 fw-bold" data-toggle-fish-audio data-audio-path="${finalAudioPath}"><i class="bi bi-volume-up me-2"></i> Pronunciación mallorquina</button>
            `;
        } else {
            audioContainer.innerHTML = ``;
        }
    }

    // 2. LOCATIONS (Cross-linking)
    const locContainer = document.getElementById('speciesModalLocations');
    if (locContainer) {
        let locationsHtml = '';
        if (typeof currentSpotsList !== 'undefined' && currentSpotsList.length > 0) {
            const frequentSpots = currentSpotsList.filter(spot => {
                const p = spot.additionalProperty?.find(ap => ap.name === 'Especies Frecuentes');
                return p && p.value && p.value.toLowerCase().includes(species.name.toLowerCase());
            });

            if (frequentSpots.length > 0) {
                const t_freq_zones = (window._i18n && window._i18n.t) ? window._i18n.t('fish_frequent_zones') : 'Zonas de Pesca Frecuentes';
                locationsHtml = `<h4 class="fw-bold mb-3 text-primary mt-4" style="letter-spacing: -0.5px;"><i class="bi bi-geo-alt-fill me-2"></i> ${t_freq_zones}</h4><div class="d-flex flex-wrap gap-2 mb-4">`;
                frequentSpots.forEach((spot) => {
                    const realIndex = currentSpotsList.findIndex(s => s.name === spot.name);
                    locationsHtml += `<span class="badge bg-primary text-white fs-6 px-3 py-2 shadow-sm" role="button" tabindex="0" aria-label="Ver detalles de ${spot.name}" style="cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.classList.replace('bg-primary', 'bg-info')" onmouseout="this.style.transform='scale(1)'; this.classList.replace('bg-info', 'bg-primary')" data-open-spot="${realIndex}" data-hide-target="speciesModal"><i class="bi bi-link-45deg me-1"></i>${spot.name}</span>`;
                });
                locationsHtml += '</div>';
            } else {
                const t_freq_zones = (window._i18n && window._i18n.t) ? window._i18n.t('fish_frequent_zones') : 'Zonas de Pesca Frecuentes';
                const t_no_zones = (window._i18n && window._i18n.t) ? window._i18n.t('fish_no_zones') : 'No se han registrado ubicaciones predominantes fijas o se desconoce con exactitud.';
                locationsHtml = `<h4 class="fw-bold mb-3 text-primary mt-4" style="letter-spacing: -0.5px;"><i class="bi bi-geo-alt-fill me-2"></i> ${t_freq_zones}</h4><p class="text-muted small mb-4">${t_no_zones}</p>`;
            }
        }
        locContainer.innerHTML = locationsHtml;
    }

    // 3. VIDEO (Dinámico)
    const vidContainer = document.getElementById('speciesModalVideo');
    if (vidContainer) {
        const speciesSlug = species['@id'] ? species['@id'].split('/').pop() : '';
        let videoSource = species.video;

        if (!videoSource || speciesSlug === 'lubina') {
            videoSource = 'pesca.mp4';
        }

        if (videoSource) {
            const videoThumbnail = species.videoThumbnail || galleryImages[0] || species.image || 'assets/img/hero-carousel/hero-carousel-1.jpg';
            const rutaLimpiaThumb = videoThumbnail.substring(0, videoThumbnail.lastIndexOf('.'));
            let videoCode = '';

            if (videoSource.includes('youtube.com') || videoSource.includes('youtu.be')) {
                const isEmbed = videoSource.includes('embed');
                const isWatch = videoSource.includes('watch?v=');
                const videoId = isEmbed ? videoSource.split('embed/')[1]?.substring(0, 11) : isWatch ? videoSource.split('watch?v=')[1]?.substring(0, 11) : videoSource.split('.be/')[1]?.substring(0, 11);
                videoCode = `<iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:0; background:#000; display:block;"></iframe>`;
            } else {
                const normalizedVideoPath = videoSource.includes('/') ? videoSource : `assets/video/${videoSource}`;
                const baseVideoPath = normalizedVideoPath.replace(/\.(mp4|webm|ogv|ogg)$/i, '');
                videoCode = `
                    <video controls preload="none" playsinline controlslist="nodownload noremoteplayback" disablepictureinpicture disableremoteplayback poster="${rutaLimpiaThumb}-800.jpg" style="width:100%; height:100%; object-fit: contain; background:#000; display:block;">
                        <source src="${baseVideoPath}.mp4" type="video/mp4">
                        <source src="${baseVideoPath}.webm" type="video/webm">
                        <source src="${baseVideoPath}.ogv" type="video/ogg">
                        Tu navegador no soporta el vídeo HTML5.
                    </video>
                `;
            }

            const t_documentary = (window._i18n && window._i18n.t) ? window._i18n.t('fish_documentary') : 'Documental y Comportamiento';
            const t_play_video = (window._i18n && window._i18n.t) ? window._i18n.t('fish_play_video') : 'Reproducir Vídeo de la Especie';
            vidContainer.innerHTML = `
               <div class="mt-4 pt-3 border-top border-secondary-subtle">
                  <h4 class="fw-bold mb-3 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-play-btn-fill me-2"></i> ${t_documentary}</h4>
                  <div class="position-relative w-100 rounded overflow-hidden shadow-sm" style="aspect-ratio: 16 / 9; background-color: #000; border-radius: 1rem !important;">
                     <div id="videoPlaceholder" class="position-relative w-100 h-100 d-flex justify-content-center align-items-center" style="background-color: #000;">
                        <picture>
                        <source type="image/avif" srcset="${rutaLimpiaThumb}-400.avif 400w, ${rutaLimpiaThumb}-800.avif 800w" sizes="(max-width: 768px) 100vw, 33vw">
                        <source type="image/webp" srcset="${rutaLimpiaThumb}-400.webp 400w, ${rutaLimpiaThumb}-800.webp 800w" sizes="(max-width: 768px) 100vw, 33vw">
                        <source type="image/jpeg" srcset="${rutaLimpiaThumb}-400.jpg 400w, ${rutaLimpiaThumb}-800.jpg 800w" sizes="(max-width: 768px) 100vw, 33vw">
                        
                        <img id="videoThumbnailImg" src="${rutaLimpiaThumb}-800.jpg" alt="Miniatura de vídeo de la especie" style="width: 100%; height: 100%; object-fit: contain; background-color: #000;" loading="lazy">
                        </picture>
                        <div class="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center" style="background-color: rgba(0,0,0,0.45);">
                           <button id="btnPlayVideo" class="btn btn-outline-light rounded-circle" style="width: 64px; height: 64px;" aria-label="Reproducir vídeo documental de la especie"><i class="bi bi-play-fill fs-2"></i></button>
                           <span class="small fw-bold text-white text-uppercase mt-2" style="letter-spacing: 1px;">${t_play_video}</span>
                        </div>
                     </div>
                  </div>
               </div>
            `;

            const btnPlay = document.getElementById('btnPlayVideo');
            if (btnPlay) {
                btnPlay.onclick = () => {
                    const placeholder = document.getElementById('videoPlaceholder');
                    if (placeholder) {
                        placeholder.innerHTML = videoCode;
                        const insertedVideo = placeholder.querySelector('video');
                        if (insertedVideo) {
                            insertedVideo.setAttribute('playsinline', '');
                            const playPromise = insertedVideo.play();
                            if (playPromise && typeof playPromise.catch === 'function') {
                                playPromise.catch(() => {
                                    insertedVideo.muted = true;
                                    insertedVideo.play().catch(() => {
                                    });
                                });
                            }
                        }
                    }
                };
            }
        } else {
            vidContainer.innerHTML = ``;
        }
    }

    const propsContainer = document.getElementById('speciesModalProperties');

    // Función para asignar colores e iconos por tipo de atributo
    const getPropIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('talla') || n.includes('cupo')) return { icon: 'bi-rulers', color: 'text-danger', bg: 'bg-danger', bgSubtle: 'bg-opacity-10' };
        if (n.includes('veda')) return { icon: 'bi-calendar-x', color: 'text-danger', bg: 'bg-danger', bgSubtle: 'bg-opacity-10' };
        if (n.includes('dificultad')) return { icon: 'bi-speedometer2', color: 'text-warning', bg: 'bg-warning', bgSubtle: 'bg-opacity-10' };
        if (n.includes('gastron')) return { icon: 'bi-star-fill', color: 'text-warning', bg: 'bg-warning', bgSubtle: 'bg-opacity-10' };
        if (n.includes('modalidad') || n.includes('pesca') || n.includes('cebo')) return { icon: 'bi-crosshair', color: 'text-success', bg: 'bg-success', bgSubtle: 'bg-opacity-10' };
        if (n.includes('hábita') || n.includes('fondo') || n.includes('profundi')) return { icon: 'bi-water', color: 'text-info', bg: 'bg-info', bgSubtle: 'bg-opacity-10' };
        return { icon: 'bi-info-circle', color: 'text-primary', bg: 'bg-primary', bgSubtle: 'bg-opacity-10' };
    };

    let propsHtml = '<div class="row g-2">';
    if (species.additionalProperty) {
        species.additionalProperty.forEach(prop => {
            const { icon, color, bg, bgSubtle } = getPropIcon(prop.name);
            propsHtml += `
                <div class="col-12 col-sm-6 mb-2">
                   <div class="d-flex align-items-center p-2 rounded shadow-sm border border-light bg-white h-100">
                      <div class="${bg} ${bgSubtle} rounded p-2 me-3 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; flex-shrink: 0;">
                         <i class="bi ${icon} ${color} fs-5"></i>
                      </div>
                      <div class="text-start">
                         <span class="d-block fw-bold text-dark" style="font-size: 0.70rem; text-transform: uppercase; letter-spacing: 0.5px;">${prop.name}</span>
                         <span class="text-muted d-block lh-sm" style="font-size: 0.85rem;">${prop.value} ${prop.unitText || ''}</span>
                      </div>
                   </div>
                </div>
            `;
        });
    }
    propsHtml += '</div>';
    propsContainer.innerHTML = propsHtml;

    // Actualizar botón de captura en el header
    const actionContainer = document.getElementById('speciesModalCatchAction');
    if (actionContainer) {
        const user = AuthService.getUser();
        const isGoogleUser = user && !user.id.startsWith('mock-');

        if (!isGoogleUser) {
            actionContainer.innerHTML = ''; // Ocultar botón si no es Google
        } else {
            const isCaught = caughtSpecies.includes(species.name);
            if (isCaught) {
                actionContainer.innerHTML = `<button class="btn btn-success btn-sm rounded-pill py-1 px-3 shadow-sm" data-toggle-catch="${species.name}"><i class="bi bi-check-circle-fill me-1"></i> Capturado</button>`;
            } else {
                actionContainer.innerHTML = `<button class="btn btn-primary btn-sm rounded-pill py-1 px-3 shadow-sm text-white" data-toggle-catch="${species.name}"><i class="bi bi-plus-circle me-1"></i> Marcar como capturado</button>`;
            }
        }
    }

    // Verificar si el modal ya está inicializado
    const modalEl = document.getElementById('speciesModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }

    // ... resto de lógica de JSON-LD y show() ...


    // Actualizar JSON-LD para la especie
    SemanticService.updateSpeciesJsonLd(species);

    // Trap focus inside modal and preserve opener
    try { trapFocusInModal(modalEl, document.activeElement); } catch (e) { /* noop */ }
    modal.show();
}


// ==========================================
// SECCIÓN PECEDEX
// ==========================================

let caughtSpecies = JSON.parse(localStorage.getItem('caughtSpecies')) || [];

// Función para sincronizar con el servidor
async function syncPecedexWithServer(merge = false) {
    const user = AuthService.getUser();
    if (!user || user.id.startsWith('mock-')) return;

    try {
        const response = await fetch('forms/sync_pecedex.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                caught_list: caughtSpecies,
                merge: merge // El PHP decide si fusiona o sobrescribe
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success' && data.caught_list) {
                caughtSpecies = data.caught_list;
                localStorage.setItem('caughtSpecies', JSON.stringify(caughtSpecies));

                if (globalSpeciesList && globalSpeciesList.length > 0) {
                    initPecedex(globalSpeciesList);
                }
            }
        }
    } catch (err) {
        console.warn("Error en la sincronización de Pecédex:", err);
    }
}

// Escuchar cambios de sesión para sincronizar
window.addEventListener('auth-change', (e) => {
    const user = e.detail;
    if (user && !user.id.startsWith('mock-')) {
        syncPecedexWithServer(true); // Fusionar al entrar
    } else {
        caughtSpecies = [];
        localStorage.removeItem('caughtSpecies');
        if (window.globalSpeciesList && window.globalSpeciesList.length > 0) {
            window.initPecedex(window.globalSpeciesList);
        }
    }
});

window.initPecedex = (speciesArray) => {
    const grid = document.getElementById('pecedex-grid');
    const progressEl = document.getElementById('pecedex-progress');
    const totalEl = document.getElementById('pecedex-total');
    if (!grid) return;

    const user = AuthService.getUser();
    const isGoogleUser = user && !user.id.startsWith('mock-');

    if (totalEl) totalEl.textContent = speciesArray.length;
    if (progressEl) progressEl.textContent = isGoogleUser ? caughtSpecies.length : 0;

    // Controlar visibilidad del botón de reinicio
    const resetBtn = document.getElementById('pecedex-reset-btn');
    if (resetBtn) {
        resetBtn.style.display = isGoogleUser ? 'inline-block' : 'none';
    }

    if (!isGoogleUser) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="p-5 bg-white rounded-4 shadow-sm border border-light">
                    <i class="bi bi-lock-fill text-primary mb-3" style="font-size: 3rem;"></i>
                    <h4 class="fw-bold" data-i18n="pecedex_blocked_title">${t('pecedex_blocked_title', 'Pecédex Bloqueada')}</h4>
                    <p class="text-muted" data-i18n="pecedex_blocked_message">${t('pecedex_blocked_message', 'Inicia sesión con Google para registrar y sincronizar tus capturas.')}</p>
                    <button class="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#loginModal">
                        <i class="bi bi-person-circle me-2"></i> <span data-i18n="pecedex_login_button">${t('pecedex_login_button', 'Iniciar sesión ahora')}</span>
                    </button>
                </div>
            </div>
        `;
        return;
    }

    let html = '';
    speciesArray.forEach((species, index) => {
        const isCaught = caughtSpecies.includes(species.name);
        const imgStyle = isCaught ? 'filter: brightness(1) drop-shadow(0 4px 6px rgba(0,0,0,0.1));' : 'filter: brightness(0.1) grayscale(1); opacity: 0.6;';
        const action = isCaught ? `openSpeciesModalGlobal(${index})` : ``;
        const pointerStyle = isCaught ? `cursor: pointer; transition: transform 0.2s;` : `cursor: default; opacity: 0.8;`;
        const hoverAnim = isCaught ? `onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"` : '';

        html += `
                    <div class="col-4 col-sm-3 col-md-3 col-lg-2">
                         <div class="card h-100 border-0 bg-transparent text-center" role="button" tabindex="0" aria-label="${isCaught ? `Ver detalles de ${species.name}` : 'Especie no capturada'}" style="${pointerStyle}" ${hoverAnim} ${isCaught ? `data-open-species-global="${index}"` : ''} title="${isCaught ? 'Ver ficha técnica de la especie' : 'Captura esta especie para desbloquearla'}">
               <div class="position-relative mx-auto rounded-circle d-flex justify-content-center align-items-center" style="width: 80px; height: 80px; background-color: ${isCaught ? '#eef2ff' : '#f8f9fa'}; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);">
                 <img src="${species.image}" alt="${isCaught ? `Fotografía de ${species.name}` : 'Especie no capturada'}" class="img-fluid rounded-circle object-fit-cover" style="width: 65px; height: 65px; ${imgStyle}" loading="lazy" decoding="async">
                 ${isCaught ? '<i class="bi bi-check-circle-fill text-success position-absolute" style="bottom: 0px; right: 0px; font-size: 1.2rem; background: white; border-radius: 50%;"></i>' : ''}
               </div>
               <div class="card-body p-2">
                 <small class="card-title fw-bold ${isCaught ? 'text-primary' : 'text-muted'} d-block text-truncate" style="font-size: 0.8rem;">${isCaught ? species.name : '???'}</small>
               </div>
             </div>
          </div>
        `;
    });

    grid.innerHTML = html;
};

window.toggleCatchSpecies = (event, name) => {
    if (event) event.stopPropagation();

    if (caughtSpecies.includes(name)) {
        caughtSpecies = caughtSpecies.filter(s => s !== name);
    } else {
        caughtSpecies.push(name);
    }
    localStorage.setItem('caughtSpecies', JSON.stringify(caughtSpecies));

    syncPecedexWithServer();

    if (globalSpeciesList && globalSpeciesList.length > 0) {
        initPecedex(globalSpeciesList);
    }

    const actionContainer = document.getElementById('speciesModalCatchAction');
    if (actionContainer) {
        const isCaught = caughtSpecies.includes(name);
        if (isCaught) {
            actionContainer.innerHTML = `<button class="btn btn-success btn-sm rounded-pill py-1 px-3 shadow-sm" data-toggle-catch="${name}"><i class="bi bi-check-circle-fill me-1"></i> Capturado</button>`;
        } else {
            actionContainer.innerHTML = `<button class="btn btn-primary btn-sm rounded-pill py-1 px-3 shadow-sm text-white" data-toggle-catch="${name}"><i class="bi bi-plus-circle me-1"></i> Marcar como capturado</button>`;
        }
    }
};

window.showResetPecedexModal = () => {
    const modalEl = document.getElementById('resetPecedexModal');
    const resetBtn = document.querySelector('#pecedex button[onclick*="showResetPecedexModal"]');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    trapFocusInModal(modalEl, resetBtn);
};

window.confirmResetPecedex = () => {
    caughtSpecies = [];
    localStorage.removeItem('caughtSpecies');
    syncPecedexWithServer();
    if (globalSpeciesList && globalSpeciesList.length > 0) {
        initPecedex(globalSpeciesList);
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('resetPecedexModal'));
    modal.hide();
};