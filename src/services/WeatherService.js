/**
 * WeatherService.js
 * ------------------
 * Capa de servicio para obtener datos meteorológicos y marítimos reales
 * desde la API gratuita Open-Meteo (sin API key ni registro).
 *
 * Principios aplicados:
 *   - SRP: este módulo solo gestiona la obtención y transformación de datos meteo.
 *   - Adapter Pattern: transforma la respuesta cruda de Open-Meteo al formato interno
 *     que espera la UI ({ wind, statusIcon, statusDesc, seaState, waves, rainProb, temp, windDir }).
 *   - Cache en memoria con TTL de 5 minutos para evitar llamadas redundantes.
 */

// ─── Constantes ─────────────────────────────────────────────

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const MARINE_BASE   = 'https://marine-api.open-meteo.com/v1/marine';
const CACHE_TTL_MS  = 5 * 60 * 1000; // 5 minutos

// ─── Cache en memoria ───────────────────────────────────────

const cache = new Map();

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

// ─── Mapeo WMO Weather Code → Icono Bootstrap + Descripción ──

const WMO_MAP = {
    0:  { icon: 'bi-sun',               desc: 'Despejado' },
    1:  { icon: 'bi-sun',               desc: 'Mayormente despejado' },
    2:  { icon: 'bi-cloud-sun',          desc: 'Parcialmente nublado' },
    3:  { icon: 'bi-clouds',             desc: 'Nublado' },
    45: { icon: 'bi-cloud-fog',          desc: 'Niebla' },
    48: { icon: 'bi-cloud-fog2',         desc: 'Niebla con escarcha' },
    51: { icon: 'bi-cloud-drizzle',      desc: 'Llovizna ligera' },
    53: { icon: 'bi-cloud-drizzle',      desc: 'Llovizna moderada' },
    55: { icon: 'bi-cloud-drizzle-fill', desc: 'Llovizna intensa' },
    61: { icon: 'bi-cloud-rain',         desc: 'Lluvia ligera' },
    63: { icon: 'bi-cloud-rain',         desc: 'Lluvia moderada' },
    65: { icon: 'bi-cloud-rain-heavy',   desc: 'Lluvia intensa' },
    71: { icon: 'bi-cloud-snow',         desc: 'Nieve ligera' },
    73: { icon: 'bi-cloud-snow',         desc: 'Nieve moderada' },
    75: { icon: 'bi-cloud-snow',         desc: 'Nieve intensa' },
    80: { icon: 'bi-cloud-rain',         desc: 'Chubascos ligeros' },
    81: { icon: 'bi-cloud-rain',         desc: 'Chubascos moderados' },
    82: { icon: 'bi-cloud-rain-heavy',   desc: 'Chubascos violentos' },
    95: { icon: 'bi-cloud-lightning',    desc: 'Tormenta eléctrica' },
    96: { icon: 'bi-cloud-lightning-rain', desc: 'Tormenta con granizo' },
    99: { icon: 'bi-cloud-lightning-rain', desc: 'Tormenta severa' }
};

function getWeatherDescription(code) {
    return WMO_MAP[code] || { icon: 'bi-question-circle', desc: 'Desconocido' };
}

// ─── Conversión de grados del viento → Punto cardinal ───────

function degreesToCardinal(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return dirs[index];
}

// ─── Conversión km/h → nudos ────────────────────────────────

function kmhToKnots(kmh) {
    return Math.round(kmh * 0.539957);
}

// ─── Escala Douglas de estado del mar ───────────────────────

function getSeaState(waveHeight) {
    if (waveHeight == null) return { state: 'Sin datos', range: '' };
    const h = waveHeight;
    if (h < 0.1)  return { state: 'Calma',            range: `${h.toFixed(1)}m` };
    if (h < 0.5)  return { state: 'Rizada',           range: `${h.toFixed(1)}m` };
    if (h < 1.25) return { state: 'Marejadilla',      range: `${h.toFixed(1)}m` };
    if (h < 2.5)  return { state: 'Marejada',         range: `${h.toFixed(1)}m` };
    if (h < 4.0)  return { state: 'Fuerte Marejada',  range: `${h.toFixed(1)}m` };
    if (h < 6.0)  return { state: 'Gruesa',           range: `${h.toFixed(1)}m` };
    if (h < 9.0)  return { state: 'Muy Gruesa',       range: `${h.toFixed(1)}m` };
    return          { state: 'Arbolada',              range: `${h.toFixed(1)}m` };
}

// ─── Función principal pública ──────────────────────────────

/**
 * Obtiene datos meteorológicos y marítimos reales para una coordenada dada.
 * Devuelve un objeto con el formato que la UI espera.
 *
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<{wind: string, statusIcon: string, statusDesc: string,
 *           seaState: string, waves: string, rainProb: string, temp: string, windDir: string}>}
 */
export async function fetchRealWeatherData(lat, lon) {
    const cacheKey = `${lat}_${lon}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        // Lanzar ambas peticiones en paralelo
        const [forecastRes, marineRes] = await Promise.allSettled([
            fetch(`${FORECAST_BASE}?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code,precipitation&timezone=Europe/Madrid`),
            fetch(`${MARINE_BASE}?latitude=${lat}&longitude=${lon}&current=wave_height,wave_period,wave_direction&timezone=Europe/Madrid`)
        ]);

        // Procesar forecast
        let forecastData = null;
        if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
            forecastData = await forecastRes.value.json();
        }

        // Procesar marine
        let marineData = null;
        if (marineRes.status === 'fulfilled' && marineRes.value.ok) {
            marineData = await marineRes.value.json();
        }

        if (!forecastData || !forecastData.current) {
            throw new Error('No se pudieron obtener datos meteorológicos');
        }

        const current = forecastData.current;
        const marine  = marineData?.current || {};

        // Transformaciones
        const windKnots   = kmhToKnots(current.wind_speed_10m);
        const windCardinal = degreesToCardinal(current.wind_direction_10m);
        const weatherInfo  = getWeatherDescription(current.weather_code);
        const sea          = getSeaState(marine.wave_height);
        const temp         = Math.round(current.temperature_2m);
        const precip       = current.precipitation || 0;

        // Estimar probabilidad de lluvia basándonos en el código WMO
        let rainProb;
        if (current.weather_code >= 80)      rainProb = '80-100%';
        else if (current.weather_code >= 61) rainProb = '60-80%';
        else if (current.weather_code >= 51) rainProb = '30-60%';
        else if (current.weather_code >= 3)  rainProb = '10-30%';
        else                                  rainProb = '< 10%';

        const result = {
            wind:       `${windKnots} nudos (${windCardinal})`,
            windDir:    windCardinal,
            statusIcon: weatherInfo.icon,
            statusDesc: weatherInfo.desc,
            seaState:   sea.state,
            waves:      sea.range || 'Sin datos marinos',
            rainProb:   rainProb,
            temp:       `${temp}°C`,
            precip:     `${precip} mm`
        };

        setCache(cacheKey, result);
        return result;

    } catch (error) {
        console.error('WeatherService error:', error);
        // Fallback con datos indicativos de error
        return {
            wind:       'Error de conexión',
            windDir:    '-',
            statusIcon: 'bi-exclamation-triangle',
            statusDesc: 'Sin conexión',
            seaState:   'Sin datos',
            waves:      '-',
            rainProb:   '-',
            temp:       '-',
            precip:     '-',
            error:      true
        };
    }
}
