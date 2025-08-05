import React, { useState, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminUserService from '../../../Services/adminUserService';
import debounce from 'lodash/debounce';
import axios from 'axios';

// Función temporal para notificaciones (puedes reemplazar con tu sistema de notificaciones)
const showNotification = (type, message) => {
    // Por ahora usamos alert, pero puedes integrar react-toastify o similar
    if (type === 'error') {
        alert(`Error: ${message}`);
    } else {
        alert(message);
    }
};

const UsersIndex = ({ users: initialUsers, filters: initialFilters, roles }) => {
    console.log('Props iniciales:', { initialUsers, initialFilters, roles }); // DEBUG
    
    // Estados
    const [users, setUsers] = useState(initialUsers || { data: [], current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        role_id: '',
        active: '',
        account_type: '',
        per_page: 10,
        page: 1
    });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [userToResetPassword, setUserToResetPassword] = useState(null);
    const [passwordData, setPasswordData] = useState({ new_password: '', new_password_confirmation: '' });

    // Cargar usuarios
    const loadUsers = async (params = filters) => {
        setLoading(true);
        try {
            console.log('Cargando usuarios con params:', params); // DEBUG
            
            // Usar la nueva URL de API
            const response = await axios.get('/admin/api/users', { 
                params,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            console.log('Respuesta del servidor:', response.data); // DEBUG
            
            // Verificar la estructura de la respuesta
            if (response.data.users) {
                setUsers(response.data.users);
            } else if (response.data.data) {
                // Si la respuesta viene directamente como paginación
                setUsers(response.data);
            } else {
                console.error('Estructura de respuesta no reconocida:', response.data);
                setUsers({ data: [], current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            showNotification('error', 'Error al cargar usuarios');
            // En caso de error, mantener estructura vacía
            setUsers({ data: [], current_page: 1, last_page: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda con debounce
    const debouncedLoadUsers = useCallback(
        debounce((params) => {
            loadUsers(params);
        }, 500),
        []
    );

    // Manejar cambios en filtros
    const handleFilterChange = (key, value) => {
        console.log('Cambiando filtro:', key, value); // DEBUG
        
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        
        // Siempre usar debouncedLoadUsers para evitar muchas peticiones
        debouncedLoadUsers(newFilters);
    };

    // Cambiar página
    const handlePageChange = (page) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        loadUsers(newFilters);
    };

    // Toggle estado usuario
    const handleToggleStatus = async (userId) => {
        const user = users.data.find(u => u.id === userId);
        const action = user?.status?.blocked ? 'desbloquear' : 'bloquear';
        
        if (confirm(`¿Estás seguro de que quieres ${action} a este usuario?`)) {
            try {
                const response = await adminUserService.toggleUserStatus(userId);
                showNotification('success', response.message || 'Estado actualizado');
                loadUsers(); // Recargar lista
            } catch (error) {
                showNotification('error', 'Error al cambiar estado del usuario');
            }
        }
    };

    // Eliminar usuario
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            const response = await adminUserService.deleteUser(userToDelete.id);
            showNotification('success', response.message || 'Usuario eliminado');
            setShowDeleteModal(false);
            setUserToDelete(null);
            loadUsers(); // Recargar lista
        } catch (error) {
            showNotification('error', error.response?.data?.message || 'Error al eliminar usuario');
        }
    };

    // Reset password
    const handleResetPassword = async () => {
        if (!userToResetPassword) return;
        
        try {
            const response = await adminUserService.resetUserPassword(userToResetPassword.id, passwordData);
            showNotification('success', response.message || 'Contraseña restablecida');
            setShowResetPasswordModal(false);
            setUserToResetPassword(null);
            setPasswordData({ new_password: '', new_password_confirmation: '' });
        } catch (error) {
            showNotification('error', error.response?.data?.message || 'Error al restablecer contraseña');
        }
    };

    // Seleccionar todos
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.data.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    // Seleccionar usuario individual
    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    // Función para limpiar filtros y recargar
    const clearFiltersAndReload = () => {
        console.log('Limpiando todos los filtros...'); // DEBUG
        const resetFilters = {
            search: '',
            role_id: '',
            active: '',
            account_type: '',
            per_page: 10,
            page: 1
        };
        
        // Cancelar cualquier debounce pendiente
        if (debouncedLoadUsers) {
            debouncedLoadUsers.cancel();
        }
        
        // Actualizar estado de filtros
        setFilters(resetFilters);
        
        // Cargar usuarios sin filtros
        loadUsers(resetFilters);
    };

    // Cargar usuarios al montar el componente
    useEffect(() => {
        // Siempre cargar usuarios al montar el componente
        console.log('Componente montado, cargando usuarios...'); // DEBUG
        loadUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                <Link
                    href="/admin/users/create"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    ➕ Nuevo Usuario
                </Link>
            </div>

            {/* Acciones masivas */}
            {selectedUsers.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-center">
                    <span className="text-blue-700">
                        {selectedUsers.length} usuario(s) seleccionado(s)
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (confirm(`¿Estás seguro de que quieres eliminar ${selectedUsers.length} usuario(s)?`)) {
                                    // Implementar eliminación masiva
                                    showNotification('info', 'Función en desarrollo');
                                    setSelectedUsers([]);
                                }
                            }}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                            Eliminar seleccionados
                        </button>
                        <button
                            onClick={() => setSelectedUsers([])}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded text-sm"
                        >
                            Cancelar selección
                        </button>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => {
                                const value = e.target.value;
                                console.log('Buscando:', value); // DEBUG
                                handleFilterChange('search', value);
                            }}
                            placeholder="Nombre o email..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Rol
                        </label>
                        <select
                            value={filters.role_id}
                            onChange={(e) => handleFilterChange('role_id', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Todos los roles</option>
                            {roles?.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Estado
                        </label>
                        <select
                            value={filters.active}
                            onChange={(e) => handleFilterChange('active', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Todos</option>
                            <option value="1">Activos</option>
                            <option value="0">Bloqueados</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo de cuenta
                        </label>
                        <select
                            value={filters.account_type}
                            onChange={(e) => handleFilterChange('account_type', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Todos</option>
                            <option value="personal">Personal</option>
                            <option value="institutional">Institucional</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={clearFiltersAndReload}
                            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded transition-colors duration-200"
                        >
                            🔄 Limpiar filtros
                        </button>
                        
                        {/* Indicador de filtros activos */}
                        {(filters.search || filters.role_id || filters.active !== '' || filters.account_type) && (
                            <span className="text-sm text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full font-medium">
                                ⚠️ Filtros activos
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Mostrar:</label>
                            <select
                                value={filters.per_page}
                                onChange={(e) => handleFilterChange('per_page', e.target.value)}
                                className="shadow-sm border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-600">
                            Mostrando {users.data?.length || 0} de {users.total || 0} usuarios
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                    </div>
                ) : users.data && users.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedUsers.length === users.data?.length && users.data?.length > 0}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registro
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data?.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.full_name}
                                                        </div>
                                                        {user.is_institutional && user.companies && (
                                                            <div className="text-xs text-gray-500">
                                                                {user.companies.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                    {user.status && !user.status.email_verified && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            ⚠️ Email no verificado
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {user.role_names || 'Sin rol'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status?.blocked 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.status?.name || 'Activo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.created_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-1">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200"
                                                    >
                                                        ✏️ Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={`font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200 ${
                                                            user.status?.blocked 
                                                                ? 'bg-green-500 hover:bg-green-700 text-white' 
                                                                : 'bg-yellow-500 hover:bg-yellow-700 text-white'
                                                        }`}
                                                    >
                                                        {user.status?.blocked ? '🔓 Desbloquear' : '🔒 Bloquear'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToResetPassword(user);
                                                            setShowResetPasswordModal(true);
                                                        }}
                                                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200"
                                                    >
                                                        🔑 Reset Pass
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(user);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {users.last_page > 1 && (
                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(users.current_page - 1)}
                                        disabled={users.current_page === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                            users.current_page === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(users.current_page + 1)}
                                        disabled={users.current_page === users.last_page}
                                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                            users.current_page === users.last_page
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Mostrando página <span className="font-medium">{users.current_page}</span> de{' '}
                                            <span className="font-medium">{users.last_page}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {/* Botón Primera página */}
                                            {users.current_page > 1 && (
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                >
                                                    ««
                                                </button>
                                            )}
                                            
                                            {/* Botón Anterior */}
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, users.current_page - 1))}
                                                disabled={users.current_page === 1}
                                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                                    users.current_page === 1 
                                                        ? 'text-gray-300 cursor-not-allowed' 
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                «
                                            </button>
                                            
                                            {/* Páginas numeradas - máximo 5 páginas visibles */}
                                            {(() => {
                                                const totalPages = users.last_page;
                                                const currentPage = users.current_page;
                                                let pages = [];
                                                
                                                if (totalPages <= 5) {
                                                    // Si hay 5 o menos páginas, mostrar todas
                                                    pages = [...Array(totalPages)].map((_, i) => i + 1);
                                                } else {
                                                    // Si hay más de 5 páginas, mostrar ventana móvil
                                                    if (currentPage <= 3) {
                                                        pages = [1, 2, 3, 4, '...', totalPages];
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                                    } else {
                                                        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                                                    }
                                                }
                                                
                                                return pages.map((page, index) => (
                                                    page === '...' ? (
                                                        <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                users.current_page === page
                                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ));
                                            })()}
                                            
                                            {/* Botón Siguiente */}
                                            <button
                                                onClick={() => handlePageChange(Math.min(users.last_page, users.current_page + 1))}
                                                disabled={users.current_page === users.last_page}
                                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                                    users.current_page === users.last_page 
                                                        ? 'text-gray-300 cursor-not-allowed' 
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                »
                                            </button>
                                            
                                            {/* Botón Última página */}
                                            {users.current_page < users.last_page && (
                                                <button
                                                    onClick={() => handlePageChange(users.last_page)}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                >
                                                    »»
                                                </button>
                                            )}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg mb-4">
                            {filters.search || filters.role_id || filters.active !== '' || filters.account_type 
                                ? 'No se encontraron usuarios con los filtros aplicados' 
                                : 'No hay usuarios registrados'}
                        </p>
                        {(filters.search || filters.role_id || filters.active !== '' || filters.account_type) && (
                            <button
                                onClick={clearFiltersAndReload}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                            >
                                🔄 Limpiar filtros y ver todos los usuarios
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Eliminar usuario
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.full_name}</strong>? 
                                                Esta acción no se puede deshacer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDeleteUser}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Eliminar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setUserToDelete(null);
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de reset password */}
            {showResetPasswordModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center mb-4">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <span className="text-2xl">🔑</span>
                                    </div>
                                    <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900">
                                        Restablecer contraseña
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">
                                    Ingresa una nueva contraseña para el usuario <strong>{userToResetPassword?.full_name}</strong>
                                </p>
                                <div className="mt-2">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Nueva contraseña <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Confirmar contraseña <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.new_password_confirmation}
                                            onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Restablecer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowResetPasswordModal(false);
                                        setUserToResetPassword(null);
                                        setPasswordData({ new_password: '', new_password_confirmation: '' });
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

UsersIndex.layout = page => <AdminLayout>{page}</AdminLayout>;

export default UsersIndex;