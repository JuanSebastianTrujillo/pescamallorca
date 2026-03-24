import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { HeroSection } from "./components/HeroSection.js";
import { SpotsSection } from "./components/SpotsSection.js";
import { MapSection } from "./components/MapSection.js";
import { SpeciesSection } from "./components/SpeciesSection.js";
import { RulesSection } from "./components/RulesSection.js";
import { WeatherSection, initWeather } from "./components/WeatherSection.js";
import { ShopsSection, initShops } from "./components/ShopsSection.js";
import { RampsSection, initRamps } from "./components/RampsSection.js";
import { initTheme } from "../assets/js/main.js";

const app = document.getElementById('app');

// Inicializar la estructura general renderizando todas las secciones de golpe
const renderApp = () => {
    app.innerHTML = `
        ${Header()}
        <main class="main" id="main-content">
            ${HeroSection()}
            ${SpotsSection()}
            ${SpeciesSection()}
            ${MapSection()}
            ${WeatherSection()}
            ${ShopsSection()}
            ${RampsSection()}
            ${RulesSection()}
        </main>
        ${Footer()}
    `;
};

// Se ejecuta cuando el HTML index ha cargado la base
document.addEventListener("DOMContentLoaded", () => {
    renderApp();

    // Al ser todo una misma página, inicializamos los datos de inmediato
    loadSpotsData();
    loadSpeciesData();
    initWeather();
    initShops();
    initRamps();

    // Inicializar JS de Bootstrap y theme (scroll spy, headers pegadizos...)
    initTheme();
});

// ==========================================
// SECCIÓN DE ZONAS DE PESCA
// ==========================================

// Variable global para las zonas
let currentSpotsList = [];

async function loadSpotsData() {
    const spotsContainer = document.getElementById('spots-container');
    if (!spotsContainer) return;

    try {
        const response = await fetch('/assets/data/zonas.json');
        const schema = await response.json();

        // Extraer los spots del nuevo json exclusivo
        const spots = schema['@graph'];
        
        // Guardamos los spots filtrados en la variable global
        currentSpotsList = spots;

        let htmlCards = '';
        spots.forEach((spot, index) => {
            const imgSrc = Array.isArray(spot.image) ? spot.image[0] : spot.image;
            htmlCards += `
              <div class="col-lg-4 col-md-6">
                <div class="card h-100 shadow-sm border-0 spot-card" onclick="openSpotModal(${index})" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <img src="${imgSrc}" class="card-img-top object-fit-cover" alt="${spot.name}" style="height:200px">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary fw-bold">${spot.name}</h5>
                    <p class="card-text text-muted small"><i class="bi bi-geo-alt"></i> ${spot.address?.addressLocality || 'Desconocido'}</p>
                    <p class="card-text text-truncate">${spot.description}</p>
                    <div class="mt-auto">
                        ${spot.keywords ? spot.keywords.split(',').map(tag => `<span class="badge bg-light text-dark border me-1 my-1">${tag.trim()}</span>`).join('') : ''}
                    </div>
                  </div>
                </div>
              </div>
            `;
        });

        spotsContainer.innerHTML = htmlCards;

        // Reinicializar animaciones tras inyectar DOM nuevo
        if (typeof AOS !== 'undefined') AOS.init();

    } catch (e) {
        console.error("Error al cargar JSON de la zona:", e);
        spotsContainer.innerHTML = '<div class="alert alert-danger">Error cargando información de Spots. Asegúrate de estar usando un servidor local y no abrir file:///</div>';
    }
}

window.openSpotModal = (index) => {
    const spot = currentSpotsList[index];
    if (!spot) return;

    // 1. Textos principales
    document.getElementById('spotModalLabel').innerText = spot.name;
    document.getElementById('spotModalLocality').innerHTML = `<i class="bi bi-geo-alt text-danger"></i> ${spot.address?.addressLocality || 'Ubicación no especificada'}`;
    document.getElementById('spotModalDescription').innerText = spot.description || '';

    // 2. Galería de imágenes
    const galleryContainer = document.getElementById('spotModalGallery');
    // Aseguramos que sea un array aunque solo venga una imagen
    const images = Array.isArray(spot.image) ? spot.image : [spot.image];
    
    // Si hay más de una imagen creamos un grid, si no, una grande
    let galleryHtml = '';
    images.forEach(img => {
        galleryHtml += `
            <div class="${images.length > 1 ? 'col-6' : 'col-12'} mb-2">
                <img src="${img}" class="img-fluid rounded shadow-sm w-100 object-fit-cover" style="height: 200px;" alt="Imagen de la zona" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
            </div>
        `;
    });
    galleryContainer.innerHTML = galleryHtml;

    // 3. Extracción de propiedades adicionales
    const getPropValue = (propName) => {
        const prop = spot.additionalProperty?.find(p => p.name === propName);
        return prop ? prop.value : '<span class="text-muted fst-italic">Información no disponible</span>';
    };

    document.getElementById('spotModalAccess').innerHTML = getPropValue('Acceso');
    document.getElementById('spotModalSeabed').innerHTML = getPropValue('Fondo Marino');
    document.getElementById('spotModalTechniques').innerHTML = getPropValue('Técnicas Recomendadas');

    // Procesar las especies para mostrarlas como badges
    const speciesRaw = getPropValue('Especies Frecuentes');
    if (speciesRaw.includes('Información no')) {
        document.getElementById('spotModalSpecies').innerHTML = speciesRaw;
    } else {
        const badges = speciesRaw.split(',').map(s => `<span class="badge bg-success me-1 mb-1 fs-6">${s.trim()}</span>`).join('');
        document.getElementById('spotModalSpecies').innerHTML = badges;
    }

    // 4. Mostrar el Modal
    const modalEl = document.getElementById('spotModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
};


// ==========================================
// SECCIÓN DE ESPECIES (ICTIOLOGÍA)
// ==========================================

// Variables globales para la gestion dinámica del swiper y modal de especies
let speciesSwiperInstance = null;
let currentSpeciesList = [];

async function loadSpeciesData() {
    const speciesContainer = document.getElementById('species-container');
    if (!speciesContainer) return;

    try {
        const response = await fetch('/assets/data/especies.json');
        const schema = await response.json();

        let allSpecies = schema['@graph'] || [];
        renderSpeciesSwiper(allSpecies);

        // Configuración avanzada de búsqueda
        const applyFilters = () => {
            const dif = document.getElementById('filter-dificultad').value.toLowerCase();
            const cal = document.getElementById('filter-calidad').value.toLowerCase();
            const txt = document.getElementById('filter-text').value.toLowerCase();

            const filtered = allSpecies.filter(sp => {
                let pass = true;
                
                // Filtro Dificultad
                if(dif !== 'todo') {
                    const prop = sp.additionalProperty?.find(p => p.name === 'Dificultad');
                    if(!prop || prop.value.toLowerCase() !== dif) pass = false;
                }
                
                // Filtro Calidad Culinaria
                if(cal !== 'todo' && pass) {
                    const prop = sp.additionalProperty?.find(p => p.name === 'Calidad culinaria');
                    if(!prop) { pass = false; }
                    else {
                       let val = prop.value.toLowerCase();
                       if (cal === 'moderada' && !val.includes('baja') && !val.includes('moderada')) pass = false;
                       else if (cal !== 'moderada' && !val.includes(cal)) pass = false;
                    }
                }
                
                // Filtro Texto Libre (Nombre, metodos, descripcion)
                if(txt.length > 0 && pass) {
                    const jsonString = JSON.stringify(sp).toLowerCase();
                    if(!jsonString.includes(txt)) pass = false;
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
    
    if(speciesSwiperInstance) {
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

    document.getElementById('speciesModalLabel').innerText = species.name;
    document.getElementById('speciesModalScientific').innerText = species.alternateName || '';
    document.getElementById('speciesModalDescription').innerText = species.description || '';

    const imgEl = document.getElementById('speciesModalImage');
    imgEl.src = species.image;
    imgEl.onerror = () => { imgEl.src = 'assets/img/hero-carousel/hero-carousel-1.jpg'; };

    const propsContainer = document.getElementById('speciesModalProperties');
    let propsHtml = '';
    if (species.additionalProperty) {
        species.additionalProperty.forEach(prop => {
            propsHtml += `
                <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                   <strong class="text-dark">${prop.name}:</strong> 
                   <span class="text-muted text-end ms-2">${prop.value} ${prop.unitText || ''}</span>
                </li>
            `;
        });
    }
    propsContainer.innerHTML = propsHtml;

    // Verificar si el modal ya está inicializado. Si no, lo inicializa Bootstrap.
    const modalEl = document.getElementById('speciesModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
};