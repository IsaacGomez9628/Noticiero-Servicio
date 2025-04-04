import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function AsistenteRow({ asistente }) {
    const formatDate = (dateString) => {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <li>
            <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">
                            {asistente.nombre}
                        </p>
                        {asistente.es_titular && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Titular
                            </span>
                        )}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${
                  asistente.asistio
                      ? "bg-green-100 text-green-800"
                      : asistente.status?.nombre === "Pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }`}
                        >
                            {asistente.asistio
                                ? "Asistió"
                                : asistente.status?.nombre || "Sin estado"}
                        </span>
                    </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                            {asistente.email && (
                                <>
                                    <svg
                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="truncate">
                                        {asistente.email}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
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
                        <span>
                            Registrado el {formatDate(asistente.fecha_registro)}
                            {asistente.evento?.titulo && (
                                <>
                                    {" "}
                                    para{" "}
                                    <strong>{asistente.evento.titulo}</strong>
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
}
