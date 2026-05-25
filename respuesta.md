Tengo toda la información necesaria. Voy a generar el informe técnico completo.

  ---
  📋 INFORME TÉCNICO DE EVALUACIÓN

  Práctica Final Web-App — Pesca Mallorca (pescamallorca.online)

  Asignatura: Tecnología Multimedia | Fecha: Mayo 2026

  ---
  1. 🏗️ ESTRUCTURA HTML5

  ┌──────────────┬─────────────────┐
  │    Campo     │     Detalle     │
  ├──────────────┼─────────────────┤
  │ Implementado │ ✅ Parcialmente │
  └──────────────┴─────────────────┘

  Evidencias encontradas:
  - index.html — esqueleto del SPA
  - src/components/Header.js, HeroSection.js, Footer.js, etc.

  Fragmentos relevantes:
  <!-- index.html:143 -->
  <body class="index-page">
    <div id="app"></div>  <!-- Único elemento: SPA renderiza todo por JS -->

  <!-- app.js:67 -->
  app.innerHTML = `
    ${Header()}
    <main class="main" id="main-content">
      ${HeroSection()}
      <div id="deferred-sections"></div>
    </main>
    ${Footer()}
    ${LoginModal()}`;

  Explicación técnica:
  Es una SPA (Single Page Application) que genera toda la estructura HTML dinámicamente mediante ES6 modules. El index.html solo contiene metadatos, scripts y un <div id="app">   
  vacío. El uso de <main>, <section>, <header>, <footer> existe, pero se inyecta vía JavaScript. Las etiquetas semánticas están presentes en los componentes JS. La jerarquía de   
  headings usa <h2> en hero, <h3> en tarjetas y <h6> en subcomponentes.

  Limitaciones:
  - El HTML semántico no es estático en el .html; si JS falla, la página queda vacía.
  - No hay <article>, <aside>, o <nav> visible en el index.html base.
  - El <html lang="es"> es estático; no cambia dinámicamente al cambiar idioma.

  Preguntas para la defensa:
  1. ¿Por qué optaste por un SPA en lugar de HTML estático? ¿Qué ventajas y desventajas implica para el SEO?
  2. Si desactivas JavaScript, ¿qué ve el usuario? ¿Consideraste eso como limitación de accesibilidad?
  3. ¿Qué diferencia hay entre <section> y <div> semántico y cómo lo has aplicado?

  Nivel orientativo: 3 / 4 — Buen uso de semántica en componentes JS, estructura sólida, aunque la dependencia total en JS es una limitación.

  ---
  2. 🎨 DISEÑO GRÁFICO, CSS Y UX VISUAL

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ✅ Sí   │
  └──────────────┴─────────┘

  Evidencias:
  - assets/css/main.css, assets/css/chatbot.css
  - Bootstrap 5 + Bootstrap Icons + AOS + Swiper

  Fragmentos relevantes:
  // AccessibilityService.js:278 — High Contrast Mode
  body.setAttribute('data-high-contrast', 'true');
  style.textContent = `
    body[data-high-contrast="true"] { background-color: #ffffff !important; }
    body[data-high-contrast="true"] h1, h2 { color: #000000 !important; font-weight: 700 !important; }
    body[data-high-contrast="true"] .btn-primary { background-color: #0066cc !important; ... }
  // main.js:101 — AOS animations
  AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });

  Explicación técnica:
  El proyecto usa Bootstrap 5 pasado por PurgeCSS (reducción del 72% del peso). Las fuentes son Roboto, Poppins y Raleway, cargadas de manera no bloqueante. El spacing y la paleta
   de colores son consistentes (primario azul Bootstrap, verde para zonas, naranja para reservas). El modo alto contraste está implementado como toggle dinámico en
  AccessibilityService.js con CSS inyectado programáticamente. El zoom de texto (100% → 115% → 130%) también está disponible. Las animaciones scroll usan AOS y los carruseles usan
   Swiper.

  Limitaciones:
  - No hay dark mode propiamente dicho (solo alto contraste).
  - Algunos estilos inline en componentes JS mezclan presentación con lógica.

  Preguntas para la defensa:
  1. ¿Cómo garantizas que el contraste de colores cumple WCAG AA en el modo normal?
  2. ¿Por qué elegiste PurgeCSS y no solo la versión minificada de Bootstrap?
  3. ¿Cuál es la diferencia entre el "alto contraste" que implementaste y un verdadero "dark mode"?

  Nivel orientativo: 3.5 / 4

  ---
  3. 📱 WEB RESPONSIVE

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ✅ Sí   │
  └──────────────┴─────────┘

  Evidencias:
  - index.html:6 — viewport meta
  - HeroSection.js — srcset + sizes
  - app.js:736–749 — Swiper breakpoints

  Fragmentos relevantes:
  <!-- index.html:6 -->
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  // app.js:736 — Swiper responsive breakpoints
  breakpoints: {
    768: { slidesPerView: 2, spaceBetween: 30 },
    992: { slidesPerView: 3, spaceBetween: 40 }
  }
  <!-- HeroSection.js:10-16 — Responsive images -->
  <img
    src="assets/img/hero-carousel/hero-carousel-1-640.webp"
    srcset="...hero-carousel-1-640.webp 640w, ...1280.webp 1280w, ...1920.webp 1920w"
    sizes="100vw"
    fetchpriority="high">
  // HeroSection.js:20 — Fluid typography
  style="font-size: clamp(1.8rem, 5vw, 3rem);"

  Explicación técnica:
  El diseño usa Bootstrap grid con clases responsive (col-sm-6 col-lg-4). Las imágenes del hero tienen srcset con 3 tamaños (640w, 1280w, 1920w). Los carruseles Swiper tienen     
  breakpoints para 1/2/3/4 columnas. Se usa clamp() para tipografía fluida. Las tarjetas de spots, especies, rampas y playas usan el mismo patrón responsive.

  Limitaciones:
  - No se detecta uso explícito de @media queries propias más allá de las de Bootstrap.
  - El modal de mapas puede tener dificultades en pantallas muy pequeñas.

  Preguntas para la defensa:
  1. ¿Qué significa mobile-first y puedes demostrar que tu CSS sigue ese enfoque?
  2. Explica cómo funciona srcset y sizes en las imágenes del hero.
  3. ¿Has probado la app en dispositivos reales además del emulador del navegador?

  Nivel orientativo: 3.5 / 4

  ---
  4. ⚙️ FUNCIONALIDAD Y JAVASCRIPT

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ✅ Sí   │
  └──────────────┴─────────┘

  Evidencias:
  - src/app.js (2286 líneas), src/components/ (12 componentes), src/services/ (7 servicios)
  - Uso de: Swiper, AOS, Bootstrap JS, Leaflet, i18next, GlightBox, ImageOptimizationService

  Fragmentos relevantes:
  // app.js:216–253 — Event delegation (DOM eficiente, evita listeners múltiples)
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-open-spot],[data-open-beach],[data-open-species-index],...');
    if (!el) return;
    if (el.dataset.openSpot !== undefined) { openSpotModal(idx); return; }
    if (el.dataset.openBeach !== undefined) { openBeachModal(...); return; }
    ...
  });

  // QuizEngine.js:15 — Patrón State Machine
  const STATE = { IDLE:'IDLE', PLAYING:'PLAYING', ANSWERED:'ANSWERED', FINISHED:'FINISHED' };

  // WeatherService.js:7-12 — Patrón Adapter + SRP comentado
  // - SRP: este módulo solo gestiona la obtención y transformación de datos meteo.
  // - Adapter Pattern: transforma la respuesta cruda de Open-Meteo al formato interno
  // - Cache en memoria con TTL de 5 minutos

  Explicación técnica:
  Excelente separación de responsabilidades: src/components/ para UI, src/services/ para lógica de negocio. Se aplican patrones de diseño documentados: Adapter (WeatherService),  
  Facade (MapService), State Machine (QuizEngine), SRP en todos los servicios. La delegación de eventos con .closest() es muy eficiente. Las librerías usadas son todas de código  
  abierto y bien conocidas. El bundling con esbuild genera dist/app.bundle.js minificado.

  Limitaciones:
  - app.js con 2286 líneas es demasiado grande y debería dividirse más.
  - Uso de window.xxx como global state es un anti-patrón (ej: window.globalZonesData, window.currentSpotsList).
  - Algunos onmouseover inline en HTML generado por JS mezclan presentación y comportamiento.

  Preguntas para la defensa:
  1. ¿Qué es el patrón event delegation y por qué lo usaste en lugar de listeners en cada elemento?
  2. ¿Qué es esbuild y qué diferencia hay entre un bundle y un módulo ES6 nativo?
  3. ¿Por qué app.js tiene 2286 líneas? ¿Cómo lo refactorizarías?

  Nivel orientativo: 3.5 / 4

  ---
  5. ⏳ PROGRAMACIÓN ASÍNCRONA

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ✅ Sí   │
  └──────────────┴─────────┘

  Evidencias:
  - WeatherService.js, app.js, ChatbotWidget.js

  Fragmentos relevantes:
  // WeatherService.js:116 — Promise.allSettled para peticiones paralelas
  const [forecastRes, marineRes] = await Promise.allSettled([
    fetch(`${FORECAST_BASE}?latitude=${lat}&...`),
    fetch(`${MARINE_BASE}?latitude=${lat}&...`)
  ]);

  // WeatherService.js:171 — try/catch + fallback de datos
  } catch (error) {
    console.error('WeatherService error:', error);
    return { wind:'Error de conexión', statusIcon:'bi-exclamation-triangle', error:true };
  }

  // app.js:77-84 — requestIdleCallback para renderizado diferido
  const deferRender = (callback) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 1000 });
    } else {
      setTimeout(callback, 50); // fallback
    }
  };

  // ChatbotWidget.js:64 — async/await en formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resp = await sendMessage(text);
    ...
  });

  Explicación técnica:
  Se usa async/await de manera coherente en todas las llamadas fetch. Promise.allSettled para peticiones paralelas (más robusto que Promise.all, no falla si una falla). try/catch 
  sistemático con mensajes de error al usuario via toast notifications. requestIdleCallback con fallback para navegadores sin soporte. Caché en memoria con TTL de 5 minutos en    
  WeatherService para evitar llamadas redundantes.

  Limitaciones:
  - Algunos fetch usan ?v=${new Date().getTime()} como cache-busting — correcto para desarrollo pero innecesario en producción para datos estables.
  - El error del formulario de contacto tiene un fallback que simula éxito aunque PHP no exista — puede confundir al usuario.

  Preguntas para la defensa:
  1. ¿Qué diferencia hay entre Promise.all y Promise.allSettled? ¿Por qué elegiste allSettled?
  2. ¿Qué es requestIdleCallback y cuándo es mejor que setTimeout?
  3. ¿Cómo funciona la caché en memoria de WeatherService? ¿Qué problema resuelve?

  Nivel orientativo: 4 / 4

  ---
  6. 🔐 SISTEMA DE AUTENTICACIÓN

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ✅ Sí   │
  └──────────────┴─────────┘

  Evidencias:
  - src/services/AuthService.js
  - src/components/LoginModal.js

  Fragmentos relevantes:
  // AuthService.js:4-32 — Google Identity Services OAuth
  export const AuthService = {
    init() {
      const savedUser = localStorage.getItem('pm_user'); // Persistencia
      if (savedUser) this._user = JSON.parse(savedUser);

      window.handleGoogleSignIn = (response) => {
        const payload = this.decodeJwt(response.credential); // JWT decoding
        this._user = { id: payload.sub, name: payload.name, email: payload.email, picture: payload.picture };
        localStorage.setItem('pm_user', JSON.stringify(this._user));
        window.dispatchEvent(new CustomEvent('auth-change', { detail: this._user }));
      };
    },
    logout() {
      this._user = null;
      localStorage.removeItem('pm_user');
      window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
    },
    mockLogin() { /* Login anónimo como "Pescador Anónimo" */ }
  };

  Explicación técnica:
  Autenticación completa con Google Identity Services (OAuth 2.0). El JWT se decodifica en el cliente (Base64). La sesión persiste en localStorage (clave pm_user). Se disparan    
  CustomEvent auth-change para notificar cambios de estado a toda la app. Hay una opción de "mock login" como pescador anónimo. La UI del header (botón login/avatar) se actualiza 
  dinámicamente. Los comentarios y la Pecédex requieren autenticación.

  Limitaciones:
  - El JWT se decodifica en cliente sin verificar la firma criptográfica — solo adecuado para datos no sensibles.
  - No hay tokens de refresh ni gestión de expiración del token de Google.
  - localStorage no es seguro para datos muy sensibles (vulnerable a XSS).
  - No hay registro/login propio con email/contraseña.

  Preguntas para la defensa:
  1. ¿Qué es OAuth 2.0 y qué diferencia hay entre autenticación y autorización?
  2. ¿Por qué decodificas el JWT en el cliente? ¿Es seguro? ¿Qué parte NO validas?
  3. ¿Por qué usaste localStorage en lugar de cookies httpOnly?

  Nivel orientativo: 3 / 4

  ---
  7. 🌐 WEB SEMÁNTICA Y JSON-LD

  ┌──────────────┬────────────────────────┐
  │    Campo     │        Detalle         │
  ├──────────────┼────────────────────────┤
  │ Implementado │ ✅ Sí — Nivel avanzado │
  └──────────────┴────────────────────────┘

  Evidencias:
  - index.html:28-74 — JSON-LD estático
  - src/services/SemanticService.js — JSON-LD dinámico
  - assets/data/zonas.json, especies.json, rampas.json — datos en formato Schema.org

  Fragmentos relevantes:
  // index.html:28 — JSON-LD estático WebSite + WebPage + BreadcrumbList
  {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": "https://pescamallorca.online/#website", "name": "Pesca Mallorca", ... },
      { "@type": "WebPage", "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [...] } }
    ]
  }

  // especies.json:1 — Datos como Schema.org Taxon
  { "@context":"https://schema.org","@graph":[
    { "@type":"Taxon","@id":"https://...peces/dorada","name":"Dorada (Orada)",
      "alternateName":"Sparus aurata","additionalProperty":[...] }
  ]}

  // SemanticService.js:32 — JSON-LD dinámico al abrir modal de especie
  const jsonld = {
    "@context":"https://schema.org","@type":"Thing","@id":`${baseUrl}/peces/${slug}`,
    "name": species.name, "description": species.description,
    "additionalType":"Taxon", "alternateName": scientificName
  };
  this._updateScriptTag(jsonld);

  Explicación técnica:
  Implementación muy completa en dos capas: (1) JSON-LD estático en <head> para WebSite, WebPage y BreadcrumbList; (2) JSON-LD dinámico via SemanticService que inyecta/elimina    
  scripts <script type="application/ld+json"> al abrir modales de especies (Taxon), zonas (Place/TouristAttraction), playas (Beach) y rampas. Los propios ficheros JSON de datos   
  usan formato Schema.org. OpenGraph y Twitter Cards también implementados.

  Limitaciones:
  - El JSON-LD dinámico no persiste en el DOM al cerrar el modal (se elimina con clearEntityJsonLd), lo que es correcto semánticamente.
  - La URL del @id dinámico usa slugs generados en JS que podrían no coincidir exactamente con los @id del JSON estático.

  Preguntas para la defensa:
  1. ¿Qué es Schema.org y para qué sirve el JSON-LD en el contexto SEO?
  2. ¿Por qué actualizas el JSON-LD dinámicamente al abrir un modal? ¿Cómo lo verían los bots de Google?
  3. ¿Cuál es la diferencia entre @type: Thing y @type: Taxon que usas para las especies?

  Nivel orientativo: 4 / 4

  ---
  8. 📦 GESTIÓN DE DATOS JSON

  ┌──────────────┬─────────────────────────────────────────┐
  │    Campo     │                 Detalle                 │
  ├──────────────┼─────────────────────────────────────────┤
  │ Implementado │ ✅ Sí — Completo en las tres categorías │
  └──────────────┴─────────────────────────────────────────┘

  Evidencias:
  assets/data/
    zonas.json / zonas_es.json / zonas_ca.json / zonas_en.json / zonas_de.json
    especies.json / especies_es.json / especies_ca.json / especies_en.json / especies_de.json
    rampas.json / rampas_es.json / rampas_ca.json / rampas_en.json / rampas_de.json
    playas.json        ← JSON externo cacheado localmente
    comments.json      ← persistencia de comentarios
    messages.json / user_progress.json

  JSON Propio (app.js:555-596):
  async function loadSpotsData() {
    const response = await fetch(`assets/data/zonas_${activeLang}.json?v=...`);
    const schema = await response.json();
    const spots = schema['@graph'].filter(item => item['@type'] === 'Place');
    renderSpotsCards(spots);
  }

  JSON Externo (app.js:1134):
  // Integración de datos de mallorcalas.online (otro grupo)
  const EXTERNAL_URL = 'https://www.mallorcalas.online/data/playas.json';
  const PROXIES = [
    'https://corsproxy.io/?' + EXTERNAL_URL,
    'https://api.allorigins.win/raw?url=...',
    'https://thingproxy.freeboard.io/fetch/' + EXTERNAL_URL,
  ];
  // Sistema de fallback entre 3 proxies CORS

  Explicación técnica:
  JSON propio muy bien estructurado con Schema.org. Separación total datos/lógica: los JSON son solo datos, la transformación se hace en JS. JSON multiidioma (un fichero por      
  idioma × entidad). Integración de JSON externo de mallorcalas.online con sistema robusto de 3 proxies CORS en cascada y adaptación de campos (el externo tiene img,
  accessDifficulty, features vs la estructura propia). Filtrado, búsqueda y ordenación implementados en applyRecommender() y los filtros de playas.

  Limitaciones:
  - Dependencia de proxies CORS de terceros para los datos de playas — si fallan todos, la sección no carga.
  - El comments.json es estático y no permite escritura real sin backend PHP.
  - El parámetro ?v=new Date().getTime() en cada fetch evita cualquier caché del navegador — ineficiente en producción.

  Preguntas para la defensa:
  1. ¿Qué es CORS y por qué necesitas un proxy para acceder a mallorcalas.online?
  2. ¿Cómo adaptaste el esquema del JSON externo a tu estructura interna? Muestra el mapeo de campos.
  3. ¿Qué diferencia hay entre tu JSON de especies y el formato Schema.org Taxon?

  Nivel orientativo: 4 / 4

  ---
  9. 🎬 CONTENIDO MULTIMEDIA

  ┌──────────────┬────────────────────────┐
  │    Campo     │        Detalle         │
  ├──────────────┼────────────────────────┤
  │ Implementado │ ✅ Sí — Nivel muy alto │
  └──────────────┴────────────────────────┘

  Evidencias:
  assets/img/hero-carousel/hero-carousel-1-640.webp   ← 3 tamaños
  assets/img/hero-carousel/hero-carousel-1-1280.webp
  assets/img/hero-carousel/hero-carousel-1-1920.webp
  assets/img/peces/webp/dorada-min-400.webp           ← 400w y 800w
  assets/img/peces/webp/dorada-min-800.webp
  assets/img/peces/todos/dorada-800.webp              ← versión de calidad
  assets/audio/dorada.mp3                             ← pronunciación en mallorquín
  assets/video/pesca.mp4                              ← vídeo de especie

  Fragmentos relevantes:
  <!-- app.js:496-501 — Picture element con AVIF + WebP + JPEG fallback -->
  <picture style="position: absolute; width: 100%; height: 100%;">
    <source type="image/avif" srcset="${rutaLimpia}-400.avif 400w, ${rutaLimpia}-800.avif 800w" sizes="100vw">
    <source type="image/webp" srcset="${rutaLimpia}-400.webp 400w, ${rutaLimpia}-800.webp 800w" sizes="100vw">
    <source type="image/jpeg" srcset="${rutaLimpia}-400.jpg 400w, ${rutaLimpia}-800.jpg 800w" sizes="100vw">
    <img src="${rutaLimpia}-800.jpg" alt="..." loading="eager">
  </picture>
  // resize_images.js + package.json → node resize_images.js
  // sharp library para redimensionar y convertir imágenes automáticamente
  "images:resize": "node resize_images.js",
  "images:optimize": "node optimizar.js"

  Explicación técnica:
  Pipeline multimedia muy completo: imágenes con AVIF + WebP + JPEG como fallback usando <picture>. Tres resoluciones por imagen (400w, 800w, 1920w para hero). Generación
  automática con sharp (Node.js). Audio MP3/OGG para pronunciación de especies en mallorquín. Vídeo MP4 referenciado en especies. loading="lazy" en todas excepto LCP.
  fetchpriority="high" en la primera imagen del hero. Limpieza agresiva de vídeo al cerrar modales (app.js:150-170).

  Limitaciones:
  - No se detectan archivos .ogg de audio en la carpeta — solo .mp3.
  - El vídeo en el modal de especie parece compartido (un único pesca.mp4) en lugar de vídeos por especie.
  - No hay <track> con subtítulos para el vídeo (accesibilidad).
  - No se usan SVG para iconografía propia (usan Bootstrap Icons con fuente woff2).

  Preguntas para la defensa:
  1. ¿Qué ventaja tiene AVIF sobre WebP? ¿Todos los navegadores lo soportan?
  2. ¿Cómo funciona el elemento <picture> con <source>? ¿Cuándo aplica el navegador cada uno?
  3. ¿Qué es fetchpriority="high" y cómo mejora las métricas LCP?

  Nivel orientativo: 4 / 4

  ---
  10. 🔌 APIs HTML5

  ┌──────────────┬───────────────────┐
  │    Campo     │      Detalle      │
  ├──────────────┼───────────────────┤
  │ Implementado │ ✅ Sí — Múltiples │
  └──────────────┴───────────────────┘

  Evidencias y APIs utilizadas:

  ┌──────────────────────────────┬─────────────────────────────────────────────────────┬──────────────────────────────────────────┐
  │             API              │                         Uso                         │                 Archivo                  │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Web Speech API (TTS)         │ Lectura de fichas, notificaciones, modo voz         │ AccessibilityService.js, VoiceService.js │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Web Speech API (STT)         │ Comandos de voz para navegar/buscar                 │ VoiceService.js:128-235                  │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Web Storage (localStorage)   │ Sesión usuario, comentarios, quiz progress, idioma  │ AuthService.js, app.js                   │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Web Storage (sessionStorage) │ No detectado explícitamente                         │                                          │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Media API (Audio)            │ Reproducción pronunciación mallorquín               │ VoiceService.js:65-115                   │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Geolocalización              │ Implícita via coordenadas fijas de spots            │ —                                        │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ Notifications (toast)        │ Notificaciones accesibilidad                        │ AccessibilityService.js:413              │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ requestIdleCallback          │ Renderizado diferido                                │ app.js:77                                │
  ├──────────────────────────────┼─────────────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ MutationObserver             │ Detección de elementos dinámicos para accesibilidad │ AccessibilityService.js:527              │
  └──────────────────────────────┴─────────────────────────────────────────────────────┴──────────────────────────────────────────┘

  Fragmento STT (VoiceService.js:128-222):
  class VoiceController {
    constructor() {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "es-ES";
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      // Timer de silencio de 2s para procesar el comando
      this._resetSilenceTimer = () => setTimeout(() => {
        this.onCommandTimeout(this._accumulatedTranscript);
      }, 2000);
    }
  }

  Limitaciones:
  - No hay uso de Push Notifications del navegador.
  - El STT solo reconoce español (lang: "es-ES") aunque la app es multiidioma.
  - No hay uso de Geolocalización real (navigator.geolocation) para centrar el mapa en la posición del usuario.

  Preguntas para la defensa:
  1. ¿Cómo funciona el reconocimiento de voz continuo con continuous: true? ¿Qué es interimResults?
  2. ¿Por qué usar MutationObserver para la accesibilidad? ¿Qué problema resuelve en una SPA?
  3. ¿Qué diferencia hay entre localStorage y sessionStorage?

  Nivel orientativo: 3.5 / 4

  ---
  11. 🌍 APIs EXTERNAS

  ┌──────────────┬───────────────────┐
  │    Campo     │      Detalle      │
  ├──────────────┼───────────────────┤
  │ Implementado │ ✅ Sí — Múltiples │
  └──────────────┴───────────────────┘

  Evidencias:

  ┌─────────────────────────────────────────────┬──────────────────────────────────────────────┬───────────────────────┐
  │                     API                     │                     Uso                      │        Archivo        │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ Open-Meteo (meteorología)                   │ Datos viento, temperatura, estado del mar    │ WeatherService.js     │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ Marine API Open-Meteo                       │ Altura de olas, período                      │ WeatherService.js:118 │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ OpenStreetMap via Leaflet                   │ Mapa interactivo con spots, rampas, reservas │ MapService.js         │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ Google Identity Services                    │ Autenticación OAuth con Google               │ AuthService.js:16     │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ Gemini 2.5 Flash                            │ Chatbot de IA conversacional                 │ ChatbotWidget.js:5    │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ mallorcalas.online                          │ JSON externo de playas (otro grupo)          │ app.js:1134           │
  ├─────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────┤
  │ CORS Proxies (corsproxy.io, allorigins.win) │ Intermediarios para JSON externo             │ app.js:1136           │
  └─────────────────────────────────────────────┴──────────────────────────────────────────────┴───────────────────────┘

  Fragmentos relevantes:
  // WeatherService.js:116 — Open-Meteo + Marine API en paralelo
  const [forecastRes, marineRes] = await Promise.allSettled([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,...`),
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,...`)
  ]);
  // ChatbotWidget.js:5 — Chatbot proxy hacia Gemini
  const apiEndpoint = '/api/chat.php'; // PHP proxy que llama a Gemini 2.5 Flash

  Explicación técnica:
  Open-Meteo es gratuita sin API key — muy buena elección. Leaflet + OpenStreetMap también gratuitos. Google Auth usa el SDK oficial. El chatbot usa Gemini 2.5 Flash a través de  
  un proxy PHP para ocultar la API key. Los errores de red están manejados con try/catch y mensajes al usuario.

  Limitaciones:
  - El chatbot depende del servidor PHP — en modo estático no funciona.
  - La Geolocalización podría usarse para centrar el mapa y solicitar el tiempo en la posición actual del usuario.
  - Los proxies CORS de terceros son un punto de fallo externo.

  Preguntas para la defensa:
  1. ¿Por qué usas un proxy PHP para el chatbot en lugar de llamar directamente a Gemini desde el cliente?
  2. ¿Qué son los límites de uso (rate limits) de Open-Meteo y cómo los manejas?
  3. ¿Qué información retorna la Marine API y cómo la transformas en "estado del mar"?

  Nivel orientativo: 4 / 4

  ---
  12. ⚡ RENDIMIENTO Y SEO

  ┌──────────────┬────────────────────────┐
  │    Campo     │        Detalle         │
  ├──────────────┼────────────────────────┤
  │ Implementado │ ✅ Sí — Nivel muy alto │
  └──────────────┴────────────────────────┘

  Evidencias:
  // package.json — pipeline de build
  "build": "npm run purgecss && npm run minify-css && npm run bundle"
  "purgecss": "postcss bootstrap.min.css --output bootstrap.min.purged.css"  // -72%
  "bundle":   "esbuild src/app.js --bundle --minify --outfile=dist/app.bundle.js"
  "lighthouse": "lighthouse https://www.pescamallorca.online --output=json"

  Optimizaciones implementadas:

  ┌──────────────────────────────────────────────┬──────────────────────────────┐
  │                   Técnica                    │          Evidencia           │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ PurgeCSS (Bootstrap -72%)                    │ package.json, index.html:116 │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ esbuild bundle + minify                      │ dist/app.bundle.js           │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ CSS no bloqueante (preload + onload)         │ index.html:108-128           │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ Fuentes no bloqueantes                       │ index.html:102-105           │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ fetchpriority="high" en LCP                  │ HeroSection.js:12            │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ loading="lazy" en imágenes secundarias       │ HeroSection.js:32            │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ requestIdleCallback para secciones diferidas │ app.js:77                    │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ Caché en memoria WeatherService (TTL 5min)   │ WeatherService.js:22-32      │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ Preconnect a Open-Meteo, Google Fonts        │ index.html:87-91             │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ Prefetch de Leaflet e i18next                │ index.html:112-113           │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ CSS crítico inline (evita FOUC)              │ index.html:84                │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ AVIF + WebP + JPEG srcset                    │ app.js:496-501               │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ AOS diferido vía requestAnimationFrame       │ main.js:112-116              │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ Canonical, meta robots                       │ index.html:10-11             │
  ├──────────────────────────────────────────────┼──────────────────────────────┤
  │ OpenGraph + Twitter Cards                    │ index.html:13-26             │
  └──────────────────────────────────────────────┴──────────────────────────────┘

  Limitaciones:
  - No se encuentra un Lighthouse report generado (lighthouse-report-final.json no está en el repo).
  - No hay evidencia de uso de WAVE o axe en el código.
  - El ?v=${new Date().getTime()} en los fetch de JSON desactiva la caché HTTP del navegador para esos recursos — contraproducente en producción.

  Preguntas para la defensa:
  1. Explica la técnica de CSS preload no bloqueante que usas: <link rel="preload" as="style" onload="this.rel='stylesheet'">.
  2. ¿Qué mide el LCP (Largest Contentful Paint) y cómo lo has optimizado?
  3. ¿Qué hace PurgeCSS y cómo has configurado qué selectores conservar?

  Nivel orientativo: 4 / 4

  ---
  13. ♿ ACCESIBILIDAD AVANZADA

  ┌──────────────┬────────────────────────┐
  │    Campo     │        Detalle         │
  ├──────────────┼────────────────────────┤
  │ Implementado │ ✅ Sí — Nivel muy alto │
  └──────────────┴────────────────────────┘

  Evidencias:
  - src/services/AccessibilityService.js (563 líneas)
  - src/services/VoiceService.js
  - ChatbotWidget.js (atributos ARIA completos)
  - MapService.js (ARIA en marcadores)

  Implementaciones:

  ┌────────────────────────────────────────────┬─────────────────────────────────────────────────────────┐
  │               Característica               │                        Evidencia                        │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ ARIA roles en modal chatbot                │ role="dialog", aria-modal, aria-labelledby, aria-hidden │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ aria-live="polite" en chat                 │ ChatbotWidget.js:28                                     │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ TTS (Text-to-Speech)                       │ AccessibilityService.js:28-68                           │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ STT (Speech Recognition)                   │ VoiceService.js:128                                     │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ Alto contraste toggle                      │ AccessibilityService.js:278-387                         │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ Zoom de texto (100/115/130%)               │ AccessibilityService.js:391-403                         │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ Focus trap en modales                      │ AccessibilityService.js:167-215                         │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ Indicadores de foco visibles (3px outline) │ AccessibilityService.js:244-274                         │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ Navegación por teclado (Enter/Space)       │ app.js:247-253                                          │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ ARIA labels en marcadores Leaflet          │ MapService.js:139-141                                   │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ aria-label en botones del carousel         │ HeroSection.js:56-63                                    │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ visually-hidden para screen readers        │ HeroSection.js:58                                       │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ MutationObserver para elementos dinámicos  │ AccessibilityService.js:527-542                         │
  ├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ role="alert" en notificaciones             │ AccessibilityService.js:418                             │
  └────────────────────────────────────────────┴─────────────────────────────────────────────────────────┘

  Fragmento clave:
  // AccessibilityService.js:167 — Focus Trap WCAG 2.1
  export function trapFocusInModal(modal, triggerElement) {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, ...');
    // Tab → avanza; Shift+Tab → retrocede; Escape → cierra y devuelve foco
    modal.addEventListener('hidden.bs.modal', () => {
      if (triggerElement) triggerElement.focus(); // Devuelve foco al opener
    });
  }

  Limitaciones:
  - No hay <a href="#main-content"> skip-nav link para saltar la navegación.
  - El STT solo funciona en español.
  - El <html lang> no se actualiza dinámicamente al cambiar idioma.
  - Los vídeos no tienen subtítulos (<track>).

  Preguntas para la defensa:
  1. ¿Qué es el "focus trap" en modales y por qué es necesario para accesibilidad?
  2. ¿Qué son los criterios WCAG AA? ¿En qué aspectos crees que los cumples y cuáles te faltan?
  3. ¿Cómo funciona aria-live="polite" en el chat? ¿Qué anuncia a un lector de pantalla?

  Nivel orientativo: 4 / 4

  ---
  14. 🌐 MULTIIDIOMA (i18n)

  ┌──────────────┬────────────────────────────┐
  │    Campo     │          Detalle           │
  ├──────────────┼────────────────────────────┤
  │ Implementado │ ✅ Sí — Nivel muy completo │
  └──────────────┴────────────────────────────┘

  Evidencias:
  assets/locales/es.json  ← ~60+ claves de UI
  assets/locales/ca.json  ← catalán
  assets/locales/en.json  ← inglés
  assets/locales/de.json  ← alemán

  assets/data/zonas_es.json / zonas_ca.json / zonas_en.json / zonas_de.json
  assets/data/especies_es.json / ... / de.json
  assets/data/rampas_es.json / ... / de.json

  Fragmentos relevantes:
  // i18n.js:12 — i18next con detección automática y backend HTTP
  i18n.use(HttpBackend).use(LanguageDetector).init({
    fallbackLng: 'es',
    backend: { loadPath: 'assets/locales/{{lng}}.json?v=...' },
    detection: { order: ['querystring', 'localStorage', 'navigator'], caches: ['localStorage'] }
  });

  // app.js:441 — Datos JSON también en el idioma activo
  const response = await fetch(`assets/data/especies_${activeLang}.json`);
  // ChatbotWidget.js:8-13 — System prompts multiidioma para la IA
  const systemPrompts = {
    es: "Eres un asistente experto en pesca en Mallorca... Responde siempre en español.",
    en: "You are an expert assistant... Always respond in English.",
    ca: "Ets un assistent expert en pesca a Mallorca... Respon sempre en català.",
    de: "Sie sind ein Experte für Fischen auf Mallorca... Antworten Sie immer auf Deutsch."
  };

  Explicación técnica:
  Sistema de i18n muy completo: no solo traduce textos de la UI (via data-i18n), sino también los datos JSON completos (zonas, especies, rampas en 4 idiomas). El cambio de idioma 
  es dinámico sin recarga de página. La detección automática usa el idioma del navegador. El chatbot también adapta su idioma de respuesta. Los aria-labels y placeholders también 
  se traducen.

  Limitaciones:
  - La traducción de datos JSON (zonas/especies/rampas) duplica los ficheros × 4 idiomas — mantenimiento costoso.
  - No hay formateo cultural de fechas o números.
  - El <html lang="es"> es estático y no se actualiza al cambiar idioma.

  Preguntas para la defensa:
  1. ¿Cómo detecta i18next automáticamente el idioma del usuario? ¿En qué orden consulta las fuentes?
  2. ¿Por qué tienes ficheros JSON de datos separados por idioma en lugar de uno solo con todas las traducciones?
  3. ¿Qué es el fallbackLng en i18next y cuándo se activa?

  Nivel orientativo: 4 / 4

  ---
  15. 🤖 INTELIGENCIA ARTIFICIAL Y CHATBOT

  ┌──────────────┬──────────────────┐
  │    Campo     │     Detalle      │
  ├──────────────┼──────────────────┤
  │ Implementado │ ✅ Sí — Doble IA │
  └──────────────┴──────────────────┘

  Evidencias:
  - src/components/ChatbotWidget.js — Chatbot con Gemini 2.5 Flash
  - src/services/VoiceService.js — Control por voz con STT + procesador de comandos

  Fragmentos relevantes:
  // ChatbotWidget.js — Widget flotante con Gemini 2.5 Flash
  async function sendMessage(message) {
    const lang = window.i18next?.language || 'es';
    const payload = {
      message,
      system: systemPrompts[shortLang] || systemPrompts.es, // Prompt adaptado al idioma
      lang: shortLang
    };
    const res = await fetch('/api/chat.php', { method: 'POST', ... });
    return data.response;
  }
  // Formateo markdown: **negrita**, *cursiva*, listas, saltos de línea
  function formatText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") ...
  }
  // VoiceService.js:254 — Procesador de comandos de voz (IA basada en reglas)
  export function processCommand(transcript) {
    if (text.startsWith("ir a") || text.includes("ver peces")) { ... }
    if (text.startsWith("ver ") || text.startsWith("abrir ")) {
      // Busca en especies, playas, zonas, rampas y abre el modal correspondiente
      window.openSpeciesModalByName(query);
    }
    if (soundMatch) { playAudio(species.audio); } // Reproduce pronunciación
  }

  Explicación técnica:
  Dos sistemas de IA: (1) Chatbot conversacional con Gemini 2.5 Flash (LLM externo) con prompts de sistema multiidioma especializados en pesca en Mallorca, renderizado markdown,  
  accesibilidad ARIA completa. (2) Control por voz basado en reglas: STT con Web Speech API + procesador NLU propio que permite navegar, buscar especies, abrir fichas, reproducir 
  audio y controlar accesibilidad con comandos de voz naturales.

  Limitaciones:
  - El chatbot depende del servidor PHP (/api/chat.php) — no funciona en modo estático puro.
  - El procesador de comandos de voz es basado en reglas (no IA real), pero es funcional y útil.
  - No hay historial de conversación persistente entre sesiones.

  Preguntas para la defensa:
  1. ¿Qué es un system prompt en un LLM? ¿Cómo lo has usado para especializar el chatbot?
  2. ¿Por qué el chatbot llama a un proxy PHP en lugar de directamente a la API de Gemini?
  3. ¿Qué diferencia hay entre un chatbot basado en reglas y uno basado en LLM? ¿Cuál implementas en el control de voz?

  Nivel orientativo: 4 / 4

  ---
  16. 📲 PWA (Progressive Web App)

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ❌ No   │
  └──────────────┴─────────┘

  Evidencias buscadas:
  - sw.js — No encontrado
  - manifest.json — No encontrado
  - <link rel="manifest"> — No encontrado en index.html

  Explicación técnica:
  No hay ningún Service Worker registrado ni fichero manifest.json, por lo que la aplicación no puede instalarse como PWA ni funciona offline. Es una app web convencional. Sin    
  embargo, tiene muchas características de rendimiento que se acercan a una buena PWA (caché en memoria, recursos prefetchados, bundle optimizado).

  Lo que faltaría para convertirla en PWA:
  // manifest.json (mínimo)
  { "name": "Pesca Mallorca", "short_name": "PescaMallorca",
    "start_url": "/", "display": "standalone",
    "background_color": "#ffffff", "theme_color": "#0d6efd",
    "icons": [{ "src": "assets/img/favicon.png", "sizes": "192x192" }] }
  // sw.js — Service Worker básico
  self.addEventListener('install', e => e.waitUntil(
    caches.open('v1').then(cache => cache.addAll(['/','assets/css/main.css','/dist/app.bundle.js']))
  ));

  Preguntas para la defensa:
  1. ¿Qué es un Service Worker y qué le falta a tu app para ser una PWA?
  2. ¿Qué ventajas tendría añadir un manifest.json? ¿En qué dispositivos funcionaría la instalación?
  3. ¿Conoces la diferencia entre estrategias de caché Cache First y Network First?

  Nivel orientativo: 0 / 4

  ---
  17. 🗃️ GIT Y CONTROL DE VERSIONES

  ┌──────────────┬─────────┐
  │    Campo     │ Detalle │
  ├──────────────┼─────────┤
  │ Implementado │ ✅ Sí   │
  └──────────────┴─────────┘

  Evidencias:
  Commits totales: 120
  Primer commit:   "Initial commit"
  Commits intermedios:
    - "Creation of all the sections"
    - "Separation of Index.html on different .js archives"
    - "fotos peces bien", "videos ok", "zonas", "rampas"
  Commits recientes:
    - "optimiseiton test"
    - "playy"
    - "video stop"
    - "stop video 2"
  Repositorio publicado en GitHub (merge desde remote en historial)

  Explicación técnica:
  El proyecto tiene un historial de 120 commits desde el commit inicial, mostrando evolución progresiva (estructura → componentes → datos → multimedia → optimizaciones). El       
  repositorio está en GitHub (evidenciado por el merge en el log). La rama es main. Los commits más recientes muestran iteración sobre la funcionalidad de vídeo.

  Limitaciones:
  - Los mensajes de commits son poco descriptivos ("playy", "cambio", "prueba", "fotos") — no siguen convenciones (Conventional Commits).
  - No hay uso de ramas de features (feature/xxx) ni pull requests evidentes en el local.
  - No hay .gitignore que excluya node_modules/ — la carpeta con ~80 paquetes está en el repo.

  Preguntas para la defensa:
  1. ¿Qué información debe tener un buen mensaje de commit según las buenas prácticas?
  2. ¿Por qué es importante tener un .gitignore y qué deberías haber excluido?
  3. ¿Qué es un merge conflict y has tenido alguno durante el desarrollo?

  Nivel orientativo: 2.5 / 4

  ---
  📊 TABLA RESUMEN DE EVALUACIÓN

  ┌─────┬──────────────────────────┬──────────────────┬─────────────┐
  │  #  │         Criterio         │      Estado      │ Nivel (0-4) │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 1   │ Estructura HTML5         │ ✅ Parcialmente  │      3      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 2   │ Diseño CSS y UX visual   │      ✅ Sí       │     3.5     │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 3   │ Web Responsive           │      ✅ Sí       │     3.5     │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 4   │ Funcionalidad JavaScript │      ✅ Sí       │     3.5     │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 5   │ Programación Asíncrona   │      ✅ Sí       │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 6   │ Sistema de Autenticación │      ✅ Sí       │      3      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 7   │ Web Semántica y JSON-LD  │   ✅ Avanzado    │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 8   │ Gestión de Datos JSON    │   ✅ Completo    │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 9   │ Multimedia               │   ✅ Muy alto    │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 10  │ APIs HTML5               │   ✅ Múltiples   │     3.5     │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 11  │ APIs Externas            │   ✅ Múltiples   │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 12  │ Rendimiento y SEO        │   ✅ Muy alto    │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 13  │ Accesibilidad            │   ✅ Avanzado    │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 14  │ Multiidioma              │   ✅ Completo    │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 15  │ IA y Chatbot             │ ✅ Doble sistema │      4      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 16  │ PWA                      │      ❌ No       │      0      │
  ├─────┼──────────────────────────┼──────────────────┼─────────────┤
  │ 17  │ Git                      │ ✅ Parcialmente  │     2.5     │
  └─────┴──────────────────────────┴──────────────────┴─────────────┘

  Promedio estimado: ~3.47 / 4

  ---
  🎯 FORTALEZAS DESTACADAS

  1. Arquitectura modular muy sólida: SPA con separación components/services, patrones de diseño documentados (Adapter, Facade, State Machine, SRP).
  2. Pipeline de rendimiento profesional: PurgeCSS, esbuild, AVIF/WebP, lazy loading, non-blocking CSS, preconnect, requestIdleCallback.
  3. Web semántica de nivel avanzado: JSON-LD estático + dinámico, datos propios en formato Schema.org.
  4. Accesibilidad completa: TTS, STT, focus trap, alto contraste, zoom texto, ARIA exhaustivo.
  5. i18n completo en 4 idiomas, incluyendo datos JSON traducidos.
  6. Chatbot con Gemini 2.5 Flash y control de voz por comandos naturales.

  ⚠️ ASPECTOS A MEJORAR

  1. PWA ausente — el paso más obvio pendiente.
  2. node_modules en el repositorio — .gitignore incorrecto.
  3. Mensajes de commit poco descriptivos — no siguen convenciones.
  4. app.js demasiado grande (2286 líneas) — necesita mayor fragmentación.
  5. Variables globales vía window.xxx — anti-patrón en arquitecturas modulares.
  6. STT solo en español a pesar de ser una app multiidioma.
  7. Sin vídeos ni subtítulos (<track>) por especie — el vídeo es genérico.