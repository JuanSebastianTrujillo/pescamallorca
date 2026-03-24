export const HomeView = () => {
    return `
      <section id="hero" class="hero section accent-background">
        <div id="hero-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
          <div class="carousel-item active">
            <img src="assets/img/hero-carousel/hero-carousel-1.jpg" alt="">
            <div class="carousel-container">
              <h2>Bienvenido a PescaMallorca</h2>
              <p>Tu guía completa para conocer los mejores rincones de la costa Balear, su normativa y las especies reinas de nuestras aguas.</p>
              <a href="/zonas" data-link class="btn-get-started">Descubrir Spots</a>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-services" class="featured-services section light-background">
        <div class="container">
          <div class="row gy-4">
            <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="100">
              <div class="service-item position-relative">
                <div class="icon"><i class="bi bi-geo-alt icon"></i></div>
                <h4><a href="/zonas" data-link class="stretched-link">Zonas de Pesca</a></h4>
                <p>Lugares de interés con detalles de fondo, acceso y técnicas recomendadas.</p>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="200">
              <div class="service-item position-relative">
                <div class="icon"><i class="bi bi-map icon"></i></div>
                <h4><a href="/mapa" data-link class="stretched-link">Mapa Interactivo</a></h4>
                <p>Navega visualmente por toda la isla identificando los spots, reservas y rampas.</p>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="300">
              <div class="service-item position-relative">
                <div class="icon"><i class="bi bi-journal-text icon"></i></div>
                <h4><a href="/normativa" data-link class="stretched-link">Normativa</a></h4>
                <p>Especies protegidas, tallas mínimas, cuotas de captura y vedas.</p>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="400">
              <div class="service-item position-relative">
                <div class="icon"><i class="bi bi-shop icon"></i></div>
                <h4><a href="/tiendas" data-link class="stretched-link">Directorios</a></h4>
                <p>Localiza tiendas de material y rampas de botadura cercanas a tu ubicación.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
};
