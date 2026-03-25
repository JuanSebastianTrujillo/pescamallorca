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
                </p>
                
                <form id="contact-form" class="row g-3" onsubmit="submitContactForm(event)">
                  <div class="col-md-6">
                    <label for="contact-name" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="contact-name" placeholder="Tu nombre" required>
                  </div>
                  <div class="col-md-6">
                    <label for="contact-lastname" class="form-label">Apellidos</label>
                    <input type="text" class="form-control" id="contact-lastname" placeholder="Tus apellidos" required>
                  </div>
                  <div class="col-md-6">
                    <label for="contact-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="contact-email" placeholder="nombre@ejemplo.com" required>
                  </div>
                  <div class="col-md-6">
                    <label for="contact-subject" class="form-label">Asunto</label>
                    <input type="text" class="form-control" id="contact-subject" placeholder="Tema del mensaje" required>
                  </div>
                  <div class="col-12">
                    <label for="contact-message" class="form-label">Mensaje</label>
                    <textarea class="form-control" id="contact-message" rows="5" placeholder="Escribe tu consulta aquí" required></textarea>
                  </div>
                  <div class="col-12 d-flex flex-column align-items-center">
                    <button type="submit" class="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"><i class="bi bi-send-fill me-2"></i> Enviar Mensaje</button>
                    <small id="contact-response" class="text-success mt-3" style="display:none;"></small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
};
