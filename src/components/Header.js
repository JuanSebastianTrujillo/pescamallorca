export const Header = () => {
  return `
    <header id="header" class="header sticky-top">
      
      <div class="topbar d-none d-md-flex align-items-center accent-background">
        <div class="container d-flex justify-content-between align-items-center">

          <div class="contact-info d-flex align-items-center">
            <i class="bi bi-envelope d-flex align-items-center">
              <a href="mailto:info@pescamallorca.online">info@pescamallorca.online</a>
            </i>
            <i class="bi bi-phone d-flex align-items-center ms-4">
              <span>+34 971 00 00 00</span>
            </i>
          </div>

          <div class="social-links d-flex align-items-center gap-2">
            <a href="#" class="twitter"><i class="bi bi-twitter-x"></i></a>
            <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
            <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
          </div>

          <div class="d-flex align-items-center gap-3">
            
            <!-- 🌍 Dropdown idiomas -->
            <div class="dropdown">
              <button class="btn btn-sm btn-light rounded-pill dropdown-toggle d-flex align-items-center px-3"
                      type="button"
                      data-bs-toggle="dropdown">
                🌍 Idioma
              </button>

              <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2" onclick="changeLang('es')">
                    <img src="/assets/img/lang/es.png" width="20">
                    Español
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2" onclick="changeLang('ca')">
                    <img src="/assets/img/lang/ca.png" width="20">
                    Català
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2" onclick="changeLang('en')">
                    <img src="/assets/img/lang/en.png" width="20">
                    English
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2" onclick="changeLang('de')">
                    <img src="/assets/img/lang/de.png" width="20">
                    Deutsch
                  </button>
                </li>
              </ul>
            </div>

            <a href="#login" class="btn btn-sm btn-light rounded-pill d-flex align-items-center px-3">
              <i class="bi bi-person-circle fs-6 me-2"></i> Iniciar sesión
            </a>

          </div>
        </div>
      </div>
      
      <div class="branding d-flex align-items-center">
        <div class="container d-flex align-items-center justify-content-between">
          <a href="/" data-link class="logo d-flex align-items-center">
            <h1 class="sitename">Pesca Mallorca</h1>
          </a>
          
          <nav id="navmenu" class="navmenu">
            <ul>
              <li><a href="#hero" class="active">Inicio</a></li>
              <li><a href="#zonas">Spots</a></li>
              <li><a href="#especies">Especies</a></li>
              <li><a href="#mapa">Mapa</a></li>
              <li><a href="#meteo">Meteo</a></li>
              <li><a href="#tiendas">Tiendas</a></li>
              <li><a href="#rampas">Rampas</a></li>
              <li><a href="#normativa">Normativa</a></li>
              <li><a href="#autores">Autores</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
            <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
    </header>
  `;
};