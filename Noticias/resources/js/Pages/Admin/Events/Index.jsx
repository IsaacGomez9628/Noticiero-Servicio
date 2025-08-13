import React, { useState, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import adminEventService from '../../../Services/adminEventService';
import debounce from 'lodash/debounce';
import axios from 'axios';

const showNotification = (type, message) => {
    if (type === 'error') {
        alert(`Error: ${message}`);
    } else {
        alert(message);
    }
};

const EventsIndex = ({ events: initialEvents, filters: initialFilters, statuses, locations }) => {
    // Estados
    const [events, setEvents] = useState(initialEvents || { data: [], current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
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

    // Cargar eventos
    const loadEvents = async (params = filters) => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/api/events', { 
                params,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.data.events) {
                setEvents(response.data.events);
            } else if (response.data.data) {
                setEvents(response.data);
            } else {
                setEvents({ data: [], current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            showNotification('error', 'Error al cargar eventos');
            setEvents({ data: [], current_page: 1, last_page: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda con debounce
    const debouncedLoadEvents = useCallback(
        debounce((params) => {
            loadEvents(params);
        }, 500),
        []
    );

    // Manejar cambios en filtros
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        debouncedLoadEvents(newFilters);
    };

    // Cambiar página
    const handlePageChange = (page) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        loadEvents(newFilters);
    };

    // Toggle estado evento
    const handleToggleStatus = async (eventId) => {
        const event = events.data.find(e => e.id === eventId);
        const action = event?.status?.id === 1 ? 'desactivar' : 'activar';
        
        if (confirm(`¿Estás seguro de que quieres ${action} este evento?`)) {
            try {
                const response = await adminEventService.toggleEventStatus(eventId);
                showNotification('success', response.message || 'Estado actualizado');
                loadEvents();
            } catch (error) {
                showNotification('error', 'Error al cambiar estado del evento');
            }
        }
    };

    // Eliminar evento
    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        
        try {
            const response = await adminEventService.deleteEvent(eventToDelete.id);
            showNotification('success', response.message || 'Evento eliminado');
            setShowDeleteModal(false);
            setEventToDelete(null);
            loadEvents();
        } catch (error) {
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
    const clearFiltersAndReload = () => {
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
    };

    // Cargar eventos al montar
    useEffect(() => {
        loadEvents();
    }, []);

    // Función para formatear precio
    const formatPrice = (price, isFree) => {
        if (isFree) return 'Gratis';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Eventos</h1>
                <Link
                    href="/admin/events/create"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    ➕ Nuevo Evento
                </Link>
            </div>

            {/* Acciones masivas */}
            {selectedEvents.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-center">
                    <span className="text-blue-700">
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
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                            Eliminar seleccionados
                        </button>
                        <button
                            onClick={() => setSelectedEvents([])}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded text-sm"
                        >
                            Cancelar selección
                        </button>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Título o descripción..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Estado
                        </label>
                        <select
                            value={filters.status_id}
                            onChange={(e) => handleFilterChange('status_id', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Todos</option>
                            {statuses?.map(status => (
                                <option key={status.id} value={status.id}>{status.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Ubicación
                        </label>
                        <select
                            value={filters.location_id}
                            onChange={(e) => handleFilterChange('location_id', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Todas</option>
                            {locations?.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo
                        </label>
                        <select
                            value={filters.its_free}
                            onChange={(e) => handleFilterChange('its_free', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Todos</option>
                            <option value="1">Gratuitos</option>
                            <option value="0">De pago</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Desde
                        </label>
                        <input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Hasta
                        </label>
                        <input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
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
                        
                        {(filters.search || filters.status_id || filters.location_id || filters.its_free !== '' || filters.date_from || filters.date_to) && (
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
                            Mostrando {events.data?.length || 0} de {events.total || 0} eventos
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de eventos */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Cargando eventos...</p>
                    </div>
                ) : events.data && events.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedEvents.length === events.data?.length && events.data?.length > 0}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Título
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fechas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Horario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Capacidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ubicación
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.data?.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEvents.includes(event.id)}
                                                    onChange={() => handleSelectEvent(event.id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.titule}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {event.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {event.start_date}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    hasta {event.end_date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.start_time} - {event.end_time}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    event.its_free 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {formatPrice(event.price, event.its_free)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {event.capacity}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {event.attendees_count} inscritos
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${event.status?.color || 'gray'}-100 text-${event.status?.color || 'gray'}-800`}>
                                                    {event.status?.name || 'Sin estado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-1">
                                                    <Link
                                                        href={`/admin/events/${event.id}`}
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200"
                                                    >
                                                        👁️ Ver
                                                    </Link>
                                                    <Link
                                                        href={`/admin/events/${event.id}/edit`}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200"
                                                    >
                                                        ✏️ Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(event.id)}
                                                        className={`font-bold py-1.5 px-3 rounded text-xs transition-colors duration-200 ${
                                                            event.status?.id === 1 
                                                                ? 'bg-yellow-500 hover:bg-yellow-700 text-white' 
                                                                : 'bg-green-500 hover:bg-green-700 text-white'
                                                        }`}
                                                    >
                                                        {event.status?.id === 1 ? '⏸️ Pausar' : '▶️ Activar'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEventToDelete(event);
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
                        {events.last_page > 1 && (
                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(events.current_page - 1)}
                                        disabled={events.current_page === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                            events.current_page === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(events.current_page + 1)}
                                        disabled={events.current_page === events.last_page}
                                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                            events.current_page === events.last_page
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
                                            Mostrando página <span className="font-medium">{events.current_page}</span> de{' '}
                                            <span className="font-medium">{events.last_page}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {events.current_page > 1 && (
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                >
                                                    ««
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, events.current_page - 1))}
                                                disabled={events.current_page === 1}
                                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                                    events.current_page === 1 
                                                        ? 'text-gray-300 cursor-not-allowed' 
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                «
                                            </button>
                                            
                                            {(() => {
                                                const totalPages = events.last_page;
                                                const currentPage = events.current_page;
                                                let pages = [];
                                                
                                                if (totalPages <= 5) {
                                                    pages = [...Array(totalPages)].map((_, i) => i + 1);
                                                } else {
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
                                                                events.current_page === page
                                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ));
                                            })()}
                                            
                                            <button
                                                onClick={() => handlePageChange(Math.min(events.last_page, events.current_page + 1))}
                                                disabled={events.current_page === events.last_page}
                                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                                    events.current_page === events.last_page 
                                                        ? 'text-gray-300 cursor-not-allowed' 
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                »
                                            </button>
                                            
                                            {events.current_page < events.last_page && (
                                                <button
                                                    onClick={() => handlePageChange(events.last_page)}
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
                            {filters.search || filters.status_id || filters.location_id || filters.its_free !== '' || filters.date_from || filters.date_to
                                ? 'No se encontraron eventos con los filtros aplicados' 
                                : 'No hay eventos registrados'}
                        </p>
                        {(filters.search || filters.status_id || filters.location_id || filters.its_free !== '' || filters.date_from || filters.date_to) && (
                            <button
                                onClick={clearFiltersAndReload}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                            >
                                🔄 Limpiar filtros y ver todos los eventos
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
                                            Eliminar evento
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Estás seguro de que deseas eliminar el evento <strong>{eventToDelete?.titule}</strong>? 
                                                Esta acción no se puede deshacer.
                                            </p>
                                            {eventToDelete?.attendees_count > 0 && (
                                                <p className="text-sm text-red-500 mt-2">
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