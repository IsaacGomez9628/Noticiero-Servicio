import React from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

export default function RegistroConfirmado({ evento, registro, success }) {
    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha por confirmar";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long", 
            day: "numeric",
        });
    };

    // Función para formatear horas
    const formatTime = (timeString) => {
        if (!timeString) return "18:00";
        // Si viene como string de hora (ej: "18:00:00")
        if (typeof timeString === "string" && timeString.includes(":")) {
            return timeString.substring(0, 5); // Tomar solo HH:MM
        }
        // Si viene como fecha completa
        const date = new Date(timeString);
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!evento) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
                            <p className="text-yellow-800">
                                No se encontró información del evento. Por
                                favor, regresa a la lista de eventos.
                            </p>
                        </div>
                        <Link
                            href="/eventos"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Volver a Eventos
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                ¡Registro Confirmado!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Tu asistencia al evento ha sido registrada
                                correctamente.
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                                <h2 className="font-medium text-lg text-gray-900 mb-2">
                                    {evento.titulo || evento.titule}
                                </h2>

                                <div className="space-y-2 text-gray-600">
                                    <p>
                                        <span className="font-medium">
                                            Fecha:
                                        </span>{" "}
                                        {formatDate(
                                            evento.fecha_inicio ||
                                                evento.start_date ||
                                                evento.fecha
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Hora:
                                        </span>{" "}
                                        {formatTime(
                                            evento.hora ||
                                                evento.start_time ||
                                                evento.fecha_inicio ||
                                                evento.start_date
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Ubicación:
                                        </span>{" "}
                                        {evento.location?.name ||
                                            "Por confirmar"}
                                    </p>
                                    {registro && registro.codigo_registro && (
                                        <p>
                                            <span className="font-medium">
                                                Código de registro:
                                            </span>{" "}
                                            {registro.codigo_registro}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                                <h3 className="font-medium mb-2 text-blue-800">
                                    Información importante
                                </h3>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    <li>
                                        • Se ha enviado un correo de
                                        confirmación a tu dirección de email.
                                    </li>
                                    <li>
                                        • Por favor, llega 15 minutos antes del
                                        inicio del evento.
                                    </li>
                                    <li>
                                        • No olvides tu código de registro para
                                        acceder al evento.
                                    </li>
                                </ul>
                            </div>

                            {/* SECCIÓN DE BOTONES CON EL NUEVO BOTÓN REGRESAR */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                {/* NUEVO BOTÓN REGRESAR */}
                                <Link
                                    href="/eventos"
                                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    ← Regresar
                                </Link>
                                
                                {/* Botón Ver detalles del evento */}
                                <Link
                                    href={`/evento/${evento.id}/detalles`}
                                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Ver detalles del evento
                                </Link>
                                
                                {/* Botón Explorar más eventos */}
                                <Link
                                    href="/eventos"
                                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Explorar más eventos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}