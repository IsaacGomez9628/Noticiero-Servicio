import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function EventoCard({ evento }) {
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
        <div className="bg-white overflow-hidden shadow rounded-lg">
            {evento.multimedia && (
                <div className="h-48 w-full overflow-hidden">
                    <img
                        src={evento.multimedia.url_complete}
                        alt={evento.titulo}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                    {evento.titulo}
                </h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{formatDate(evento.fecha_inicio)}</span>
                </div>
                {evento.direccion && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="truncate">
                            {evento.direccion.calle?.direccion_calle},{" "}
                            {evento.direccion.ciudad?.nombre}
                        </span>
                    </div>
                )}
                {evento.modalidad && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{evento.modalidad}</span>
                    </div>
                )}
                <div className="mt-4">
                    <Link
                        href={route("eventos.show", evento.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Ver detalles
                    </Link>
                </div>
            </div>
        </div>
    );
}
