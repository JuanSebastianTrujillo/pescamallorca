export const SpotsView = async () => {
    // Función asincrónica porque más adelante obtendremos datos (fetch) desde pesca_data.json
    
    // De momento, renderizaremos una maqueta estática. 
    // Luego iteraremos sobre el array obtenido del JSON
    
    return `
      <section class="portfolio section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Zonas de Pesca</h2>
          <p>Explora el catálogo completo de pesqueras divididas por características.</p>
        </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4" id="spots-container">
             <!-- Aquí irán las tarjetas que generaremos dinámicamente:
              <div class="col-lg-4 col-md-6">
                <div class="card..."> ... </div>
              </div>
             -->
             <div class="text-center">Cargando Zonas...</div>
          </div>
        </div>
      </section>
    `;
};
