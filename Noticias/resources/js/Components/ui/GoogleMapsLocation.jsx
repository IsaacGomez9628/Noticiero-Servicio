import React, { useState } from "react";

const GoogleMapsLocation = ({ location, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Si no hay datos de ubicación válidos, mostrar mensaje
    if (
        !location ||
        (!location.latitude && !location.length && !location.direction)
    ) {
        return (
            <div
                className={`bg-gray-100 rounded-md p-4 text-center ${className}`}
            >
                <p className="text-gray-500">Ubicación no disponible</p>
            </div>
        );
    }

    // Preparar la URL de OpenStreetMap
    const getMapUrl = () => {
        // Si tenemos coordenadas, usarlas
        if (location.latitude && location.length) {
            // OpenStreetMap usa diferente formato para las coordenadas
            const lat = parseFloat(location.latitude);
            const lon = parseFloat(location.length);
            return `https://www.openstreetmap.org/export/embed.html?bbox=${
                lon - 0.01
            }%2C${lat - 0.01}%2C${lon + 0.01}%2C${
                lat + 0.01
            }&layer=mapnik&marker=${lat}%2C${lon}`;
        }

        // Si tenemos dirección, crear un enlace de nominatim (servicio de búsqueda de OSM)
        if (location.direction) {
            const address = `${location.direction}, ${location.city || ""}, ${
                location.estate || ""
            }`.trim();
            return `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                address
            )}&format=html`;
        }

        return null;
    };

    // URL directa para abrir en OpenStreetMap
    const getDirectMapUrl = () => {
        if (location.latitude && location.length) {
            const lat = parseFloat(location.latitude);
            const lon = parseFloat(location.length);
            return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;
        }

        const address = `${location.direction}, ${location.city || ""}, ${
            location.estate || ""
        }`.trim();
        return `https://www.openstreetmap.org/search?query=${encodeURIComponent(
            address
        )}`;
    };

    // Obtener la URL del mapa
    const mapUrl = getMapUrl();

    // Si no pudimos generar una URL de mapa
    if (!mapUrl) {
        return (
            <div
                className={`bg-gray-100 rounded-md p-4 text-center ${className}`}
            >
                <p className="text-gray-500">No se pudo generar el mapa</p>
                <a
                    href={getDirectMapUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                >
                    Ver en OpenStreetMap
                </a>
            </div>
        );
    }

    // Para mostrar un mapa expandible
    return (
        <div
            className={`${className} overflow-hidden transition-all duration-300`}
        >
            <div
                className={`relative ${isExpanded ? "h-[400px]" : "h-[200px]"}`}
            >
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                ></iframe>

                {/* Botón para expandir/contraer el mapa */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute bottom-2 right-2 bg-white py-1 px-3 rounded-full text-sm shadow-md hover:bg-gray-100 transition-colors z-10"
                >
                    {isExpanded ? "Contraer" : "Expandir"}
                </button>
            </div>

            <div className="flex justify-center mt-2">
                <a
                    href={getDirectMapUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                >
                    Abrir en OpenStreetMap
                </a>
            </div>
        </div>
    );
};

export default GoogleMapsLocation;
