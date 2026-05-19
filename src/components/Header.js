export const Header = () => {
  return `
    <header id="header" class="header sticky-top">
      <div class="topbar d-none d-md-flex align-items-center accent-background">
        <div class="container d-flex justify-content-end align-items-center">

          <div class="auth-links d-flex align-items-center gap-2 gap-lg-3 flex-shrink-0">
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center px-3 text-nowrap dropdown-toggle" type="button" id="accessibilityDropdownDesktop" data-bs-toggle="dropdown" aria-expanded="false" title="Opciones de Accesibilidad" data-i18n-title="accessibility_options_title">
                <i class="bi bi-person-wheelchair fs-6 me-1"></i> <span data-i18n="accessibility">Accesibilidad</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="accessibilityDropdownDesktop" style="min-width: 200px;">
                <li><h6 class="dropdown-header" data-i18n="tools_header">Herramientas</h6></li>
                <li><button class="dropdown-item d-flex align-items-center" id="tts-toggle-desktop"><i class="bi bi-volume-up-fill me-2 text-primary"></i> <span data-i18n="tts">Lectura por voz</span></button></li>
                <li><button class="dropdown-item d-flex align-items-center" id="voice-command-toggle-desktop"><i class="bi bi-mic-fill me-2 text-primary"></i> <span data-i18n="voice_commands">Comandos de voz</span></button></li>
                <li><button class="dropdown-item d-flex align-items-center" id="zoom-toggle-desktop"><i class="bi bi-zoom-in me-2 text-primary"></i> <span data-i18n="increase_text">Aumentar texto</span></button></li>
                <li><button class="dropdown-item d-flex align-items-center" id="contrast-toggle-desktop"><i class="bi bi-circle-half me-2 text-primary"></i> <span data-i18n="high_contrast">Alto contraste</span></button></li>
              </ul>
            </div>

            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center px-3 text-nowrap dropdown-toggle" type="button" id="languageDropdownDesktop" data-bs-toggle="dropdown" aria-expanded="false" title="Seleccionar Idioma">
                <i class="bi bi-globe me-1"></i> <span id="currentLanguageLabel">ES</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="languageDropdownDesktop" style="min-width: 120px;">
                <li><a class="dropdown-item active" href="#" data-lang="es">Español</a></li>
                <li><a class="dropdown-item" href="#" data-lang="ca">Català</a></li>
                <li><a class="dropdown-item" href="#" data-lang="en">English</a></li>
                <li><a class="dropdown-item" href="#" data-lang="de">Deutsch</a></li>
              </ul>
            </div>

            <div id="auth-container">
              <a href="#login" class="btn btn-sm btn-light rounded-pill d-flex align-items-center px-3 text-nowrap" style="font-weight: 500;" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="bi bi-person-circle fs-6 me-2"></i> <span data-i18n="login">Iniciar sesión</span>
              </a>
            </div>
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
              <li><a href="#hero" class="active" data-i18n="nav_inicio">Inicio</a></li>
              <li><a href="#especies" data-i18n="nav_especies">Especies</a></li>
              <li><a href="#pecedex" data-i18n="nav_pecedex">Pecédex</a></li>
              <li><a href="#zonas" data-i18n="nav_zonas">Spots</a></li>
              <li><a href="#rampas" data-i18n="nav_rampas">Rampas</a></li>
              <li><a href="#playas" data-i18n="nav_playas">Playas</a></li>
              <li><a href="#mapa" data-i18n="nav_mapa">Mapa</a></li>
              <li><a href="#meteo" data-i18n="nav_meteo">Tiempo</a></li>
              <li><a href="#quiz" data-i18n="nav_quiz">Quiz</a></li>
              <li><a href="#tiendas" data-i18n="nav_tiendas">Tiendas</a></li>
              <li><a href="#normativa" data-i18n="nav_normativa">Normativa</a></li>
              <li><a href="#autores" data-i18n="nav_autores">Autores</a></li>
              <li><a href="#contacto" data-i18n="nav_contacto">Contacto</a></li>



              <li class="d-md-none px-3 pb-2">
                <div class="dropdown w-100 mb-3">
                  <button class="btn btn-outline-primary rounded-pill dropdown-toggle w-100 d-flex justify-content-center align-items-center" type="button" id="accessibilityDropdownMobile" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" style="padding: 10px;" title="Opciones de Accesibilidad" data-i18n="accessibility" data-i18n-title="accessibility_options_title">
                    <i class="bi bi-person-wheelchair fs-5 me-2"></i> Accesibilidad
                  </button>
                  <ul class="dropdown-menu shadow text-center border-0 w-100" aria-labelledby="accessibilityDropdownMobile">
                    <li><button class="dropdown-item" id="tts-toggle-mobile" data-close-mobile><i class="bi bi-volume-up-fill me-2 text-primary"></i> <span data-i18n="tts">Lectura por voz</span></button></li>
                    <li><button class="dropdown-item" id="voice-command-toggle-mobile" data-close-mobile><i class="bi bi-mic-fill me-2 text-primary"></i> <span data-i18n="voice_commands">Comandos de voz</span></button></li>
                    <li><button class="dropdown-item" id="zoom-toggle-mobile" data-close-mobile><i class="bi bi-zoom-in me-2 text-primary"></i> <span data-i18n="increase_text">Aumentar texto</span></button></li>
                    <li><button class="dropdown-item" id="contrast-toggle-mobile" data-close-mobile><i class="bi bi-circle-half me-2 text-primary"></i> <span data-i18n="high_contrast">Alto contraste</span></button></li>
                  </ul>
                </div>

                <div id="auth-container-mobile">
                  <a href="#login" class="btn btn-primary rounded-pill d-flex justify-content-center align-items-center w-100 mb-3" style="color: white; padding: 10px;" data-bs-toggle="modal" data-bs-target="#loginModal" data-close-mobile>
                    <i class="bi bi-person-circle fs-5 me-2"></i> <span data-i18n="login">Iniciar sesión</span>
                  </a>
                </div>
                
                <div class="d-flex justify-content-center">
                  <div class="dropdown w-100">
                    <button class="btn btn-outline-secondary rounded-pill dropdown-toggle w-100" type="button" id="languageDropdownMobile" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" style="padding: 10px;">
                      <i class="bi bi-globe me-2"></i> <span id="currentLanguageLabelMobile">Español</span>
                    </button>
                    <ul class="dropdown-menu shadow text-center border-0 w-100" aria-labelledby="languageDropdownMobile">
                      <li><a class="dropdown-item active" href="#" data-lang="es">Español</a></li>
                      <li><a class="dropdown-item" href="#" data-lang="ca">Català</a></li>
                      <li><a class="dropdown-item" href="#" data-lang="en">English</a></li>
                      <li><a class="dropdown-item" href="#" data-lang="de">Deutsch</a></li>
                    </ul>
                  </div>
                </div>
              </li>

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
          <span id="voice-status-text" class="fw-bold" data-i18n="voice_listening">Escuchando...</span>
          <button class="btn btn-sm btn-light rounded-circle ms-3" data-stop-voice data-i18n-aria="voice_stop_listen" aria-label="Detener escucha">
            <i class="bi bi-x"></i>
          </button>
       </div>
    </div>
  `;
};