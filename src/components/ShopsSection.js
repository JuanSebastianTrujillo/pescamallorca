export const ShopsSection = () => {
    return `
      <!-- Shops Section -->
      <section id="tiendas" class="section light-background">
        <div class="container section-title" data-aos="fade-up">
          <h2>Directorio de Tiendas</h2>
          <p>Encuentra tu proveedor de aparejos, cebo vivo y repuestos náuticos más cercano.</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
           <!-- Filter Component -->
           <div class="row justify-content-center mb-5">
              <div class="col-lg-6 col-md-8">
                 <select id="shops-filter-select" class="form-select form-select-lg shadow-sm border-0 text-primary fw-bold cursor-pointer text-center" aria-label="Filtrar por especialidad">
                    <option value="all">Todas las especialidades</option>
                    <option value="cebo-vivo">Cebo Vivo</option>
                    <option value="jigging-vertical">Jigging/Vertical</option>
                    <option value="spinning-rockfishing">Spinning/Rockfishing</option>
                    <option value="pesca-submarina">Pesca Submarina</option>
                    <option value="nautica-electronica">Náutica y Electrónica</option>
                 </select>
              </div>
           </div>

           <!-- Shops Container -->
           <div class="row gy-4" id="shops-container">
              <!-- Shops will be populated here dynamically -->
           </div>
        </div>
      </section>
    `;
};

const storeTags = {
    'cebo-vivo': 'Cebo vivo',
    'jigging-vertical': 'Jigging/Vertical',
    'spinning-rockfishing': 'Spinning/Rockfishing',
    'pesca-submarina': 'Pesca Submarina',
    'nautica-electronica': 'Náutica y Electrónica'
};

const stores = [
  {
    name: "Ca'n Sion Palma",
    address: "Carrer del Banc de l'Oli, Palma",
    category: ["cebo-vivo"]
  },
  {
    name: "Casa Calicó Portixol",
    address: "Passeig Bartomeu Barceló, Palma",
    category: ["jigging-vertical", "spinning-rockfishing"]
  },
  {
    name: "Esports de Mar",
    address: "Carrer de la Mar, Alcúdia",
    category: ["nautica-electronica", "pesca-submarina"]
  },
  {
    name: "Armería y Pesca Perelló",
    address: "Avinguda Gabriel Roca, Andratx",
    category: ["spinning-rockfishing", "cebo-vivo"]
  },
  {
    name: "Diving Center Llevant",
    address: "Passeig Marítim, Manacor",
    category: ["pesca-submarina"]
  }
];

export const initShops = () => {
    const filterSelect = document.getElementById("shops-filter-select");
    const container = document.getElementById("shops-container");
    
    if(!filterSelect || !container) return;

    const renderShops = (filterCategory) => {
        const filteredStores = filterCategory === 'all' 
            ? stores 
            : stores.filter(store => store.category.includes(filterCategory));

        if (filteredStores.length === 0) {
            container.innerHTML = `
              <div class="col-12 text-center py-5">
                 <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                 <h5 class="text-secondary">No se han encontrado tiendas con esta especialidad en esta zona</h5>
              </div>
            `;
            return;
        }

        let html = '';
        filteredStores.forEach(store => {
            const badgesHtml = store.category.map(cat => 
                `<span class="badge bg-success me-1 my-1">${storeTags[cat] || cat}</span>`
            ).join('');

            html += `
              <div class="col-md-6">
                 <div class="card p-3 border-0 shadow d-flex flex-row align-items-center h-100">
                   <div class="bg-primary text-white p-3 rounded-circle me-3 flex-shrink-0"><i class="bi bi-shop fs-3"></i></div>
                   <div class="flex-grow-1">
                       <div class="d-flex justify-content-between align-items-start">
                           <div>
                               <h5 class="mb-1 text-primary fw-bold">${store.name}</h5>
                               <p class="mb-2 text-muted small"><i class="bi bi-geo-fill text-danger"></i> ${store.address}</p>
                           </div>
                           <a href="#mapa" class="btn btn-outline-primary btn-sm rounded-pill ms-2 shadow-sm text-nowrap"><i class="bi bi-map me-1"></i>Mapa</a>
                       </div>
                       <div class="d-flex flex-wrap">
                          ${badgesHtml}
                       </div>
                   </div>
                 </div>
              </div>
            `;
        });

        container.innerHTML = html;
    };

    filterSelect.addEventListener("change", (e) => {
        renderShops(e.target.value);
    });

    // Initial render
    renderShops('all');
};
