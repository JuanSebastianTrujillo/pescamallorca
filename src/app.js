import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { HeroSection } from "./components/HeroSection.js";
import { SpotsSection } from "./components/SpotsSection.js";
import { MapSection, initMapSection } from "./components/MapSection.js";
import { SpeciesSection } from "./components/SpeciesSection.js";
import { RulesSection } from "./components/RulesSection.js";
import { WeatherSection, initWeather } from "./components/WeatherSection.js";
import { ShopsSection, initShops } from "./components/ShopsSection.js";
import { RampsSection, initRamps } from "./components/RampsSection.js";
import { AuthorsSection } from "./components/AuthorsSection.js";
import { ContactSection } from "./components/ContactSection.js";
import { QuizSection, initQuiz } from "./components/QuizSection.js";
import { PecedexSection } from "./components/PecedexSection.js";
import { initTheme } from "../assets/js/main.js";
import { initAccessibility } from "./services/AccessibilityService.js";

const app = document.getElementById('app');

// Inicializar la estructura general renderizando todas las secciones de golpe
const renderApp = () => {
    app.innerHTML = `
        ${Header()}
        <main class="main" id="main-content">
            ${HeroSection()}
            ${SpotsSection()}
            ${SpeciesSection()}
            ${PecedexSection()}
            ${MapSection()}           
            ${WeatherSection()}
            ${QuizSection()}
            ${ShopsSection()}
            ${RampsSection()}
            ${RulesSection()}
            ${AuthorsSection()}
            ${ContactSection()}
        </main>
        ${Footer()}
    `;
};

// Se ejecuta cuando el HTML index ha cargado la base
// Datos globales compartidos entre módulos (mapa, quiz)
let globalZonesData = [];

document.addEventListener("DOMContentLoaded", () => {
    renderApp();

    // Al ser todo una misma página, inicializamos los datos de inmediato
    loadSpotsData();
    loadSpeciesData();
    loadMonthSpecies();
    initWeather();
    initShops();
    initRamps();

    // Inicializar accesibilidad (TTS, contraste, zoom)
    initAccessibility();

    // Inicializar JS de Bootstrap y theme (scroll spy, headers pegadizos...);
    initTheme();

    // Listeners globales para apagar multimedia al cerrar modales
    const fishModal = document.getElementById('speciesModal');
    if (fishModal) {
        fishModal.addEventListener('hidden.bs.modal', () => {
            if (window.currentFishAudio) {
                window.currentFishAudio.pause();
                window.currentFishAudio.currentTime = 0;
                window.currentFishAudio = null;
            }

            // Restaurar cualquier botón de audio a estado por defecto
            document.querySelectorAll('[id^="btnAudioToggle_"]').forEach(btn => {
                btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> Escuchar Sonido';
                btn.classList.remove('btn-primary', 'text-white');
                btn.classList.add('btn-outline-primary');
            });

            const vidPlaceholder = document.getElementById('videoPlaceholder');
            if (vidPlaceholder) {
                const iframe = vidPlaceholder.querySelector('iframe');
                if (iframe) iframe.src = iframe.src; // Recargar iframe corta el video
                const videoTag = vidPlaceholder.querySelector('video');
                if (videoTag) videoTag.pause();
            }
        });
    }
});

window.submitContactForm = function (event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const lastname = document.getElementById('contact-lastname').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !lastname || !email || !subject || !message) {
        alert('Por favor, rellena todos los campos antes de enviar.');
        return;
    }

    const responseEl = document.getElementById('contact-response');
    responseEl.innerText = '¡Mensaje enviado correctamente! Gracias por contactar con nosotros.';
    responseEl.style.display = 'inline-block';

    document.getElementById('contact-form').reset();

    setTimeout(() => {
        responseEl.style.display = 'none';
    }, 5000);
};

async function loadMonthSpecies() {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentMonthName = new Date().toLocaleString('es-ES', { month: 'long' });
    const formattedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

    try {
        const response = await fetch('/assets/data/especies.json');
        const schema = await response.json();
        const allSpecies = schema['@graph'] || [];

        // Filtrar especies disponibles en el mes actual
        const monthSpecies = allSpecies.filter(species => {
            const monthStart = species.additionalProperty?.find(p => p.name === 'Inicio temporada');
            const monthEnd = species.additionalProperty?.find(p => p.name === 'Fin temporada');

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

        const monthSpeciesContainer = document.getElementById('month-species-container');
        const indicatorsContainer = document.getElementById('hero-carousel-indicators');
        const carouselInner = document.getElementById('hero-carousel-inner');

        if (!monthSpeciesContainer || !indicatorsContainer || !carouselInner) {
            return;
        }

        // Crear una diapositiva por cada pez del mes
        monthSpecies.forEach((sp, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-item';
            slide.setAttribute('data-species-name', sp.name);
            slide.innerHTML = `
                <img src="${sp.image}" alt="${sp.name}" style="position: absolute; width: 100%; height: 100%; object-fit: cover;">
                <div class="carousel-container">
                    <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.8rem, 5vw, 3rem);">Peces del Mes - ${formattedMonth}</h2>
                    <h3 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.5rem, 4vw, 2.5rem); margin-top: clamp(3rem, 15vw, 10rem);">${sp.name}</h3>
                    <div style="margin-top: 1.5rem;">
                        <button class="btn btn-primary rounded-pill px-4 py-2 shadow-sm border-0 text-white" onclick="openSpeciesModalByName('${sp.name}')" style="pointer-events: auto; position: relative; z-index: 50; font-weight: 600;">
                            <i class="bi bi-info-circle me-1"></i> Ver Ficha Técnica
                        </button>
                    </div>
                </div>
            `;

            monthSpeciesContainer.appendChild(slide);
        });

        // Regenerar indicadores para todas las diapositivas
        const totalSlides = carouselInner.querySelectorAll('.carousel-item').length;
        indicatorsContainer.innerHTML = '';

        for (let i = 0; i < totalSlides; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('data-bs-target', '#hero-carousel');
            btn.setAttribute('data-bs-slide-to', i.toString());
            if (i === 0) {
                btn.classList.add('active');
                btn.setAttribute('aria-current', 'true');
            }
            btn.setAttribute('aria-label', `Slide ${i + 1}`);
            indicatorsContainer.appendChild(btn);
        }

    } catch (e) {
        console.error("Error al cargar peces del mes:", e);
    }
}

let currentSpotsList = [];

async function loadSpotsData() {
    const spotsContainer = document.getElementById('spots-container');
    if (!spotsContainer) return;

    try {
        const response = await fetch('/assets/data/zonas.json');
        const schema = await response.json();

        // Extraer los spots
        const spots = schema['@graph'].filter(item => item['@type'] === 'Place' && !item.name.includes('Reserva'));

        // Guardamos los spots filtrados en la variable global
        currentSpotsList = spots;
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
        spotsContainer.innerHTML = '<div class="alert alert-danger">Error cargando información de Spots. Asegúrate de estar usando un servidor local.</div>';
    }
}

// Nueva función exclusiva para pintar tarjetas
function renderSpotsCards(spotsArray) {
    const spotsContainer = document.getElementById('spots-container');
    if (!spotsContainer) return;

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
        htmlCards += `
          <div class="col-lg-4 col-md-6">
            <div class="card h-100 shadow-sm border-0 spot-card" onclick="openSpotModal(${originalIndex})" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              <img src="${imgSrc}" class="card-img-top object-fit-cover" alt="${spot.name}" style="height:200px">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-primary fw-bold">${spot.name}</h5>
                <p class="card-text text-muted small"><i class="bi bi-geo-alt"></i> ${spot.address?.addressLocality || 'Desconocido'}</p>
                <p class="card-text text-truncate">${spot.description}</p>
                <div class="mt-auto">
                    ${spot.keywords ? spot.keywords.split(',').slice(0,2).map(tag => `<span class="badge bg-light text-dark border me-1 my-1">${tag.trim()}</span>`).join('') : ''}
                </div>
              </div>
            </div>
          </div>
        `;
    });

    spotsContainer.innerHTML = htmlCards;

    if (typeof AOS !== 'undefined') AOS.init();
}

// LÓGICA DEL RECOMENDADOR
window.applyRecommender = () => {
    const filtroZona = document.getElementById('rec-zona').value.toLowerCase();
    const filtroTiempo = document.getElementById('rec-tiempo').value.toLowerCase(); // ¡Añadido nuevo filtro!
    const filtroTecnica = document.getElementById('rec-tipo').value.toLowerCase();
    const filtroPez = document.getElementById('rec-pez').value.toLowerCase();

    const zonasRecomendadas = currentSpotsList.filter(spot => {
        let esValida = true;

        const leerPropiedad = (nombreProp) => {
            if (!spot.additionalProperty) return "";
            const prop = spot.additionalProperty.find(p => p.name === nombreProp);
            // Quitamos tildes
            return prop ? prop.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
        };

        const localidad = spot.address?.addressLocality?.toLowerCase() || "";
        const tiempoDisponibles = leerPropiedad('Momento del Día');
        const tecnicasDisponibles = leerPropiedad('Técnicas Recomendadas');
        const especiesDisponibles = leerPropiedad('Especies Frecuentes');

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
        galleryHtml += `
            <div class="${images.length > 1 ? 'col-6' : 'col-12'} mb-2">
                <img src="${img}" class="img-fluid rounded shadow-sm w-100 object-fit-cover" style="height: 200px;" alt="Imagen de la zona" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
            </div>
        `;
    });
    galleryContainer.innerHTML = galleryHtml;

    const getPropValue = (propName) => {
        const prop = spot.additionalProperty?.find(p => p.name === propName);
        return prop ? prop.value : '<span class="text-muted fst-italic">Información no disponible</span>';
    };

    document.getElementById('spotModalAccess').innerHTML = getPropValue('Acceso');
    document.getElementById('spotModalSeabed').innerHTML = getPropValue('Fondo Marino');
    document.getElementById('spotModalTechniques').innerHTML = getPropValue('Técnicas Recomendadas');
    // Pintamos el nuevo atributo en el modal
    document.getElementById('spotModalTime').innerHTML = getPropValue('Momento del Día');

    const speciesRaw = getPropValue('Especies Frecuentes');
    if (speciesRaw.includes('Información no')) {
        document.getElementById('spotModalSpecies').innerHTML = speciesRaw;
    } else {
        const badges = speciesRaw.split(',').map(s => {
            const fishName = s.trim();
            return `<span class="badge bg-success me-1 mb-1 fs-6 px-3 py-2 shadow-sm" style="cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.classList.replace('bg-success', 'bg-primary')" onmouseout="this.style.transform='scale(1)'; this.classList.replace('bg-primary', 'bg-success')" onclick="bootstrap.Modal.getInstance(document.getElementById('spotModal'))?.hide(); setTimeout(() => openSpeciesModalByName('${fishName}'), 400);"><i class="bi bi-link-45deg me-1"></i>${fishName}</span>`;
        }).join('');
        document.getElementById('spotModalSpecies').innerHTML = badges;
    }

    // Comentarios y reportes comunitarios de la zona
    window.currentSpotIndex = index;
    setTimeout(() => {
        window.renderSpotComments(spot.name);
    }, 100);

    const modalEl = document.getElementById('spotModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
};

window.renderSpotComments = (spotName) => {
    // Código inalterado de tus comentarios...
    const container = document.getElementById('spotModalCommentsContainer');
    if (!container) return;
    const safeKey = `pm_spot_comments_${spotName.replace(/\\s+/g, '_')}`;
    const comments = JSON.parse(localStorage.getItem(safeKey)) || [];
    if (comments.length === 0) {
        container.innerHTML = '<p class="text-muted small fst-italic"><i class="bi bi-info-circle me-1"></i>No hay reportes recientes. ¡Sé el primero en compartir qué tipo de capturas entraron hoy!</p>';
        return;
    }
    let html = '';
    comments.forEach(c => {
        html += `
        <div class="mb-3 p-3 bg-white border border-light rounded shadow-sm border-start border-primary border-4">
            <div class="d-flex align-items-center mb-2">
                <i class="bi bi-person-fill text-secondary fs-5 me-2"></i>
                <strong class="text-dark">Pescador Local</strong>
                <span class="ms-auto small text-muted"><i class="bi bi-clock me-1"></i>${c.date}</span>
            </div>
            <p class="mb-0 text-secondary" style="white-space: pre-wrap; font-size: 0.95rem;">${c.text}</p>
        </div>`;
    });
    container.innerHTML = html;
};

window.submitSpotComment = () => {
    // Código inalterado de tus comentarios...
    if (window.currentSpotIndex === undefined) return;
    const input = document.getElementById('spotCommentInput');
    const text = input ? input.value.trim() : '';
    if (!text) return;
    const spotName = currentSpotsList[window.currentSpotIndex].name;
    const safeKey = `pm_spot_comments_${spotName.replace(/\\s+/g, '_')}`;
    const comments = JSON.parse(localStorage.getItem(safeKey)) || [];
    comments.unshift({ text, date: new Date().toLocaleDateString('es-ES') });
    localStorage.setItem(safeKey, JSON.stringify(comments));
    input.value = '';
    window.renderSpotComments(spotName);
};

window.toggleFishAudio = (btn, audioPath) => {
    if (!btn || !audioPath) return;

    // Si ya suena algo y es el mismo audio, detenlo
    if (window.currentFishAudio && !window.currentFishAudio.paused) {
        window.currentFishAudio.pause();
        window.currentFishAudio.currentTime = 0;
        window.currentFishAudio = null;

        btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> Escuchar Sonido';
        btn.classList.replace('btn-primary', 'btn-outline-primary');
        btn.classList.remove('text-white');
        return;
    }

    // Parar audio existente si hay uno (otra especie)
    if (window.currentFishAudio) {
        window.currentFishAudio.pause();
        window.currentFishAudio.currentTime = 0;
        window.currentFishAudio = null;
    }

    // Crear y reproducir lejos de blocos de sincronización extra
    try {
        const audio = new Audio(audioPath);
        audio.preload = 'auto';
        window.currentFishAudio = audio;

        audio.play().then(() => {
            btn.innerHTML = '<i class="bi bi-stop-circle-fill me-2"></i> Detener Sonido';
            btn.classList.replace('btn-outline-primary', 'btn-primary');
            btn.classList.add('text-white');
        }).catch((err) => {
            console.error('Error al reproducir audio:', err);
            btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> Escuchar Sonido';
            btn.classList.replace('btn-primary', 'btn-outline-primary');
            btn.classList.remove('text-white');
            window.currentFishAudio = null;
        });

        audio.onended = () => {
            btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> Escuchar Sonido';
            btn.classList.replace('btn-primary', 'btn-outline-primary');
            btn.classList.remove('text-white');
            window.currentFishAudio = null;
        };
    } catch (error) {
        console.error('toggleFishAudio error:', error);
        btn.innerHTML = '<i class="bi bi-volume-up me-2"></i> Escuchar Sonido';
        btn.classList.replace('btn-primary', 'btn-outline-primary');
        btn.classList.remove('text-white');
    }
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
        const response = await fetch('/assets/data/especies.json');
        const schema = await response.json();

        let allSpecies = schema['@graph'] || [];
        globalSpeciesList = allSpecies;
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
            const txt = document.getElementById('filter-text').value.toLowerCase();

            const filtered = allSpecies.filter(sp => {
                let pass = true;

                // Filtro Dificultad
                if (dif !== 'todo') {
                    const prop = sp.additionalProperty?.find(p => p.name === 'Dificultad');
                    if (!prop || prop.value.toLowerCase() !== dif) pass = false;
                }

                // Filtro Calidad Culinaria
                if (cal !== 'todo' && pass) {
                    const prop = sp.additionalProperty?.find(p => p.name === 'Calidad culinaria');
                    if (!prop) { pass = false; }
                    else {
                        let val = prop.value.toLowerCase();
                        if (cal === 'moderada' && !val.includes('baja') && !val.includes('moderada')) pass = false;
                        else if (cal !== 'moderada' && !val.includes(cal)) pass = false;
                    }
                }

                // Filtro Texto Libre (Nombre, metodos, descripcion)
                if (txt.length > 0 && pass) {
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
        });

    } catch (e) {
        console.error("Error al cargar JSON de especies:", e);
        speciesContainer.innerHTML = '<div class="alert alert-danger w-100">Error cargando información de Especies.</div>';
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
        htmlCards += `
          <div class="swiper-slide py-3">
             <div class="card h-100 shadow border-0 cursor-pointer species-card" onclick="openSpeciesModal(${index})" style="transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
               <img src="${species.image}" class="card-img-top object-fit-cover" alt="${species.name}" style="height:250px" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
               <div class="card-body text-center bg-white rounded-bottom">
                 <h5 class="card-title text-primary fw-bold mb-1">${species.name}</h5>
               </div>
             </div>
          </div>
        `;
    });

    container.innerHTML = htmlCards;

    if (speciesSwiperInstance) {
        speciesSwiperInstance.destroy(true, true);
    }

    if (typeof Swiper !== 'undefined') {
        speciesSwiperInstance = new Swiper('.species-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
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
    const species = globalSpeciesList.find(s => s.name === name);
    if (!species) return;
    fillAndShowSpeciesModal(species);
};

function fillAndShowSpeciesModal(species) {
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
            imgEl.src = selected.includes('/') ? selected : `/assets/img/peces/${selected}`;
            imgEl.alt = `${species.name} imagen ${currentImagePosition + 1}`;
            imgEl.onerror = () => { imgEl.src = 'assets/img/hero-carousel/hero-carousel-1.jpg'; };
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
        if (species.audio) {
            const audioPath = species.audio.includes('/') ? species.audio : `/assets/audio/${species.audio}`;
            audioContainer.innerHTML = `
               <button id="btnAudioToggle_${species.name.replace(/\s+/g, '')}" class="btn btn-outline-primary btn-sm rounded-pill ms-3 shadow-sm px-3 fw-bold" onclick="window.toggleFishAudio(this, '${audioPath}')"><i class="bi bi-volume-up me-2"></i> Escuchar Sonido</button>
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
                locationsHtml = '<h5 class="fw-bold mb-3 text-primary mt-4" style="letter-spacing: -0.5px;"><i class="bi bi-geo-alt-fill me-2"></i> Zonas de Pesca Frecuentes</h5><div class="d-flex flex-wrap gap-2 mb-4">';
                frequentSpots.forEach((spot) => {
                    const realIndex = currentSpotsList.findIndex(s => s.name === spot.name);
                    locationsHtml += `<span class="badge bg-primary text-white fs-6 px-3 py-2 shadow-sm" style="cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.classList.replace('bg-primary', 'bg-info')" onmouseout="this.style.transform='scale(1)'; this.classList.replace('bg-info', 'bg-primary')" onclick="bootstrap.Modal.getInstance(document.getElementById('speciesModal'))?.hide(); setTimeout(() => openSpotModal(${realIndex}), 400);"><i class="bi bi-link-45deg me-1"></i>${spot.name}</span>`;
                });
                locationsHtml += '</div>';
            } else {
                locationsHtml = '<h5 class="fw-bold mb-3 text-primary mt-4" style="letter-spacing: -0.5px;"><i class="bi bi-geo-alt-fill me-2"></i> Zonas de Pesca Frecuentes</h5><p class="text-muted small mb-4">No se han registrado ubicaciones predominantes fijas o se desconoce con exactitud.</p>';
            }
        }
        locContainer.innerHTML = locationsHtml;
    }

    // 3. VIDEO (Dinámico)
    const vidContainer = document.getElementById('speciesModalVideo');
    if (vidContainer) {
        if (species.video) {
            const videoThumbnail = species.videoThumbnail || galleryImages[0] || species.image || 'assets/img/hero-carousel/hero-carousel-1.jpg';
            let videoCode = '';

            if (species.video.includes('youtube.com') || species.video.includes('youtu.be')) {
                const isEmbed = species.video.includes('embed');
                const isWatch = species.video.includes('watch?v=');
                const videoId = isEmbed ? species.video.split('embed/')[1]?.substring(0, 11) : isWatch ? species.video.split('watch?v=')[1]?.substring(0, 11) : species.video.split('.be/')[1]?.substring(0, 11);
                videoCode = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:0; background:#000; display:block;"></iframe>`;
            } else {
                const videoPath = species.video.includes('/') ? species.video : `/assets/video/${species.video}`;
                videoCode = `<video controls autoplay style="width:100%; height:100%; object-fit: contain; background:#000; display:block;"><source src="${videoPath}" type="video/mp4">Tu navegador no soporta el video.</video>`;
            }

            vidContainer.innerHTML = `
               <div class="mt-4 pt-3 border-top border-secondary-subtle">
                  <h5 class="fw-bold mb-3 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-play-btn-fill me-2"></i> Documental y Comportamiento</h5>
                  <div class="position-relative w-100 rounded overflow-hidden shadow-sm" style="aspect-ratio: 16 / 9; background-color: #000; border-radius: 1rem !important;">
                     <div id="videoPlaceholder" class="position-relative w-100 h-100 d-flex justify-content-center align-items-center" style="background-color: #000;">
                        <img id="videoThumbnailImg" src="${videoThumbnail}" alt="Miniatura del vídeo" style="width: 100%; height: 100%; object-fit: contain; background-color: #000;" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'" />
                        <div class="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center" style="background-color: rgba(0,0,0,0.45);">
                           <button id="btnPlayVideo" class="btn btn-outline-light rounded-circle" style="width: 64px; height: 64px;"><i class="bi bi-play-fill fs-2"></i></button>
                           <span class="small fw-bold text-white text-uppercase mt-2" style="letter-spacing: 1px;">Reproducir Vídeo de la Especie</span>
                        </div>
                     </div>
                  </div>
               </div>
            `;

            const btnPlay = document.getElementById('btnPlayVideo');
            if (btnPlay) {
                btnPlay.onclick = () => {
                    const placeholder = document.getElementById('videoPlaceholder');
                    if (placeholder) placeholder.innerHTML = videoCode;
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
        const isCaught = caughtSpecies.includes(species.name);
        if (isCaught) {
            actionContainer.innerHTML = `<button class="btn btn-success btn-sm rounded-pill py-1 px-3 shadow-sm" onclick="toggleCatchSpecies(event, '${species.name}')"><i class="bi bi-check-circle-fill me-1"></i> Capturado</button>`;
        } else {
            actionContainer.innerHTML = `<button class="btn btn-primary btn-sm rounded-pill py-1 px-3 shadow-sm text-white" onclick="toggleCatchSpecies(event, '${species.name}')"><i class="bi bi-plus-circle me-1"></i> Marcar como capturado</button>`;
        }
    }

    // Verificar si el modal ya está inicializado. Si no, lo inicializa Bootstrap.
    const modalEl = document.getElementById('speciesModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
}


// ==========================================
// SECCIÓN PECEDEX
// ==========================================

let caughtSpecies = JSON.parse(localStorage.getItem('caughtSpecies')) || [];

window.initPecedex = (speciesArray) => {
    const grid = document.getElementById('pecedex-grid');
    const progressEl = document.getElementById('pecedex-progress');
    const totalEl = document.getElementById('pecedex-total');
    if (!grid) return;

    if (totalEl) totalEl.textContent = speciesArray.length;
    if (progressEl) progressEl.textContent = caughtSpecies.length;

    let html = '';
    speciesArray.forEach((species, index) => {
        const isCaught = caughtSpecies.includes(species.name);
        // Efectos: La silueta se oscurece al 20% y en blanco y negro (0.2 y grayscale)
        const imgStyle = isCaught ? 'filter: brightness(1) drop-shadow(0 4px 6px rgba(0,0,0,0.1));' : 'filter: brightness(0.1) grayscale(1); opacity: 0.6;';

        // Si está capturado abre la ficha. Si no, no hace nada
        const action = isCaught ? `openSpeciesModalGlobal(${index})` : ``;
        const pointerStyle = isCaught ? `cursor: pointer; transition: transform 0.2s;` : `cursor: default; opacity: 0.8;`;
        const hoverAnim = isCaught ? `onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"` : '';

        html += `
          <div class="col-4 col-sm-3 col-md-3 col-lg-2">
             <div class="card h-100 border-0 bg-transparent text-center" style="${pointerStyle}" ${hoverAnim} onclick="${action}" title="${isCaught ? 'Ver ficha técnica de la especie' : 'Ve a la lista de Especies para registrar esta captura'}">
               <div class="position-relative mx-auto rounded-circle d-flex justify-content-center align-items-center" style="width: 80px; height: 80px; background-color: ${isCaught ? '#eef2ff' : '#f8f9fa'}; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);">
                 <img src="${species.image}" alt="${species.name}" class="img-fluid rounded-circle object-fit-cover" style="width: 65px; height: 65px; ${imgStyle}" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
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
        // Desmarcar
        caughtSpecies = caughtSpecies.filter(s => s !== name);
    } else {
        // Marcar
        caughtSpecies.push(name);
    }
    localStorage.setItem('caughtSpecies', JSON.stringify(caughtSpecies));

    // Auto-update Pecedex Grid en fondo
    if (globalSpeciesList && globalSpeciesList.length > 0) {
        initPecedex(globalSpeciesList);
    }

    // Cambiar estado visual del botón del modal instantáneamente
    const actionContainer = document.getElementById('speciesModalCatchAction');
    if (actionContainer) {
        const isCaught = caughtSpecies.includes(name);
        if (isCaught) {
            actionContainer.innerHTML = `<button class="btn btn-success btn-sm rounded-pill py-1 px-3 shadow-sm" onclick="toggleCatchSpecies(event, '${name}')"><i class="bi bi-check-circle-fill me-1"></i> Capturado</button>`;
        } else {
            actionContainer.innerHTML = `<button class="btn btn-primary btn-sm rounded-pill py-1 px-3 shadow-sm text-white" onclick="toggleCatchSpecies(event, '${name}')"><i class="bi bi-plus-circle me-1"></i> Marcar como capturado</button>`;
        }
    }
};

window.resetPecedex = () => {
    if (confirm('¿Seguro que quieres borrar todo tu registro de capturas de la Pecedex?')) {
        caughtSpecies = [];
        localStorage.removeItem('caughtSpecies');
        if (currentSpeciesList) initPecedex(currentSpeciesList);
    }
};