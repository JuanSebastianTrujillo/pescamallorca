import { initMap, addSpotMarkers, addRampMarkers, addReserveMarkers, addLayerControl, invalidateSize } from "../services/MapService.js";

export const MapSection = () => {
    return `
      <!-- Map Section -->
      <section id="mapa" class="section light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Mapa Interactivo</h2>
          <p>Explora de forma visual todos los puntos de interés náutico y pesquero en la isla.</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="card shadow-sm border-0 overflow-hidden">
            <div id="map-container" style="height: 500px; width: 100%; z-index: 1;"></div>
          </div>
          <div class="text-center mt-3">
            <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Usa el control de capas (esquina superior derecha) para filtrar los marcadores por tipo.</small>
          </div>
        </div>
      </section>
    `;
};

/**
 * Inicializa el mapa interactivo y carga los marcadores.
 * Se llama desde app.js después de que los datos de spots y rampas estén disponibles.
 *
 * @param {Array} spots - Datos de zonas de pesca (del JSON).
 * @param {Array} ramps - Datos de rampas (del módulo de rampas).
 */
export const initMapSection = (spots, ramps) => {
    const map = initMap('map-container');
    if (!map) {
        // Fallback si Leaflet no cargó
        const container = document.getElementById('map-container');
        if (container) {
            container.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center h-100 bg-light">
                    <i class="bi bi-map" style="font-size: 4rem; color: #4281A4;"></i>
                    <h4 class="mt-3">Mapa no disponible</h4>
                    <p class="text-muted">No se pudo cargar la librería de mapas. Comprueba tu conexión a internet.</p>
                </div>
            `;
        }
        return;
    }

    // Añadir marcadores
    if (spots && spots.length > 0) {
        addSpotMarkers(spots);
    }

    if (ramps && ramps.length > 0) {
        addRampMarkers(ramps);
    }

    // Añadir zonas de reserva marina
    addReserveMarkers();

    // Añadir control de capas
    addLayerControl();

    // Fix de tamaño (el contenedor puede no tener dimensiones en el primer render)
    invalidateSize();
};
