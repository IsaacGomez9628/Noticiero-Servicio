// En resources/js/Services/AuthService.js
import axios from 'axios';

class AuthService {
    constructor() {
        this.baseUrl = '/admin';
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Interceptor para depuración de tokens
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('admin_token');
                console.log('Solicitud saliente:', {
                    url: config.url,
                    tieneToken: !!token
                });
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async login(credentials) {
        try {
            console.log('Intentando iniciar sesión con:', credentials.email);
            const response = await axios.post(`${this.baseUrl}/login`, credentials);

            if (response.data.status === 'success' && response.data.token) {
                // Guardar token y datos
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_data', JSON.stringify(response.data.admin));

                if (response.data.permissions) {
                    localStorage.setItem('admin_permissions', JSON.stringify(response.data.permissions));
                }

                console.log('Login exitoso, token guardado en localStorage');
                return true;
            } else {
                console.error('Respuesta de login sin token:', response.data);
                return false;
            }
        } catch (error) {
            console.error('Error en login:', error.response?.data || error);
            throw error;
        }
    }

    async logout() {
        try {
            // Obtener token actual
            const token = localStorage.getItem('admin_token');

            if (token) {
                // Configurar headers
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Llamar al endpoint de logout
                await axios.post(`${this.baseUrl}/logout`, {}, config);
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar localStorage independientemente de si la petición tuvo éxito
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
            localStorage.removeItem('admin_permissions');

            // Redirigir a la página de login
            window.location.href = '/admin/login';
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('admin_token');
    }

    getAdminData() {
        const adminData = localStorage.getItem('admin_data');
        return adminData ? JSON.parse(adminData) : null;
    }

    getPermissions() {
        const permissions = localStorage.getItem('admin_permissions');
        return permissions ? JSON.parse(permissions) : [];
    }
}

// Exportar una instancia única del servicio
const authService = new AuthService();
export default authService;