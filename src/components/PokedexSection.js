export const PokedexSection = () => {
    return `
      <!-- Pokedex Section -->
      <section id="pokedex" class="section bg-light">
        <div class="container section-title" data-aos="fade-up">
          <h2>Pokédex Balear</h2>
          <p>Lleva tu propio registro. Ve a la ficha de cada pez en la sección de Especies para marcar tus capturas y desbloquearlas aquí.</p>
        </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
           <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h5 class="text-primary fw-bold mb-0">Progreso: <span id="pokedex-progress">0</span> / <span id="pokedex-total">0</span></h5>
              <button class="btn btn-outline-danger btn-sm" onclick="resetPokedex()">
                 <i class="bi bi-trash"></i> Reiniciar
              </button>
           </div>
           
           <div class="row g-3" id="pokedex-grid">
              <!-- El grid se renderizará desde app.js -->
              <div class="text-center w-100 py-5">
                 <div class="spinner-border text-primary" role="status"></div>
                 <p class="mt-2 text-muted">Cargando Pokédex...</p>
              </div>
           </div>
        </div>
      </section>
    `;
};
