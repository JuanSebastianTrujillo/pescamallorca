import { fetchRealWeatherData } from "../services/WeatherService.js";

export const WeatherSection = () => {
    return `
      <!-- Weather Section -->
      <section id="meteo" class="section light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Parte Meteorológico</h2>
          <p>Estado del mar, vientos y mareas para planificar tu próxima salida de pesca.</p>
        </div>
        <div class="container text-center" data-aos="fade-up" data-aos-delay="100">
           <div class="row justify-content-center mb-4">
              <div class="col-lg-6">
                <label for="weather-zone-select" class="visually-hidden">Selecciona una zona</label>
                <select id="weather-zone-select" class="form-select form-select-lg shadow-sm border-0 mb-3 text-center text-primary fw-bold cursor-pointer">
                  <option value="norte">Norte (Tramuntana/Alcudia)</option>
                  <option value="sur" selected>Sur (Palma/Llucmajor)</option>
                  <option value="este">Este (Llevant)</option>
                  <option value="oeste">Oeste (Andratx)</option>
                </select>
              </div>
           </div>
           
           <div class="row justify-content-center">
             <div class="col-lg-8">
               <div class="card p-4 border-0 shadow-sm bg-light" id="weather-card" style="min-height: 200px;">
                 <!-- Content will be populated dynamically by initWeather -->
               </div>
             </div>
           </div>
        </div>
      </section>
    `;
};

// Map of zones and their coordinates for future API integration
const weatherZones = {
    norte: { name: "Norte (Tramuntana/Alcudia)", lat: 39.90, lon: 3.10 },
    sur: { name: "Sur (Palma/Llucmajor)", lat: 39.50, lon: 2.70 },
    este: { name: "Este (Llevant)", lat: 39.70, lon: 3.40 },
    oeste: { name: "Oeste (Andratx)", lat: 39.55, lon: 2.35 }
};

export const initWeather = () => {
    const select = document.getElementById("weather-zone-select");
    if (!select) return;

    const renderWeather = async (zoneId) => {
        const card = document.getElementById("weather-card");
        const zoneInfo = weatherZones[zoneId];
        
        // Render Skeleton Loading state
        card.innerHTML = `
          <h3 class="mb-4 d-flex justify-content-center align-items-center flex-column gap-2 text-primary fs-4">
            ${zoneInfo.name}
            <span class="placeholder-glow w-50 mt-2"><span class="placeholder col-12 rounded"></span></span>
          </h3>
          <div class="d-flex justify-content-center gap-4 gap-md-5 fs-5 flex-wrap">
             <div class="placeholder-glow text-center mx-3" style="width: 120px;">
                 <div class="placeholder rounded-circle mb-2 bg-secondary" style="width: 45px; height: 45px;"></div><br>
                 <span class="placeholder col-10 mb-1"></span><br>
                 <span class="placeholder col-8"></span>
             </div>
             <div class="placeholder-glow text-center mx-3" style="width: 120px;">
                 <div class="placeholder rounded-circle mb-2 bg-secondary" style="width: 45px; height: 45px;"></div><br>
                 <span class="placeholder col-10 mb-1"></span><br>
                 <span class="placeholder col-8"></span>
             </div>
             <div class="placeholder-glow text-center mx-3" style="width: 120px;">
                 <div class="placeholder rounded-circle mb-2 bg-secondary" style="width: 45px; height: 45px;"></div><br>
                 <span class="placeholder col-10 mb-1"></span><br>
                 <span class="placeholder col-8"></span>
             </div>
          </div>
        `;

        // Llamada REAL a la API de Open-Meteo
        const data = await fetchRealWeatherData(zoneInfo.lat, zoneInfo.lon);

        // Verificar si hubo error en la API
        const errorBanner = data.error
            ? `<div class="alert alert-warning border-0 shadow-sm mb-3 small"><i class="bi bi-wifi-off me-2"></i>No se pudo conectar con la API meteorológica. Los datos podrían no ser actuales.</div>`
            : '';

        card.innerHTML = `
          ${errorBanner}
          <h3 class="mb-4 fs-4">${zoneInfo.name} - <span class="text-primary">Previsión Actual</span></h3>
          
          <div class="row row-cols-2 row-cols-md-5 g-3 mt-3 px-2">
             <div class="col text-center">
                 <div class="p-3 bg-white rounded shadow-sm h-100 border">
                     <i class="bi bi-thermometer-half fs-2 text-danger d-block mb-2"></i>
                     <span class="d-block text-secondary small text-uppercase mb-1 fw-bold">Temperatura</span>
                     <span class="fs-6">${data.temp}</span>
                 </div>
             </div>

             <div class="col text-center">
                 <div class="p-3 bg-white rounded shadow-sm h-100 border">
                     <i class="bi bi-wind fs-2 text-info d-block mb-2"></i>
                     <span class="d-block text-secondary small text-uppercase mb-1 fw-bold">Viento</span>
                     <span class="fs-6">${data.wind}</span>
                 </div>
             </div>
             
             <div class="col text-center">
                 <div class="p-3 bg-primary text-white rounded shadow-sm h-100">
                     <i class="bi bi-water fs-2 d-block mb-2"></i>
                     <span class="d-block text-white-50 small text-uppercase mb-1 fw-bold">Mar y Oleaje</span>
                     <span class="fs-6 d-block">${data.seaState}</span>
                     <small class="text-white-50">${data.waves}</small>
                 </div>
             </div>

             <div class="col text-center">
                 <div class="p-3 bg-white rounded shadow-sm h-100 border">
                     <i class="bi ${data.statusIcon} fs-2 text-warning d-block mb-2"></i>
                     <span class="d-block text-secondary small text-uppercase mb-1 fw-bold">Cielo</span>
                     <span class="fs-6">${data.statusDesc}</span>
                 </div>
             </div>

             <div class="col text-center">
                 <div class="p-3 bg-white rounded shadow-sm h-100 border">
                     <i class="bi bi-cloud-drizzle fs-2 text-secondary d-block mb-2"></i>
                     <span class="d-block text-secondary small text-uppercase mb-1 fw-bold">Lluvias</span>
                     <span class="fs-6">${data.rainProb}</span>
                 </div>
             </div>
          </div>
        `;
    };

    select.addEventListener("change", (e) => {
        renderWeather(e.target.value);
    });

    // Initial render
    renderWeather(select.value);
};
