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
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-light align-items-center">
                <h5 class="modal-title fw-bold text-primary fs-4 mb-0" id="speciesModalLabel">Nombre</h5>
                <div id="speciesModalCatchAction" class="ms-auto me-3"></div>
                <button type="button" class="btn-close ms-0" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                 <div class="row">
                    <div class="col-md-5 mb-3 mb-md-0 text-center">
                       <!-- Img aspect ratio and fallback -->
                       <img src="" id="speciesModalImage" class="img-fluid rounded shadow-sm object-fit-cover w-100" style="max-height: 250px;" alt="">
                    </div>
                    <div class="col-md-7">
                       <h6 class="text-secondary fst-italic mb-3 border-bottom pb-2" id="speciesModalScientific">Nombre Cientifico</h6>
                       <p id="speciesModalDescription" class="mb-4 text-dark"></p>
                       
                       <div class="small">
                         <ul class="list-group list-group-flush border-top" id="speciesModalProperties">
                            <!-- List items injectados via app.js -->
                         </ul>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    `;
};
