export const SpotsSection = () => {
  return `
    <section id="zonas" class="section">
      
      <div class="container section-title mb-4" data-aos="fade-up">
        <h2 class="text-dark fw-bold" data-i18n="spots_title">Zonas de Pesca</h2>
        <p class="text-secondary" data-i18n="spots_tagline">Explora el catálogo completo o usa nuestro recomendador para encontrar tu pesquera ideal.</p>
      </div>

      <div class="container mb-5" data-aos="fade-up">
        <div class="card shadow-sm border-0 bg-white p-4 rounded-3">
              <h3 class="fw-bold mb-3 text-secondary text-uppercase" style="font-size: 0.85rem; letter-spacing: 0.5px;">
            <i class="bi bi-funnel-fill text-primary me-1"></i> <span data-i18n="spots_filters">Filtros de búsqueda</span>
          </h3>
          
          <div class="row g-3">
            <div class="col-md-3">
              <label for="rec-zona" class="form-label small fw-bold text-muted" data-i18n="label_municipio">Municipio / Zona</label>
              <select id="rec-zona" class="form-select border-light-subtle bg-light recommender-input" onchange="applyRecommender()">
                <option value="" data-i18n="spots_filter_any_zone">Cualquier zona...</option>
                <option value="pollença">Pollença</option>
                <option value="muro">Muro</option>
                <option value="santanyí">Santanyí</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="rec-tiempo" class="form-label small fw-bold text-muted" data-i18n="label_tiempo">Momento del Día</label>
              <select id="rec-tiempo" class="form-select border-light-subtle bg-light recommender-input" onchange="applyRecommender()">
                <option value="" data-i18n="spots_filter_any_time">Cualquier momento...</option>
                <option value="amanecer" data-i18n="spots_option_dawn">Amanecer</option>
                <option value="día" data-i18n="spots_option_day">Día</option>
                <option value="atardecer" data-i18n="spots_option_dusk">Atardecer</option>
                <option value="noche" data-i18n="spots_option_night">Noche</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="rec-tipo" class="form-label small fw-bold text-muted" data-i18n="label_tecnica">Técnica de Pesca</label>
              <select id="rec-tipo" class="form-select border-light-subtle bg-light recommender-input" onchange="applyRecommender()">
                <option value="" data-i18n="spots_filter_any_technique">Cualquier técnica...</option>
                <option value="rockfishing">Rockfishing</option>
                <option value="surfcasting">Surfcasting</option>
                <option value="fondo" data-i18n="spots_option_bottom_fishing">Pesca a fondo</option>
                <option value="spinning">Spinning</option>
                <option value="boya">Boya</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="rec-pez" class="form-label small fw-bold text-muted" data-i18n="label_especie">Especie Objetivo</label>
              <select id="rec-pez" class="form-select border-light-subtle bg-light recommender-input" onchange="applyRecommender()">
                <option value="" data-i18n="spots_filter_any_species">Cualquier pez...</option>
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
          
          <!-- Los filtros se aplican automáticamente al cambiar los selects -->
        </div>
      </div>
      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row gy-4" id="spots-container">
           <div class="col-12 text-center text-muted" data-i18n="spots_loading">Cargando Zonas desde JSON...</div>
        </div>
      </div>

      <div class="modal fade" id="spotModal" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="spotModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border-0 shadow">
            
            <div class="modal-header bg-primary text-white d-flex align-items-center">
              <h3 class="modal-title fw-bold fs-5" id="spotModalLabel" data-i18n="spot_modal_name">Nombre de la Zona</h3>
              <button class="btn btn-sm btn-outline-light rounded-pill ms-auto me-3 px-3 fw-bold" data-speak-modal="spot" data-i18n="spot_modal_read">
                <i class="bi bi-volume-up-fill me-1"></i> Leer
              </button>
              <button type="button" class="btn-close btn-close-white ms-0" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body p-4 bg-white">
              <h6 id="spotModalLocality" class="mb-3 text-secondary"></h6>
              <p id="spotModalDescription" class="mb-4 text-muted" style="text-align: justify;"></p>

              <h4 class="fw-bold border-bottom pb-2 mb-3 fs-5"><i class="bi bi-images text-primary"></i> <span data-i18n="spot_gallery">Galería</span></h4>
              <div class="row" id="spotModalGallery">
                  </div>

              <div class="row mt-4">
                  
                  <div class="col-md-12 mb-4">
                      <div class="card border-0 bg-light">
                          <div class="card-body p-3">
                              <h5 class="fw-bold text-dark fs-6"><i class="bi bi-signpost-split text-warning me-1"></i> <span data-i18n="spot_access">Acceso y Precauciones</span></h5>
                              <p class="mb-0 small text-muted" id="spotModalAccess"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-6 mb-4">
                      <div class="card border-0 bg-light h-100">
                          <div class="card-body p-3">
                              <h5 class="fw-bold text-dark fs-6"><i class="bi bi-water text-info me-1"></i> <span data-i18n="spot_seabed">Fondo Marino y Batimetría</span></h5>
                              <p class="mb-0 small text-muted" id="spotModalSeabed"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-6 mb-4">
                      <div class="card border-0 bg-light h-100">
                          <div class="card-body p-3">
                              <h5 class="fw-bold text-dark fs-6"><i class="bi bi-tools text-secondary me-1"></i> <span data-i18n="spot_techniques">Técnicas Recomendadas</span></h5>
                              <p class="mb-0 small text-muted" id="spotModalTechniques"></p>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-12 mb-4">
                      <div class="card border-0 bg-light">
                          <div class="card-body p-3">
                              <h5 class="fw-bold text-dark fs-6"><i class="bi bi-clock-history text-primary me-1"></i> <span data-i18n="spot_ideal_times">Momentos Ideales</span></h5>
                              <p class="mb-0 small fw-bold text-primary" id="spotModalTime"></p>
                          </div>
                      </div>
                  </div>
                  
                  <div class="col-md-12 mb-4">
                      <div class="card border-0 shadow-sm border-start border-success border-4 bg-white">
                          <div class="card-body p-3">
                              <h5 class="fw-bold text-success fs-6"><i class="bi bi-fish me-1"></i> <span data-i18n="spot_common_species">Especies Frecuentes</span></h5>
                              <div id="spotModalSpecies" class="mt-2"></div>
                              <small class="text-muted d-block mt-2 fst-italic" data-i18n="spot_search_fish">
                                  * Busca estas especies en la sección de Ictiología para más detalles.
                              </small>
                          </div>
                      </div>
                  </div>

                  <div class="col-md-12 pt-4 border-top">
                      <h4 class="fw-bold text-dark mb-4 fs-5"><i class="bi bi-chat-left-text-fill text-primary me-2"></i><span data-i18n="spot_reports">Reportes de Capturas</span></h4>
                      <div id="spotModalCommentsContainer" class="mb-4">
                          </div>
                      <div class="card border-0 bg-light shadow-sm">
                          <div class="card-body p-4">
                              <h5 class="fw-bold mb-3 border-bottom pb-2 fs-6"><i class="bi bi-pencil-square text-primary me-2"></i><span data-i18n="spot_add_report">Añadir Nuevo Reporte</span></h5>
                              <form onsubmit="event.preventDefault(); window.submitSpotComment();">
                                  <div class="mb-3">
                                      <label for="spotCommentInput" class="visually-hidden" data-i18n="spot_comment_label">Escribe tu reporte de captura</label>
                                      <textarea id="spotCommentInput" class="form-control border-0 shadow-sm" rows="3" placeholder="Ej: Hoy a las 6AM han entrado de sobra los verderones tirando con pan. ¿Qué tal ha ido la jornada de hoy?" data-i18n-placeholder="spot_comment_placeholder" required></textarea>
                                  </div>
                                  <button type="submit" class="btn btn-primary fw-bold px-4 shadow-sm text-white"><i class="bi bi-send-fill me-2"></i><span data-i18n="spot_publish_report">Publicar Reporte de Comunidad</span></button>
                              </form>
                          </div>
                      </div>
                  </div>

              </div>
            </div>
            
            <div class="modal-footer bg-light border-0">
              <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal" data-i18n="close">Cerrar</button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  `;
};