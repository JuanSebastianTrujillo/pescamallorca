export const Header = () => {
  return `
    <header id="header" class="header sticky-top">
      
      <div class="topbar d-none d-md-flex align-items-center accent-background">
        <div class="container d-flex justify-content-center justify-content-md-between align-items-center">
          
          <div class="contact-info d-flex align-items-center">
            <a href="mailto:info@pescamallorca.online" class="d-flex align-items-center text-white text-decoration-none text-nowrap">
              <i class="bi bi-envelope me-1 me-lg-2"></i><span style="font-size: 0.9rem;">info@pescamallorca.online</span>
            </a>
            <a href="tel:+34971000000" class="d-flex align-items-center ms-2 ms-lg-4 text-white text-decoration-none text-nowrap">
              <i class="bi bi-phone me-1"></i><span style="font-size: 0.9rem;">+34 971 00 00 00</span>
            </a>
            
            <div class="social-links d-flex align-items-center ms-2 ms-lg-4 gap-2">
              <a href="#" class="twitter text-white" aria-label="X (Twitter)"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="facebook text-white" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="instagram text-white" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            </div>
          </div>

          <div class="auth-links d-flex align-items-center gap-2 gap-lg-3 flex-shrink-0 ms-2">
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center px-3 text-nowrap dropdown-toggle" type="button" id="accessibilityDropdownDesktop" data-bs-toggle="dropdown" aria-expanded="false" title="Opciones de Accesibilidad">
                <i class="bi bi-person-wheelchair fs-6 me-1"></i> Accesibilidad
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="accessibilityDropdownDesktop" style="min-width: 200px;">
                <li><h6 class="dropdown-header">Herramientas</h6></li>
                <li><button class="dropdown-item d-flex align-items-center" id="tts-toggle-desktop"><i class="bi bi-volume-up-fill me-2 text-primary"></i> Lectura por voz</button></li>
                <li><button class="dropdown-item d-flex align-items-center" id="voice-command-toggle-desktop"><i class="bi bi-mic-fill me-2 text-primary"></i> Comandos de voz</button></li>
                <li><button class="dropdown-item d-flex align-items-center" id="zoom-toggle-desktop"><i class="bi bi-zoom-in me-2 text-primary"></i> Aumentar texto</button></li>
                <li><button class="dropdown-item d-flex align-items-center" id="contrast-toggle-desktop"><i class="bi bi-circle-half me-2 text-primary"></i> Alto contraste</button></li>
              </ul>
            </div>

            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center px-3 text-nowrap dropdown-toggle" type="button" id="languageDropdownDesktop" data-bs-toggle="dropdown" aria-expanded="false" title="Seleccionar Idioma">
                <i class="bi bi-globe me-1"></i> ES
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="languageDropdownDesktop" style="min-width: 120px;">
                <li><a class="dropdown-item active" href="#">Español</a></li>
                <li><a class="dropdown-item" href="#">Català</a></li>
                <li><a class="dropdown-item" href="#">English</a></li>
                <li><a class="dropdown-item" href="#">Deutsch</a></li>
              </ul>
            </div>

            <a href="#login" class="btn btn-sm btn-light rounded-pill d-flex align-items-center px-3 text-nowrap" style="font-weight: 500;">
              <i class="bi bi-person-circle fs-6 me-2"></i> Iniciar sesión
            </a>
          </div>
        </div>
      </div>
      
      <div class="branding d-flex align-items-center">
        <div class="container position-relative d-flex align-items-center justify-content-between">
          <a href="/" data-link class="logo d-flex align-items-center" aria-label="Ir a la página de inicio">
            <h1 class="sitename">Pesca Mallorca</h1>
          </a>
          
          <nav id="navmenu" class="navmenu" aria-label="Menú principal de navegación">
            <ul>
              <li><a href="#hero" class="active">Inicio</a></li>
              <li><a href="#zonas">Spots</a></li>
              <li><a href="#especies">Especies</a></li>
              <li><a href="#pecedex">Pecédex</a></li>
              <li><a href="#mapa">Mapa</a></li>
              <li><a href="#quiz">Quiz</a></li>
              <li><a href="#meteo">Tiempo</a></li>
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
                <div class="dropdown w-100 mb-3">
                  <button class="btn btn-outline-primary rounded-pill dropdown-toggle w-100 d-flex justify-content-center align-items-center" type="button" id="accessibilityDropdownMobile" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" style="padding: 10px;" title="Opciones de Accesibilidad">
                    <i class="bi bi-person-wheelchair fs-5 me-2"></i> Accesibilidad
                  </button>
                  <ul class="dropdown-menu shadow text-center border-0 w-100" aria-labelledby="accessibilityDropdownMobile">
                    <li><button class="dropdown-item" id="tts-toggle-mobile"><i class="bi bi-volume-up-fill me-2 text-primary"></i> Lectura por voz</button></li>
                    <li><button class="dropdown-item" id="voice-command-toggle-mobile"><i class="bi bi-mic-fill me-2 text-primary"></i> Comandos de voz</button></li>
                    <li><button class="dropdown-item" id="zoom-toggle-mobile"><i class="bi bi-zoom-in me-2 text-primary"></i> Aumentar texto</button></li>
                    <li><button class="dropdown-item" id="contrast-toggle-mobile"><i class="bi bi-circle-half me-2 text-primary"></i> Alto contraste</button></li>
                  </ul>
                </div>

                <a href="#login" class="btn btn-primary rounded-pill d-flex justify-content-center align-items-center w-100 mb-3" style="color: white; padding: 10px;">
                  <i class="bi bi-person-circle fs-5 me-2"></i> Iniciar sesión
                </a>
                
                <div class="d-flex justify-content-center">
                  <div class="dropdown w-100">
                    <button class="btn btn-outline-secondary rounded-pill dropdown-toggle w-100" type="button" id="languageDropdownMobile" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" style="padding: 10px;">
                      <i class="bi bi-globe me-2"></i> Español
                    </button>
                    <ul class="dropdown-menu shadow text-center border-0 w-100" aria-labelledby="languageDropdownMobile">
                      <li><a class="dropdown-item active" href="#">Español</a></li>
                      <li><a class="dropdown-item" href="#">Català</a></li>
                      <li><a class="dropdown-item" href="#">English</a></li>
                      <li><a class="dropdown-item" href="#">Deutsch</a></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li class="d-md-none text-center pb-3">
                <div class="social-links d-flex justify-content-center gap-4 mt-2">
                  <a href="#" class="twitter text-secondary" aria-label="X (Twitter)"><i class="bi bi-twitter-x fs-4"></i></a>
                  <a href="#" class="facebook text-secondary" aria-label="Facebook"><i class="bi bi-facebook fs-4"></i></a>
                  <a href="#" class="instagram text-secondary" aria-label="Instagram"><i class="bi bi-instagram fs-4"></i></a>
                </div>
              </li>
            </ul>
            <button class="mobile-nav-toggle d-xl-none btn btn-link p-0 border-0" aria-label="Abrir menú de navegación" type="button">
              <i class="bi bi-list"></i>
            </button>
          </nav>
        </div>
      </div>
    </header>
    
    <!-- Status de Voz -->
    <div id="voice-status-container" class="position-fixed bottom-0 start-50 translate-middle-x mb-4 d-none" style="z-index: 10000;">
       <div class="badge bg-primary p-3 rounded-pill shadow-lg d-flex align-items-center">
          <div class="voice-indicator me-3">
             <div class="dot"></div>
             <div class="dot"></div>
             <div class="dot"></div>
          </div>
          <span id="voice-status-text" class="fw-bold">Escuchando...</span>
          <button class="btn btn-sm btn-light rounded-circle ms-3" onclick="window.stopVoiceRecognition()" aria-label="Detener escucha">
            <i class="bi bi-x"></i>
          </button>
       </div>
    </div>
  `;
};