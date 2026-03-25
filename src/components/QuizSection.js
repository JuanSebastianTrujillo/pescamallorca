export const QuizSection = () => {
    return `
      <!-- Quiz Section -->
      <section id="quiz" class="section bg-light">
        <div class="container section-title" data-aos="fade-up">
          <h2>Quiz del Pescador</h2>
          <p>Pon a prueba tus conocimientos sobre la normativa y las especies locales de Baleares.</p>
        </div>

        <div class="container text-center" data-aos="fade-up" data-aos-delay="100">
          <div class="row justify-content-center">
             <div class="col-md-6 col-lg-5">
                <div class="card shadow border-0 p-4 rounded-4">
                   <div class="mb-4">
                      <i class="bi bi-controller text-primary" style="font-size: 4.5rem;"></i>
                   </div>
                   <h4 class="fw-bold text-dark mb-4">Elige tu desafío</h4>
                   
                   <div class="mb-4 text-start">
                     <label for="quiz-selector" class="form-label text-muted small fw-bold text-uppercase">Temática del cuestionario</label>
                     <select id="quiz-selector" class="form-select form-select-lg text-center border-primary shadow-sm text-primary fw-bold" style="cursor: pointer;">
                        <option value="especies">🐟 Reconocimiento de Especies</option>
                        <option value="normativa">📜 Normativa y Tallas Mínimas</option>
                        <option value="geografia">🗺️ Mapa y Reservas Marinas</option>
                     </select>
                   </div>
                   
                   <button class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-bold w-100 py-3" data-bs-toggle="modal" data-bs-target="#quizModal">
                      <i class="bi bi-play-fill me-1 fs-5"></i> Jugar Ahora
                   </button>
                </div>
             </div>
          </div>
        </div>

        <!-- Quiz Interface Modal -->
        <div class="modal fade" id="quizModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="quizModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="modal-header bg-primary text-white p-3">
                <div class="d-flex w-100 justify-content-between align-items-center">
                   <h5 class="modal-title fw-bold m-0 fs-4" id="quizModalLabel">
                     <i class="bi bi-patch-question-fill me-2 text-warning"></i> Pregunta <span id="quiz-current-question">1</span>/10
                   </h5>
                   <div class="badge bg-white text-primary fs-6 px-3 py-2 rounded-pill shadow-sm">
                     Puntuación: <span id="quiz-score" class="fw-bold">0</span>
                   </div>
                </div>
                <button type="button" class="btn-close btn-close-white ms-3" data-bs-dismiss="modal" aria-label="Close" title="Abandonar partida"></button>
              </div>
              
              <div class="modal-body p-4 p-md-5 text-center bg-light">
                 
                 <!-- Pregunta Placeholder -->
                 <h4 class="mb-4 fw-bold text-dark lh-base" id="quiz-question-text">
                    [La API cargará la pregunta aquí. Ej: ¿Cuál es la talla mínima legal de la Dorada en Baleares?]
                 </h4>
                 
                 <!-- Imagen opcional para la pregunta (se mostrará vía API si es necesario) -->
                 <img src="" id="quiz-question-img" class="img-fluid rounded-3 shadow-sm mb-4 d-none object-fit-cover w-100" style="max-height: 250px;" alt="Imagen de soporte a la pregunta">

                 <!-- Opciones Skeleton de UI -->
                 <div class="d-grid gap-3" id="quiz-options-container">
                    <button class="btn btn-outline-primary btn-lg text-start px-4 py-3 rounded-3 position-relative" style="transition: all 0.2s ease;">
                       <span class="fw-bold me-2">A)</span> <span>15 cm</span>
                    </button>
                    <!-- Simulated Correct Option -->
                    <button class="btn btn-success btn-lg text-start px-4 py-3 rounded-3 position-relative text-white border-0 shadow-sm" style="transition: all 0.2s ease;">
                       <span class="fw-bold me-2">B)</span> <span>20 cm</span>
                       <i class="bi bi-check-circle-fill position-absolute top-50 end-0 translate-middle-y me-4 fs-4"></i>
                    </button>
                    <!-- Simulated Wrong Option -->
                    <button class="btn btn-danger btn-lg text-start px-4 py-3 rounded-3 position-relative text-white border-0 shadow-sm opacity-75" style="transition: all 0.2s ease;">
                       <span class="fw-bold me-2">C)</span> <span>25 cm</span>
                       <i class="bi bi-x-circle-fill position-absolute top-50 end-0 translate-middle-y me-4 fs-4"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-lg text-start px-4 py-3 rounded-3 position-relative opacity-50 pe-none" style="transition: all 0.2s ease;">
                       <span class="fw-bold me-2">D)</span> <span>No hay talla mínima</span>
                    </button>
                 </div>

              </div>
              <div class="modal-footer bg-white border-top p-3 justify-content-between align-items-center">
                 <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Abandonar partida</button>
                 <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" id="quiz-next-btn">Siguiente <i class="bi bi-arrow-right ms-2"></i></button>
              </div>
            </div>
          </div>
        </div>

      </section>
    `;
};
