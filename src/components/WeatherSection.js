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
                <select id="weather-zone-select" class="form-select form-select-lg shadow-sm border-0 mb-3 text-center text-primary fw-bold cursor-pointer" aria-label="Selecciona una zona">
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

// Mock function to simulate an API call
const fetchWeatherData = (zoneId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock data based on zone
            const mocks = {
                norte: { wind: "20 nudos (N)", statusIcon: "bi-cloud-rain", statusDesc: "Lluvia débil", seaState: "Fuerte Marejada", waves: "1.5m - 2.5m", rainProb: "75%" },
                sur: { wind: "15 nudos (NE)", statusIcon: "bi-sun", statusDesc: "Despejado", seaState: "Marejadilla", waves: "0.2m - 0.5m", rainProb: "10%" },
                este: { wind: "12 nudos (E)", statusIcon: "bi-cloud-sun", statusDesc: "Parc. Nublado", seaState: "Marejadilla", waves: "0.4m - 0.8m", rainProb: "25%" },
                oeste: { wind: "18 nudos (W)", statusIcon: "bi-clouds", statusDesc: "Nublado", seaState: "Marejada", waves: "0.8m - 1.2m", rainProb: "40%" }
            };
            resolve(mocks[zoneId]);
        }, 800);
    });
};

export const initWeather = () => {
    const select = document.getElementById("weather-zone-select");
    if (!select) return;

    const renderWeather = async (zoneId) => {
        const card = document.getElementById("weather-card");
        const zoneInfo = weatherZones[zoneId];
        
        // Render Skeleton Loading state
        card.innerHTML = `
          <h4 class="mb-4 d-flex justify-content-center align-items-center flex-column gap-2 text-primary">
            ${zoneInfo.name}
            <span class="placeholder-glow w-50 mt-2"><span class="placeholder col-12 rounded"></span></span>
          </h4>
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

        // We prepare the coordinates to be used later in the actual API call
        const lat = zoneInfo.lat;
        const lon = zoneInfo.lon;
        
        console.log(`Future API Call to: lat: ${lat}, lon: ${lon}`);

        const data = await fetchWeatherData(zoneId);

        card.innerHTML = `
          <h4 class="mb-4">${zoneInfo.name} - <span class="text-primary">Previsión Actual</span></h4>
          
          <div class="row row-cols-2 row-cols-md-4 g-3 mt-3 px-2">
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
