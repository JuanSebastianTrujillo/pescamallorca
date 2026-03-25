export const Footer = () => {
    return `
      <footer id="footer" class="footer dark-background">
        <div class="container footer-top">
          <div class="row gy-4">
            <div class="col-lg-5 col-md-12 footer-about">
              <a href="/" data-link class="logo d-flex align-items-center">
                <span class="sitename">Pesca Mallorca</span>
              </a>
              <p>Tu plataforma líder para descubrir los mejores spots de pesca, conocer la normativa actualizada y aprender más sobre el entorno marino en Mallorca.</p>
              <div class="social-links d-flex mt-4">
                <a href="#"><i class="bi bi-twitter-x"></i></a>
                <a href="#"><i class="bi bi-facebook"></i></a>
                <a href="#"><i class="bi bi-instagram"></i></a>
              </div>
            </div>
            
            <div class="col-lg-2 col-6 footer-links">
              <h4>Enlaces Útiles</h4>
              <ul>
                <li><a href="/" data-link>Inicio</a></li>
                <li><a href="/zonas" data-link>Zonas de Pesca</a></li>
                <li><a href="/normativa" data-link>Normativa Legal</a></li>
                <li><a href="/soporte" data-link>Reportar y Soporte</a></li>
                <li><a href="/autores" data-link>Transparencia</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="container copyright text-center mt-4">
          <p>© <span>Copyright</span> <strong class="px-1 sitename">Pesca Mallorca</strong> <span>Todos los Derechos Reservados</span></p>
          <div class="credits">
            Diseñado en Mallorca
          </div>
        </div>
      </footer>
    `;
};
