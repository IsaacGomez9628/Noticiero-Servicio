import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = '/admin/api';

// Configurar interceptor para incluir el token CSRF
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const locationService = {
    /**
     * Obtener datos del formulario (estados y ciudades)
     */
    getFormData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations/form-data`);
            console.log('Form data response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting form data:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener ciudades por estado
     */
    getCitiesByEstate: async (estateId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations/cities/${estateId}`);
            console.log('Cities response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting cities:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener todas las ubicaciones con filtros
     */
    getLocations: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key] !== '' && filters[key] !== null) {
                    params.append(key, filters[key]);
                }
            });

            const response = await axios.get(`${API_BASE_URL}/locations?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error getting locations:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener una ubicación específica
     */
    getLocation: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting location:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Crear una nueva ubicación
     */
    createLocation: async (locationData) => {
        try {
            console.log('Creating location with data:', locationData);

            const response = await axios.post(`${API_BASE_URL}/locations`, locationData);

            console.log('Location created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating location:', error);

            // Si hay errores de validación, los devolvemos
            if (error.response?.status === 422) {
                throw {
                    status: 'error',
                    errors: error.response.data.errors,
                    message: error.response.data.message
                };
            }

            throw error.response?.data || error;
        }
    },

    /**
     * Actualizar una ubicación existente
     */
    updateLocation: async (id, locationData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/locations/${id}`, locationData);
            return response.data;
        } catch (error) {
            console.error('Error updating location:', error);

            if (error.response?.status === 422) {
                throw {
                    status: 'error',
                    errors: error.response.data.errors,
                    message: error.response.data.message
                };
            }

            throw error.response?.data || error;
        }
    },

    /**
     * Cambiar el estado activo/inactivo de una ubicación
     */
    toggleLocationStatus: async (id) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/locations/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            console.error('Error toggling location status:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Eliminar una ubicación
     */
    deleteLocation: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/locations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Verificar si una ubicación tiene eventos asociados
     */
    checkLocationEvents: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations/${id}/events`);
            return response.data;
        } catch (error) {
            console.error('Error checking location events:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Buscar ubicaciones (para autocompletado)
     */
    searchLocations: async (query) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching locations:', error);
            throw error.response?.data || error;
        }
    }
};

export default locationService;