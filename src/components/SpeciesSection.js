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
                <select id="filter-dificultad" class="form-select shadow-sm border-primary text-primary species-filter fw-bold">
                   <option value="Todo">Dificultad: Todas</option>
                   <option value="Baja">Baja</option>
                   <option value="Media">Media</option>
                   <option value="Alta">Alta</option>
                   <option value="Muy alta">Muy Alta</option>
                </select>
             </div>
             <div class="col-md-3 mb-2">
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
          <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg overflow-hidden" style="border-radius: 1rem;">
              <div class="modal-header align-items-center py-3 px-4" style="background: linear-gradient(135deg, var(--bs-primary) 0%, #1A365D 100%);">
                <h4 class="modal-title fw-bold text-white mb-0" id="speciesModalLabel">Nombre</h4>
                <div id="speciesModalCatchAction" class="ms-auto me-3"></div>
                <button type="button" class="btn-close btn-close-white ms-0" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-0">
                 
                 <div class="row g-0">
                    <!-- Columna Imagen -->
                    <div class="col-12 col-md-5 position-relative bg-dark d-flex align-items-center" style="min-height: 400px;">
                       <img src="" id="speciesModalImage" class="w-100 h-100 object-fit-cover" alt="" style="opacity: 0.85; position: absolute; top:0; left:0;">
                       <div class="position-absolute bottom-0 start-0 w-100 p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);">
                          <h5 class="text-white fst-italic mb-0 fw-light" id="speciesModalScientific"><i class="bi bi-tag-fill me-2 text-info"></i>Nombre Cientifico</h5>
                       </div>
                    </div>
                    
                    <!-- Columna Datos -->
                    <div class="col-12 col-md-7 p-4 p-md-5 bg-light overflow-auto" style="max-height: 80vh;">
                       <div class="d-flex align-items-center mb-3 border-bottom border-secondary-subtle pb-2">
                          <h5 class="fw-bold mb-0 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-book me-2"></i> Notas Biológicas</h5>
                          <div id="speciesModalAudioContainer"></div>
                       </div>
                       
                       <p id="speciesModalDescription" class="mb-4 text-dark" style="text-align: justify; line-height: 1.7; font-size: 0.98rem;"></p>
                       
                       <div id="speciesModalLocations"></div>

                       <h5 class="fw-bold mb-4 text-primary" style="letter-spacing: -0.5px;"><i class="bi bi-clipboard2-data me-2"></i> Ficha Técnica y Legalidad</h5>
                       <div id="speciesModalProperties">
                          <!-- Listado paramétrico inyectado vía JS (Grid layout dinámico) -->
                       </div>
                       
                       <div id="speciesModalVideo"></div>
                    </div>
                 </div>

              </div>
            </div>
          </div>
        </div>

      </section>
    `;
};
