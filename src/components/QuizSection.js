import { QuizEngine } from "../services/QuizEngine.js";
import { trapFocusInModal } from "../services/AccessibilityService.js";

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
                   <h3 class="fw-bold text-dark mb-4 fs-5">Elige tu desafío</h3>
                   
                   <div class="mb-4 text-start">
                     <label for="quiz-selector" class="form-label text-muted small fw-bold text-uppercase">Temática del cuestionario</label>
                     <select id="quiz-selector" class="form-select form-select-lg text-center border-primary shadow-sm text-primary fw-bold" style="cursor: pointer;">
                        <option value="especies">🐟 Reconocimiento de Especies</option>
                        <option value="normativa">📜 Normativa y Tallas Mínimas</option>
                        <option value="geografia">🗺️ Mapa y Reservas Marinas</option>
                     </select>
                   </div>
                   
                   <button id="quiz-start-btn" class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-bold w-100 py-3">
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
                   <h3 class="modal-title fw-bold m-0 fs-4" id="quizModalLabel">
                     <i class="bi bi-patch-question-fill me-2 text-warning"></i> Pregunta <span id="quiz-current-question">1</span>/<span id="quiz-total-questions">10</span>
                   </h3>
                   <div class="badge bg-white text-primary fs-6 px-3 py-2 rounded-pill shadow-sm">
                     Puntuación: <span id="quiz-score" class="fw-bold">0</span>
                   </div>
                </div>
                <button type="button" class="btn-close btn-close-white ms-3" data-bs-dismiss="modal" aria-label="Close" title="Abandonar partida"></button>
              </div>
              
              <div class="modal-body p-4 p-md-5 text-center bg-light">
                 
                 <!-- Pregunta -->
                 <h4 class="mb-4 fw-bold text-dark lh-base fs-4" id="quiz-question-text">
                    Cargando pregunta...
                 </h4>
                 
                 <!-- Imagen opcional para la pregunta -->
                 <img src="" id="quiz-question-img" class="img-fluid rounded-3 shadow-sm mb-4 d-none object-fit-cover w-100" style="max-height: 250px;" alt="Imagen ilustrativa de la especie marina para la pregunta del quiz de pesca en Mallorca">

                 <!-- Opciones -->
                 <div class="d-grid gap-3" id="quiz-options-container">
                    <!-- Opciones se generan dinámicamente -->
                 </div>

                 <!-- Explicación (visible tras responder) -->
                 <div id="quiz-explanation" class="alert alert-info border-0 shadow-sm mt-4 text-start d-none">
                    <i class="bi bi-lightbulb-fill me-2"></i><span id="quiz-explanation-text"></span>
                 </div>

              </div>
              <div class="modal-footer bg-white border-top p-3 justify-content-between align-items-center">
                 <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Abandonar partida</button>
                 <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-none" id="quiz-confirm-btn">Confirmar</button>
                 <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm d-none" id="quiz-next-btn">Siguiente <i class="bi bi-arrow-right ms-2"></i></button>
              </div>
            </div>
          </div>
        </div>

      </section>
    `;
};

// ─── Controlador del Quiz ───────────────────────────────────

let quizEngine = null;

/**
 * Inicializa la lógica del quiz conectando el motor de juego al DOM.
 * Se llama desde app.js después del render, pasando los datos necesarios.
 *
 * @param {Array} speciesData - Datos de especies desde especies.json
 * @param {Array} zonesData   - Datos de zonas desde zonas.json
 */
export const initQuiz = (speciesData, zonesData) => {
    const startBtn   = document.getElementById('quiz-start-btn');
    const nextBtn    = document.getElementById('quiz-next-btn');
    const selectorEl = document.getElementById('quiz-selector');

    let selectedOptionIndex = null;

    if (!startBtn) return;

    quizEngine = new QuizEngine();

    // ─── Helper: obtener referencias DOM frescas ────────────
    // Necesario porque startNewGame() reemplaza innerHTML del modal body,
    // invalidando cualquier referencia cacheada.

    function getQuizElements() {
        return {
            questionText:   document.getElementById('quiz-question-text'),
            questionImg:    document.getElementById('quiz-question-img'),
            optionsContainer: document.getElementById('quiz-options-container'),
            scoreEl:        document.getElementById('quiz-score'),
            currentQEl:     document.getElementById('quiz-current-question'),
            totalQEl:       document.getElementById('quiz-total-questions'),
            explanationEl:  document.getElementById('quiz-explanation'),
            explanationTxt: document.getElementById('quiz-explanation-text'),
            confirmBtn:     document.getElementById('quiz-confirm-btn')
        };
    }

    // ─── Renderizar pregunta actual ─────────────────────────

    function renderQuestion() {
        const question = quizEngine.getCurrentQuestion();
        if (!question) return;

        const els = getQuizElements();
        if (!els.questionText || !els.optionsContainer) return;

        // Actualizar header
        if (els.currentQEl) els.currentQEl.textContent = quizEngine.currentIndex + 1;
        if (els.totalQEl)   els.totalQEl.textContent   = quizEngine.questions.length;
        if (els.scoreEl)    els.scoreEl.textContent     = quizEngine.score;

        // Pregunta
        els.questionText.textContent = question.text;

        // Imagen
        if (question.image && els.questionImg) {
            els.questionImg.src = question.image;
            els.questionImg.alt = question.imageAlt || `Imagen relacionada con la pregunta: ${question.text}`;
            els.questionImg.classList.remove('d-none');
            els.questionImg.onerror = () => { els.questionImg.classList.add('d-none'); };
        } else if (els.questionImg) {
            els.questionImg.classList.add('d-none');
        }

        // Ocultar explicación y botones de control
        if (els.explanationEl) els.explanationEl.classList.add('d-none');
        if (els.confirmBtn) {
            els.confirmBtn.classList.add('d-none');
            els.confirmBtn.disabled = false;
        }
        nextBtn.classList.add('d-none');
        selectedOptionIndex = null;

        // Generar opciones
        const labels = ['A', 'B', 'C', 'D'];
        els.optionsContainer.innerHTML = question.options.map((opt, i) => `
            <button type="button" class="btn btn-outline-primary btn-lg text-start px-4 py-3 rounded-3 position-relative quiz-option-btn" 
                data-index="${i}" 
                aria-pressed="false"
                style="transition: all 0.2s ease;">
                <span class="fw-bold me-2">${labels[i]})</span> <span>${opt.text}</span>
            </button>
        `).join('');

        // Conectar handlers de opciones
        els.optionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => selectOption(parseInt(btn.dataset.index), btn));
        });
    }

    // ─── Manejar respuesta ──────────────────────────────────

    function selectOption(optionIndex, button) {
        if (quizEngine.getState() !== 'PLAYING') return;

        const buttons = document.querySelectorAll('.quiz-option-btn');
        buttons.forEach((btn, i) => {
            btn.classList.remove('btn-primary', 'text-white');
            btn.classList.add('btn-outline-primary');
            btn.setAttribute('aria-pressed', 'false');
        });

        selectedOptionIndex = optionIndex;
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-primary', 'text-white');
        button.setAttribute('aria-pressed', 'true');

        const els = getQuizElements();
        if (els.confirmBtn) {
            els.confirmBtn.classList.remove('d-none');
            els.confirmBtn.disabled = false;
        }
    }

    function handleAnswer(optionIndex) {
        if (quizEngine.getState() !== 'PLAYING') return;

        const result = quizEngine.answerQuestion(optionIndex);
        if (!result) return;

        const els = getQuizElements();

        // Deshabilitar todos los botones
        const buttons = els.optionsContainer?.querySelectorAll('.quiz-option-btn') || [];
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';

            if (i === result.correctIndex) {
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('btn-success', 'text-white', 'border-0', 'shadow-sm');
                btn.innerHTML += ' <i class="bi bi-check-circle-fill position-absolute top-50 end-0 translate-middle-y me-4 fs-4"></i>';
            } else if (i === optionIndex && !result.correct) {
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('btn-danger', 'text-white', 'border-0', 'shadow-sm', 'opacity-75');
                btn.innerHTML += ' <i class="bi bi-x-circle-fill position-absolute top-50 end-0 translate-middle-y me-4 fs-4"></i>';
            } else {
                btn.classList.add('opacity-50');
            }
        });

        if (els.confirmBtn) {
            els.confirmBtn.classList.add('d-none');
        }

        // Actualizar puntuación
        if (els.scoreEl) els.scoreEl.textContent = quizEngine.score;

        // Mostrar explicación
        if (result.explanation && els.explanationTxt && els.explanationEl) {
            els.explanationTxt.textContent = result.explanation;
            els.explanationEl.classList.remove('d-none');
        }

        // Mostrar botón siguiente
        nextBtn.classList.remove('d-none');

        if (quizEngine.currentIndex >= quizEngine.questions.length - 1) {
            nextBtn.innerHTML = '<i class="bi bi-trophy-fill me-2"></i>Ver Resultados';
        } else {
            nextBtn.innerHTML = 'Siguiente <i class="bi bi-arrow-right ms-2"></i>';
        }
    }

    // ─── Pantalla de resultados ─────────────────────────────

    function renderResults() {
        const results = quizEngine.getResults();
        const modalBody = document.querySelector('#quizModal .modal-body');

        let barColor = 'bg-danger';
        if (results.percentage >= 70) barColor = 'bg-success';
        else if (results.percentage >= 50) barColor = 'bg-warning';

        modalBody.innerHTML = `
            <div class="text-center py-4" aria-live="polite" aria-atomic="true">
                <div class="mb-4" style="font-size: 5rem;">${results.percentage >= 70 ? '🏆' : results.percentage >= 50 ? '🎣' : '🌊'}</div>
                <h3 class="fw-bold text-dark mb-2">${results.grade}</h3>
                <p class="text-muted fs-5 mb-4">Has acertado <strong class="text-primary">${results.score}</strong> de <strong>${results.total}</strong> preguntas</p>
                
                <div class="progress mb-4 shadow-sm" style="height: 24px; border-radius: 12px;">
                    <div class="progress-bar ${barColor} fw-bold" role="progressbar" 
                         style="width: ${results.percentage}%; transition: width 1s ease;" 
                         aria-valuenow="${results.percentage}" aria-valuemin="0" aria-valuemax="100">
                        ${results.percentage}%
                    </div>
                </div>

                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" id="quiz-retry-btn">
                        <i class="bi bi-arrow-counterclockwise me-2"></i>Jugar de nuevo
                    </button>
                    <button class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">
                        <i class="bi bi-x-lg me-2"></i>Cerrar
                    </button>
                </div>
            </div>
        `;

        nextBtn.classList.add('d-none');

        document.getElementById('quiz-retry-btn')?.addEventListener('click', () => {
            startNewGame();
        });
    }

    // ─── Iniciar nueva partida ──────────────────────────────

    function startNewGame() {
        const category = selectorEl?.value || 'especies';
        quizEngine.startGame(category, speciesData, zonesData);

        if (quizEngine.getState() === 'FINISHED') {
            const modalBody = document.querySelector('#quizModal .modal-body');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-emoji-frown fs-1 text-muted"></i>
                        <h3 class="mt-3 text-dark fs-5">No se pudieron generar preguntas</h3>
                        <p class="text-muted">No hay suficientes datos para esta categoría. Prueba con otra temática.</p>
                    </div>
                `;
            }
            nextBtn.classList.add('d-none');
            return;
        }

        // Restaurar la estructura del modal body
        const modalBody = document.querySelector('#quizModal .modal-body');
        modalBody.innerHTML = `
            <h4 class="mb-4 fw-bold text-dark lh-base" id="quiz-question-text">Cargando...</h4>
            <img src="" id="quiz-question-img" class="img-fluid rounded-3 shadow-sm mb-4 d-none object-fit-cover w-100" style="max-height: 250px;" alt="Imagen ilustrativa de la especie marina para la pregunta del quiz de pesca en Mallorca">
            <div class="d-grid gap-3" id="quiz-options-container"></div>
            <div id="quiz-explanation" class="alert alert-info border-0 shadow-sm mt-4 text-start d-none">
                <i class="bi bi-lightbulb-fill me-2"></i><span id="quiz-explanation-text"></span>
            </div>
        `;

        // Render con referencias frescas del DOM
        renderQuestion();
    }

    // ─── Event Listeners ────────────────────────────────────

    const confirmBtn = document.getElementById('quiz-confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (selectedOptionIndex === null) return;
            handleAnswer(selectedOptionIndex);
        });
    }

    startBtn.addEventListener('click', () => {
        startNewGame();
        const modalEl = document.getElementById('quizModal');
        let modal = bootstrap.Modal.getInstance(modalEl);
        if (!modal) modal = new bootstrap.Modal(modalEl);
        modal.show();
        
        // Gestión de foco para accesibilidad
        trapFocusInModal(modalEl, startBtn);
    });

    nextBtn.addEventListener('click', () => {
        const newState = quizEngine.nextQuestion();
        if (newState === 'FINISHED') {
            renderResults();
        } else {
            renderQuestion();
        }
    });
};
