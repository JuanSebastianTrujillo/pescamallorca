/**
 * MapService.js
 * ─────────────
 * Servicio de mapa interactivo basado en Leaflet + OpenStreetMap.
 * Gestiona la inicialización del mapa, marcadores de spots/rampas
 * y overlays de reservas marinas.
 *
 * Principios aplicados:
 *   - SRP: solo gestiona lógica del mapa, sin tocar DOM de otros componentes.
 *   - Facade: expone una API simple (initMap, addSpotMarkers, addRampMarkers, addReserveMarkers).
 */

// ─── Estado interno ─────────────────────────────────────────

let mapInstance = null;
const markerLayers = {
    spots: null,
    ramps: null,
    reserves: null
};

// ─── Iconos personalizados ──────────────────────────────────

function createIcon(color, icon) {
    // Usamos un div-icon con Bootstrap Icons (evita dependencia de imágenes externas)
    return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
            background: ${color};
            width: 32px; height: 32px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
        "><i class="bi ${icon}" style="color: white; font-size: 14px;"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

const ICONS = {
    spot:    () => createIcon('#0d6efd', 'bi-geo-alt-fill'),
    ramp:    () => createIcon('#198754', 'bi-signpost-fill'),
    reserve: () => createIcon('#fd7e14', 'bi-shield-fill-exclamation')
};

// ─── Inicialización del mapa ────────────────────────────────

/**
 * Inicializa el mapa Leaflet dentro del contenedor dado.
 * @param {string} containerId - ID del elemento div contenedor.
 * @returns {object|null} Instancia del mapa Leaflet o null si falla.
 */
export function initMap(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof L === 'undefined') {
        console.warn('MapService: Leaflet no disponible o contenedor no encontrado.');
        return null;
    }

    // Evitar doble inicialización
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    // Centro de Mallorca
    // Restringir el mapa a las Islas Baleares para evitar salir de la zona
    const balearesBounds = L.latLngBounds([[38.6, 0.2], [40.6, 5.2]]);
    mapInstance = L.map(containerId, {
        center: [39.62, 2.95],
        zoom: 9,
        zoomControl: true,
        scrollWheelZoom: true,
        maxBounds: balearesBounds,
        maxBoundsViscosity: 1.0 
    });

    // Tiles de OpenStreetMap (gratuito, sin API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(mapInstance);

    // Inicializar capas de marcadores
    markerLayers.spots    = L.layerGroup().addTo(mapInstance);
    markerLayers.ramps    = L.layerGroup().addTo(mapInstance);
    markerLayers.reserves = L.layerGroup().addTo(mapInstance);

    return mapInstance;
}

// ─── Marcadores de Spots de Pesca ───────────────────────────

/**
 * Añade marcadores al mapa para cada zona de pesca.
 * @param {Array} spots - Array de objetos de zonas (schema.org Place format).
 */
export function addSpotMarkers(spots) {
    if (!mapInstance || !markerLayers.spots) return;
    markerLayers.spots.clearLayers();

    spots.forEach((spot, index) => {
        if (!spot.geo) return;

        const lat = spot.geo.latitude;
        const lon = spot.geo.longitude;
        const speciesRaw = spot.additionalProperty?.find(p => p.name === 'Especies Frecuentes')?.value || '';

        const popupContent = `
            <div style="min-width: 200px; font-family: 'Poppins', sans-serif;">
                <h6 style="margin: 0 0 5px 0; color: #0d6efd; font-weight: 700;">${spot.name}</h6>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d;">
                    <i class="bi bi-geo-alt text-danger"></i> ${spot.address?.addressLocality || ''}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #495057;">${spot.description?.substring(0, 100)}...</p>
                ${speciesRaw ? `<p style="margin: 0 0 8px 0; font-size: 11px;"><strong>Especies:</strong> ${speciesRaw}</p>` : ''}
                <button class="btn btn-primary btn-sm w-100 rounded-pill" 
                    onclick="openSpotModal(${index})" 
                    style="font-size: 12px; font-weight: 600;">
                    <i class="bi bi-eye me-1"></i>Ver Ficha Completa
                </button>
            </div>
        `;

        L.marker([lat, lon], { icon: ICONS.spot() })
            .bindPopup(popupContent, { maxWidth: 280 })
            .addTo(markerLayers.spots);
    });
}

// ─── Marcadores de Rampas ───────────────────────────────────

/**
 * Añade marcadores al mapa para cada rampa de botadura.
 * @param {Array} ramps - Array de objetos de rampas.
 */
export function addRampMarkers(ramps) {
    if (!mapInstance || !markerLayers.ramps) return;
    markerLayers.ramps.clearLayers();

    ramps.forEach(ramp => {
        if (!ramp.gps) return;

        const [lat, lon] = ramp.gps.split(',').map(c => parseFloat(c.trim()));
        if (isNaN(lat) || isNaN(lon)) return;

        const popupContent = `
            <div style="min-width: 200px; font-family: 'Poppins', sans-serif;">
                <h6 style="margin: 0 0 5px 0; color: #198754; font-weight: 700;">
                    <i class="bi bi-signpost-fill me-1"></i>${ramp.name}
                </h6>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6c757d;">
                    <i class="bi bi-geo-alt text-danger"></i> ${ramp.location}
                </p>
                <div style="margin: 0 0 8px 0;">
                    <span style="font-size: 11px; background: ${ramp.priceColor === 'success' ? '#198754' : ramp.priceColor === 'warning' ? '#ffc107' : '#dc3545'}; color: white; padding: 2px 8px; border-radius: 10px;">${ramp.priceTag}</span>
                    <span style="font-size: 11px; background: #6c757d; color: white; padding: 2px 8px; border-radius: 10px; margin-left: 4px;">${ramp.typeLabel}</span>
                </div>
                <button class="btn btn-success btn-sm w-100 rounded-pill"
                    onclick="openRampModal(${ramp.id})"
                    style="font-size: 12px; font-weight: 600;">
                    <i class="bi bi-eye me-1"></i>Ver Detalles
                </button>
            </div>
        `;

        L.marker([lat, lon], { icon: ICONS.ramp() })
            .bindPopup(popupContent, { maxWidth: 280 })
            .addTo(markerLayers.ramps);
    });
}

// ─── Marcadores de Reservas Marinas ─────────────────────────

/**
 * Añade marcadores circulares para las reservas marinas de Baleares.
 * Usamos círculos aproximados ya que los polígonos exactos requerirían
 * datos cartográficos oficiales.
 */
export function addReserveMarkers() {
    if (!mapInstance || !markerLayers.reserves) return;
    markerLayers.reserves.clearLayers();

    const reserves = [
        {
            name: 'Reserva Marina del Llevant',
            description: 'De Cala Mata hasta Sa Punta de n\'Amer. Declaración responsable semanal obligatoria.',
            center: [39.6100, 3.4100],
            radius: 5000
        },
        {
            name: 'Reserva Marina de la Bahía de Palma',
            description: 'Regulación por días (veda lunes, miércoles, viernes). Zona de protección pesquera.',
            center: [39.5100, 2.6400],
            radius: 4500
        },
        {
            name: 'Reserva Marina del Nord de Mallorca',
            description: 'Nivel de protección de flota y uso especial. Zona de alta biodiversidad.',
            center: [39.9200, 3.1900],
            radius: 3500
        },
        {
            name: 'Reserva Marina de Illes Malgrats',
            description: 'Pequeña zona de alto valor ecológico frente a Santa Ponça.',
            center: [39.4980, 2.4500],
            radius: 2000
        }
    ];

    reserves.forEach(reserve => {
        // Círculo de zona
        L.circle(reserve.center, {
            radius: reserve.radius,
            color: '#fd7e14',
            fillColor: '#fd7e14',
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '6 4'
        }).addTo(markerLayers.reserves);

        // Marcador central
        const popupContent = `
            <div style="min-width: 200px; font-family: 'Poppins', sans-serif;">
                <h6 style="margin: 0 0 5px 0; color: #fd7e14; font-weight: 700;">
                    <i class="bi bi-shield-fill-exclamation me-1"></i>${reserve.name}
                </h6>
                <p style="margin: 0; font-size: 12px; color: #495057;">${reserve.description}</p>
            </div>
        `;

        L.marker(reserve.center, { icon: ICONS.reserve() })
            .bindPopup(popupContent, { maxWidth: 280 })
            .addTo(markerLayers.reserves);
    });
}

// ─── Control de capas (toggle) ──────────────────────────────

/**
 * Añade un control de capas para que el usuario active/desactive
 * categorías de marcadores.
 */
export function addLayerControl() {
    if (!mapInstance) return;

    const overlays = {
        '🐟 Zonas de Pesca': markerLayers.spots,
        '🚤 Rampas de Botadura': markerLayers.ramps,
        '⚠️ Reservas Marinas': markerLayers.reserves
    };

    L.control.layers(null, overlays, { collapsed: false, position: 'topright' })
        .addTo(mapInstance);
}

/**
 * Invalida el tamaño del mapa (útil después de que el contenedor cambie de tamaño).
 */
export function invalidateSize() {
    if (mapInstance) {
        setTimeout(() => mapInstance.invalidateSize(), 200);
    }
}
