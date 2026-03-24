import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { router, pushToRoute } from "./router.js";
import { initTheme } from "../assets/js/main.js";

const app = document.getElementById('app');

// Inicializar la estructura general
const renderApp = () => {
    app.innerHTML = `
        ${Header()}
        <main class="main" id="main-content">
            <!-- Router Outlet: las vistas se insertarán aquí dinámicamente -->
        </main>
        ${Footer()}
    `;
};

// Añadir Listeners al DOM para navegación estilo SPA
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    renderApp();
    initTheme(); // Inicializar JS de Bootstrap y theme
    // Interceptar navegaciones a /zonas, /etc en vez de petición al servidor
    document.body.addEventListener("click", pushToRoute);
    router();
});

// Evento especial para cargar datos cuando estamos en Zonas
document.addEventListener('spotsViewLoaded', async () => {
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

    } catch (e) {
        console.error("Error al cargar JSON de la zona:", e);
        spotsContainer.innerHTML = '<div class="alert alert-danger">Error cargando información de Spots.</div>';
    }
});
