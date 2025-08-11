import axios from 'axios';

const adminUserService = {
    /**
     * Obtener lista de usuarios con filtros y paginación
     */
    getUsers: async (params = {}) => {
        try {
            const response = await axios.get('/admin/api/users', { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    /**
     * Obtener un usuario específico
     */
    getUser: async (userId) => {
        try {
            const response = await axios.get(`/admin/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    },

    /**
     * Crear nuevo usuario
     */
    createUser: async (userData) => {
        try {
            const response = await axios.post('/admin/api/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            // Si hay errores de validación, los propagamos
            if (error.response?.status === 422) {
                throw error.response.data;
            }
            throw error;
        }
    },

    /**
     * Actualizar usuario existente
     */
    updateUser: async (userId, userData) => {
        try {
            const response = await axios.put(`/admin/api/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            if (error.response?.status === 422) {
                throw error.response.data;
            }
            throw error;
        }
    },

    /**
     * Eliminar usuario
     */
    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(`/admin/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    },

    /**
     * Cambiar estado del usuario (bloquear/desbloquear)
     */
    toggleUserStatus: async (userId) => {
        try {
            const response = await axios.patch(`/admin/api/users/${userId}/toggle-status`);
            return response.data;
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error);
            throw error;
        }
    },

    /**
     * Restablecer contraseña del usuario
     */
    resetUserPassword: async (userId, passwordData) => {
        try {
            const response = await axios.post(`/admin/api/users/${userId}/reset-password`, passwordData);
            return response.data;
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            if (error.response?.status === 422) {
                throw error.response.data;
            }
            throw error;
        }
    },

    /**
     * Exportar usuarios (cuando lo implementes)
     */
    exportUsers: async (params = {}) => {
        try {
            const response = await axios.get('/admin/api/users/export', {
                params,
                responseType: 'blob' // Para descargar archivo
            });

            // Crear un enlace de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return { status: 'success', message: 'Exportación completada' };
        } catch (error) {
            console.error('Error al exportar usuarios:', error);
            throw error;
        }
    },

    /**
     * Buscar usuarios por término
     */
    searchUsers: async (searchTerm) => {
        try {
            const response = await axios.get('/admin/api/users', {
                params: { search: searchTerm, per_page: 10 }
            });
            return response.data.users.data; // Acceder correctamente a los datos
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas de usuarios
     */
    getUserStats: async () => {
        try {
            const response = await axios.get('/admin/api/stats/users');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    },

    /**
     * Verificar email del usuario
     */
    verifyUserEmail: async (userId) => {
        try {
            const response = await axios.post(`/admin/api/users/${userId}/verify-email`);
            return response.data;
        } catch (error) {
            console.error('Error al verificar email:', error);
            throw error;
        }
    },

    /**
     * Obtener historial de actividad del usuario
     */
    getUserActivity: async (userId, params = {}) => {
        try {
            const response = await axios.get(`/admin/api/users/${userId}/activity`, { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener actividad del usuario:', error);
            throw error;
        }
    },

    /**
     * Buscar usuarios para autocompletado
     */
    autocompleteUsers: async (query) => {
        try {
            const response = await axios.get('/admin/api/users', {
                params: {
                    search: query,
                    per_page: 5,
                    fields: 'id,email,full_name' // Solo campos necesarios
                }
            });
            return response.data.users.data.map(user => ({
                value: user.id,
                label: `${user.full_name} (${user.email})`
            }));
        } catch (error) {
            console.error('Error en autocompletado de usuarios:', error);
            throw error;
        }
    }
};

// Función helper para manejar errores de validación
export const handleValidationErrors = (error, setErrors) => {
    if (error.errors) {
        const formattedErrors = {};
        Object.keys(error.errors).forEach(key => {
            formattedErrors[key] = error.errors[key][0]; // Tomar el primer error de cada campo
        });
        setErrors(formattedErrors);
    }
};

// Función helper para formatear mensajes de error
export const formatErrorMessage = (error) => {
    if (error.response) {
        // Error de respuesta del servidor
        if (error.response.data.message) {
            return error.response.data.message;
        } else if (error.response.data.error) {
            return error.response.data.error;
        } else if (error.response.status === 404) {
            return 'Recurso no encontrado';
        } else if (error.response.status === 403) {
            return 'No tienes permisos para realizar esta acción';
        } else if (error.response.status === 401) {
            return 'No estás autenticado';
        } else if (error.response.status === 500) {
            return 'Error interno del servidor';
        }
    } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        return 'No se pudo conectar con el servidor';
    }
    // Algo más pasó
    return 'Ha ocurrido un error inesperado';
};

// Función helper para mostrar notificaciones
export const showNotification = (type, message) => {
    // Aquí puedes integrar tu sistema de notificaciones
    // Por ejemplo, con react-toastify o un sistema personalizado
    switch (type) {
        case 'success':
            console.log('✅', message);
            // toast.success(message);
            break;
        case 'error':
            console.error('❌', message);
            // toast.error(message);
            break;
        case 'info':
            console.info('ℹ️', message);
            // toast.info(message);
            break;
        case 'warning':
            console.warn('⚠️', message);
            // toast.warning(message);
            break;
        default:
            console.log(message);
    }
};

// Función helper para formatear fechas
export const formatDate = (date, format = 'DD/MM/YYYY') => {
    if (!date) return '';

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'DD/MM/YYYY HH:mm':
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        default:
            return date;
    }
};

export default adminUserService;