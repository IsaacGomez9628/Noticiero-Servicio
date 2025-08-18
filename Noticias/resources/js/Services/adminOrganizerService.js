import axios from 'axios';

class AdminOrganizerService {
    constructor() {
        this.baseURL = '/admin/api/organizers';
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Configurar token de autenticación si existe
        const token = localStorage.getItem('admin_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Interceptor para manejar errores
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    // Token expirado o no válido
                    localStorage.removeItem('admin_token');
                    window.location.href = '/admin/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Obtener lista de organizadores con filtros
    async getOrganizers(params = {}) {
        try {
            const response = await axios.get(this.baseURL, { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener organizadores:', error);
            throw error;
        }
    }

    // Obtener un organizador específico
    async getOrganizer(id) {
        try {
            const response = await axios.get(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener organizador:', error);
            throw error;
        }
    }

    // Crear nuevo organizador
    async createOrganizer(data) {
        try {
            const formData = this.prepareFormData(data);
            const response = await axios.post(this.baseURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear organizador:', error);
            throw error;
        }
    }

    // Actualizar organizador
    async updateOrganizer(id, data) {
        try {
            const formData = this.prepareFormData(data);
            formData.append('_method', 'PUT');

            const response = await axios.post(`${this.baseURL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar organizador:', error);
            throw error;
        }
    }

    // Eliminar organizador
    async deleteOrganizer(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar organizador:', error);
            throw error;
        }
    }

    // Toggle estado activo/inactivo
    async toggleStatus(id) {
        try {
            const response = await axios.patch(`${this.baseURL}/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            throw error;
        }
    }

    // Obtener estadísticas
    async getStats() {
        try {
            const response = await axios.get('/admin/api/stats/organizers');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    // Preparar FormData para envío
    prepareFormData(data) {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === 'logo' && data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else if (typeof data[key] === 'boolean') {
                    formData.append(key, data[key] ? '1' : '0');
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        return formData;
    }

    // Buscar organizadores
    async searchOrganizers(query) {
        try {
            const response = await axios.get(this.baseURL, {
                params: { search: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error al buscar organizadores:', error);
            throw error;
        }
    }

    // Exportar organizadores
    async exportOrganizers(format = 'csv') {
        try {
            const response = await axios.get(`${this.baseURL}/export`, {
                params: { format },
                responseType: 'blob'
            });

            // Crear link de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `organizadores_${new Date().toISOString()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return true;
        } catch (error) {
            console.error('Error al exportar organizadores:', error);
            throw error;
        }
    }
}

export default new AdminOrganizerService();