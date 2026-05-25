export const BeachesSection = () => {
    return `
      <!-- Beaches Section -->
      <section id="playas" class="section">
            <div class="container section-title" data-aos="fade-up">
               <h2 data-i18n="beach_title">Playas</h2>
               <p data-i18n="beach_tagline">Descubre las mejores playas de Mallorca, sus características y accesibilidad.</p>
            </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          
          <!-- UI de Filtros Avanzados -->
          <div class="row mb-4 justify-content-center">
             <div class="col-md-3 mb-2">
                <label for="filter-beach-dificultad" class="visually-hidden" data-i18n="filter_beach_dificultad_label">Filtrar por dificultad de acceso</label>
                <select id="filter-beach-dificultad" class="form-select shadow-sm border-primary text-primary beaches-filter fw-bold">
                   <option value="Todo" data-i18n="beach_option_all_difficulty">Acceso: Todos</option>
                   <option value="Facil" data-i18n="beach_option_easy">Fácil</option>
                   <option value="Media" data-i18n="beach_option_medium_difficulty">Media</option>
                   <option value="Dificil" data-i18n="beach_option_hard">Difícil</option>
                </select>
             </div>
             <div class="col-md-3 mb-2">
                <label for="filter-beach-tipo" class="visually-hidden" data-i18n="filter_beach_tipo_label">Filtrar por tipo de playa</label>
                <select id="filter-beach-tipo" class="form-select shadow-sm border-primary text-primary beaches-filter fw-bold">
                   <option value="Todo" data-i18n="beach_option_all_types">Tipo: Todos</option>
                   <option value="Arena" data-i18n="beach_option_sand">Arena</option>
                   <option value="Rocosa" data-i18n="beach_option_rock">Rocosa</option>
                </select>
             </div>
             <div class="col-md-4 mb-2">
                <div class="input-group shadow-sm border-primary rounded">
                    <span class="input-group-text bg-primary text-white border-primary"><i class="bi bi-search"></i></span>
                    <label for="filter-beach-text" class="visually-hidden" data-i18n="filter_beach_text_label">Buscar playas</label>
                    <input type="text" id="filter-beach-text" class="form-control border-primary beaches-filter" placeholder="Buscar por nombre, zona o municipio" data-i18n-placeholder="beach_search_placeholder">
                </div>
             </div>
          </div>

          <!-- Swiper Container -->
          <div class="swiper beaches-swiper" style="padding-bottom: 50px;">
            <div class="swiper-button-prev beaches-swiper-prev"></div>
            <div class="swiper-wrapper" id="beaches-container">
               <div class="text-center w-100 py-4">
                 <div class="spinner-border text-primary mb-2" role="status" aria-hidden="true"></div>
                 <p class="text-muted small" data-i18n="beach_loading">Cargando playas desde mallorcalas.online…</p>
               </div>
            </div>
            <div class="swiper-button-next beaches-swiper-next"></div>
            <div class="swiper-pagination beaches-swiper-pagination"></div>
          </div>

        </div>

      <!-- Beach Detail Modal -->
      <div class="modal fade" id="beachModal" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="beachModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg overflow-hidden" style="border-radius: 1rem;">
              <div class="modal-header align-items-center py-3 px-4" style="background: linear-gradient(135deg, var(--bs-primary) 0%, #1A365D 100%);">
                        <h3 class="modal-title fw-bold text-white mb-0 fs-4" id="beachModalLabel" data-i18n="beach_modal_title">Nombre</h3>
                        <button class="btn btn-sm btn-outline-light rounded-pill ms-auto me-3 px-3 fw-bold" data-speak-modal="beach">
                           <i class="bi bi-volume-up-fill me-1"></i> <span data-i18n="beach_modal_read">Leer</span>
                        </button>
                <button type="button" class="btn-close btn-close-white ms-0" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-0">
                  <div class="position-relative bg-dark d-flex align-items-center" style="height: 300px;">
                     <div class="w-100 h-100 position-relative">
                     <img src="" id="beachModalImage" class="w-100 h-100 object-fit-cover" alt="Foto de la playa" style="opacity: 0.85; position: absolute; top:0; left:0;">
                     <div class="position-absolute bottom-0 start-0 w-100 p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.95), transparent); z-index: 2;">
                           <h4 class="text-white fst-italic mb-0 fw-light fs-6" id="beachModalLocality"><i class="bi bi-geo-alt-fill me-2 text-danger"></i><span data-i18n="beach_modal_location">Ubicación</span></h4>
                     </div>
                  </div>
                  </div>

                  <div class="p-4 p-md-5 bg-light overflow-auto" style="max-height: 50vh;">
                       <h4 class="fw-bold mb-3 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-info-circle me-2"></i> <span data-i18n="beach_modal_desc">Descripción</span></h4>
                       <p id="beachModalDescription" class="mb-4 text-dark" style="text-align: justify; line-height: 1.7; font-size: 0.98rem;"></p>
                       
                       <h4 class="fw-bold mb-4 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-clipboard2-data me-2"></i> <span data-i18n="beach_modal_details">Detalles</span></h4>
                       <div id="beachModalProperties" class="row">
                          <!-- Properties injected via JS -->
                       </div>
                    </div>

              </div>
              <div class="modal-footer bg-light border-top-0 justify-content-end">
                <button type="button" class="btn btn-secondary px-4 fw-bold rounded-pill shadow-sm" data-bs-dismiss="modal" data-i18n="beach_modal_close">Cerrar</button>
              </div>
            </div>
          </div>
        </div>

      </section>
    `;
};
