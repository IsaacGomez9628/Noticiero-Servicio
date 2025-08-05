import "../css/app.css";
import axios from 'axios';

// ===== CONFIGURACIÓN DE AXIOS PARA ADMIN =====
// Configurar el token de admin si existe - ESTO ES CRÍTICO
const adminToken = localStorage.getItem('admin_token');
if (adminToken) {
    console.log('Token de admin encontrado, configurando axios...'); // DEBUG
    axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
}

// Configurar axios para incluir el token CSRF de Laravel
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar interceptor para manejar errores 401
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Si es una ruta de admin, redirigir al login de admin
            if (window.location.pathname.startsWith('/admin')) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                localStorage.removeItem('admin_permissions');
                window.location.href = '/admin/login';
            } else {
                // Si es una ruta normal, redirigir al login normal
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Exponer axios globalmente para debugging (SOLO EN DESARROLLO)
if (process.env.NODE_ENV === 'development') {
    window.axios = axios;
}
// ===== FIN DE CONFIGURACIÓN DE AXIOS =====

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createInertiaApp({
    title: (title) => `${title} CEATyCC`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        
        // DEBUG: Verificar qué páginas se están cargando
        console.log('Buscando página:', name);
        console.log('Páginas disponibles:', Object.keys(pages));
        console.log('Página encontrada:', page);
        
        if (!page) {
            throw new Error(`Página no encontrada: ${name}`);
        }
        
        // Manejar exports default vs named exports
        page.default.layout = page.default.layout || ((page) => page);
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});