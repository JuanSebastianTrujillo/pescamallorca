export const ShopsSection = () => {
    return `
      <!-- Shops Section -->
      <section id="tiendas" class="section light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Directorio de Tiendas</h2>
          <p>Encuentra tu proveedor de aparejos, cebo vivo y repuestos náuticos más cercano.</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
           <div class="row gy-4">
              <!-- Tienda 1 -->
              <div class="col-md-6">
                <div class="card p-3 border-0 shadow d-flex flex-row align-items-center">
                   <div class="bg-primary text-white p-3 rounded-circle me-3"><i class="bi bi-shop fs-3"></i></div>
                   <div>
                       <h5 class="mb-1">Ca'n Sion Palma</h5>
                       <p class="mb-1 text-muted small"><i class="bi bi-geo-fill"></i> Carrer del Banc de l'Oli, Palma</p>
                       <span class="badge bg-success">Cebo vivo</span>
                   </div>
                </div>
              </div>
              
              <!-- Tienda 2 -->
              <div class="col-md-6">
                 <div class="card p-3 border-0 shadow d-flex flex-row align-items-center">
                   <div class="bg-primary text-white p-3 rounded-circle me-3"><i class="bi bi-shop fs-3"></i></div>
                   <div>
                       <h5 class="mb-1">Casa Calicó Portixol</h5>
                       <p class="mb-1 text-muted small"><i class="bi bi-geo-fill"></i> Passeig Bartomeu Barceló, Palma</p>
                       <span class="badge bg-success">Jigging</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>
    `;
};
