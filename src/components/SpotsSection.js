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
                  
                  <div class="col-md-12 mb-4">
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

                  <!-- REVIEWS/COMMENTS SECTION (ZONAS) -->
                  <div class="col-md-12 pt-4 border-top">
                      <h4 class="fw-bold text-dark mb-4"><i class="bi bi-chat-left-text-fill text-primary me-2"></i>Reportes de Capturas</h4>
                      <div id="spotModalCommentsContainer" class="mb-4">
                          <!-- JS inyecta comentarios aquí -->
                      </div>
                      <div class="card border-0 bg-light shadow-sm">
                          <div class="card-body p-4">
                              <h6 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-pencil-square text-primary me-2"></i>Añadir Nuevo Reporte</h6>
                              <form onsubmit="event.preventDefault(); window.submitSpotComment();">
                                  <div class="mb-3">
                                      <textarea id="spotCommentInput" class="form-control border-0 shadow-sm" rows="3" placeholder="Ej: Hoy a las 6AM han entrado de sobra los verderones tirando con pan. ¿Qué tal ha ido la jornada de hoy?" required></textarea>
                                  </div>
                                  <button type="submit" class="btn btn-primary fw-bold px-4 shadow-sm"><i class="bi bi-send-fill me-2"></i>Publicar Reporte de Comunidad</button>
                              </form>
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