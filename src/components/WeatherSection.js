export const WeatherSection = () => {
    return `
      <!-- Weather Section -->
      <section id="meteo" class="section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Parte Meteorológico</h2>
          <p>Estado del mar, vientos y mareas para planificar tu próxima salida de pesca.</p>
        </div>
        <div class="container text-center" data-aos="fade-up" data-aos-delay="100">
           <div class="row justify-content-center">
             <div class="col-lg-8">
               <div class="card p-4 border-0 shadow-sm bg-light">
                 <h4 class="mb-4">Bahía de Palma - <span class="text-primary">Previsión Actual</span></h4>
                 <div class="d-flex justify-content-center gap-5 fs-5">
                    <div>
                        <i class="bi bi-wind fs-1 text-info"></i><br>
                        <strong>15 nudos</strong> (NE)
                    </div>
                    <div>
                        <i class="bi bi-water fs-1 text-primary"></i><br>
                        <strong>Rizado</strong> (0.3m)
                    </div>
                    <div>
                        <i class="bi bi-thermometer-half fs-1 text-danger"></i><br>
                        <strong>22°C</strong>
                    </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>
    `;
};
