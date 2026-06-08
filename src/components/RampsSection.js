export const RampsSection = () => {
    return `
      <!-- Ramps Section -->
      <section id="rampas" class="section ramps light-background">
                <div class="container section-title" data-aos="fade-up">
                    <h2 data-i18n="ramps_title">Módulo de Rampas y Lugares de Botadura</h2>
                    <p data-i18n="ramps_tagline">Catálogo técnico de accesos al mar. Priorizamos la viabilidad logística para asegurar tu confort y seguridad.</p>
                </div>
        
        <div class="container" data-aos="fade-up" data-aos-delay="100">
            
            <!-- Functional Filters -->
            <div class="row mb-5 justify-content-center">
               <div class="col-lg-10">
                   <div class="card bg-white border-0 shadow-sm p-4">
                       <h3 class="mb-3 text-secondary fs-6" style="text-transform: uppercase;"><strong><i class="bi bi-funnel-fill me-2 text-primary"></i><span data-i18n="ramps_filters">Filtros Técnicos Rápidos</span></strong></h3>
                       <div class="d-flex flex-wrap gap-3 align-items-center">
                           <label for="ramps-zone-filter" class="visually-hidden" data-i18n="label_filter_zone">Filtrar por zona</label>
                           <select id="ramps-zone-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;">
                               <option value="all" selected data-i18n="ramps_option_all_zones">Cualquier zona</option>
                               <option value="norte" data-i18n="ramps_option_norte">Norte</option>
                               <option value="sur" data-i18n="ramps_option_sur">Sur</option>
                               <option value="este" data-i18n="ramps_option_este">Este</option>
                               <option value="oeste" data-i18n="ramps_option_oeste">Oeste</option>
                           </select>
                           <label for="ramps-type-filter" class="visually-hidden" data-i18n="label_filter_type">Filtrar por tipo de firme</label>
                           <select id="ramps-type-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;">
                               <option value="all" selected data-i18n="ramps_option_all_types">Cualquier firme</option>
                               <option value="hormigon" data-i18n="ramps_option_hormigon">Hormigón</option>
                               <option value="arena" data-i18n="ramps_option_arena">Arena</option>
                               <option value="roca" data-i18n="ramps_option_roca">Roca natural</option>
                           </select>
                           <label for="ramps-price-filter" class="visually-hidden" data-i18n="label_filter_price">Filtrar por gestión/precio</label>
                           <select id="ramps-price-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;">
                               <option value="all" selected data-i18n="ramps_option_all_prices">Cualquier gestión</option>
                               <option value="Gratuita" data-i18n="ramps_option_free">Gratuita</option>
                               <option value="De pago" data-i18n="ramps_option_paid">De pago</option>
                               <option value="Exclusiva" data-i18n="ramps_option_exclusive">Exclusiva Socios</option>
                           </select>
                           <!-- Filtro aplicado automáticamente al cambiar los selects -->
                       </div>
                   </div>
               </div>
            </div>

            <!-- Ramps Swiper Container -->
            <div class="swiper ramps-swiper" style="padding-bottom: 55px;">
              <div class="swiper-button-prev ramps-swiper-prev"></div>
              <div class="swiper-wrapper" id="ramps-container">
                <div class="swiper-slide text-center" data-i18n="ramps_loading">Cargando Rampas...</div>
              </div>
              <div class="swiper-button-next ramps-swiper-next"></div>
              <div class="swiper-pagination ramps-swiper-pagination"></div>
            </div>
        </div>

        <!-- Ramp Details Modal -->
        <div class="modal fade" id="rampModal" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="rampModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title fw-bold" id="rampModalLabel" data-i18n="ramp_modal_title">Detalle de la Rampa</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body p-0">
                <!-- Modal Body sections generated dynamically -->
                <div id="rampModalBodyContent"></div>
              </div>
              
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary fw-bold" data-bs-dismiss="modal" data-i18n="close">Cerrar</button>
              </div>
              
            </div>
          </div>
        </div>

      </section>
    `;
};

// --- RAMPS SWIPER ---
let rampsSwiperInstance = null;

function reinitRampsSwiper() {
    if (rampsSwiperInstance) {
        rampsSwiperInstance.destroy(true, true);
        rampsSwiperInstance = null;
    }
    if (typeof Swiper !== 'undefined') {
        rampsSwiperInstance = new Swiper('.ramps-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.ramps-swiper-next',
                prevEl: '.ramps-swiper-prev'
            },
            pagination: { el: '.ramps-swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 40 }
            }
        });
    }
}

export const initRamps = () => {
    const container = document.getElementById("ramps-container");
    const zoneFilter = document.getElementById("ramps-zone-filter");
    const typeFilter = document.getElementById("ramps-type-filter");
    const priceFilter = document.getElementById("ramps-price-filter");

    if (!container || !zoneFilter || !typeFilter || !priceFilter) return;

    // We store data in a global scope for modal reference in app.js now
    // window.currentRampsData = rampsData;

    window.renderRamps = () => {
        const zoneVal = zoneFilter.value;
        const typeVal = typeFilter.value;
        const priceVal = priceFilter.value;

        const currentRamps = window.currentRampsData || [];
        const filtered = currentRamps.filter(r => {
            let pass = true;
            if (zoneVal !== 'all' && r.zone !== zoneVal) pass = false;
            if (typeVal !== 'all' && r.type !== typeVal) pass = false;
            if (priceVal !== 'all' && !r.priceTag.includes(priceVal)) pass = false;
            return pass;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="swiper-slide text-center py-5">
                    <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                    <h5 class="text-secondary">No se han encontrado rampas en esta zona.</h5>
                </div>
            `;
            reinitRampsSwiper();
            return;
        }

        let html = '';
        filtered.forEach(rampa => {
            
            let iconType = 'bi-signpost-fill';
            if (rampa.type === 'hormigon') iconType = 'bi-bricks';
            else if (rampa.type === 'arena') iconType = 'bi-brightness-alt-high-fill';
            else if (rampa.type === 'roca') iconType = 'bi-moat';

            const rutaLimpia = rampa.image.substring(0, rampa.image.lastIndexOf('.'));
            
            html += `
            <div class="swiper-slide d-flex" style="height:auto;">
                <div class="card shadow-sm border-0 w-100 ramp-card" role="button" tabindex="0" aria-label="Ver detalles t&eacute;cnicos de ${rampa.name}" style="transition: transform 0.2s; cursor:pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'" data-open-ramp="${rampa.id}">
                    <div class="position-relative">
                        <picture>
                          <source type="image/avif" srcset="${rutaLimpia}-400.avif 400w, ${rutaLimpia}-800.avif 800w" sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">
                          <source type="image/webp" srcset="${rutaLimpia}-400.webp 400w, ${rutaLimpia}-800.webp 800w" sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">
                          <source type="image/jpeg" srcset="${rutaLimpia}-400.jpg 400w, ${rutaLimpia}-800.jpg 800w" sizes="(max-width: 576px) 95vw, (max-width: 768px) 48vw, (max-width: 992px) 30vw, 28vw">

                          <img src="${rutaLimpia}-800.jpg" class="card-img-top object-fit-cover" alt="Rampa de botadura ${rampa.name}" style="height:220px;" loading="lazy" decoding="async" onerror="this.src='assets/img/hero-carousel/hero-carousel-1-640.jpg'">
                        </picture>
                        <span class="badge bg-<span class="badge bg-${rampa.priceColor} text-white position-absolute top-0 end-0 m-3 fs-6 shadow-sm" ${rampa.priceColor === 'warning' ? 'style="background-color: #6B4600 !important;"' : ''}>${rampa.priceTag}</span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title fw-bold text-primary mb-1 fs-5">${rampa.name}</h3>
                        <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${rampa.location}</p>
                        
                        <div class="mb-3 d-flex flex-wrap gap-2">
                            <span class="badge bg-light text-dark border"><i class="bi ${iconType} text-primary me-1"></i>${rampa.typeLabel}</span>
                            <span class="badge bg-${rampa.suitabilityColor} text-white shadow-sm"><i class="bi bi-check-circle me-1"></i>${rampa.suitabilityTag}</span>
                        </div>

                        <div class="mt-auto pt-3 border-top">
                            <button class="btn btn-outline-primary w-100 fw-bold" data-open-ramp="${rampa.id}"><i class="bi bi-file-earmark-text me-2"></i>Ver Detalles T&eacute;cnicos</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        
        container.innerHTML = html;
        reinitRampsSwiper();
    };

    // Aplicar filtros automáticamente cuando cambien los selects
    zoneFilter.addEventListener("change", window.renderRamps);
    typeFilter.addEventListener("change", window.renderRamps);
    priceFilter.addEventListener("change", window.renderRamps);
    // renderRamps(); // initial call happens when data is loaded
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
        const rutaLimpiaGaleria = img.substring(0, img.lastIndexOf('.'));
        galleryHtml += `
            <div class="col-md-4 mb-3">
               <picture>
                   <source type="image/avif" srcset="${rutaLimpiaGaleria}-400.avif 400w, ${rutaLimpiaGaleria}-800.avif 800w" sizes="(max-width: 768px) 100vw, 33vw">
                   <source type="image/webp" srcset="${rutaLimpiaGaleria}-400.webp 400w, ${rutaLimpiaGaleria}-800.webp 800w" sizes="(max-width: 768px) 100vw, 33vw">
                   <source type="image/jpeg" srcset="${rutaLimpiaGaleria}-400.jpg 400w, ${rutaLimpiaGaleria}-800.jpg 800w" sizes="(max-width: 768px) 100vw, 33vw">
                   <img src="${rutaLimpiaGaleria}-800.jpg" class="img-fluid rounded shadow-sm object-fit-cover w-100" style="height:150px;" alt="Fotografía detallada de la rampa de varada ${rampa.name}, ubicada en ${rampa.location}" onerror="this.src='assets/img/hero-carousel/hero-carousel-1-640.jpg'">
                </picture>
            </div>
        `;
    });

    // Construir Modal Body
    let iconType = 'bi-signpost-fill';
    if (rampa.type === 'hormigon') iconType = 'bi-bricks';
    else if (rampa.type === 'arena') iconType = 'bi-brightness-alt-high-fill';
    else if (rampa.type === 'roca') iconType = 'bi-moat';

    const t_nav_gps = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_navigate_gps') : 'Navegar con GPS';
    const t_gallery = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_gallery') : 'Galería Técnica';
    const t_physical = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_physical') : 'Características Físicas y Batimetría';
    const t_draft = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_draft') : 'Calado Operativo:';
    const t_width = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_width') : 'Anchura Útil:';
    const t_incline = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_incline') : 'Inclinación y Firme:';
    const t_logistics = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_logistics') : 'Logística de Aparcamiento';
    const t_bur = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_bureaucracy') : 'Tarifas y Burocracia';
    const t_annex = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_annex_services') : 'Servicios Anexos';
    const t_warn = (window._i18n && window._i18n.t) ? window._i18n.t('ramp_local_warnings') : 'Avisos y Peligros';

    const modalBodyHTML = `
       <div class="p-4 bg-light text-center border-bottom">
           <h2 class="fw-bold mb-2 fs-3">${rampa.name}</h2>
           <p class="text-muted mb-3"><i class="bi bi-pin-map-fill text-danger"></i> ${rampa.location} | <i class="bi ${iconType} text-primary"></i> ${rampa.typeLabel}</p>
           <a href="${rampa.mapsLink}" target="_blank" class="btn btn-success rounded-pill fw-bold shadow-sm px-4"><i class="bi bi-cursor-fill me-2"></i>${t_nav_gps}</a>
       </div>

       <div class="p-4">
           <!-- Sección: Galería Técnica -->
           <h3 class="fw-bold text-primary border-bottom pb-2 mb-3 fs-5"><i class="bi bi-images me-2"></i>${t_gallery}</h3>
           <div class="row mb-4">
               ${galleryHtml}
           </div>

           <div class="row custom-details">
               <!-- Sección: Características y Batimetría -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-info border-4 bg-white">
                       <div class="card-body">
                           <h4 class="fw-bold text-dark text-uppercase mb-3 fs-6"><i class="bi bi-water text-info fs-5 me-2"></i> ${t_physical}</h4>
                           <ul class="list-unstyled mb-0">
                               <li class="mb-2"><strong>${t_draft}</strong> <span class="text-muted">${rampa.draft}</span></li>
                               <li class="mb-2"><strong>${t_width}</strong> <span class="text-muted">${rampa.width}</span></li>
                               <li><strong>${t_incline}</strong> <span class="text-muted">${rampa.incline}</span></li>
                           </ul>
                       </div>
                   </div>
               </div>

               <!-- Sección: Logística de aparcamiento -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-secondary border-4 bg-white">
                       <div class="card-body">
                           <h4 class="fw-bold text-dark text-uppercase mb-3 fs-6"><i class="bi bi-p-square text-secondary fs-5 me-2"></i> ${t_logistics}</h4>
                           <p class="small text-muted mb-0" style="text-align: justify;">${rampa.parkingLogistics}</p>
                       </div>
                   </div>
               </div>

               <!--  Sección: Tarifas -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-warning border-4 bg-white">
                       <div class="card-body">
                           <h4 class="fw-bold text-dark text-uppercase mb-3 fs-6"><i class="bi bi-cash-coin text-warning fs-5 me-2"></i> ${t_bur}</h4>
                           <p class="small text-muted mb-0">${rampa.tariffs}</p>
                       </div>
                   </div>
               </div>

               <!-- Sección: Servicios Anexos -->
               <div class="col-lg-6 mb-4">
                   <div class="card h-100 border-0 shadow-sm border-start border-primary border-4 bg-white">
                       <div class="card-body">
                           <h4 class="fw-bold text-dark text-uppercase mb-3 fs-6"><i class="bi bi-wrench-adjustable text-primary fs-5 me-2"></i> ${t_annex}</h4>
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
                               <h4 class="fw-bold text-danger text-uppercase mb-1 fs-6">${t_warn}</h4>
                               <p class="small text-danger mb-0"><strong>${(window._i18n && window._i18n.t) ? window._i18n.t('ramp_local_warnings') : 'Crítico:'}</strong> ${rampa.warnings}</p>
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
