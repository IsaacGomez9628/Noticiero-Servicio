import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function EventoCard({ evento, asistenciasConfirmadas }) {
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha por definir";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Cabecera con imagen */}
            <div className="h-48 relative overflow-hidden">
                {evento.imagen ? (
                    <img
                        src={evento.imagen}
                        alt={evento.titulo}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {evento.titulo}
                    </div>
                )}
                <div className="absolute top-0 right-0 p-2">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                            evento.precio > 0
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {evento.precio > 0
                            ? `$${evento.precio.toFixed(2)}`
                            : "Gratis"}
                    </span>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {evento.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {evento.descripcion}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            {formatDate(evento.start_date)}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            {formatTime(evento.start_date)}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            {evento.location?.name || "Ubicación por confirmar"}
                        </span>
                    </div>
                </div>

                {/* Barra de capacidad */}
                {evento.capacity && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Capacidad</span>
                            <span>
                                {asistenciasConfirmadas}/{evento.capacity}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full ${
                                    asistenciasConfirmadas >= evento.capacity
                                        ? "bg-red-600"
                                        : "bg-blue-600"
                                }`}
                                style={{
                                    width: `${Math.min(
                                        (asistenciasConfirmadas /
                                            evento.capacity) *
                                            100,
                                        100
                                    )}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex space-x-2">
                    <a
                        href={`/evento/${evento.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm"
                    >
                        Ver detalles
                    </a>
                    <button
                        type="button"
                        onClick={() => openRegistrationModal(evento)}
                        disabled={asistenciasConfirmadas >= evento.capacity}
                        className={`flex-1 px-4 py-2 rounded-md border text-sm ${
                            asistenciasConfirmadas >= evento.capacity
                                ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                        {asistenciasConfirmadas >= evento.capacity
                            ? "Sin cupo"
                            : "Registrarse"}
                    </button>
                </div>
            </div>
        </div>
    );
}
