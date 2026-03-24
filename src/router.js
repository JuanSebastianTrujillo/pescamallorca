import { HomeView } from "./views/HomeView.js";
import { SpotsView } from "./views/SpotsView.js";

const routes = {
    '/': HomeView,
    '/zonas': SpotsView,
};

export const router = async () => {
    const mainContainer = document.getElementById("main-content");

    // Buscamos la ruta actual en el path
    let path = window.location.pathname;
    
    // Fallback: si no es / ni /zonas, redirigimos temporalmente a /
    let view = routes[path];
    if (!view) {
        view = routes['/'];
        path = '/';
        history.replaceState(null, null, '/'); // Reset clean path
    }

    // Ejecutar la función de la vista para obtener el HTML
    const html = await view();

    // Actualizamos el contenedor principal
    if(mainContainer) {
        mainContainer.innerHTML = html;
        window.scrollTo(0, 0); // Ir al inicio del DOM
        
        // Si estamos en Spots, lanzar un evento para cargar los datos dinámicamente
        if (path === '/zonas') {
            document.dispatchEvent(new Event('spotsViewLoaded'));
        }
    }
};

// Configurar los enlaces para que utilicen History API
export const pushToRoute = (e) => {
    // Escuchar cualquier click
    if (e.target.matches("[data-link]") || e.target.closest("[data-link]")) {
        e.preventDefault();
        const aTag = e.target.closest("a");
        history.pushState(null, null, aTag.href);
        router();
    }
};
