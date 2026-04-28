/**
 * AuthService handles user authentication via Google Identity Services.
 */
export const AuthService = {
    _user: null,

    init() {
        // Load user from localStorage if available
        const savedUser = localStorage.getItem('pm_user');
        if (savedUser) {
            this._user = JSON.parse(savedUser);
        }

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.handleGoogleSignIn = (response) => {
            const payload = this.decodeJwt(response.credential);
            this._user = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            };
            localStorage.setItem('pm_user', JSON.stringify(this._user));
            window.dispatchEvent(new CustomEvent('auth-change', { detail: this._user }));
            this.updateHeaderUI();
        };
    },

    decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error decoding JWT', e);
            return null;
        }
    },

    getUser() {
        return this._user;
    },

    isLoggedIn() {
        return !!this._user;
    },

    logout() {
        this._user = null;
        localStorage.removeItem('pm_user');
        window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
        this.updateHeaderUI();
    },

    updateHeaderUI() {
        const containers = [document.getElementById('auth-container'), document.getElementById('auth-container-mobile')];
        const user = this.getUser();

        containers.forEach(container => {
            if (!container) return;
            if (this.isLoggedIn()) {
                container.innerHTML = `
                    <div class="dropdown">
                        <button class="btn btn-sm ${container.id === 'auth-container' ? 'btn-light' : 'btn-outline-primary'} rounded-pill d-flex align-items-center px-2 pe-3 text-nowrap dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <img src="${user.picture}" class="rounded-circle me-2" style="width: 24px; height: 24px;">
                            <span class="${container.id === 'auth-container' ? 'd-none d-lg-inline' : ''}">${user.name.split(' ')[0]}</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><h6 class="dropdown-header">${user.email}</h6></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item text-danger" onclick="AuthService.logout()"><i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión</button></li>
                        </ul>
                    </div>
                `;
            } else {
                if (container.id === 'auth-container') {
                    container.innerHTML = `
                        <a href="#login" class="btn btn-sm btn-light rounded-pill d-flex align-items-center px-3 text-nowrap" style="font-weight: 500;" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <i class="bi bi-person-circle fs-6 me-2"></i> Iniciar sesión
                        </a>
                    `;
                } else {
                    container.innerHTML = `
                        <a href="#login" class="btn btn-primary rounded-pill d-flex justify-content-center align-items-center w-100 mb-3" style="color: white; padding: 10px;" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <i class="bi bi-person-circle fs-5 me-2"></i> Iniciar sesión
                        </a>
                    `;
                }
            }
        });
    },

    mockLogin() {
        const mockUser = {
            id: 'mock-' + Math.random().toString(36).substr(2, 9),
            name: 'Pescador Anónimo',
            email: 'anonimo@pescamallorca.online',
            picture: 'https://i.pravatar.cc/150?u=demo'
        };
        this._user = mockUser;
        localStorage.setItem('pm_user', JSON.stringify(this._user));
        window.dispatchEvent(new CustomEvent('auth-change', { detail: this._user }));
        this.updateHeaderUI();
    }
};

window.AuthService = AuthService;
window.mockLogin = () => AuthService.mockLogin();
