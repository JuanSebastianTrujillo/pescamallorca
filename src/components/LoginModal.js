import { AuthService } from "../services/AuthService.js";

export const LoginModal = () => {
    return `
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-0 pb-0">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-5 pt-0 text-center">
            <div class="mb-4">
                <i class="bi bi-person-circle text-primary" style="font-size: 4rem;"></i>
            </div>
            <h3 class="fw-bold mb-3">Bienvenido a Pesca Mallorca</h3>
            <p class="text-muted mb-4">Accede para participar en nuestra comunidad.</p>
            
            <div class="d-grid gap-3">
                <!-- Google Sign-In Button Container -->
                <div id="google-signin-container" class="d-flex justify-content-center">
                    <div id="g_id_onload"
                        data-client_id="686646751258-vnjbg6qkcckmvql6jeuvf1ov06pgkj83.apps.googleusercontent.com"
                        data-callback="handleGoogleSignIn"
                        data-auto_prompt="false">
                    </div>
                    <div class="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="signin_with" data-shape="pill" data-logo_alignment="left"></div>
                </div>

                <div class="divider d-flex align-items-center my-2">
                    <hr class="flex-grow-1">
                    <span class="mx-2 text-muted small">O TAMBIÉN</span>
                    <hr class="flex-grow-1">
                </div>

                <button class="btn btn-outline-secondary btn-lg rounded-pill d-flex align-items-center justify-content-center py-2" onclick="window.mockLogin(); bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();">
                    <i class="bi bi-person-badge me-2"></i> Entrar como Pescador Anónimo
                </button>
            </div>
            
            <p class="mt-4 small text-muted">Al iniciar sesión, aceptas nuestra política de privacidad y términos de uso.</p>
          </div>
        </div>
      </div>
    </div>
    `;
};

export const initLoginModal = () => {
    // Escuchar el evento de cambio de autenticación para cerrar el modal si se inicia sesión
    window.addEventListener('auth-change', (e) => {
        const user = e.detail;
        if (user) {
            const modalEl = document.getElementById('loginModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
        }

        // Refrescar contenido de otros modales si están abiertos
        if (window.renderSpotComments && window.currentSpotIndex !== undefined) {
            const spotName = window.globalZonesData[window.currentSpotIndex]?.name;
            if (spotName) window.renderSpotComments(spotName);
        }

        const shopModal = document.getElementById('shopModal');
        if (shopModal && shopModal.classList.contains('show')) {
            // Buscar el ID de la tienda actual (está en el ID del contenedor de reviews)
            const reviewsContainer = shopModal.querySelector('[id^="shopReviewsList_"]');
            if (reviewsContainer) {
                const storeId = reviewsContainer.id.split('_')[1];
                if (window.renderShopReviews) window.renderShopReviews(parseInt(storeId));
            }
        }
    });

    // Asegurar que el botón de Google se renderice si se abre el modal
    const modalEl = document.getElementById('loginModal');
    if (modalEl && !modalEl.dataset.listenerAttached) {
        modalEl.dataset.listenerAttached = "true";

        // Inicializar Google una sola vez al cargar el componente
        if (window.google && window.google.accounts && window.google.accounts.id && !window.gsiInitialized) {
            google.accounts.id.initialize({
                client_id: "686646751258-vnjbg6qkcckmvql6jeuvf1ov06pgkj83.apps.googleusercontent.com",
                callback: window.handleGoogleSignIn
            });
            window.gsiInitialized = true;
        }

        modalEl.addEventListener('shown.bs.modal', () => {
            if (window.google && window.google.accounts && window.google.accounts.id) {
                const btnContainer = document.querySelector('.g_id_signin');
                if (btnContainer) {
                    google.accounts.id.renderButton(btnContainer, {
                        type: "standard",
                        size: "large",
                        theme: "outline",
                        text: "signin_with",
                        shape: "pill",
                        logo_alignment: "left"
                    });
                }
            }
        });
    }
};
