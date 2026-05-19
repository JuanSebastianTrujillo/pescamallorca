export const RulesSection = () => {
    return `
      <!-- Rules Section -->
      <section id="normativa" class="section light-background">
                <div class="container section-title" data-aos="fade-up">
                    <h2 data-i18n="rules_title">Normativa Legal y Permisos</h2>
                    <p data-i18n="rules_tagline">Límites de capturas, cuotas y licencias marítimas vigentes en Islas Baleares.</p>
                </div>
        
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          
          <!-- Nav tabs -->
          <ul class="nav nav-tabs nav-fill mb-4 border-0 gap-2" id="rulesTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active rounded-pill shadow-sm border-0 bg-white text-dark fw-bold" id="licencias-tab" data-bs-toggle="tab" data-bs-target="#licencias" type="button" role="tab" data-i18n="tab_licencias">📜 Licencias y Permisos</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link rounded-pill shadow-sm border-0 bg-white text-dark fw-bold" id="tallas-cupos-tab" data-bs-toggle="tab" data-bs-target="#tallas-cupos" type="button" role="tab" data-i18n="tab_tallas">⚖️ Tallas y Cupos</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link rounded-pill shadow-sm border-0 bg-white text-dark fw-bold" id="reservas-tab" data-bs-toggle="tab" data-bs-target="#reservas" type="button" role="tab" data-i18n="tab_reservas">🐠 Reservas Marinas</button>
            </li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content bg-white p-4 rounded-4 shadow-sm border" id="rulesTabsContent">
            
            <!-- LICENCIAS -->
            <div class="tab-pane fade show active" id="licencias" role="tabpanel" tabindex="0">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <h3 class="fw-bold text-primary mb-3 fs-4" data-i18n="licenses_title">Licencias Oficiales (GOIB)</h3>
                        <p class="text-muted" style="text-align: justify;">Para practicar la pesca marítima de recreo en las Islas Baleares, es <strong>obligatorio estar en posesión de una licencia válida</strong> expedida por la Dirección General de Pesca o una administración autonómica convalidada.</p>
                        <ul class="list-unstyled mt-3 text-muted">
                            <li class="mb-2"><i class="bi bi-person-badge text-primary me-2"></i><strong>Individual (Desde costa/Submarina):</strong> Mayores de 14 años (o menores autorizados). Vigencia de 3 años.</li>
                            <li class="mb-2"><i class="bi bi-droplet-half text-primary me-2"></i><strong>Embarcación:</strong> Cubre a todas las personas a bordo hasta el límite del certificado.</li>
                            <li><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i><strong>Prohibición:</strong> Vender o ceder comercialmente capturas conlleva sanción grave.</li>
                        </ul>
                        <div class="mt-4">
                            <a href="https://www.caib.es/sites/pescarecreativa/es/licencias/" target="_blank" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-i18n="licenses_link"><i class="bi bi-box-arrow-up-right me-2"></i>Trámite telemático GOIB</a>
                        </div>
                    </div>
                    <div class="col-md-5 text-center mt-4 mt-md-0">
                        <i class="bi bi-card-checklist text-primary" style="font-size: 8rem; opacity: 0.8;"></i>
                    </div>
                </div>
            </div>

            <!-- TALLAS Y CUPOS -->
            <div class="tab-pane fade" id="tallas-cupos" role="tabpanel" tabindex="0">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <h3 class="fw-bold text-primary mb-3 fs-4" data-i18n="regulation_title">Regulación Extensa de Especies</h3>
                        <p class="text-muted" style="text-align: justify;">Las Islas Baleares cuentan con una estricta normativa de tallas mínimas para garantizar la supervivencia de los alevines y el equilibrio del ecosistema. <strong>Retener inmaduros supone multas severas y decomiso inmediato.</strong></p>
                        <div class="alert alert-info border-0 shadow-sm mt-3">
                            <h4 class="fw-bold mb-1 fs-6" data-i18n="limits_title"><i class="bi bi-info-circle-fill me-2"></i>Límites diarios vigentes:</h4>
                            <p class="small mb-0 text-dark">El tope legal de extracción es de <strong>5 kg más una pieza</strong> por licencia y día. Hay especies con límite de unidades diario (ej. 50 Raors por navegante en temporada abierta, máx. 300 por barco).</p>
                        </div>
                        <p class="small text-muted mt-3 mb-0">* Puedes consultar las dimensiones legales de cada pez dentro del <strong>Directorio de Ictiología (Especies)</strong>, abriendo la ficha técnica de la página individual de cada pez.</p>
                    </div>
                    <div class="col-md-5 text-center mt-4 mt-md-0">
                        <i class="bi bi-rulers text-primary" style="font-size: 8rem; opacity: 0.8;"></i>
                    </div>
                </div>
            </div>

            <!-- RESERVAS MARINAS -->
            <div class="tab-pane fade" id="reservas" role="tabpanel" tabindex="0">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <h3 class="fw-bold text-primary mb-3 fs-4" data-i18n="reserves_title">Zonas Protegidas y Reservas</h3>
                        <p class="text-muted" style="text-align: justify;">Una red de áreas marinas altamente protegidas garantiza la recuperación biológica. Pescar dentro del polígono de reserva sin superar los trámites obligatorios (como la <strong>declaración responsable semanal y autorización del barco</strong>) es un delito grave.</p>
                        <ul class="list-unstyled mt-3 text-muted">
                            <li class="mb-2"><i class="bi bi-geo-alt-fill text-warning me-2"></i><strong>Llevant de Mallorca:</strong> De Cala Mata hasta de n'Amer.</li>
                            <li class="mb-2"><i class="bi bi-geo-alt-fill text-warning me-2"></i><strong>Badia de Palma:</strong> Regulación por días (veda interna lunes, miérc., vier.).</li>
                            <li class="mb-2"><i class="bi bi-geo-alt-fill text-warning me-2"></i><strong>Nord y Malgrats:</strong> Nivel de protección de flota y uso especial.</li>
                        </ul>
                        <div class="mt-4">
                            <p class="small fw-bold text-dark mb-1">Indicación visual de precauciones:</p>
                            <p class="small text-muted mb-0">Revisa la pestaña del <strong>Mapa Interactivo</strong>. Las zonas sombreadas en amarillo/naranja corresponden a los límites geográficos teóricos de dichas reservas.</p>
                        </div>
                    </div>
                    <div class="col-md-5 text-center mt-4 mt-md-0">
                        <i class="bi bi-map text-warning" style="font-size: 8rem; opacity: 0.8;"></i>
                    </div>
                </div>
            </div>
          </div>
          
        </div>
      </section>
      
      <style>
        #rulesTabs .nav-link.active {
            background-color: var(--bs-primary) !important;
            color: white !important;
            transform: translateY(-2px);
            transition: all 0.2s;
        }
        #rulesTabs .nav-link {
            transition: all 0.2s;
        }
        #rulesTabs .nav-link:hover:not(.active) {
            background-color: #f8f9fa !important;
            transform: translateY(-1px);
        }
      </style>
    `;
};
