export const SpotsSection = () => {
    return `
      <!-- Spots Section -->
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
      </section>
    `;
};
