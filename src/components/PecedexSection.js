import { trapFocusInModal } from "../services/AccessibilityService.js";

export const PecedexSection = () => {
  return `
      <!-- Pecedex Section -->
      <section id="pecedex" class="section bg-light">
        <div class="container section-title" data-aos="fade-up">
          <h2>Pecédex Balear</h2>
          <p>Lleva tu propio registro. Ve a la ficha de cada pez en la sección de Especies para marcar tus capturas y desbloquearlas aquí.</p>
        </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
           <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h3 class="text-primary fw-bold mb-0 fs-5">Progreso: <span id="pecedex-progress" aria-live="polite">0</span> / <span id="pecedex-total">0</span></h3>
              <button id="pecedex-reset-btn" class="btn btn-outline-danger btn-sm" onclick="showResetPecedexModal()" style="display: none;">
                 <i class="bi bi-trash"></i> Reiniciar
              </button>
           </div>
           
           <div class="row g-3" id="pecedex-grid">
              <!-- El grid se renderizará desde app.js -->
              <div class="text-center w-100 py-5">
                 <div class="spinner-border text-primary" role="status"></div>
                 <p class="mt-2 text-muted">Cargando Pecédex...</p>
              </div>
           </div>
        </div>
      </section>

      <!-- Modal de Confirmación de Reset Pecédex -->
      <div class="modal fade" id="resetPecedexModal" tabindex="-1" aria-labelledby="resetPecedexModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title text-danger fs-5" id="resetPecedexModalLabel">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Reinicio
              </h3>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <p class="mb-0">¿Seguro que quieres borrar todo tu registro de capturas de la Pecédex? Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" onclick="confirmResetPecedex()">
                <i class="bi bi-trash me-1"></i> Sí, borrar todo
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
};
