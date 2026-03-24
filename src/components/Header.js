export const Header = () => {
    return `
      <header id="header" class="header sticky-top">
        <div class="topbar d-flex align-items-center accent-background">
          <div class="container d-flex justify-content-center justify-content-md-between">
            <div class="contact-info d-flex align-items-center">
              <i class="bi bi-envelope d-flex align-items-center"><a href="mailto:info@pescamallorca.online">info@pescamallorca.online</a></i>
              <i class="bi bi-phone d-flex align-items-center ms-4"><span>+34 971 00 00 00</span></i>
            </div>
            <div class="social-links d-none d-md-flex align-items-center">
              <a href="#" class="twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div class="branding d-flex align-items-center">
          <div class="container position-relative d-flex align-items-center justify-content-between">
            <a href="/" data-link class="logo d-flex align-items-center">
              <h1 class="sitename">PescaMallorca</h1>
            </a>
            
            <nav id="navmenu" class="navmenu">
              <ul>
                <li><a href="#hero" class="active">Inicio</a></li>
                <li><a href="#zonas">Spots</a></li>
                <li><a href="#especies">Especies</a></li>
                <li><a href="#mapa">Mapa</a></li>
                <li><a href="#meteo">Météo</a></li>
                <li><a href="#tiendas">Tiendas</a></li>
                <li><a href="#rampas">Rampas</a></li>
                <li><a href="#normativa">Normativa</a></li>
                <li><a href="#autores">Autores</a></li>
              </ul>
              <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
          </div>
        </div>
      </header>
    `;
};
