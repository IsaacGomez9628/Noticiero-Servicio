import axios from 'axios';

class UserService {
    constructor() {
        this.baseUrl = '/admin';
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Interceptor para añadir el token a todas las solicitudes
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('admin_token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para manejar errores de respuesta (como token expirado)
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Si el token ha expirado o es inválido, redirigir al login
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_data');
                    localStorage.removeItem('admin_permissions');

                    // Solo redirigir si no estamos ya en la página de login
                    if (!window.location.pathname.includes('/admin/login')) {
                        window.location.href = '/admin/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    async getUsers() {
        try {
            const response = await axios.get(`${this.baseUrl}/users/list`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    async getUser(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const response = await axios.post(`${this.baseUrl}/users`, userData);
            return response.data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await axios.put(`${this.baseUrl}/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${id}:`, error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const response = await axios.delete(`${this.baseUrl}/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
            throw error;
        }
    }

    async getRoles() {
        try {
            const response = await axios.get(`${this.baseUrl}/roles`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener roles:', error);
            throw error;
        }
    }

    async getUserStatuses() {
        try {
            const response = await axios.get(`${this.baseUrl}/statuses/user`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estados de usuarios:', error);
            throw error;
        }
    }

    // Método para verificar permisos del usuario actual
    async checkPermission(permission) {
        try {
            const adminData = JSON.parse(localStorage.getItem('admin_data'));
            const permissions = JSON.parse(localStorage.getItem('admin_permissions'));

            if (!permissions) {
                return false;
            }

            return permissions.includes(permission);
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            return false;
        }
    }
}

// Exportar una instancia única del servicio
const userService = new UserService();
export default userService;