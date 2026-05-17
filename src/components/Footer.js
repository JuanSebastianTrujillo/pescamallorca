export const Footer = () => {
    return `
      <footer id="footer" class="footer dark-background">
        <div class="container footer-top">
          <div class="row gy-4">
            <div class="col-lg-5 col-md-12 footer-about">
              <a href="/" data-link class="logo d-flex align-items-center">
                <span class="sitename">Pesca Mallorca</span>
              </a>
              <p data-i18n="footer_description">Tu plataforma líder para descubrir los mejores spots de pesca, conocer la normativa actualizada y aprender más sobre el entorno marino en Mallorca.</p>
              <div class="social-links d-flex mt-4">
                <a href="#" aria-label="X (Twitter)"><i class="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              </div>
            </div>
            
            <div class="col-lg-2 col-6 footer-links">
              <h2 class="fs-5 fw-bold" data-i18n="footer_links_title">Enlaces Útiles</h2>
              <ul>
                <li><a href="/" data-link data-i18n="nav_inicio">Inicio</a></li>
                <li><a href="/zonas" data-link data-i18n="footer_zonas">Zonas de Pesca</a></li>
                <li><a href="/normativa" data-link data-i18n="footer_normativa">Normativa Legal</a></li>
                <li><a href="/soporte" data-link data-i18n="footer_support">Reportar y Soporte</a></li>
                <li><a href="/autores" data-link data-i18n="footer_transparency">Transparencia</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="container copyright text-center mt-4">
          <p data-i18n="footer_copyright">© <span>Copyright</span> <strong class="px-1 sitename">Pesca Mallorca</strong> <span>Todos los Derechos Reservados</span></p>
          <div class="credits" data-i18n="footer_designed_in_mallorca">
            Diseñado en Mallorca
          </div>
        </div>
      </footer>
    `;
};
