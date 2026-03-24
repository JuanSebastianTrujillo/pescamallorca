export const MapSection = () => {
    return `
      <!-- Map Section -->
      <section id="mapa" class="section light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Mapa Interactivo</h2>
          <p>Explora de forma visual todos los puntos de interés náutico y pesquero en la isla.</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="card shadow-sm border-0">
            <div class="card-body p-5 text-center bg-white rounded">
                <i class="bi bi-map" style="font-size: 4rem; color: #5cb85c;"></i>
                <h4 class="mt-3">Mapa de Cartografía (Próximamente)</h4>
                <p class="text-muted">Aquí integraremos el mapa dinámico con marcadores interactivos usando Leaflet o Mapbox.</p>
            </div>
          </div>
        </div>
      </section>
    `;
};
