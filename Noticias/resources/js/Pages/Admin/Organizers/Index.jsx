import React, { useState, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminOrganizerService from '../../../Services/adminOrganizerService';
import debounce from 'lodash/debounce';
import { Eye, Edit, Pause, Trash2, Plus, Filter, AlertCircle, Play, MoreVertical } from 'lucide-react';

const OrganizersIndex = ({ organizers: initialOrganizers, filters: initialFilters }) => {
    const [organizers, setOrganizers] = useState(initialOrganizers || { data: [], current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        active: '',
        city: '',
        per_page: 10,
        page: 1
    });
    const [cities, setCities] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [organizerToDelete, setOrganizerToDelete] = useState(null);
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

    // Cargar organizadores
    const loadOrganizers = async (params = filters) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Cargando organizadores con params:', params);
            
            const data = await adminOrganizerService.getOrganizers(params);
            console.log('📊 Datos recibidos:', data);
            
            if (data && data.organizers) {
                setOrganizers(data.organizers);
                setCities(data.cities || []);
                console.log('✅ Organizadores cargados:', data.organizers.data?.length || 0);
            } else {
                console.warn('⚠️ Estructura de datos inesperada:', data);
                setOrganizers({ data: [], current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('❌ Error al cargar organizadores:', error);
            setError(error.response?.data?.message || 'Error al cargar los organizadores');
            showNotification('error', error.response?.data?.message || 'Error al cargar los organizadores');
            setOrganizers({ data: [], current_page: 1, last_page: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Debounce para búsqueda
    const debouncedLoadOrganizers = useCallback(
        debounce((params) => {
            console.log('🔍 Búsqueda debounced:', params);
            loadOrganizers(params);
        }, 500),
        []
    );

    // Manejar cambios en filtros
    const handleFilterChange = (field, value) => {
        console.log(`🔧 Cambiando filtro ${field}:`, value);
        const newFilters = { ...filters, [field]: value, page: 1 };
        setFilters(newFilters);
        
        if (field === 'search') {
            debouncedLoadOrganizers(newFilters);
        } else {
            loadOrganizers(newFilters);
        }
    };

    // Manejar paginación
    const handlePageChange = (page) => {
        console.log('📄 Cambiando a página:', page);
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        loadOrganizers(newFilters);
    };

    // Toggle estado activo
    const handleToggleStatus = async (id) => {
        console.log('🔄 Cambiando estado del organizador:', id);
        
        try {
            const data = await adminOrganizerService.toggleStatus(id);
            console.log('✅ Estado cambiado:', data);
            
            if (data.status === 'success') {
                await loadOrganizers();
                showNotification('success', data.message || 'Estado actualizado correctamente');
            } else {
                showNotification('error', data.message || 'Error al cambiar el estado');
            }
        } catch (error) {
            console.error('❌ Error al cambiar estado:', error);
            showNotification('error', error.response?.data?.message || 'Error al cambiar el estado del organizador');
        }
        
        // Cerrar dropdown
        setShowActionsDropdown(null);
    };

    // Eliminar organizador
    const handleDelete = async () => {
        if (!organizerToDelete) {
            console.warn('⚠️ No hay organizador seleccionado para eliminar');
            return;
        }
        
        console.log('🗑️ Eliminando organizador:', organizerToDelete.id);
        
        try {
            const data = await adminOrganizerService.deleteOrganizer(organizerToDelete.id);
            console.log('✅ Organizador eliminado:', data);
            
            if (data.status === 'success') {
                setShowDeleteModal(false);
                setOrganizerToDelete(null);
                await loadOrganizers();
                showNotification('success', data.message || 'Organizador eliminado correctamente');
            } else {
                showNotification('error', data.message || 'Error al eliminar el organizador');
            }
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            const message = error.response?.data?.message || 'Error al eliminar el organizador';
            showNotification('error', message);
        }
    };

    // Limpiar filtros
    const clearFilters = () => {
        console.log('🧹 Limpiando filtros');
        const resetFilters = {
            search: '',
            active: '',
            city: '',
            per_page: 10,
            page: 1
        };
        setFilters(resetFilters);
        loadOrganizers(resetFilters);
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
        console.log('🚀 Componente montado, cargando organizadores');
        loadOrganizers();
    }, []);

    // Componente para botones de acción responsivos
    const ActionButtons = ({ organizer }) => (
        <div className="flex items-center justify-center space-x-1">
            {/* Versión Desktop - Botones individuales */}
            <div className="hidden lg:flex space-x-1">
                <Link
                    href={`/admin/organizers/${organizer.id}`}
                    className="inline-flex items-center px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Ver detalles"
                >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                </Link>
                
                <Link
                    href={`/admin/organizers/${organizer.id}/edit`}
                    className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Editar organizador"
                >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                </Link>
                
                <button
                    onClick={() => handleToggleStatus(organizer.id)}
                    className={`inline-flex items-center px-2 py-1 text-white text-xs font-medium rounded transition-colors duration-200 ${
                        organizer.active 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={organizer.active ? 'Pausar organizador' : 'Activar organizador'}
                >
                    {organizer.active ? (
                        <>
                            <Pause className="w-3 h-3 mr-1" />
                            Pausar
                        </>
                    ) : (
                        <>
                            <Play className="w-3 h-3 mr-1" />
                            Activar
                        </>
                    )}
                </button>
                
                <button
                    onClick={() => {
                        console.log('🗑️ Solicitando eliminar organizador:', organizer);
                        setOrganizerToDelete(organizer);
                        setShowDeleteModal(true);
                    }}
                    disabled={organizer.events_count > 0}
                    className={`inline-flex items-center px-2 py-1 text-white text-xs font-medium rounded transition-colors duration-200 ${
                        organizer.events_count > 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                    }`}
                    title={organizer.events_count > 0 ? 'No se puede eliminar: tiene eventos asociados' : 'Eliminar organizador'}
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
                        setShowActionsDropdown(showActionsDropdown === organizer.id ? null : organizer.id);
                    }}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded border"
                >
                    <MoreVertical className="w-3 h-3" />
                </button>

                {showActionsDropdown === organizer.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                            <Link
                                href={`/admin/organizers/${organizer.id}`}
                                className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowActionsDropdown(null)}
                            >
                                <Eye className="w-3 h-3 mr-2" />
                                Ver
                            </Link>
                            
                            <Link
                                href={`/admin/organizers/${organizer.id}/edit`}
                                className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowActionsDropdown(null)}
                            >
                                <Edit className="w-3 h-3 mr-2" />
                                Editar
                            </Link>
                            
                            <button
                                onClick={() => handleToggleStatus(organizer.id)}
                                className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            >
                                {organizer.active ? (
                                    <>
                                        <Pause className="w-3 h-3 mr-2" />
                                        Pausar
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3 h-3 mr-2" />
                                        Activar
                                    </>
                                )}
                            </button>
                            
                            {organizer.events_count === 0 && (
                                <button
                                    onClick={() => {
                                        setOrganizerToDelete(organizer);
                                        setShowDeleteModal(true);
                                        setShowActionsDropdown(null);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Eliminar
                                </button>
                            )}
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
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Organizadores</h1>
                        <p className="text-sm text-gray-600 mt-1">Gestión del sistema</p>
                    </div>
                    <Link
                        href="/admin/organizers/create"
                        className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Organizador
                    </Link>
                </div>

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
                                placeholder="Nombre, email o ciudad..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                value={filters.active}
                                onChange={(e) => handleFilterChange('active', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos los estados</option>
                                <option value="1">Activos</option>
                                <option value="0">Inactivos</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <select
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todas las ciudades</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Información de resultados */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 gap-2">
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
                            Mostrando {organizers.from || 0} de {organizers.total || 0} organizadores
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                    Logo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">
                                    Contacto
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Ciudad
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Eventos
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[280px] lg:min-w-[300px]">
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
                                        <p className="mt-2 text-gray-500">Cargando organizadores...</p>
                                    </td>
                                </tr>
                            ) : organizers.data && organizers.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron organizadores
                                    </td>
                                </tr>
                            ) : (
                                organizers.data && organizers.data.map(organizer => {
                                    console.log('🔍 Renderizando organizador:', {
                                        id: organizer.id,
                                        name: organizer.name,
                                        active: organizer.active,
                                        events_count: organizer.events_count
                                    });

                                    return (
                                        <tr key={organizer.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {organizer.logo ? (
                                                    <img 
                                                        src={`/storage/${organizer.logo}`} 
                                                        alt={organizer.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs font-medium">N/A</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                                        {organizer.name}
                                                    </div>
                                                    {organizer.web_site && (
                                                        <div className="text-xs text-blue-600 hover:text-blue-800 truncate max-w-[180px]">
                                                            <a href={organizer.web_site} target="_blank" rel="noopener noreferrer">
                                                                {organizer.web_site}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-900 truncate max-w-[140px]">{organizer.email || '-'}</div>
                                                <div className="text-xs text-gray-500">{organizer.phone || '-'}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{organizer.city || '-'}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {organizer.events_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    organizer.active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {organizer.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <ActionButtons organizer={organizer} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {organizers.last_page > 1 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(Math.max(1, organizers.current_page - 1))}
                                disabled={organizers.current_page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange(Math.min(organizers.last_page, organizers.current_page + 1))}
                                disabled={organizers.current_page === organizers.last_page}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">{organizers.from || 0}</span> a{' '}
                                    <span className="font-medium">{organizers.to || 0}</span> de{' '}
                                    <span className="font-medium">{organizers.total}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, organizers.current_page - 1))}
                                        disabled={organizers.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    
                                    {[...Array(Math.min(5, organizers.last_page))].map((_, index) => {
                                        const page = index + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    organizers.current_page === page
                                                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => handlePageChange(Math.min(organizers.last_page, organizers.current_page + 1))}
                                        disabled={organizers.current_page === organizers.last_page}
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
                                            Eliminar Organizador
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Estás seguro de que deseas eliminar el organizador "<strong>{organizerToDelete?.name}</strong>"? 
                                                Esta acción no se puede deshacer.
                                            </p>
                                            {organizerToDelete?.events_count > 0 && (
                                                <p className="text-sm text-red-600 mt-2">
                                                    ⚠️ Este organizador tiene {organizerToDelete.events_count} evento(s) asociado(s).
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={organizerToDelete?.events_count > 0}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                                        organizerToDelete?.events_count > 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    }`}
                                >
                                    {organizerToDelete?.events_count > 0 ? 'No se puede eliminar' : 'Eliminar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setOrganizerToDelete(null);
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

OrganizersIndex.layout = page => <AdminLayout>{page}</AdminLayout>;

export default OrganizersIndex;