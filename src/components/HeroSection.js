export const HeroSection = () => {
    return `
      <section id="hero" class="hero section accent-background">
        <div id="hero-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="hover">
          <div class="carousel-indicators" id="hero-carousel-indicators"></div>
          <div class="carousel-inner" id="hero-carousel-inner">
            <div class="carousel-item active">
              <!-- LCP image: webp nativa como src principal + fetchpriority=high + eager -->
              <img
                src="assets/img/hero-carousel/hero-carousel-1-640.webp"
                srcset="assets/img/hero-carousel/hero-carousel-1-640.webp 640w,
                        assets/img/hero-carousel/hero-carousel-1-1280.webp 1280w,
                        assets/img/hero-carousel/hero-carousel-1-1920.webp 1920w"
                sizes="100vw"
                alt="Pescador lanzando el anzuelo en la costa de Mallorca"
                fetchpriority="high"
                loading="eager"
                decoding="async">
              <div class="carousel-container">
                <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.8rem, 5vw, 3rem);">Bienvenido a Pesca Mallorca</h2>
                <p style="font-size: clamp(1rem, 2.5vw, 1.2rem);">Tu guía completa para conocer los mejores rincones de la costa Balear, su normativa y las especies reinas de nuestras aguas.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src="assets/img/hero-carousel/hero-carousel-2-640.webp"
                srcset="assets/img/hero-carousel/hero-carousel-2-640.webp 640w,
                        assets/img/hero-carousel/hero-carousel-2-1280.webp 1280w,
                        assets/img/hero-carousel/hero-carousel-2-1920.webp 1920w"
                sizes="100vw"
                alt="Vista de un spot de pesca en la costa mallorquina"
                loading="lazy"
                decoding="async">
              <div class="carousel-container">
                <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.8rem, 5vw, 3rem);">Descubre Nuestras Zonas</h2>
                <p style="font-size: clamp(1rem, 2.5vw, 1.2rem);">Explora los mejores puntos de pesca en las Islas Baleares con información detallada de cada ubicación.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src="assets/img/hero-carousel/hero-carousel-3-640.webp"
                srcset="assets/img/hero-carousel/hero-carousel-3-640.webp 640w,
                        assets/img/hero-carousel/hero-carousel-3-1280.webp 1280w,
                        assets/img/hero-carousel/hero-carousel-3-1920.webp 1920w"
                sizes="100vw"
                alt="Barco de pesca navegando aguas de Mallorca"
                loading="lazy"
                decoding="async">
              <div class="carousel-container">
                <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: clamp(1.8rem, 5vw, 3rem);">Especies de Calidad</h2>
                <p style="font-size: clamp(1rem, 2.5vw, 1.2rem);">Conoce las diferentes especies que puedes encontrar y la normativa de pesca para cada una.</p>
              </div>
            </div>
            <!-- Pez del Mes - Inyectado dinámicamente por JS -->
            <div id="month-species-container"></div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </section>
    `;
};
