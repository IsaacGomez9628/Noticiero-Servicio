import React, { useState, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminEventService from '../../../Services/adminEventService';
import debounce from 'lodash/debounce';
import { Eye, Edit, Pause, Trash2, Plus, Filter, AlertCircle, MoreVertical, Play, Calendar, MapPin, DollarSign } from 'lucide-react';
import axios from 'axios';

const EventsIndex = ({ events: initialEvents, filters: initialFilters, statuses, locations }) => {
    const [events, setEvents] = useState(initialEvents || { data: [], current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status_id: '',
        location_id: '',
        its_free: '',
        date_from: '',
        date_to: '',
        per_page: 10,
        page: 1
    });
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
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

    // Función para formatear precio
    const formatPrice = (price, isFree) => {
        if (isFree) return 'Gratis';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Cargar eventos
    const loadEvents = async (params = filters) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Cargando eventos con params:', params);
            
            const response = await axios.get('/admin/api/events', { 
                params,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            console.log('📊 Datos recibidos:', response.data);
            
            if (response.data.events) {
                setEvents(response.data.events);
            } else if (response.data.data) {
                setEvents(response.data);
            } else {
                console.warn('⚠️ Estructura de datos inesperada:', response.data);
                setEvents({ data: [], current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('❌ Error al cargar eventos:', error);
            setError(error.response?.data?.message || 'Error al cargar eventos');
            showNotification('error', error.response?.data?.message || 'Error al cargar eventos');
            setEvents({ data: [], current_page: 1, last_page: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Debounce para búsqueda
    const debouncedLoadEvents = useCallback(
        debounce((params) => {
            console.log('🔍 Búsqueda debounced:', params);
            loadEvents(params);
        }, 500),
        []
    );

    // Manejar cambios en filtros
    const handleFilterChange = (field, value) => {
        console.log(`🔧 Cambiando filtro ${field}:`, value);
        const newFilters = { ...filters, [field]: value, page: 1 };
        setFilters(newFilters);
        
        if (field === 'search') {
            debouncedLoadEvents(newFilters);
        } else {
            loadEvents(newFilters);
        }
    };

    // Manejar paginación
    const handlePageChange = (page) => {
        console.log('📄 Cambiando a página:', page);
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        loadEvents(newFilters);
    };

    // Toggle estado evento
    const handleToggleStatus = async (eventId) => {
        console.log('🔄 Cambiando estado del evento:', eventId);
        
        const event = events.data.find(e => e.id === eventId);
        const action = event?.status?.id === 1 ? 'desactivar' : 'activar';
        
        try {
            const response = await adminEventService.toggleEventStatus(eventId);
            console.log('✅ Estado cambiado:', response);
            
            showNotification('success', response.message || 'Estado actualizado');
            await loadEvents();
        } catch (error) {
            console.error('❌ Error al cambiar estado:', error);
            showNotification('error', 'Error al cambiar estado del evento');
        }
        
        setShowActionsDropdown(null);
    };

    // Eliminar evento
    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        
        console.log('🗑️ Eliminando evento:', eventToDelete.id);
        
        try {
            const response = await adminEventService.deleteEvent(eventToDelete.id);
            console.log('✅ Evento eliminado:', response);
            
            showNotification('success', response.message || 'Evento eliminado');
            setShowDeleteModal(false);
            setEventToDelete(null);
            await loadEvents();
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            showNotification('error', error.response?.data?.message || 'Error al eliminar evento');
        }
    };

    // Seleccionar todos
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEvents(events.data.map(event => event.id));
        } else {
            setSelectedEvents([]);
        }
    };

    // Seleccionar evento individual
    const handleSelectEvent = (eventId) => {
        if (selectedEvents.includes(eventId)) {
            setSelectedEvents(selectedEvents.filter(id => id !== eventId));
        } else {
            setSelectedEvents([...selectedEvents, eventId]);
        }
    };

    // Limpiar filtros
    const clearFilters = () => {
        console.log('🧹 Limpiando filtros');
        const resetFilters = {
            search: '',
            status_id: '',
            location_id: '',
            its_free: '',
            date_from: '',
            date_to: '',
            per_page: 10,
            page: 1
        };
        
        if (debouncedLoadEvents) {
            debouncedLoadEvents.cancel();
        }
        
        setFilters(resetFilters);
        loadEvents(resetFilters);
        setSelectedEvents([]);
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
        console.log('🚀 Componente montado, cargando eventos');
        loadEvents();
    }, []);

    // Componente para botones de acción responsivos
    const ActionButtons = ({ event }) => (
        <div className="flex items-center justify-center space-x-1">
            {/* Versión Desktop - Botones individuales */}
            <div className="hidden lg:flex space-x-1">
                <Link
                    href={`/admin/events/${event.id}`}
                    className="inline-flex items-center px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Ver detalles"
                >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                </Link>
                
                <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Editar evento"
                >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                </Link>
                
                <button
                    onClick={() => handleToggleStatus(event.id)}
                    className={`inline-flex items-center px-2 py-1 text-white text-xs font-medium rounded transition-colors duration-200 ${
                        event.status?.id === 1 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={event.status?.id === 1 ? 'Pausar evento' : 'Activar evento'}
                >
                    {event.status?.id === 1 ? (
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
                        console.log('🗑️ Solicitando eliminar evento:', event);
                        setEventToDelete(event);
                        setShowDeleteModal(true);
                    }}
                    className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200"
                    title="Eliminar evento"
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
                        setShowActionsDropdown(showActionsDropdown === event.id ? null : event.id);
                    }}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded border"
                >
                    <MoreVertical className="w-3 h-3" />
                </button>

                {showActionsDropdown === event.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                            <Link
                                href={`/admin/events/${event.id}`}
                                className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowActionsDropdown(null)}
                            >
                                <Eye className="w-3 h-3 mr-2" />
                                Ver
                            </Link>
                            
                            <Link
                                href={`/admin/events/${event.id}/edit`}
                                className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowActionsDropdown(null)}
                            >
                                <Edit className="w-3 h-3 mr-2" />
                                Editar
                            </Link>
                            
                            <button
                                onClick={() => handleToggleStatus(event.id)}
                                className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            >
                                {event.status?.id === 1 ? (
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
                            
                            <button
                                onClick={() => {
                                    setEventToDelete(event);
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
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
                        <p className="text-sm text-gray-600 mt-1">Gestión del sistema</p>
                    </div>
                    <Link
                        href="/admin/events/create"
                        className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Evento
                    </Link>
                </div>

                {/* Acciones masivas */}
                {selectedEvents.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <span className="text-blue-700 font-medium">
                            {selectedEvents.length} evento(s) seleccionado(s)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (confirm(`¿Estás seguro de que quieres eliminar ${selectedEvents.length} evento(s)?`)) {
                                        showNotification('info', 'Función en desarrollo');
                                        setSelectedEvents([]);
                                    }
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200"
                            >
                                Eliminar seleccionados
                            </button>
                            <button
                                onClick={() => setSelectedEvents([])}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                            <input
                                type="text"
                                placeholder="Título o descripción..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                value={filters.status_id}
                                onChange={(e) => handleFilterChange('status_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                {statuses?.map(status => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                            <select
                                value={filters.location_id}
                                onChange={(e) => handleFilterChange('location_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todas</option>
                                {locations?.map(location => (
                                    <option key={location.id} value={location.id}>{location.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select
                                value={filters.its_free}
                                onChange={(e) => handleFilterChange('its_free', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                <option value="1">Gratuitos</option>
                                <option value="0">De pago</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <Filter className="w-3 h-3 mr-2" />
                                Limpiar Filtros
                            </button>
                        </div>

                        <div className="md:col-span-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                {(filters.search || filters.status_id || filters.location_id || filters.its_free !== '' || filters.date_from || filters.date_to) && (
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
                                    Mostrando {events.data?.length || 0} de {events.total || 0} eventos
                                </div>
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
                                        checked={selectedEvents.length === events.data?.length && events.data?.length > 0}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                                    Título
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                    Fechas
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Horario
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Precio
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Capacidad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Ubicación
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[280px] lg:min-w-[300px]">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        </div>
                                        <p className="mt-2 text-gray-500">Cargando eventos...</p>
                                    </td>
                                </tr>
                            ) : events.data && events.data.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                        {(filters.search || filters.status_id || filters.location_id || filters.its_free !== '' || filters.date_from || filters.date_to) 
                                            ? 'No se encontraron eventos con los filtros aplicados' 
                                            : 'No hay eventos registrados'}
                                    </td>
                                </tr>
                            ) : (
                                events.data && events.data.map(event => {
                                    console.log('🔍 Renderizando evento:', {
                                        id: event.id,
                                        title: event.titule,
                                        status: event.status?.name,
                                        attendees: event.attendees_count
                                    });

                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEvents.includes(event.id)}
                                                    onChange={() => handleSelectEvent(event.id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                                                        {event.titule}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[220px]">
                                                        {event.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                                    <div>
                                                        <div>{event.start_date}</div>
                                                        <div className="text-xs text-gray-500">
                                                            hasta {event.end_date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.start_time} - {event.end_time}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    event.its_free 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    <DollarSign className="w-3 h-3 mr-1" />
                                                    {formatPrice(event.price, event.its_free)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {event.capacity}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {event.attendees_count} inscritos
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${event.status?.color || 'gray'}-100 text-${event.status?.color || 'gray'}-800`}>
                                                    {event.status?.name || 'Sin estado'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                    <span className="truncate max-w-[100px]">
                                                        {event.location || 'Sin ubicación'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <ActionButtons event={event} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {events.last_page > 1 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(Math.max(1, events.current_page - 1))}
                                disabled={events.current_page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange(Math.min(events.last_page, events.current_page + 1))}
                                disabled={events.current_page === events.last_page}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">{events.from || 0}</span> a{' '}
                                    <span className="font-medium">{events.to || 0}</span> de{' '}
                                    <span className="font-medium">{events.total}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, events.current_page - 1))}
                                        disabled={events.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    
                                    {[...Array(Math.min(5, events.last_page))].map((_, index) => {
                                        const page = index + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    events.current_page === page
                                                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => handlePageChange(Math.min(events.last_page, events.current_page + 1))}
                                        disabled={events.current_page === events.last_page}
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
                                            Eliminar Evento
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Estás seguro de que deseas eliminar el evento "<strong>{eventToDelete?.titule}</strong>"? 
                                                Esta acción no se puede deshacer.
                                            </p>
                                            {eventToDelete?.attendees_count > 0 && (
                                                <p className="text-sm text-red-600 mt-2">
                                                    ⚠️ Este evento tiene {eventToDelete.attendees_count} asistentes registrados.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDeleteEvent}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Eliminar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setEventToDelete(null);
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

EventsIndex.layout = page => <AdminLayout>{page}</AdminLayout>;

export default EventsIndex;