export const SpotsSection = () => {
  return `
    <section id="zonas" class="section">
      
      <div class="container section-title mb-4" data-aos="fade-up">
        <h2 class="text-dark fw-bold">Zonas de Pesca</h2>
        <p class="text-secondary">Explora el catálogo completo o usa nuestro recomendador para encontrar tu pesquera ideal.</p>
      </div>

      <div class="container mb-5" data-aos="fade-up">
        <div class="card shadow-sm border-0 bg-white p-4 rounded-3">
          <h6 class="fw-bold mb-3 text-secondary text-uppercase" style="font-size: 0.85rem; letter-spacing: 0.5px;">
            <i class="bi bi-funnel-fill text-primary me-1"></i> Filtros de búsqueda
          </h6>
          
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label small fw-bold text-muted">Municipio / Zona</label>
              <select id="rec-zona" class="form-select border-light-subtle bg-light recommender-input">
                <option value="">Cualquier zona...</option>
                <option value="pollença">Pollença</option>
                <option value="muro">Muro</option>
                <option value="santanyí">Santanyí</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold text-muted">Momento del Día</label>
              <select id="rec-tiempo" class="form-select border-light-subtle bg-light recommender-input">
                <option value="">Cualquier momento...</option>
                <option value="amanecer">Amanecer</option>
                <option value="día">Día</option>
                <option value="atardecer">Atardecer</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold text-muted">Técnica de Pesca</label>
              <select id="rec-tipo" class="form-select border-light-subtle bg-light recommender-input">
                <option value="">Cualquier técnica...</option>
                <option value="rockfishing">Rockfishing</option>
                <option value="surfcasting">Surfcasting</option>
                <option value="fondo">Pesca a fondo</option>
                <option value="spinning">Spinning</option>
                <option value="boya">Boya</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold text-muted">Especie Objetivo</label>
              <select id="rec-pez" class="form-select border-light-subtle bg-light recommender-input">
                <option value="">Cualquier pez...</option>
                <option value="dorada">Dorada</option>
                <option value="mero">Mero</option>
                <option value="sargo">Sargo</option>
                <option value="dentón">Dentón</option>
                <option value="llampuga">Llampuga</option>
                <option value="cap-roig">Cap-roig</option>
                <option value="serrano">Serrano</option>
                <option value="oblada">Oblada</option>
                <option value="salpa">Salpa</option>
                <option value="bonito">Bonito</option>
              </select>
            </div>
          </div>
          
          <div class="mt-4 text-end">
             <button class="btn btn-link text-decoration-none text-secondary btn-sm me-3" onclick="resetRecommender()">Limpiar filtros</button>
             <button class="btn btn-primary px-4 rounded-pill shadow-sm" onclick="applyRecommender()"><i class="bi bi-search me-2"></i> Buscar</button>
          </div>
        </div>
      </div>
      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row gy-4" id="spots-container">
           <div class="col-12 text-center text-muted">Cargando Zonas desde JSON...</div>
        </div>
      </div>

      <div class="modal fade" id="spotModal" tabindex="-1" aria-labelledby="spotModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border-0 shadow">
            
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title fw-bold" id="spotModalLabel">Nombre de la Zona</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body p-4 bg-white">
              <h6 id="spotModalLocality" class="mb-3 text-secondary"></h6>
              <p id="spotModalDescription" class="mb-4 text-muted" style="text-align: justify;"></p>

              <h5 class="fw-bold border-bottom pb-2 mb-3"><i class="bi bi-images text-primary"></i> Galería</h5>
              <div class="row" id="spotModalGallery">
                  </div>

              <div class="row mt-4">
                  
                  <div class="col-md-12 mb-4">
                      <div class="card border-0 bg-light">
                          <div class="card-body p-3">
                              <h6 class="fw-bold text-dark"><i class="bi bi-signpost-split text-warning me-1"></i> Acceso y Precauciones</h6>
                              <p class="mb-0 small text-muted" id="spotModalAccess"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-6 mb-4">
                      <div class="card border-0 bg-light h-100">
                          <div class="card-body p-3">
                              <h6 class="fw-bold text-dark"><i class="bi bi-water text-info me-1"></i> Fondo Marino y Batimetría</h6>
                              <p class="mb-0 small text-muted" id="spotModalSeabed"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-6 mb-4">
                      <div class="card border-0 bg-light h-100">
                          <div class="card-body p-3">
                              <h6 class="fw-bold text-dark"><i class="bi bi-tools text-secondary me-1"></i> Técnicas Recomendadas</h6>
                              <p class="mb-0 small text-muted" id="spotModalTechniques"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-12 mb-4">
                      <div class="card border-0 bg-light">
                          <div class="card-body p-3">
                              <h6 class="fw-bold text-dark"><i class="bi bi-clock-history text-primary me-1"></i> Momentos Ideales</h6>
                              <p class="mb-0 small fw-bold text-primary" id="spotModalTime"></p>
                          </div>
                      </div>
                  </div>
                  
                  <div class="col-md-12 mb-4">
                      <div class="card border-0 shadow-sm border-start border-success border-4 bg-white">
                          <div class="card-body p-3">
                              <h6 class="fw-bold text-success"><i class="bi bi-fish me-1"></i> Especies Frecuentes</h6>
                              <div id="spotModalSpecies" class="mt-2"></div>
                              <small class="text-muted d-block mt-2 fst-italic">
                                  * Busca estas especies en la sección de Ictiología para más detalles.
                              </small>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-12 pt-4 border-top">
                      <h4 class="fw-bold text-dark mb-4"><i class="bi bi-chat-left-text-fill text-primary me-2"></i>Reportes de Capturas</h4>
                      <div id="spotModalCommentsContainer" class="mb-4">
                          </div>
                      <div class="card border-0 bg-light shadow-sm">
                          <div class="card-body p-4">
                              <h6 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-pencil-square text-primary me-2"></i>Añadir Nuevo Reporte</h6>
                              <form onsubmit="event.preventDefault(); window.submitSpotComment();">
                                  <div class="mb-3">
                                      <textarea id="spotCommentInput" class="form-control border-0 shadow-sm" rows="3" placeholder="Ej: Hoy a las 6AM han entrado de sobra los verderones tirando con pan. ¿Qué tal ha ido la jornada de hoy?" required></textarea>
                                  </div>
                                  <button type="submit" class="btn btn-primary fw-bold px-4 shadow-sm text-white"><i class="bi bi-send-fill me-2"></i>Publicar Reporte de Comunidad</button>
                              </form>
                          </div>
                      </div>
                  </div>

              </div>
            </div>
            
            <div class="modal-footer bg-light border-0">
              <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal">Cerrar</button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  `;
};