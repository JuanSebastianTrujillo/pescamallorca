export const VoiceHelpModal = () => {
    return `
    <div class="modal fade" id="voiceHelpModal" tabindex="-1" aria-labelledby="voiceHelpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 1.5rem; overflow: hidden;">
                <div class="modal-header bg-primary text-white py-4 px-4">
                    <h2 class="modal-title fs-4 fw-bold mb-0" id="voiceHelpModalLabel">
                        <i class="bi bi-mic-fill me-2"></i> Asistente de Voz: Comandos Disponibles
                    </h2>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body p-4 p-md-5">
                    <p class="text-secondary mb-4">Puedes interactuar con la aplicación usando tu voz. Aquí tienes algunos ejemplos de lo que puedes decir:</p>
                    
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card h-100 border-light-subtle bg-light">
                                <div class="card-body">
                                    <h3 class="fs-6 fw-bold text-primary mb-3"><i class="bi bi-compass me-2"></i> Navegación</h3>
                                    <ul class="list-unstyled mb-0" style="font-size: 0.95rem;">
                                        <li class="mb-2"><code>"Ir a peces"</code>, <code>"Zonas"</code>, <code>"Mapa"</code></li>
                                        <li class="mb-2"><code>"Tiendas"</code>, <code>"Rampas"</code>, <code>"Tiempo"</code></li>
                                        <li><code>"Ir al Quiz"</code> o <code>"Normas"</code></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="card h-100 border-light-subtle bg-light">
                                <div class="card-body">
                                    <h3 class="fs-6 fw-bold text-success mb-3"><i class="bi bi-search me-2"></i> Búsqueda y Detalle</h3>
                                    <ul class="list-unstyled mb-0" style="font-size: 0.95rem;">
                                        <li class="mb-2"><code>"Buscar dorada"</code> - Filtra la lista.</li>
                                        <li class="mb-2"><code>"Ver Dorada"</code> - Abre la ficha técnica.</li>
                                        <li class="mb-2"><code>"Ver Cala Figuera"</code> - Abre la zona.</li>
                                        <li><code>"Cerrar"</code> o <code>"Salir"</code> - Cierra ventanas.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card h-100 border-light-subtle bg-light">
                                <div class="card-body">
                                    <h3 class="fs-6 fw-bold text-warning mb-3"><i class="bi bi-volume-up me-2"></i> Multimedia</h3>
                                    <ul class="list-unstyled mb-0" style="font-size: 0.95rem;">
                                        <li class="mb-2"><code>"Reproduce sonido de dorada"</code></li>
                                        <li class="mb-2"><code>"Parar lectura"</code> - Detiene la voz o audio.</li>
                                        <li><code>"Silencio"</code> - Ataja cualquier sonido.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card h-100 border-light-subtle bg-light">
                                <div class="card-body">
                                    <h3 class="fs-6 fw-bold text-info mb-3"><i class="bi bi-person-wheelchair me-2"></i> Accesibilidad</h3>
                                    <ul class="list-unstyled mb-0" style="font-size: 0.95rem;">
                                        <li class="mb-2"><code>"Activar alto contraste"</code></li>
                                        <li class="mb-2"><code>"Quitar alto contraste"</code></li>
                                        <li><code>"Ayuda"</code> - Muestra este panel.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-light border-0 py-3">
                    <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Entendido</button>
                </div>
            </div>
        </div>
    </div>
    `;
};
