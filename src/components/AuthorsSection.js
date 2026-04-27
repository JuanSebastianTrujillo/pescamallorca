export const AuthorsSection = () => {
  return `
      <section id="autores" class="section team">
        <div class="container section-title" data-aos="fade-up">
          <h2>Transparencia y Autores</h2>
          <p>Conoce al equipo detrás de la plataforma y nuestros valores fundamentales.</p>
        </div>

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row mb-5">
            <div class="col-lg-10 mx-auto text-center">
              <h3 class="fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-book text-primary fs-2"></i> Manifiesto del Proyecto
              </h3>
              <p class="lead fst-italic text-muted" style="line-height: 1.8;">
                "Nuestra motivación principal detrás de esta Web-App es proporcionar a la comunidad 
                de pescadores de Mallorca una herramienta integral y moderna. Creemos firmemente en el fomento de una 
                <strong>pesca responsable y sostenible</strong>, apoyando la conservación de nuestro entorno marino 
                y el respeto por las normativas vigentes, para que las futuras generaciones también puedan disfrutar 
                de la riqueza de nuestras costas."
              </p>
            </div>
          </div>

          <div class="row gy-4 justify-content-center mt-5">
            <!-- Author Card 1 -->
            <div class="col-lg-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="100">
              <div class="card h-100 w-100 shadow-sm border-0 author-card text-center p-4 border-top border-primary border-4" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="card-body d-flex flex-column align-items-center">
                  <div class="mb-4">
                    <img src="assets/img/team/team-1.webp" class="rounded-circle shadow-sm" alt="Aaron Satyar Daghigh-Nia Tudor" style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;" onerror="this.src='https://ui-avatars.com/api/?name=Aaron+Satyar+Daghigh-Nia+Tudor&background=0d6efd&color=fff&size=120'">
                  </div>
                  <h4 class="fw-bold text-primary mb-1" style="font-size: 1.2rem;">Aaron Satyar Daghigh-Nia Tudor</h4>
                  <span class="text-muted d-block mb-3 fw-semibold small"><i class="bi bi-code-slash me-1"></i> Frontend</span>
                  <div class="d-flex justify-content-center gap-3 mt-auto">
                    <a href="https://github.com/AaronTudor-tester" target="_blank" class="text-secondary fs-5 text-decoration-none" aria-label="GitHub de Aaron Tudor" onmouseover="this.className='text-dark fs-5 text-decoration-none'" onmouseout="this.className='text-secondary fs-5 text-decoration-none'"><i class="bi bi-github"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Author Card 2 -->
            <div class="col-lg-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="200">
              <div class="card h-100 w-100 shadow-sm border-0 author-card text-center p-4 border-top border-success border-4" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="card-body d-flex flex-column align-items-center">
                  <div class="mb-4">
                    <img src="assets/img/team/team-2.webp" class="rounded-circle shadow-sm" alt="Jaume Juan Huguet" style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;" onerror="this.src='https://ui-avatars.com/api/?name=Jaume+Juan+Huguet&background=0d6efd&color=fff&size=120'">
                  </div>
                  <h4 class="fw-bold text-primary mb-1" style="font-size: 1.2rem;">Jaume Juan Huguet</h4>
                  <span class="text-muted d-block mb-3 fw-semibold small"><i class="bi bi-database me-1"></i> Data Engineer</span>
                  <div class="d-flex justify-content-center gap-3 mt-auto">
                    <a href="https://github.com/TheStargate" target="_blank" class="text-secondary fs-5 text-decoration-none" aria-label="GitHub de Jaume Juan" onmouseover="this.className='text-dark fs-5 text-decoration-none'" onmouseout="this.className='text-secondary fs-5 text-decoration-none'"><i class="bi bi-github"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Author Card 3 -->
            <div class="col-lg-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="300">
              <div class="card h-100 w-100 shadow-sm border-0 author-card text-center p-4 border-top border-warning border-4" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="card-body d-flex flex-column align-items-center">
                  <div class="mb-4">
                    <img src="assets/img/team/team-3.webp" class="rounded-circle shadow-sm" alt="Juan Sebastián Trujillo Gil" style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;" onerror="this.src='https://ui-avatars.com/api/?name=Juan+Sebasti%C3%A1n+Trujillo+Gil&background=0d6efd&color=fff&size=120'">
                  </div>
                  <h4 class="fw-bold text-primary mb-1" style="font-size: 1.2rem;">Juan Sebastián Trujillo Gil</h4>
                  <span class="text-muted d-block mb-3 fw-semibold small"><i class="bi bi-palette me-1"></i> Especialista UI/UX</span>
                  <div class="d-flex justify-content-center gap-3 mt-auto">
                    <a href="https://github.com/JuanSebastianTrujillo" target="_blank" class="text-secondary fs-5 text-decoration-none" aria-label="GitHub de Juan Sebastián" onmouseover="this.className='text-dark fs-5 text-decoration-none'" onmouseout="this.className='text-secondary fs-5 text-decoration-none'"><i class="bi bi-github"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Author Card 4 -->
            <div class="col-lg-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="400">
              <div class="card h-100 w-100 shadow-sm border-0 author-card text-center p-4 border-top border-danger border-4" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="card-body d-flex flex-column align-items-center">
                  <div class="mb-4">
                    <img src="assets/img/team/team-4.webp" class="rounded-circle shadow-sm" alt="Miquel Sansó Febrer" style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;" onerror="this.src='https://ui-avatars.com/api/?name=Miquel+Sans%C3%B3+Febrer&background=0d6efd&color=fff&size=120'">
                  </div>
                  <h4 class="fw-bold text-primary mb-1" style="font-size: 1.2rem;">Miquel Sansó Febrer</h4>
                  <span class="text-muted d-block mb-3 fw-semibold small"><i class="bi bi-server me-1"></i> Desarrollador Backend</span>
                  <div class="d-flex justify-content-center gap-3 mt-auto">
                    <a href="https://github.com/miquelsf" target="_blank" class="text-secondary fs-5 text-decoration-none" aria-label="GitHub de Miquel Sansó" onmouseover="this.className='text-dark fs-5 text-decoration-none'" onmouseout="this.className='text-secondary fs-5 text-decoration-none'"><i class="bi bi-github"></i></a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    `;
};
