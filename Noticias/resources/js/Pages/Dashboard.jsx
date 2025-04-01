import React from "react";
import { Calendar, Users, FileText, Clock, MapPin } from "lucide-react";

export default function Dashboard({
    eventAttendances = [],
    companyAttendances = [],
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

    // Estadísticas principales
    const stats = [
        {
            name: "Eventos Disponibles",
            value: "12", // Idealmente esto debería venir del backend
            icon: Calendar,
            color: "bg-blue-500",
        },
        {
            name: "Mis Asistencias",
            value: eventAttendances?.length || "0",
            icon: Users,
            color: "bg-green-500",
        },
        {
            name: "Noticias Recientes",
            value: "8", // Idealmente esto debería venir del backend
            icon: FileText,
            color: "bg-amber-500",
        },
        {
            name: "Próximos Eventos",
            value: "3", // Idealmente esto debería venir del backend
            icon: Clock,
            color: "bg-purple-500",
        },
    ];

    // Verificar si el usuario es institucional
    const isInstitutional = user?.roles?.some((role) => role.id === 6); // Asumiendo que el rol 6 es institucional

    return (
        <div className="pt-6 container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Bienvenido, {user?.name || "Usuario"}
            </h1>
            <p className="text-gray-600 mb-8">
                Aquí puedes administrar tus eventos, noticias y más.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div
                                    className={`flex-shrink-0 ${item.color} rounded-md p-3`}
                                >
                                    <item.icon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {item.name}
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                {item.value}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <a
                                    href={
                                        item.name === "Mis Asistencias"
                                            ? "/mis-asistencias"
                                            : "#"
                                    }
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Ver detalles
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sección de Mis Registros */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Mis Registros a Eventos
                </h2>

                {eventAttendances && eventAttendances.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {eventAttendances.map((attendance) => (
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
                                                        <Calendar
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        {formatDate(
                                                            attendance.event
                                                                .fecha_inicio ||
                                                                attendance.event
                                                                    .start_date
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <MapPin
                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <p>
                                                        {attendance.event
                                                            .location?.name ||
                                                            "Ubicación por confirmar"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                        <p className="text-gray-500">
                            No te has registrado a ningún evento aún.
                        </p>
                        <a
                            href="/eventos"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                            Ver eventos disponibles
                        </a>
                    </div>
                )}
            </div>

            {/* Sección de Registros Institucionales (solo para usuarios institucionales) */}
            {isInstitutional &&
                companyAttendances &&
                companyAttendances.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Registros Institucionales
                        </h2>
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {companyAttendances.map((attendance) => (
                                    <li key={attendance.id}>
                                        <a
                                            href={`/evento/${attendance.event.id}`}
                                            className="block hover:bg-gray-50"
                                        >
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-600 truncate">
                                                            {attendance.event
                                                                .titulo ||
                                                                attendance.event
                                                                    .titule}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Asistente:{" "}
                                                            {attendance.nombre}
                                                        </p>
                                                    </div>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <p
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                attendance
                                                                    .status
                                                                    ?.slug ===
                                                                "confirmado"
                                                                    ? "bg-green-100 text-green-800"
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
                                                            <Calendar
                                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                            {formatDate(
                                                                attendance.event
                                                                    .fecha_inicio ||
                                                                    attendance
                                                                        .event
                                                                        .start_date
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <MapPin
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        <p>
                                                            {attendance.event
                                                                .location
                                                                ?.name ||
                                                                "Ubicación por confirmar"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
        </div>
    );
}
