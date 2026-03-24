export const HeroSection = () => {
    return `
      <section id="hero" class="hero section accent-background">
        <div id="hero-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
          <div class="carousel-item active">
            <img src="assets/img/hero-carousel/hero-carousel-1.jpg" alt="">
            <div class="carousel-container">
              <h2>Bienvenido a PescaMallorca</h2>
              <p>Tu guía completa para conocer los mejores rincones de la costa Balear, su normativa y las especies reinas de nuestras aguas.</p>
            </div>
          </div>
        </div>
      </section>
    `;
};
