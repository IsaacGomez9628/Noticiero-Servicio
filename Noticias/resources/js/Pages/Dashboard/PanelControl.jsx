import React from "react";
import {
    Calendar,
    Users,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";

export default function PanelDeControl({
    eventAttendances = [],
    stats = {},
    user,
}) {
    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha pendiente";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="pt-6 container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Panel de Control
            </h1>
            <p className="text-gray-600 mb-8">
                Resumen de tus asistencias a eventos y estadísticas
            </p>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <Calendar
                                    className="h-6 w-6 text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total de Registros
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {stats.total_registros || 0}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <a
                                href="/mis-asistencias"
                                className="font-medium text-blue-700 hover:text-blue-900"
                            >
                                Ver detalles
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <CheckCircle
                                    className="h-6 w-6 text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Confirmados
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {stats.registros_confirmados || 0}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <a
                                href="/mis-asistencias"
                                className="font-medium text-blue-700 hover:text-blue-900"
                            >
                                Ver detalles
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                                <AlertTriangle
                                    className="h-6 w-6 text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pendientes
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {stats.registros_pendientes || 0}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <a
                                href="/mis-asistencias"
                                className="font-medium text-blue-700 hover:text-blue-900"
                            >
                                Ver detalles
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                                <XCircle
                                    className="h-6 w-6 text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Cancelados
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {stats.registros_cancelados || 0}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <a
                                href="/mis-asistencias"
                                className="font-medium text-blue-700 hover:text-blue-900"
                            >
                                Ver detalles
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas institucionales (si aplica) */}
            {stats.total_registros_institucionales > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Estadísticas de Registros Institucionales
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                        <Users
                                            className="h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total de Asistentes
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stats.total_registros_institucionales ||
                                                        0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <a
                                        href="/mis-asistencias"
                                        className="font-medium text-blue-700 hover:text-blue-900"
                                    >
                                        Ver detalles
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                        <CheckCircle
                                            className="h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Confirmados
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stats.institucional_confirmados ||
                                                        0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <a
                                        href="/mis-asistencias"
                                        className="font-medium text-blue-700 hover:text-blue-900"
                                    >
                                        Ver detalles
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de actividad reciente */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Actividad Reciente
                </h2>

                {eventAttendances && eventAttendances.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {eventAttendances.slice(0, 5).map((attendance) => (
                                <li key={attendance.id}>
                                    <a
                                        href={`/evento/${attendance.event.id}`}
                                        className="block hover:bg-gray-50"
                                    >
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-blue-600 truncate">
                                                    {attendance.event.titulo ||
                                                        attendance.event.titule}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            attendance.status
                                                                ?.slug ===
                                                            "confirmado"
                                                                ? "bg-green-100 text-green-800"
                                                                : attendance
                                                                      .status
                                                                      ?.slug ===
                                                                  "cancelado"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {attendance.status
                                                            ?.nombre ||
                                                            "Pendiente"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        <Users
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        {attendance.tipo_registro ===
                                                        "institucional"
                                                            ? "Registro institucional"
                                                            : "Registro personal"}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <Calendar
                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <p>
                                                        <time>
                                                            {formatDate(
                                                                attendance.event
                                                                    .fecha_inicio ||
                                                                    attendance
                                                                        .event
                                                                        .start_date
                                                            )}
                                                        </time>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {eventAttendances.length > 5 && (
                            <div className="bg-gray-50 px-4 py-3 text-center">
                                <a
                                    href="/mis-asistencias"
                                    className="text-sm font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Ver todas mis asistencias
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                        <p className="text-gray-500">
                            No hay actividad reciente para mostrar.
                        </p>
                        <a
                            href="/eventos"
                            className="mt-3 inline-block font-medium text-blue-700 hover:text-blue-900"
                        >
                            Explorar eventos disponibles
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
