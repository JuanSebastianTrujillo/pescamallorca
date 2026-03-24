export const SpotsSection = () => {
  return `
    <section id="zonas" class="portfolio section">
      <div class="container section-title" data-aos="fade-up">
        <h2>Zonas de Pesca</h2>
        <p>Explora el catálogo completo de pesqueras divididas por características.</p>
      </div>

      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row gy-4" id="spots-container">
           <div class="text-center">Cargando Zonas desde JSON...</div>
        </div>
      </div>

      <div class="modal fade" id="spotModal" tabindex="-1" aria-labelledby="spotModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title fw-bold" id="spotModalLabel">Nombre de la Zona</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body p-4">
              <h6 id="spotModalLocality" class="mb-3"></h6>
              <p id="spotModalDescription" class="mb-4" style="text-align: justify;"></p>

              <h5 class="fw-bold border-bottom pb-2 mb-3"><i class="bi bi-images text-primary"></i> Galería</h5>
              <div class="row" id="spotModalGallery">
                  </div>

              <div class="row mt-4">
                  
                  <div class="col-md-12 mb-4">
                      <div class="card border-0 bg-light">
                          <div class="card-body">
                              <h6 class="fw-bold text-dark"><i class="bi bi-signpost-split text-warning"></i> Acceso y Precauciones</h6>
                              <p class="mb-0 small" id="spotModalAccess"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-6 mb-4">
                      <div class="card border-0 bg-light h-100">
                          <div class="card-body">
                              <h6 class="fw-bold text-dark"><i class="bi bi-water text-info"></i> Fondo Marino y Batimetría</h6>
                              <p class="mb-0 small" id="spotModalSeabed"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-6 mb-4">
                      <div class="card border-0 bg-light h-100">
                          <div class="card-body">
                              <h6 class="fw-bold text-dark"><i class="bi bi-tools text-secondary"></i> Técnicas Recomendadas</h6>
                              <p class="mb-0 small" id="spotModalTechniques"></p>
                          </div>
                      </div>
                  </div>
                  
                  <div class="col-md-12">
                      <div class="card border-0 shadow-sm border-start border-success border-4">
                          <div class="card-body">
                              <h6 class="fw-bold text-success"><i class="bi bi-fish"></i> Especies Frecuentes</h6>
                              <div id="spotModalSpecies" class="mt-2"></div>
                              <small class="text-muted d-block mt-2">
                                  * Busca estas especies en la sección de Ictiología para más detalles.
                              </small>
                          </div>
                      </div>
                  </div>

              </div>
            </div>
            
            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  `;
};