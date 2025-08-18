// Services/locationService.js
import axios from 'axios';

const API_URL = '/admin/api/locations';

const locationService = {
    /**
     * Obtener datos para el formulario (estados y ciudades)
     */
    getFormData: async () => {
        try {
            const response = await axios.get(`${API_URL}/form-data`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener datos del formulario:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener todas las ubicaciones
     */
    getAllLocations: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ubicaciones:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener ubicaciones activas
     */
    getActiveLocations: async () => {
        try {
            const response = await axios.get(`${API_URL}/active`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ubicaciones activas:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener una ubicación por ID
     */
    getLocation: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Crear nueva ubicación
     */
    createLocation: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear ubicación:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Actualizar ubicación existente
     */
    updateLocation: async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar ubicación:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Eliminar ubicación
     */
    deleteLocation: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar ubicación:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Buscar ubicaciones
     */
    searchLocations: async (query) => {
        try {
            const response = await axios.get(`${API_URL}/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error al buscar ubicaciones:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener ubicaciones por ciudad
     */
    getLocationsByCity: async (cityId) => {
        try {
            const response = await axios.get(`${API_URL}/city/${cityId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ubicaciones por ciudad:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener ubicaciones por estado
     */
    getLocationsByState: async (stateId) => {
        try {
            const response = await axios.get(`${API_URL}/state/${stateId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ubicaciones por estado:', error);
            throw error.response?.data || error;
        }
    },

    /**
     * Validar coordenadas de Google Maps
     */
    validateGoogleMapsLink: (link) => {
        const googleMapsRegex = /^https?:\/\/(www\.)?maps\.google\.com\/.*/;
        return googleMapsRegex.test(link);
    },

    /**
     * Extraer coordenadas de un link de Google Maps
     */
    extractCoordinatesFromGoogleMaps: (link) => {
        // Intentar extraer coordenadas del formato @lat,lng
        const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
            return {
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2])
            };
        }
        return null;
    }
};

export default locationService;