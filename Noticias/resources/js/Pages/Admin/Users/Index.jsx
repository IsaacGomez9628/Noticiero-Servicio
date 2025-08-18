import React, { useState, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminUserService from '../../../Services/adminUserService';
import debounce from 'lodash/debounce';
import { Eye, Edit, Lock, Unlock, Trash2, Plus, Filter, AlertCircle, MoreVertical, Key, User } from 'lucide-react';
import axios from 'axios';

const UsersIndex = ({ users: initialUsers, filters: initialFilters, roles }) => {
    const [users, setUsers] = useState(initialUsers || { data: [], current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
    const [showActionsDropdown, setShowActionsDropdown] = useState(null);

    // Función para mostrar notificaciones
    const showNotification = (type, message) => {
        if (type === 'error') {
            console.error('Error:', message);
            alert(`❌ Error: ${message}`);
        } else if (type === 'success') {
            console.log('Success:', message);
            alert(`✅ ${message}`);
        } else {
            alert(message);
        }
    };

    // Cargar usuarios
    const loadUsers = async (params = filters) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Cargando usuarios con params:', params);
            
            const response = await axios.get('/admin/api/users', { 
                params,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            console.log('📊 Datos recibidos:', response.data);
            
            if (response.data.users) {
                setUsers(response.data.users);
            } else if (response.data.data) {
                setUsers(response.data);
            } else {
                console.warn('⚠️ Estructura de datos inesperada:', response.data);
                setUsers({ data: [], current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('❌ Error al cargar usuarios:', error);
            setError(error.response?.data?.message || 'Error al cargar usuarios');
            showNotification('error', error.response?.data?.message || 'Error al cargar usuarios');
            setUsers({ data: [], current_page: 1, last_page: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Debounce para búsqueda
    const debouncedLoadUsers = useCallback(
        debounce((params) => {
            console.log('🔍 Búsqueda debounced:', params);
            loadUsers(params);
        }, 500),
        []
    );

    // Manejar cambios en filtros
    const handleFilterChange = (field, value) => {
        console.log(`🔧 Cambiando filtro ${field}:`, value);
        const newFilters = { ...filters, [field]: value, page: 1 };
        setFilters(newFilters);
        
        if (field === 'search') {
            debouncedLoadUsers(newFilters);
        } else {
            loadUsers(newFilters);
        }
    };

    // Manejar paginación
    const handlePageChange = (page) => {
        console.log('📄 Cambiando a página:', page);
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        loadUsers(newFilters);
    };

    // Toggle estado usuario
    const handleToggleStatus = async (userId) => {
        console.log('🔄 Cambiando estado del usuario:', userId);
        
        const user = users.data.find(u => u.id === userId);
        const action = user?.status?.blocked ? 'desbloquear' : 'bloquear';
        
        try {
            const response = await adminUserService.toggleUserStatus(userId);
            console.log('✅ Estado cambiado:', response);
            
            showNotification('success', response.message || 'Estado actualizado');
            await loadUsers();
        } catch (error) {
            console.error('❌ Error al cambiar estado:', error);
            showNotification('error', 'Error al cambiar estado del usuario');
        }
        
        setShowActionsDropdown(null);
    };

    // Reset password
    const handleResetPassword = async () => {
        if (!userToResetPassword) return;
        
        console.log('🔑 Restableciendo contraseña para:', userToResetPassword.id);
        
        try {
            const response = await adminUserService.resetUserPassword(userToResetPassword.id, passwordData);
            console.log('✅ Contraseña restablecida:', response);
            
            showNotification('success', response.message || 'Contraseña restablecida');
            setShowResetPasswordModal(false);
            setUserToResetPassword(null);
            setPasswordData({ new_password: '', new_password_confirmation: '' });
        } catch (error) {
            console.error('❌ Error al restablecer contraseña:', error);
            showNotification('error', error.response?.data?.message || 'Error al restablecer contraseña');
        }
    };

    // Eliminar usuario
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        console.log('🗑️ Eliminando usuario:', userToDelete.id);
        
        try {
            const response = await adminUserService.deleteUser(userToDelete.id);
            console.log('✅ Usuario eliminado:', response);
            
            showNotification('success', response.message || 'Usuario eliminado');
            setShowDeleteModal(false);
            setUserToDelete(null);
            await loadUsers();
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            showNotification('error', error.response?.data?.message || 'Error al eliminar usuario');
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

    // Limpiar filtros
    const clearFilters = () => {
        console.log('🧹 Limpiando filtros');
        const resetFilters = {
            search: '',
            role_id: '',
            active: '',
            account_type: '',
            per_page: 10,
            page: 1
        };
        
        if (debouncedLoadUsers) {
            debouncedLoadUsers.cancel();
        }
        
        setFilters(resetFilters);
        loadUsers(resetFilters);
        setSelectedUsers([]);
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = () => {
            setShowActionsDropdown(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Cargar datos al montar el componente
    useEffect(() => {
        console.log('🚀 Componente montado, cargando usuarios');
        loadUsers();
    }, []);

    // Componente para botones de acción responsivos
    const ActionButtons = ({ user }) => (
        <div className="flex items-center justify-center space-x-1">
            {/* Versión Desktop - Botones individuales */}
            <div className="hidden lg:flex space-x-1">
                <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Editar usuario"
                >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                </Link>
                
                <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`inline-flex items-center px-2 py-1 text-white text-xs font-medium rounded transition-colors duration-200 ${
                        user.status?.blocked 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                    title={user.status?.blocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
                >
                    {user.status?.blocked ? (
                        <>
                            <Unlock className="w-3 h-3 mr-1" />
                            Desbloquear
                        </>
                    ) : (
                        <>
                            <Lock className="w-3 h-3 mr-1" />
                            Bloquear
                        </>
                    )}
                </button>
                
                <button
                    onClick={() => {
                        setUserToResetPassword(user);
                        setShowResetPasswordModal(true);
                    }}
                    className="inline-flex items-center px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Restablecer contraseña"
                >
                    <Key className="w-3 h-3 mr-1" />
                    Reset
                </button>
                
                <button
                    onClick={() => {
                        console.log('🗑️ Solicitando eliminar usuario:', user);
                        setUserToDelete(user);
                        setShowDeleteModal(true);
                    }}
                    className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Eliminar usuario"
                >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Eliminar
                </button>
            </div>

            {/* Versión Mobile/Tablet - Dropdown */}
            <div className="lg:hidden relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowActionsDropdown(showActionsDropdown === user.id ? null : user.id);
                    }}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded border"
                >
                    <MoreVertical className="w-3 h-3" />
                </button>

                {showActionsDropdown === user.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                            <Link
                                href={`/admin/users/${user.id}/edit`}
                                className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowActionsDropdown(null)}
                            >
                                <Edit className="w-3 h-3 mr-2" />
                                Editar
                            </Link>
                            
                            <button
                                onClick={() => handleToggleStatus(user.id)}
                                className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            >
                                {user.status?.blocked ? (
                                    <>
                                        <Unlock className="w-3 h-3 mr-2" />
                                        Desbloquear
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-3 h-3 mr-2" />
                                        Bloquear
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={() => {
                                    setUserToResetPassword(user);
                                    setShowResetPasswordModal(true);
                                    setShowActionsDropdown(null);
                                }}
                                className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            >
                                <Key className="w-3 h-3 mr-2" />
                                Reset Password
                            </button>
                            
                            <button
                                onClick={() => {
                                    setUserToDelete(user);
                                    setShowDeleteModal(true);
                                    setShowActionsDropdown(null);
                                }}
                                className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Eliminar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                        <p className="text-sm text-gray-600 mt-1">Gestión del sistema</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Usuario
                    </Link>
                </div>

                {/* Acciones masivas */}
                {selectedUsers.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <span className="text-blue-700 font-medium">
                            {selectedUsers.length} usuario(s) seleccionado(s)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (confirm(`¿Estás seguro de que quieres eliminar ${selectedUsers.length} usuario(s)?`)) {
                                        showNotification('info', 'Función en desarrollo');
                                        setSelectedUsers([]);
                                    }
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200"
                            >
                                Eliminar seleccionados
                            </button>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded text-sm transition-colors duration-200"
                            >
                                Cancelar selección
                            </button>
                        </div>
                    </div>
                )}

                {/* Mostrar errores si existen */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                            <input
                                type="text"
                                placeholder="Nombre o email..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select
                                value={filters.role_id}
                                onChange={(e) => handleFilterChange('role_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos los roles</option>
                                {roles?.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                value={filters.active}
                                onChange={(e) => handleFilterChange('active', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                <option value="1">Activos</option>
                                <option value="0">Bloqueados</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de cuenta</label>
                            <select
                                value={filters.account_type}
                                onChange={(e) => handleFilterChange('account_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                <option value="personal">Personal</option>
                                <option value="institutional">Institucional</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Limpiar Filtros
                            </button>
                            
                            {(filters.search || filters.role_id || filters.active !== '' || filters.account_type) && (
                                <span className="text-sm text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full font-medium">
                                    ⚠️ Filtros activos
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div>
                                Mostrar: 
                                <select
                                    value={filters.per_page}
                                    onChange={(e) => handleFilterChange('per_page', e.target.value)}
                                    className="mx-2 px-2 py-1 border border-gray-300 rounded"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <div>
                                Mostrando {users.data?.length || 0} de {users.total || 0} usuarios
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla con scroll horizontal */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedUsers.length === users.data?.length && users.data?.length > 0}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                    Usuario
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Rol
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Registro
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[320px] lg:min-w-[360px]">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        </div>
                                        <p className="mt-2 text-gray-500">Cargando usuarios...</p>
                                    </td>
                                </tr>
                            ) : users.data && users.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        {(filters.search || filters.role_id || filters.active !== '' || filters.account_type) 
                                            ? 'No se encontraron usuarios con los filtros aplicados' 
                                            : 'No hay usuarios registrados'}
                                    </td>
                                </tr>
                            ) : (
                                users.data && users.data.map(user => {
                                    console.log('🔍 Renderizando usuario:', {
                                        id: user.id,
                                        name: user.full_name,
                                        email: user.email,
                                        blocked: user.status?.blocked
                                    });

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                                            {user.full_name}
                                                        </div>
                                                        {user.is_institutional && user.companies && (
                                                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                                                {user.companies.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-900 truncate max-w-[160px]">{user.email}</div>
                                                {user.status && !user.status.email_verified && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                                        ⚠️ No verificado
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {user.role_names || 'Sin rol'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status?.blocked 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.status?.blocked ? 'Bloqueado' : 'Activo'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.created_at}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <ActionButtons user={user} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {users.last_page > 1 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(Math.max(1, users.current_page - 1))}
                                disabled={users.current_page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange(Math.min(users.last_page, users.current_page + 1))}
                                disabled={users.current_page === users.last_page}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">{users.from || 0}</span> a{' '}
                                    <span className="font-medium">{users.to || 0}</span> de{' '}
                                    <span className="font-medium">{users.total}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, users.current_page - 1))}
                                        disabled={users.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    
                                    {[...Array(Math.min(5, users.last_page))].map((_, index) => {
                                        const page = index + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    users.current_page === page
                                                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => handlePageChange(Math.min(users.last_page, users.current_page + 1))}
                                        disabled={users.current_page === users.last_page}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de eliminación */}
            {showDeleteModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteModal(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Trash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Eliminar Usuario
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Estás seguro de que deseas eliminar al usuario "<strong>{userToDelete?.full_name}</strong>"? 
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
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowResetPasswordModal(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center mb-4">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Key className="h-6 w-6 text-indigo-600" />
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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