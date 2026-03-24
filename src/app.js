import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { HeroSection } from "./components/HeroSection.js";
import { SpotsSection } from "./components/SpotsSection.js";
import { MapSection } from "./components/MapSection.js";
import { SpeciesSection } from "./components/SpeciesSection.js";
import { RulesSection } from "./components/RulesSection.js";
import { WeatherSection } from "./components/WeatherSection.js";
import { ShopsSection } from "./components/ShopsSection.js";
import { RampsSection } from "./components/RampsSection.js";
import { initTheme } from "../assets/js/main.js";

const app = document.getElementById('app');

// Inicializar la estructura general renderizando todas las secciones de golpe
const renderApp = () => {
    app.innerHTML = `
        ${Header()}
        <main class="main" id="main-content">
            ${HeroSection()}
            ${SpotsSection()}
            ${MapSection()}
            ${SpeciesSection()}
            ${RulesSection()}
            ${WeatherSection()}
            ${ShopsSection()}
            ${RampsSection()}
        </main>
        ${Footer()}
    `;
};

// Se ejecuta cuando el HTML index ha cargado la base
document.addEventListener("DOMContentLoaded", () => {
    renderApp();
    
    // Al ser todo una misma página, inicializamos los datos de los spots de inmediato
    loadSpotsData();

    // Inicializar JS de Bootstrap y theme (scroll spy, headers pegadizos...)
    initTheme(); 
});

async function loadSpotsData() {
    const spotsContainer = document.getElementById('spots-container');
    if (!spotsContainer) return;

    try {
        const response = await fetch('/assets/data/pesca_data.json');
        const schema = await response.json();
        
        // Filtrar objetos Place (Zonas y Rampas) que no sean reservas (solo por ejemplo)
        const spots = schema['@graph'].filter(
             item => item['@type'] === 'Place' && item['@id'].includes('/zonas/')
        );
        
        let htmlCards = '';
        spots.forEach(spot => {
            const imgSrc = Array.isArray(spot.image) ? spot.image[0] : spot.image;
            htmlCards += `
              <div class="col-lg-4 col-md-6">
                <!-- Tarjeta del spot como un componente en linea -->
                <div class="card h-100 shadow-sm border-0 cursor-pointer spot-card">
                  <img src="${imgSrc}" class="card-img-top object-fit-cover" alt="${spot.name}" style="height:200px">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary fw-bold">${spot.name}</h5>
                    <p class="card-text text-muted small"><i class="bi bi-geo-alt"></i> ${spot.address.addressLocality}</p>
                    <p class="card-text text-truncate">${spot.description}</p>
                    <div class="mt-auto">
                        ${spot.keywords.split(',').map(tag => `<span class="badge bg-light text-dark border me-1 my-1">${tag.trim()}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `;
        });
        
        spotsContainer.innerHTML = htmlCards;

        // Reinicializar animaciones tras inyectar DOM nuevo
        if(typeof AOS !== 'undefined') AOS.init();

    } catch (e) {
        console.error("Error al cargar JSON de la zona:", e);
        spotsContainer.innerHTML = '<div class="alert alert-danger">Error cargando información de Spots. Asegúrate de estar usando un servidor local y no abrir file:///</div>';
    }
}
