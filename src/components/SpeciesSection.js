export const SpeciesSection = () => {
    return `
      <!-- Species Section -->
      <section id="especies" class="section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Directorio de Especies</h2>
          <p>Fichas detalladas con biología, hábitat y regulaciones de las especies de Baleares.</p>
        </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          
          <!-- UI de Filtros Avanzados -->
          <div class="row mb-4 justify-content-center">
             <div class="col-md-3 mb-2">
                <label for="filter-dificultad" class="visually-hidden">Filtrar por dificultad</label>
                <select id="filter-dificultad" class="form-select shadow-sm border-primary text-primary species-filter fw-bold">
                   <option value="Todo">Dificultad: Todas</option>
                   <option value="Baja">Baja</option>
                   <option value="Media">Media</option>
                   <option value="Alta">Alta</option>
                   <option value="Muy alta">Muy Alta</option>
                </select>
             </div>
             <div class="col-md-3 mb-2">
                <label for="filter-calidad" class="visually-hidden">Filtrar por calidad gastronómica</label>
                <select id="filter-calidad" class="form-select shadow-sm border-primary text-primary species-filter fw-bold">
                   <option value="Todo">Calidad Gastronómica: Todas</option>
                   <option value="Excelente">Excelente</option>
                   <option value="buena">Buena / Muy Buena</option>
                   <option value="Moderada">Moderada / Baja</option>
                </select>
             </div>
             <div class="col-md-4 mb-2">
                <div class="input-group shadow-sm border-primary rounded">
                    <span class="input-group-text bg-primary text-white border-primary"><i class="bi bi-search"></i></span>
                    <label for="filter-text" class="visually-hidden">Buscar especies</label>
                    <input type="text" id="filter-text" class="form-control border-primary species-filter" placeholder="Buscar por pesca, nombre o zona...">
                </div>
             </div>
          </div>

          <!-- Swiper Container -->
          <div class="swiper species-swiper" style="padding-bottom: 50px;">
            <div class="swiper-wrapper" id="species-container">
               <div class="text-center w-100">Cargando Especies...</div>
            </div>
            <div class="swiper-pagination"></div>
          </div>

        </div>

        <!-- Specie Detail Modal -->
        <div class="modal fade" id="speciesModal" tabindex="-1" aria-labelledby="speciesModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg overflow-hidden" style="border-radius: 1rem;">
              <div class="modal-header align-items-center py-3 px-4" style="background: linear-gradient(135deg, var(--bs-primary) 0%, #1A365D 100%);">
                <h3 class="modal-title fw-bold text-white mb-0 fs-4" id="speciesModalLabel">Nombre</h3>
                <div id="speciesModalCatchAction" class="ms-auto me-3"></div>
                <button type="button" class="btn-close btn-close-white ms-0" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-0">
                  <!-- Imagen arriba (ocupa toda la anchura) -->
                  <div class="position-relative bg-dark d-flex align-items-center" style="height: 300px;">
                     <div id="speciesMediaCarousel" class="w-100 h-100 position-relative">
                     <img src="" id="speciesModalImage" class="w-100 h-100 object-fit-cover" alt="Foto de la especie" style="opacity: 0.85; position: absolute; top:0; left:0; transition: opacity 0.35s ease-in-out;">
                     <button type="button" id="speciesCarouselPrev" aria-label="Imagen anterior" class="btn btn-sm btn-outline-light position-absolute top-50 start-0 translate-middle-y m-2" style="z-index: 2;"><i class="bi bi-chevron-left"></i></button>
                     <button type="button" id="speciesCarouselNext" aria-label="Imagen siguiente" class="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y m-2" style="z-index: 2;"><i class="bi bi-chevron-right"></i></button>
                     <div id="speciesCarouselDots" class="position-absolute top-0 start-50 translate-middle-x mt-2 d-flex gap-1" style="z-index: 2; display: none;"></div>
                     <div class="position-absolute bottom-0 start-0 w-100 p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.95), transparent); z-index: 2;">
                        <h4 class="text-white fst-italic mb-0 fw-light fs-6" id="speciesModalScientific"><i class="bi bi-tag-fill me-2 text-info"></i>Nombre Cientifico</h4>
                     </div>
                  </div>
                  </div>

                  <!-- Datos debajo -->
                  <div class="p-4 p-md-5 bg-light overflow-auto" style="max-height: 50vh;">
                       <div class="d-flex align-items-center mb-3 border-bottom border-secondary-subtle pb-2">
                          <h4 class="fw-bold mb-0 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-book me-2"></i> Notas Biológicas</h4>
                          <div id="speciesModalAudioContainer"></div>
                       </div>
                       
                       <p id="speciesModalDescription" class="mb-4 text-dark" style="text-align: justify; line-height: 1.7; font-size: 0.98rem;"></p>
                       
                       <div id="speciesModalLocations"></div>

                       <h4 class="fw-bold mb-4 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-clipboard2-data me-2"></i> Ficha Técnica y Legalidad</h4>
                       <div id="speciesModalProperties">
                          <!-- Listado paramétrico inyectado vía JS (Grid layout dinámico) -->
                       </div>
                       
                       <div id="speciesModalVideo"></div>
                    </div>

              </div>
              <div class="modal-footer bg-light border-top-0 justify-content-end">
                <button type="button" class="btn btn-secondary px-4 fw-bold rounded-pill shadow-sm" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>

      </section>
    `;
};
