export const ContactSection = () => {
    return `
      <!-- Contact/Support Section -->
      <section id="contacto" class="section contact light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Soporte y Atención al Usuario</h2>
          <p>¿Tienes dudas, aportaciones o quieres reportar alguna incidencia? Estamos aquí para ayudarte.</p>
        </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="card border-0 shadow-sm p-5 text-center" style="border-top: 4px solid var(--bs-primary) !important;">
                <div class="mb-4">
                  <i class="bi bi-chat-dots-fill text-primary" style="font-size: 4rem;"></i>
                </div>
                <h3 class="fw-bold mb-3">Envíanos tu mensaje</h3>
                <p class="text-muted mb-5 lead">
                  Queremos escuchar tus propuestas, resolver tus dudas y mantener la plataforma actualizada con la colaboración ciudadana. 
                  Para ello, utilizamos un sistema ágil mediante formularios web.
                </p>
                
                <div class="d-flex flex-column align-items-center">
                  <!-- Google Forms Redirect Button -->
                  <a href="https://forms.google.com/tu-formulario-aqui" target="_blank" class="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="bi bi-ui-checks-grid me-2"></i> Abrir Formulario de Contacto
                  </a>
                  <small class="text-secondary mt-3"><i class="bi bi-info-circle me-1"></i> Serás redirigido a una encuesta de Google Forms segura.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
};
