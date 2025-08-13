import axios from 'axios';

const API_BASE = '/admin/api';

const adminEventService = {
    // Obtener lista de eventos con filtros
    getEvents: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE}/events`, { params });
            return response.data;
        } catch (error) {
            console.error('Error getting events:', error);
            throw error.response?.data || error;
        }
    },

    // Obtener un evento específico
    getEvent: async (id) => {
        try {
            const response = await axios.get(`${API_BASE}/events/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting event:', error);
            throw error.response?.data || error;
        }
    },

    // Crear nuevo evento
    createEvent: async (data) => {
        try {
            const response = await axios.post(`${API_BASE}/events`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating event:', error);
            if (error.response?.status === 422) {
                // Error de validación
                throw error.response.data;
            }
            throw error.response?.data || error;
        }
    },

    // Actualizar evento
    updateEvent: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE}/events/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error.response?.data || error;
        }
    },

    // Eliminar evento
    deleteEvent: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE}/events/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error.response?.data || error;
        }
    },

    // Cambiar estado del evento
    toggleEventStatus: async (id) => {
        try {
            const response = await axios.patch(`${API_BASE}/events/${id}/toggle-status`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error toggling event status:', error);
            throw error.response?.data || error;
        }
    },

    // Obtener estadísticas de eventos
    getEventStats: async () => {
        try {
            const response = await axios.get(`${API_BASE}/stats/events`);
            return response.data;
        } catch (error) {
            console.error('Error getting event stats:', error);
            throw error.response?.data || error;
        }
    },

    // Exportar eventos (si necesitas esta funcionalidad)
    exportEvents: async (format = 'excel') => {
        try {
            const response = await axios.get(`${API_BASE}/events/export`, {
                params: { format },
                responseType: 'blob'
            });

            // Crear un enlace para descargar
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `eventos_${new Date().toISOString()}.${format === 'excel' ? 'xlsx' : 'csv'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return { status: 'success', message: 'Archivo descargado exitosamente' };
        } catch (error) {
            console.error('Error exporting events:', error);
            throw error.response?.data || error;
        }
    }
};

export default adminEventService;