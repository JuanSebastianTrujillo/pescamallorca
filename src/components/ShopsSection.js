export const ShopsSection = () => {
  return `
      <!-- Shops Section -->
      <section id="tiendas" class="section light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Módulo de Tiendas y Proveedores</h2>
          <p>Directorio comercial experto. Encuentra el mejor material, cebo fresco y servicios de reparación naval en Mallorca.</p>
        </div>
        
        <div class="container" data-aos="fade-up" data-aos-delay="100">
            <!-- Functional Filters -->
            <div class="row mb-5 justify-content-center">
               <div class="col-lg-10">
                   <div class="card bg-white border-0 shadow-sm p-4">
                       <h3 class="mb-3 text-secondary fs-6" style="text-transform: uppercase;"><strong><i class="bi bi-funnel-fill me-2 text-primary"></i>Filtros de Búsqueda Comercial</strong></h3>
                       <div class="d-flex flex-wrap gap-3 align-items-center">
                           <label for="shops-zone-filter" class="visually-hidden">Filtrar por zona</label>
                           <select id="shops-zone-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;">
                               <option value="all" selected>Cualquier zona</option>
                               <option value="palma">Zonas de Palma</option>
                               <option value="norte">Zona Norte (Alcúdia, Pollença)</option>
                               <option value="sur">Zona Sur / Levante</option>
                           </select>
                           <label for="shops-service-filter" class="visually-hidden">Filtrar por servicio</label>
                           <select id="shops-service-filter" class="form-select border-0 bg-light shadow-sm" style="width: auto; flex-grow: 1;">
                               <option value="all" selected>Todos los servicios</option>
                               <option value="cebo">Vende Cebo Vivo</option>
                               <option value="taller">Taller de Reparación</option>
                               <option value="submarina">Pesca Submarina</option>
                               <option value="licencias">Gestión de Licencias</option>
                           </select>
                           <button id="shops-search-btn" class="btn btn-primary shadow-sm px-4 fw-bold"><i class="bi bi-search me-2"></i>Filtrar</button>
                       </div>
                   </div>
               </div>
            </div>

            <!-- Shops Grid Container -->
            <div class="row gy-4" id="shops-container">
               <!-- Tarjetas inyectadas dinámicamente -->
            </div>
        </div>

        <!-- Shop Detail Modal -->
        <div class="modal fade" id="shopModal" tabindex="-1" aria-labelledby="shopModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg">
              
              <div class="modal-header bg-primary text-white border-0">
                <h3 class="modal-title fw-bold fs-5" id="shopModalLabel"><i class="bi bi-shop me-2"></i>Detalle de la Tienda</h3>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body p-0">
                <!-- Se inyecta dinámicamente desde JS -->
                <div id="shopModalBodyContent"></div>
              </div>
              
              <div class="modal-footer bg-light border-top-0">
                <button type="button" class="btn btn-secondary px-4 fw-bold rounded-pill shadow-sm" data-bs-dismiss="modal">Cerrar</button>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    `;
};

// --- MOCK DATA FOR SHOPS ---
const storesData = [
  {
    id: 0,
    name: "Pesca Palma Pro",
    geoZone: "palma",
    keyServices: ["cebo", "taller", "licencias"],
    location: "Palma - Passeig Marítim",
    address: "Carrer de la Mar, 10, 07014 Palma",
    rating: "4.8",
    image: "assets/img/hero-carousel/hero-carousel-1.jpg",
    gallery: [
      "assets/img/hero-carousel/hero-carousel-1.jpg",
      "assets/img/hero-carousel/hero-carousel-2.jpg",
      "assets/img/hero-carousel/hero-carousel-3.jpg"
    ],
    contact: {
      phone: "+34971000111",
      phoneStr: "971 000 111",
      email: "info@pescapalmapro.es",
      web: "https://pescapalmapro.es"
    },
    googleMapsLink: "https://maps.google.com/?q=Palma",
    hours: [
      { condition: "Lunes a Viernes", time: "09:00h - 20:00h (Ininterrumpido)" },
      { condition: "Sábados", time: "09:00h - 14:00h" },
      { condition: "Domingos / Festivos", time: "Cerrado" }
    ],
    badges: [
      { text: "Cebo Vivo", color: "success", icon: "bi-bug" },
      { text: "Taller Reparación", color: "info", icon: "bi-tools" }
    ],
    services: {
      bait: "Coreano, Americano, Tita de palangre, Norte, Rosca, y Llombriu vivo por encargo semanal.",
      workshop: "Anillado oficial Fuji, revisión y engrase de carretes Shimano/Daiwa, reparación de punteras de carbono.",
      licenses: "Tramitación Exprés de la Licencia de Pesca Marítima Recreativa del Govern Balear.",
      misc: "Máquina expendedora de cebo 24h y venta de hielo en escamas/bloque."
    },
    specialty: "Altamente especializados en Spinning desde costa, Jigging y curricán de altura. Amplio stock en señuelos artesanales."
  },
  {
    id: 1,
    name: "Sub Náutica Alcúdia",
    geoZone: "norte",
    keyServices: ["submarina", "alquiler"],
    location: "Alcúdia - Puerto",
    address: "Passeig Marítim, 45, 07400 Alcúdia",
    rating: "4.5",
    image: "assets/img/hero-carousel/hero-carousel-3.jpg",
    gallery: [
      "assets/img/hero-carousel/hero-carousel-3.jpg"
    ],
    contact: {
      phone: "+34971222333",
      phoneStr: "971 222 333",
      email: "contacto@subalcudia.com",
      web: "https://instagram.com"
    },
    googleMapsLink: "https://maps.google.com/?q=Alcudia",
    hours: [
      { condition: "Horario de Verano (Mayo-Oct)", time: "08:00h - 21:00h" },
      { condition: "Horario de Invierno", time: "09:00h - 13:30h, 16:30h - 19:00h" }
    ],
    badges: [
      { text: "Pesca Submarina", color: "primary", icon: "bi-water" },
      { text: "Alquiler Material", color: "warning", icon: "bi-cart-check" }
    ],
    services: {
      bait: "Cebo empaquetado y congelado (sardina, calamar). No disponen de cebo vivo habitualmente.",
      workshop: "Carga de fusiles de aire comprimido, cambio de gomas y aletas a medida.",
      licenses: "Solo licencias de pesca submarina (requiere certificado médico).",
      misc: "Alquiler de botellas de buceo, lastre, y boyas de señalización."
    },
    specialty: "La tienda pionera en todo el Norte de Mallorca orientada al 100% a la Pesca Submarina y apnea."
  },
  {
    id: 2,
    name: "Ca'n Sion",
    geoZone: "palma",
    keyServices: ["cebo"],
    location: "Palma - Centro Historico",
    address: "Carrer del Sindicat, Palma",
    rating: "4.9",
    image: "assets/img/hero-carousel/hero-carousel-2.jpg",
    gallery: [
      "assets/img/hero-carousel/hero-carousel-2.jpg"
    ],
    contact: {
      phone: "+34971333444",
      phoneStr: "971 333 444",
      email: "sion@cansion.es",
      web: "https://cansion.es"
    },
    googleMapsLink: "https://maps.google.com/?q=Palma",
    hours: [
      { condition: "Lunes a Viernes", time: "09:30h - 13:30h, 17:00h - 20:00h" },
      { condition: "Sábados", time: "09:30h - 13:30h" }
    ],
    badges: [
      { text: "Tradicional", color: "secondary", icon: "bi-star" },
      { text: "Surtido Cebo Vivo", color: "success", icon: "bi-bug" }
    ],
    services: {
      bait: "Disponibilidad garantizada del mejor coreano y tita de la isla. Lombriz autóctona de arena bajo reserva.",
      workshop: "Pequeñas reparaciones de punteras tradicionales y montajes de bajos de línea directos de competición.",
      licenses: "Asesoramiento sobre normativas de tallas mínimas locales.",
      misc: "Venta de plomos artesanales fundidos en tienda."
    },
    specialty: "La tienda de barrio icónica para el pescador tradicional de Surfcasting y pesca a boya. Trato familiar y cercano."
  }
];

export const initShops = () => {
  const container = document.getElementById("shops-container");
  const zoneFilter = document.getElementById("shops-zone-filter");
  const serviceFilter = document.getElementById("shops-service-filter");
  const searchBtn = document.getElementById("shops-search-btn");

  if (!container || !zoneFilter || !serviceFilter || !searchBtn) return;

  window.currentShopsData = storesData;

  const renderShops = () => {
    const zoneVal = zoneFilter.value;
    const svcVal = serviceFilter.value;

    const filtered = storesData.filter(s => {
      let pass = true;
      if (zoneVal !== 'all' && s.geoZone !== zoneVal) pass = false;
      if (svcVal !== 'all' && !s.keyServices.includes(svcVal)) pass = false;
      return pass;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-shop fs-1 text-muted mb-3 d-block"></i>
                    <h5 class="text-secondary">No se han encontrado tiendas con estos criterios.</h5>
                </div>
            `;
      return;
    }

    let html = '';
    filtered.forEach(store => {

      let badgesHtml = '';
      store.badges.forEach(b => {
        badgesHtml += `<span class="badge bg-${b.color} me-1 shadow-sm"><i class="bi ${b.icon} me-1"></i>${b.text}</span>`;
      });

      html += `
            <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">
               <div class="card w-100 shadow-sm border-0 shop-card cursor-pointer" role="button" tabindex="0" aria-label="Ver detalles de ${store.name}" onclick="openShopModal(${store.id})" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <div class="position-relative">
                     <img src="${store.image}" class="card-img-top object-fit-cover" alt="Fotografía detallada de la tienda de pesca ${store.name}, especializada en artículos de pesca en Mallorca" style="height:220px" loading="lazy" decoding="async" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
                     <div class="position-absolute bottom-0 start-0 m-3">
                         <span class="badge bg-dark align-items-center shadow-lg"><i class="bi bi-star-fill text-warning me-1"></i> ${store.rating} / 5</span>
                     </div>
                  </div>
                  
                  <div class="card-body d-flex flex-column bg-white">
                      <h3 class="card-title fw-bold text-primary mb-1 fs-5">${store.name}</h3>
                      <p class="card-text text-muted small mb-3"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${store.location}</p>
                      <div class="mb-3">
                         ${badgesHtml}
                      </div>
                      <div class="mt-auto border-top pt-3">
                         <button class="btn btn-outline-primary w-100 fw-bold rounded-pill"><i class="bi bi-shop-window me-2"></i>Ver Tienda</button>
                      </div>
                  </div>
               </div>
            </div>
            `;
    });
    container.innerHTML = html;
  };

  searchBtn.addEventListener("click", renderShops);
  renderShops();
};

window.openShopModal = (storeId) => {
  const store = window.currentShopsData.find(s => s.id === storeId);
  if (!store) return;

  // Carousel Setup for Gallery
  let carouselIndicators = '';
  let carouselItems = '';
  store.gallery.forEach((img, index) => {
    const activeClass = index === 0 ? 'active' : '';
    carouselIndicators += `<button type="button" data-bs-target="#shopGalleryCarousel" data-bs-slide-to="${index}" class="${activeClass}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>`;
    carouselItems += `
            <div class="carousel-item ${activeClass}">
                <img src="${img}" class="d-block w-100 object-fit-cover rounded shadow-sm" style="height: 350px;" alt="Fotografía detallada de la tienda de pesca ${store.name}, especializada en artículos de pesca en Mallorca" onerror="this.src='assets/img/hero-carousel/hero-carousel-1.jpg'">
            </div>
        `;
  });

  // Hours UI table
  let hoursHtml = '<table class="table table-sm table-borderless small mb-0">';
  store.hours.forEach(h => {
    hoursHtml += `<tr><td class="fw-bold text-dark w-50">${h.condition}</td><td class="text-muted text-end">${h.time}</td></tr>`;
  });
  hoursHtml += '</table>';

  // Detailed Body HTML
  const modalHtml = `
      <div class="p-4 bg-light d-flex flex-column flex-md-row justify-content-between align-items-center border-bottom shadow-sm">
         <div class="text-center text-md-start mb-3 mb-md-0">
             <h2 class="fw-bold text-primary mb-1">${store.name}</h2>
             <span class="text-muted"><i class="bi bi-map-fill text-danger me-1"></i>${store.address}</span>
         </div>
         <div class="d-flex gap-2">
             <a href="tel:${store.contact.phone}" class="btn btn-primary rounded-pill fw-bold shadow-sm px-4"><i class="bi bi-telephone-fill me-2"></i>Llamar</a>
             <a href="${store.googleMapsLink}" target="_blank" class="btn btn-success rounded-pill fw-bold shadow-sm px-4"><i class="bi bi-cursor-fill me-2"></i>Ruta GPS</a>
         </div>
      </div>

      <div class="p-0 border-bottom">
         <!-- Bootstrap Carousel -->
         <div id="shopGalleryCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">${carouselIndicators}</div>
            <div class="carousel-inner">${carouselItems}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#shopGalleryCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon shadow-lg bg-dark rounded-circle p-2" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#shopGalleryCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon shadow-lg bg-dark rounded-circle p-2" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
         </div>
      </div>

      <div class="p-4 p-md-5 bg-white">
          <div class="row align-items-start gy-4">
              
              <!-- Left Column: Specialty & Contacts & Hours -->
              <div class="col-lg-5">
                  <div class="mb-4">
                      <h5 class="fw-bold text-dark mb-3"><i class="bi bi-star-fill text-warning me-2"></i>Especialidad de la Casa</h5>
                      <p class="text-muted" style="text-align: justify; line-height: 1.6;">${store.specialty}</p>
                  </div>

                  <div class="card border-0 shadow-sm border-start border-info border-5 mb-4 bg-light">
                      <div class="card-body">
                          <h6 class="fw-bold text-info text-uppercase mb-3"><i class="bi bi-clock-history me-2"></i>Horarios y Apertura</h6>
                          ${hoursHtml}
                      </div>
                  </div>

                  <div class="card border-0 shadow-sm border-start border-secondary border-5 bg-light">
                     <div class="card-body">
                          <h6 class="fw-bold text-secondary text-uppercase mb-3"><i class="bi bi-info-circle-fill me-2"></i>Contacto Digital</h6>
                          <ul class="list-unstyled mb-0 small">
                             <li class="mb-2"><a href="tel:${store.contact.phone}" class="text-decoration-none text-dark"><i class="bi bi-telephone me-2 text-primary"></i>${store.contact.phoneStr}</a></li>
                             <li class="mb-2"><a href="mailto:${store.contact.email}" class="text-decoration-none text-dark"><i class="bi bi-envelope me-2 text-primary"></i>${store.contact.email}</a></li>
                             <li><a href="${store.contact.web}" target="_blank" class="text-decoration-none text-dark"><i class="bi bi-globe me-2 text-primary"></i>Visitar Web/Redes</a></li>
                          </ul>
                     </div>
                  </div>
              </div>

              <!-- Right Column: Services Catalog -->
              <div class="col-lg-7 ps-lg-5">
                  <h4 class="fw-bold text-dark mb-4 border-bottom pb-3"><i class="bi bi-ui-checks-grid text-primary me-2"></i>Catálogo de Servicios</h4>
                  
                  <div class="d-flex align-items-start mb-4">
                      <div class="bg-success bg-opacity-10 text-success rounded px-3 py-2 me-3 shadow-sm"><i class="bi bi-bug-fill fs-3"></i></div>
                      <div>
                          <h6 class="fw-bold text-success text-uppercase mb-1">Cebo Vivo y Carnada</h6>
                          <p class="text-muted small mb-0">${store.services.bait}</p>
                      </div>
                  </div>

                  <div class="d-flex align-items-start mb-4">
                      <div class="bg-primary bg-opacity-10 text-primary rounded px-3 py-2 me-3 shadow-sm"><i class="bi bi-tools fs-3"></i></div>
                      <div>
                          <h6 class="fw-bold text-primary text-uppercase mb-1">Taller y Reparaciones</h6>
                          <p class="text-muted small mb-0">${store.services.workshop}</p>
                      </div>
                  </div>

                  <div class="d-flex align-items-start mb-4">
                      <div class="bg-warning bg-opacity-10 text-warning rounded px-3 py-2 me-3 shadow-sm"><i class="bi bi-card-heading fs-3"></i></div>
                      <div>
                          <h6 class="fw-bold text-dark text-uppercase mb-1">Gestión de Licencias</h6>
                          <p class="text-muted small mb-0">${store.services.licenses}</p>
                      </div>
                  </div>

                  <div class="d-flex align-items-start">
                      <div class="bg-info bg-opacity-10 text-info rounded px-3 py-2 me-3 shadow-sm"><i class="bi bi-snow fs-3"></i></div>
                      <div>
                          <h6 class="fw-bold text-info text-uppercase mb-1">Hielo y Alquileres</h6>
                          <p class="text-muted small mb-0">${store.services.misc}</p>
                      </div>
                  </div>
              </div>
          </div>

          <!-- REVIEWS SECTION -->
          <div class="row mt-5 pt-4 border-top">
             <div class="col-12">
                 <h4 class="fw-bold text-dark mb-4"><i class="bi bi-star text-warning me-2"></i>Reseñas de Pescadores</h4>
                 
                 <div id="shopReviewsList_${store.id}" class="mb-4">
                     <!-- Carga dinámica -->
                 </div>

                 <!-- Formulario -->
                 <div class="card border-0 bg-light shadow-sm">
                    <div class="card-body p-4">
                       <h6 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-pencil-square me-2 text-primary"></i>Deja tu valoración</h6>
                       <form onsubmit="event.preventDefault(); window.submitShopReview(${store.id});">
                           <div class="mb-3">
                               <label class="form-label small fw-bold text-dark">Puntuación General</label>
                               <div id="starRatingContainer_${store.id}" class="d-flex align-items-center mb-1" style="cursor: pointer;" onmouseleave="window.resetStarUI(${store.id})">
                                   <!-- 5 estrellas interactivas -->
                                   <i class="bi bi-star-fill text-warning fs-4 me-1" role="button" tabindex="0" aria-label="Calificar con 1 estrella" data-index="1" onmousemove="window.handleStarHover(event, this, ${store.id})" onclick="window.setStarRating(event, this, ${store.id})"></i>
                                   <i class="bi bi-star-fill text-warning fs-4 me-1" role="button" tabindex="0" aria-label="Calificar con 2 estrellas" data-index="2" onmousemove="window.handleStarHover(event, this, ${store.id})" onclick="window.setStarRating(event, this, ${store.id})"></i>
                                   <i class="bi bi-star-fill text-warning fs-4 me-1" role="button" tabindex="0" aria-label="Calificar con 3 estrellas" data-index="3" onmousemove="window.handleStarHover(event, this, ${store.id})" onclick="window.setStarRating(event, this, ${store.id})"></i>
                                   <i class="bi bi-star-fill text-warning fs-4 me-1" role="button" tabindex="0" aria-label="Calificar con 4 estrellas" data-index="4" onmousemove="window.handleStarHover(event, this, ${store.id})" onclick="window.setStarRating(event, this, ${store.id})"></i>
                                   <i class="bi bi-star-fill text-warning fs-4 me-1" role="button" tabindex="0" aria-label="Calificar con 5 estrellas" data-index="5" onmousemove="window.handleStarHover(event, this, ${store.id})" onclick="window.setStarRating(event, this, ${store.id})"></i>
                               </div>
                               <input type="hidden" id="reviewRatingInput_${store.id}" value="5">
                               <span id="starRatingText_${store.id}" class="small text-muted fw-bold">Excelente (5/5)</span>
                           </div>
                           <div class="mb-3">
                               <label class="form-label small fw-bold text-dark">Tu Reseña Escrita</label>
                               <textarea id="reviewTextInput_${store.id}" class="form-control border-0 shadow-sm" rows="3" placeholder="¿Cómo fue la compra? ¿Recibiste buen asesoramiento?" required></textarea>
                           </div>
                           <button type="submit" class="btn btn-warning fw-bold px-4 shadow-sm text-dark"><i class="bi bi-send-fill me-2"></i>Publicar Reseña Pública</button>
                       </form>
                    </div>
                 </div>
             </div>
          </div>

      </div>
    `;

  document.getElementById('shopModalBodyContent').innerHTML = modalHtml;

  // Inyectar reseñas dinámicas
  setTimeout(() => {
    window.renderShopReviews(store.id);
  }, 100);

  // Trigger standard Bootstrap modal logic
  const modalEl = document.getElementById('shopModal');
  let modal = bootstrap.Modal.getInstance(modalEl);
  if (!modal) {
    modal = new bootstrap.Modal(modalEl);
  }
  modal.show();
};

window.renderShopReviews = (storeId) => {
  const listEl = document.getElementById(`shopReviewsList_${storeId}`);
  if (!listEl) return;
  const revs = JSON.parse(localStorage.getItem(`pm_shop_reviews_${storeId}`)) || [];
  if (revs.length === 0) {
    listEl.innerHTML = '<p class="text-muted small fst-italic"><i class="bi bi-info-circle me-1"></i>Aún no hay reseñas. ¡Sé el primero en valorar esta tienda de pesca!</p>';
    return;
  }
  let html = '';
  revs.forEach(r => {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (r.rating >= i) starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
      else if (r.rating >= i - 0.5) starsHtml += '<i class="bi bi-star-half text-warning"></i>';
      else starsHtml += '<i class="bi bi-star text-secondary opacity-25"></i>';
    }

    html += `
        <div class="mb-3 p-4 bg-white rounded shadow-sm border-start border-warning border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong><i class="bi bi-person-circle me-2 text-secondary fs-5 align-middle"></i>Usuario Verificado</strong>
                <span class="small" style="text-shadow: 1px 1px 1px rgba(0,0,0,0.1);">${starsHtml}</span>
            </div>
            <p class="mb-2 text-dark" style="white-space: pre-wrap; font-size: 0.95rem;">${r.text}</p>
            <small class="text-muted fw-bold" style="font-size: 0.75rem;"><i class="bi bi-clock me-1"></i>Publicado el ${r.date}</small>
        </div>
        `;
  });
  listEl.innerHTML = html;
};

// ==========================
// RATING UI HANDLERS
// ==========================

window.handleStarHover = (e, el, storeId) => {
  const rect = el.getBoundingClientRect();
  const isHalf = (e.clientX - rect.left) < (rect.width / 2);
  let val = parseInt(el.getAttribute('data-index'));
  if (isHalf) val -= 0.5;
  window.renderStarsUI(storeId, val, true);
};

window.renderStarsUI = (storeId, value, isHover) => {
  const container = document.getElementById(`starRatingContainer_${storeId}`);
  if (!container) return;
  const stars = container.querySelectorAll('i');

  // Si esta previsualizando con hover es más tenue, si está clickado (real) es amarillo fuerte.
  const activeClass = isHover ? 'text-secondary' : 'text-warning';

  stars.forEach((star, idx) => {
    const starVal = idx + 1;
    star.className = 'bi fs-4 me-1'; // Reset

    if (value >= starVal) {
      star.classList.add('bi-star-fill', activeClass);
    } else if (value >= starVal - 0.5) {
      star.classList.add('bi-star-half', activeClass);
    } else {
      star.classList.add('bi-star', 'text-secondary', 'opacity-25');
    }
  });

  const texts = {
    0.5: "La peor tienda de pesca de Mallorca", 1: "Pésimo", 1.5: "Malo", 2: "Regular", 2.5: "Aceptable",
    3: "Bueno", 3.5: "Muy bueno", 4: "Genial", 4.5: "Casi perfecto", 5: "Excelente"
  };
  const textEl = document.getElementById(`starRatingText_${storeId}`);
  if (textEl) {
    textEl.innerHTML = `<span class="${activeClass} fw-bold">${texts[value] || ""} (${value}/5)</span>`;
  }
};

window.setStarRating = (e, el, storeId) => {
  const rect = el.getBoundingClientRect();
  const isHalf = (e.clientX - rect.left) < (rect.width / 2);
  let val = parseInt(el.getAttribute('data-index'));
  if (isHalf) val -= 0.5;

  const inputRate = document.getElementById(`reviewRatingInput_${storeId}`);
  if (inputRate) inputRate.value = val;
  window.renderStarsUI(storeId, val, false); // Pasa false para anclarlo en amarillo
};

window.resetStarUI = (storeId) => {
  const inputRate = document.getElementById(`reviewRatingInput_${storeId}`);
  if (inputRate) {
    window.renderStarsUI(storeId, parseFloat(inputRate.value), false);
  }
};



window.submitShopReview = (storeId) => {
  const textEl = document.getElementById(`reviewTextInput_${storeId}`);
  const rateEl = document.getElementById(`reviewRatingInput_${storeId}`);
  if (!textEl || !rateEl || !textEl.value.trim()) return;

  const newRev = {
    rating: parseFloat(rateEl.value),
    text: textEl.value.trim(),
    date: new Date().toLocaleDateString('es-ES')
  };
  const revs = JSON.parse(localStorage.getItem(`pm_shop_reviews_${storeId}`)) || [];
  revs.unshift(newRev);
  localStorage.setItem(`pm_shop_reviews_${storeId}`, JSON.stringify(revs));

  textEl.value = '';
  window.renderShopReviews(storeId);
};

