export const Header = () => {
  return `
    <header id="header" class="header sticky-top">
      
      <div class="topbar d-none d-md-flex align-items-center accent-background">
        <div class="container d-flex justify-content-center justify-content-md-between">
          
          <div class="contact-info d-flex align-items-center">
            <a href="mailto:info@pescamallorca.online" class="d-flex align-items-center text-decoration-none" style="color: inherit;">
              <i class="bi bi-envelope me-2"></i>info@pescamallorca.online
            </a>
            <a href="tel:+34971000000" class="d-flex align-items-center ms-4 text-decoration-none" style="color: inherit;">
              <i class="bi bi-phone me-2"></i>+34 971 00 00 00
            </a>
            
            <div class="social-links d-flex align-items-center ms-4 gap-2">
              <a href="#" class="twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
            </div>
          </div>

          <div class="auth-links d-flex align-items-center">
            <a href="#login" class="btn btn-sm btn-light rounded-pill d-flex align-items-center px-3" style="font-weight: 500;">
              <i class="bi bi-person-circle fs-6 me-2"></i> Iniciar sesión
            </a>
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
              <li><a href="#contacto">Contacto</a></li>
              
              <li class="d-md-none mt-4 px-3 py-3 border-top">
                <div class="d-flex flex-column gap-2 text-center">
                  <a href="mailto:info@pescamallorca.online" class="text-secondary text-decoration-none" style="font-size: 0.95rem;">
                    <i class="bi bi-envelope me-2"></i>info@pescamallorca.online
                  </a>
                  <a href="tel:+34971000000" class="text-secondary text-decoration-none" style="font-size: 0.95rem;">
                    <i class="bi bi-phone me-2"></i>+34 971 00 00 00
                  </a>
                </div>
              </li>

              <li class="d-md-none px-3 pb-2">
                <a href="#login" class="btn btn-primary rounded-pill d-flex justify-content-center align-items-center w-100" style="color: white; padding: 10px;">
                  <i class="bi bi-person-circle fs-5 me-2"></i> Iniciar sesión
                </a>
              </li>

              <li class="d-md-none text-center pb-3">
                <div class="social-links d-flex justify-content-center gap-4 mt-2">
                  <a href="#" class="twitter text-secondary"><i class="bi bi-twitter-x fs-4"></i></a>
                  <a href="#" class="facebook text-secondary"><i class="bi bi-facebook fs-4"></i></a>
                  <a href="#" class="instagram text-secondary"><i class="bi bi-instagram fs-4"></i></a>
                </div>
              </li>
            </ul>
            <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
    </header>
  `;
};