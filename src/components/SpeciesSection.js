export const SpeciesSection = () => {
    return `
      <!-- Species Section -->
      <section id="especies" class="section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Directorio de Especies</h2>
          <p>Fichas detalladas con biología, hábitat y regulaciones de las especies de Baleares.</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4 text-center">
            
            <div class="col-md-4">
              <div class="card shadow-sm border-0 h-100 p-4">
                <i class="bi bi-fish mt-3" style="font-size: 3rem; color: #007bff;"></i>
                <h5 class="mt-4 fw-bold">Epinephelus marginatus</h5>
                <p class="text-muted">Mero / Anfós</p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card shadow-sm border-0 h-100 p-4">
                <i class="bi bi-water mt-3" style="font-size: 3rem; color: #007bff;"></i>
                <h5 class="mt-4 fw-bold">Sparus aurata</h5>
                <p class="text-muted">Dorada / Daurada</p>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card shadow-sm border-0 h-100 p-4">
                <i class="bi bi-stars mt-3" style="font-size: 3rem; color: #007bff;"></i>
                <h5 class="mt-4 fw-bold">Xyrichtys novacula</h5>
                <p class="text-muted">Raor / Galán</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    `;
};
