export const RampsSection = () => {
    return `
      <!-- Ramps Section -->
      <section id="rampas" class="section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Logística de Botadura</h2>
          <p>Puntos de acceso al mar habilitados en Mallorca. Verificación de condiciones para remolques y embarcaciones.</p>
        </div>
        
        <div class="container" data-aos="fade-up" data-aos-delay="100">
            <!-- Functional Filters Mockup -->
            <div class="row mb-5 justify-content-center">
               <div class="col-lg-10">
                   <div class="card bg-light border-0 shadow-sm p-4">
                       <h5 class="mb-3 text-secondary" style="font-size: 0.95rem; text-transform: uppercase;"><strong><i class="bi bi-funnel-fill me-2"></i>Filtros Técnicos Rápidos</strong></h5>
                       <div class="d-flex flex-wrap gap-3 align-items-center">
                           <select id="ramps-zone-filter" class="form-select border-0 shadow-sm" style="width: auto; flex-grow: 1;" aria-label="Zona">
                               <option value="all" selected>Cualquier zona</option>
                               <option value="norte">Norte</option>
                               <option value="sur">Sur</option>
                               <option value="este">Este</option>
                               <option value="oeste">Oeste</option>
                           </select>
                           <select id="ramps-ownership-filter" class="form-select border-0 shadow-sm" style="width: auto; flex-grow: 1;" aria-label="Gestión de Rampa">
                               <option value="all" selected>Cualquier titularidad</option>
                               <option value="publica">Pública</option>
                               <option value="privada">Privada</option>
                               <option value="de-pago">De pago</option>
                           </select>
                           <select id="ramps-trailer-filter" class="form-select border-0 shadow-sm" style="width: auto; flex-grow: 1;" aria-label="Acceso Remolque">
                               <option value="all" selected>Cualquier accesibilidad</option>
                               <option value="6m">Giro amplio (>6m eslora)</option>
                               <option value="small">Solo remolques pequeños (<5m)</option>
                           </select>
                           <button id="ramps-search-btn" class="btn btn-primary shadow-sm px-4 fw-bold"><i class="bi bi-search me-2"></i>Buscar</button>
                       </div>
                   </div>
               </div>
            </div>

            <!-- Ramps Container -->
            <div id="ramps-container">
                <!-- Ramps will be dynamically injected here -->
            </div>
        </div>
      </section>
    `;
};

const rampsData = [
    {
        name: "Rampa de Botadura Port d'Andratx",
        location: "Andratx, Ponent",
        zone: "oeste",
        ownership: "publica",
        ownershipText: "Ports IB (Tarifa Pública)",
        trailer: "6m",
        trailerText: "Apta >6m. Margen de giro amplio.",
        depthText: "Calado al final de la base: 1.5m"
    },
    {
        name: "Rampa Club Náutico S'Arenal",
        location: "Llucmajor, Migjorn",
        zone: "sur",
        ownership: "privada",
        ownershipText: "Club Náutico S'Arenal",
        trailer: "6m",
        trailerText: "Apta >6m. Explanada para maniobras.",
        depthText: "Calado al final de la base: 2.0m"
    },
    {
        name: "Rampa Comercial Port de Sóller",
        location: "Sóller, Tramuntana",
        zone: "norte",
        ownership: "publica",
        ownershipText: "Ports IB",
        trailer: "small",
        trailerText: "Solo remolques ligeros y barcas <5m.",
        depthText: "Calado al final de la base: 1.0m"
    },
    {
        name: "Marina de Portocolom",
        location: "Felanitx, Llevant",
        zone: "este",
        ownership: "de-pago",
        ownershipText: "Gestión Mixta (De pago anual)",
        trailer: "6m",
        trailerText: "Apta >6m. Fácil acceso al agua.",
        depthText: "Calado al final: 1.2m"
    },
    {
        name: "Rampa Cala Bona Antigua",
        location: "Son Servera, Llevant",
        zone: "este",
        ownership: "privada",
        ownershipText: "Club Local",
        trailer: "small",
        trailerText: "Solo remolques pequeños y neumáticas.",
        depthText: "Calado muy limitado: 0.6m"
    }
];

export const initRamps = () => {
    const container = document.getElementById("ramps-container");
    const zoneFilter = document.getElementById("ramps-zone-filter");
    const ownershipFilter = document.getElementById("ramps-ownership-filter");
    const trailerFilter = document.getElementById("ramps-trailer-filter");
    const searchBtn = document.getElementById("ramps-search-btn");

    if (!container || !zoneFilter || !ownershipFilter || !trailerFilter || !searchBtn) return;

    const renderRamps = () => {
        const zoneVal = zoneFilter.value;
        const ownershipVal = ownershipFilter.value;
        const trailerVal = trailerFilter.value;

        const filtered = rampsData.filter(rampa => {
            const matchZone = zoneVal === 'all' || rampa.zone === zoneVal;
            const matchOwnership = ownershipVal === 'all' || rampa.ownership === ownershipVal;
            const matchTrailer = trailerVal === 'all' || rampa.trailer === trailerVal;
            return matchZone && matchOwnership && matchTrailer;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                    <h5 class="text-secondary">No se han encontrado rampas con estas características.</h5>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(rampa => {
            html += `
            <div class="row justify-content-center mb-5">
                <div class="col-lg-8">
                    <div class="card shadow-sm border-0 border-start border-primary border-5">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div>
                                    <h4 class="mb-1 text-primary fw-bold">${rampa.name}</h4>
                                    <p class="text-muted small mb-0"><i class="bi bi-geo-alt-fill me-1"></i>${rampa.location}</p>
                                </div>
                                <a href="#mapa" class="btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm"><i class="bi bi-map me-1"></i>Mapa</a>
                            </div>
                            
                            <div class="row gy-4">
                                <div class="col-sm-6 d-flex align-items-start">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded px-2 py-1 me-3">
                                        <i class="bi bi-building fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-secondary small text-uppercase mb-1 fw-bold">Titularidad y Coste</h6>
                                        <strong class="d-block text-dark">${rampa.ownershipText}</strong>
                                    </div>
                                </div>
                                <div class="col-sm-6 d-flex align-items-start">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded px-2 py-1 me-3">
                                        <i class="bi bi-truck fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-secondary small text-uppercase mb-1 fw-bold">Accesibilidad Remolque</h6>
                                        <strong class="d-block text-dark">${rampa.trailerText}</strong>
                                    </div>
                                </div>
                                <div class="col-sm-6 d-flex align-items-start">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded px-2 py-1 me-3">
                                        <i class="bi bi-water fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-secondary small text-uppercase mb-1 fw-bold">Calado Operativo</h6>
                                        <strong class="d-block text-dark">${rampa.depthText}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        
        container.innerHTML = html;
    };

    searchBtn.addEventListener("click", renderRamps);

    // Initial render
    renderRamps();
};
