import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';

const ShowEvent = ({ event }) => {
    // Función para formatear fecha
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('es-MX', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    // Función para formatear precio
    const formatPrice = (price, isFree) => {
        if (isFree) return 'Gratis';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Detalles del Evento</h1>
                <div className="flex gap-2">
                    <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ✏️ Editar
                    </Link>
                    <Link
                        href="/admin/events"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ← Volver
                    </Link>
                </div>
            </div>
            
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Información básica */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        Información Básica
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                ID del Evento:
                            </label>
                            <p className="text-gray-800">{event.id}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Slug:
                            </label>
                            <p className="text-gray-800">{event.slug}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Título:
                            </label>
                            <p className="text-gray-800 text-lg">{event.titule}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Descripción:
                            </label>
                            <p className="text-gray-800 whitespace-pre-wrap">{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Fechas y Horarios */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        Fechas y Horarios
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Fecha de Inicio:
                            </label>
                            <p className="text-gray-800">{formatDate(event.start_date)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Fecha de Fin:
                            </label>
                            <p className="text-gray-800">{formatDate(event.end_date)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Hora de Inicio:
                            </label>
                            <p className="text-gray-800">{event.start_time}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Hora de Fin:
                            </label>
                            <p className="text-gray-800">{event.end_time}</p>
                        </div>
                    </div>
                </div>

                {/* Precio y Capacidad */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        Precio y Capacidad
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Tipo de Evento:
                            </label>
                            <p className="text-gray-800">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    event.its_free 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {event.its_free ? 'Gratuito' : 'De Pago'}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Precio:
                            </label>
                            <p className="text-gray-800 text-lg font-semibold">
                                {formatPrice(event.price, event.its_free)}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Capacidad:
                            </label>
                            <p className="text-gray-800">
                                {event.capacity} personas
                                {event.attendees_count > 0 && (
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({event.attendees_count} inscritos)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    {event.available_capacity !== undefined && (
                        <div className="mt-4">
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Lugares Disponibles:
                            </label>
                            <div className="w-full bg-gray-200 rounded-full h-6 relative">
                                <div 
                                    className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                    style={{ width: `${((event.attendees_count || 0) / event.capacity) * 100}%` }}
                                >
                                    {Math.round(((event.attendees_count || 0) / event.capacity) * 100)}%
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {event.available_capacity} lugares disponibles
                            </p>
                        </div>
                    )}
                </div>

                {/* Ubicación y Estado */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        Ubicación y Estado
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Ubicación:
                            </label>
                            <p className="text-gray-800">
                                {event.location?.name || 'No especificada'}
                                {event.location?.address && (
                                    <span className="block text-sm text-gray-600">
                                        {event.location.address}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Estado:
                            </label>
                            <p className="text-gray-800">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${event.status?.color || 'gray'}-100 text-${event.status?.color || 'gray'}-800`}>
                                    {event.status?.name || 'Sin estado'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        Información Adicional
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Organizador:
                            </label>
                            <p className="text-gray-800">
                                {event.organizer?.name || 'No especificado'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Administrador:
                            </label>
                            <p className="text-gray-800">
                                {event.admin?.name || 'No especificado'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Creado:
                            </label>
                            <p className="text-gray-800">{event.created_at}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-bold mb-1">
                                Última Actualización:
                            </label>
                            <p className="text-gray-800">{event.updated_at}</p>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ✏️ Editar Evento
                    </Link>
                    <Link
                        href="/admin/events"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ← Volver a la Lista
                    </Link>
                </div>
            </div>
        </div>
    );
};

ShowEvent.layout = page => <AdminLayout>{page}</AdminLayout>;

export default ShowEvent;