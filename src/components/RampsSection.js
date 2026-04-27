export const RampsSection = () => {
    return `
      <!-- Ramps Section -->
      <section id="rampas" class="section ramps light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Módulo de Rampas y Lugares de Botadura</h2>
          <p>Catálogo técnico de accesos al mar. Priorizamos la viabilidad logística para asegurar tu confort y seguridad.</p>
        </div>
        
        <div class="container" data-aos="fade-up" data-aos-delay="100">
            
            <!-- Functional Filters -->
            <div class="row mb-5 justify-content-center">
               <div class="col-lg-10">
                   <div class="card bg-white border-0 shadow-sm p-4">
                       <h5 class="mb-3 text-secondary" style="font-size: 0.95rem; text-transform: uppercase;"><strong><i class="bi bi-funnel-fill me-2 text-primary"></i>Filtros Técnicos Rápidos</strong></h5>
                       <div class="d-flex flex-wrap gap-3 align-items-center">
                           <select id="ramps-zone-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;" aria-label="Zona">
                               <option value="all" selected>Cualquier zona</option>
                               <option value="norte">Norte</option>
                               <option value="sur">Sur</option>
                               <option value="este">Este</option>
                               <option value="oeste">Oeste</option>
                           </select>
                           <select id="ramps-type-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;" aria-label="Tipo Firme">
                               <option value="all" selected>Cualquier firme</option>
                               <option value="hormigon">Hormigón</option>
                               <option value="arena">Arena</option>
                               <option value="roca">Roca natural</option>
                           </select>
                           <select id="ramps-price-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;" aria-label="Gestión">
                               <option value="all" selected>Cualquier gestión</option>
                               <option value="Gratuita">Gratuita</option>
                               <option value="De pago">De pago</option>
                               <option value="Exclusiva">Exclusiva Socios</option>
                           </select>
                           <button id="ramps-search-btn" class="btn btn-primary shadow-sm px-4 fw-bold"><i class="bi bi-search me-2"></i>Filtrar</button>
                       </div>
                   </div>
               </div>
            </div>

            <!-- Ramps Grid Container -->
            <div class="row gy-4" id="ramps-container">
                <!-- Ramps will be dynamically injected here -->
            </div>
        </div>

        <!-- Ramp Details Modal -->
        <div class="modal fade" id="rampModal" tabindex="-1" aria-labelledby="rampModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title fw-bold" id="rampModalLabel">Detalle de la Rampa</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body p-0">
                <!-- Modal Body sections generated dynamically -->
                <div id="rampModalBodyContent"></div>
              </div>
              
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary fw-bold" data-bs-dismiss="modal">Cerrar</button>
              </div>
              
            </div>
          </div>
        </div>

      </section>
    `;
};

// --- MOCK DATA FOR RAMPS ---
const rampsData = [
    {
        id: 0,
        name: "Rampa Port d'Andratx",
        location: "Andratx, Ponent",
        zone: "oeste",
        type: "hormigon",
        typeLabel: "Rampa de hormigón",
        priceTag: "De pago",
        priceColor: "warning",
        suitabilityTag: "Apta para remolques",
        suitabilityColor: "success",
        image: "assets/img/hero-carousel/hero-carousel-1.jpg", 
        gallery: [
            "assets/img/hero-carousel/hero-carousel-1.jpg", 
            "assets/img/hero-carousel/hero-carousel-2.jpg",
            "assets/img/hero-carousel/hero-carousel-3.jpg"
        ],
        // Physical Characteristics & Bathymetry
        draft: "1.5m",
        width: "6 metros",
        incline: "Moderada. Apta para coche normal tracción delantera, aunque 4x4 recomendado si hay algas.",
        // Logistics
        parkingLogistics: "Explanada anexa limitada. El vehículo y su remolque deben desengancharse y aparcar obligatoriamente en la zona de aparcamiento habilitada por Ports IB. Ocupar la zona de maniobra conlleva sanción inmediata.",
        // Tariffs & Bureaucracy
        tariffs: "Aprox. 12€/botadura. Posibilidad de bono anual (T-0). Pago en las oficinas del puerto o al responsable de la rampa presencialmente.",
        // Annex Services
        services: "Manguera de agua dulce disponible para endulzar el remolque y motor. Aseos anexos al edificio de capitanía y gasolinera marítima funcional.",
        // Warnings
        warnings: "Suele acumular verdín al final de la rampa en invierno; extremar precaución. En agosto la saturación de tráfico es muy alta.",
        // Route
        gps: "39.5445, 2.3888",
        mapsLink: "https://maps.google.com/?q=39.5445,2.3888"
    },
    {
        id: 1,
        name: "Club Náutico S'Arenal",
        location: "Llucmajor, Migjorn",
        zone: "sur",
        type: "hormigon",
        typeLabel: "Rampa de hormigón lisa",
        priceTag: "Exclusiva Socios (O pago alto)",
        priceColor: "danger",
        suitabilityTag: "Apta remolques grandes",
        suitabilityColor: "primary",
        image: "assets/img/hero-carousel/hero-carousel-3.jpg", 
        gallery: [
            "assets/img/hero-carousel/hero-carousel-3.jpg"
        ],
        draft: "2.5m",
        width: "8 metros",
        incline: "Suave, pavimento antideslizante en constante mantenimiento.",
        parkingLogistics: "Aparcamiento privado dentro de las instalaciones del club. Zonas exclusivas extra-largas para coches con remolque con vigilancia 24h.",
        tariffs: "Exclusivo para socios del CNA. No socios pueden consultar cuota de pasaje en oficina central (suele superar los 30€ por uso diario).",
        services: "Instalaciones premium: manguera potente, marinería de apoyo, aseos y duchas privadas, gasolinera justo al lado.",
        warnings: "Debido a regatas internacionales ocasionales, la rampa puede estar cerrada para uso general durante fines de semana de competición. Consultar tablón de anuncios marino.",
        gps: "39.5019, 2.7534",
        mapsLink: "https://maps.google.com/?q=39.5019,2.7534"
    },
    {
        id: 2,
        name: "Acceso natural Cala Pi",
        location: "Llucmajor, Migjorn",
        zone: "sur",
        type: "roca",
        typeLabel: "Acceso natural de roca",
        priceTag: "Gratuita",
        priceColor: "success",
        suitabilityTag: "Solo Kayaks / Ligero",
        suitabilityColor: "secondary",
        image: "assets/img/hero-carousel/hero-carousel-2.jpg", 
        gallery: [
            "assets/img/hero-carousel/hero-carousel-2.jpg"
        ],
        draft: "Varía (0.5m media en la orilla)",
        width: "Sin delimitación (acceso peatonal)",
        incline: "Abrupta mediante escaleras. Totalmente inviable para remolques o coches.",
        parkingLogistics: "Aparcamiento en la parte superior de la calle residencial. Requiere bajar la embarcación (kayak o paddle) a pulso o con carrito adaptado por escaleras empinadas.",
        tariffs: "Totalmente pública y gratuita. (Ningún servicio asociado).",
        services: "Ninguno. Máquina de agua o chiringuito en verano en la parte alta.",
        warnings: "Ubicación rodeada de bañistas en temporada alta. Extremar cuidado al botar para evitar accidentes. Zonas de rocas sueltas y resbaladizas con temporales del sur.",
        gps: "39.3638, 2.8361",
        mapsLink: "https://maps.google.com/?q=39.3638,2.8361"
    }
];

export const initRamps = () => {
    const container = document.getElementById("ramps-container");
    const zoneFilter = document.getElementById("ramps-zone-filter");
    const typeFilter = document.getElementById("ramps-type-filter");
    const priceFilter = document.getElementById("ramps-price-filter");
    const searchBtn = document.getElementById("ramps-search-btn");

    if (!container || !zoneFilter || !typeFilter || !priceFilter || !searchBtn) return;

    // We store data in a global scope for modal reference
    window.currentRampsData = rampsData;

    const renderRamps = () => {
        const zoneVal = zoneFilter.value;
        const typeVal = typeFilter.value;
        const priceVal = priceFilter.value;

        const filtered = rampsData.filter(r => {
            let pass = true;
            if (zoneVal !== 'all' && r.zone !== zoneVal) pass = false;
            if (typeVal !== 'all' && r.type !== typeVal) pass = false;
            if (priceVal !== 'all' && !r.priceTag.includes(priceVal)) pass = false;
            return pass;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                    <h5 class="text-secondary">No se han encontrado rampas en esta zona.</h5>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(rampa => {
            
            let iconType = 'bi-signpost-fill';
            if (rampa.type === 'hormigon') iconType = 'bi-bricks';
            else if (rampa.type === 'arena') iconType = 'bi-brightness-alt-high-fill';
            else if (rampa.type === 'roca') iconType = 'bi-moat';

            html += `
            <div class="col-xl-4 col-md-6 d-flex align-items-stretch">
                <div class="card shadow-sm border-0 w-100 ramp-card" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="openRampModal(${rampa.id})">
                    <div class="position-relative">
                        <img src="${rampa.image}" class="card-img-top object-fit-cover" alt="Fotografía detallada de la rampa de varada ${rampa.name}, ubicada en ${rampa.location}" style="height:220px;" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
                        <span class="badge bg-${rampa.priceColor} position-absolute top-0 end-0 m-3 fs-6 shadow-sm">${rampa.priceTag}</span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h4 class="card-title fw-bold text-primary mb-1">${rampa.name}</h4>
                        <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${rampa.location}</p>
                        
                        <div class="mb-3 d-flex flex-wrap gap-2">
                            <span class="badge bg-light text-dark border"><i class="bi ${iconType} text-primary me-1"></i>${rampa.typeLabel}</span>
                            <span class="badge bg-${rampa.suitabilityColor} text-white shadow-sm"><i class="bi bi-check-circle me-1"></i>${rampa.suitabilityTag}</span>
                        </div>

                        <div class="mt-auto pt-3 border-top">
                            <button class="btn btn-outline-primary w-100 fw-bold" onclick="openRampModal(${rampa.id})"><i class="bi bi-file-earmark-text me-2"></i>Ver Detalles Técnicos</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        
        container.innerHTML = html;
    };

    searchBtn.addEventListener("click", renderRamps);
    renderRamps(); // initial
};

// Global function to open modal dynamically
window.openRampModal = (rampId) => {
    const rampa = window.currentRampsData.find(r => r.id === rampId);
    if (!rampa) return;

    // Modificando texto de la cabecera
    document.getElementById('rampModalLabel').innerHTML = `<i class="bi bi-geo-alt-fill text-warning me-2"></i> ${rampa.name}`;

    // Generar Galería
    let galleryHtml = '';
    rampa.gallery.forEach(img => {
        galleryHtml += `
            <div class="col-md-4 mb-3">
               <img src="${img}" class="img-fluid rounded shadow-sm object-fit-cover w-100" style="height:150px;" alt="Fotografía detallada de la rampa de varada ${rampa.name}, ubicada en ${rampa.location}" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
            </div>
        `;
    });

    // Construir Modal Body
    let iconType = 'bi-signpost-fill';
    if (rampa.type === 'hormigon') iconType = 'bi-bricks';
    else if (rampa.type === 'arena') iconType = 'bi-brightness-alt-high-fill';
    else if (rampa.type === 'roca') iconType = 'bi-moat';

    const modalBodyHTML = `
       <div class="p-4 bg-light text-center border-bottom">
           <h3 class="fw-bold mb-2">${rampa.name}</h3>
           <p class="text-muted mb-3"><i class="bi bi-pin-map-fill text-danger"></i> ${rampa.location} | <i class="bi ${iconType} text-primary"></i> ${rampa.typeLabel}</p>
           <a href="${rampa.mapsLink}" target="_blank" class="btn btn-success rounded-pill fw-bold shadow-sm px-4"><i class="bi bi-cursor-fill me-2"></i>Navegar con GPS</a>
       </div>

       <div class="p-4">
           <!-- Sección: Galería Técnica -->
           <h5 class="fw-bold text-primary border-bottom pb-2 mb-3"><i class="bi bi-images me-2"></i>Galería Técnica</h5>
           <div class="row mb-4">
               ${galleryHtml}
           </div>

           <div class="row custom-details">
               <!-- Sección: Características y Batimetría -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-info border-4 bg-white">
                       <div class="card-body">
                           <h6 class="fw-bold text-dark text-uppercase mb-3"><i class="bi bi-water text-info fs-5 me-2"></i> Características Físicas y Batimetría</h6>
                           <ul class="list-unstyled mb-0">
                               <li class="mb-2"><strong>Calado Operativo:</strong> <span class="text-muted">${rampa.draft}</span></li>
                               <li class="mb-2"><strong>Anchura Útil:</strong> <span class="text-muted">${rampa.width}</span></li>
                               <li><strong>Inclinación y Firme:</strong> <span class="text-muted">${rampa.incline}</span></li>
                           </ul>
                       </div>
                   </div>
               </div>

               <!-- Sección: Logística de aparcamiento -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-secondary border-4 bg-white">
                       <div class="card-body">
                           <h6 class="fw-bold text-dark text-uppercase mb-3"><i class="bi bi-p-square text-secondary fs-5 me-2"></i> Logística de Aparcamiento</h6>
                           <p class="small text-muted mb-0" style="text-align: justify;">${rampa.parkingLogistics}</p>
                       </div>
                   </div>
               </div>

               <!--  Sección: Tarifas -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-warning border-4 bg-white">
                       <div class="card-body">
                           <h6 class="fw-bold text-dark text-uppercase mb-3"><i class="bi bi-cash-coin text-warning fs-5 me-2"></i> Tarifas y Burocracia</h6>
                           <p class="small text-muted mb-0">${rampa.tariffs}</p>
                       </div>
                   </div>
               </div>

               <!-- Sección: Servicios Anexos -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-primary border-4 bg-white">
                       <div class="card-body">
                           <h6 class="fw-bold text-dark text-uppercase mb-3"><i class="bi bi-wrench-adjustable text-primary fs-5 me-2"></i> Servicios Anexos</h6>
                           <p class="small text-muted mb-0">${rampa.services}</p>
                       </div>
                   </div>
               </div>

               <!-- Sección: Avisos y Peligros -->
               <div class="col-12 mb-2">
                   <div class="card border-0 shadow-sm bg-danger bg-opacity-10 rounded">
                       <div class="card-body d-flex align-items-center">
                           <div class="me-3">
                               <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 2.5rem;"></i>
                           </div>
                           <div>
                               <h6 class="fw-bold text-danger text-uppercase mb-1">Avisos y Peligros Locales</h6>
                               <p class="small text-danger mb-0"><strong>Crítico:</strong> ${rampa.warnings}</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
           
       </div>
    `;

    document.getElementById('rampModalBodyContent').innerHTML = modalBodyHTML;

    // Mostrar el modal
    const modalEl = document.getElementById('rampModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
};
