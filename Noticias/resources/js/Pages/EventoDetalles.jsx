import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    User,
    ArrowLeft,
    Heart,
    Share2,
    DownloadIcon,
} from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import GoogleMapsLocation from "@/Components/ui/GoogleMapsLocation";

export default function EventoDetalle({ evento, asistenciasConfirmadas = 0 }) {
    // Add default value to prevent undefined errors
    const [counter, setCounter] = useState(1);

    // Función para formatear fechas
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const { auth } = usePage().props;

    // Función para formatear horas
    const formatearHora = (hora) => {
        if (!hora) return "Hora no especificada";

        // Check if hora is already a Date object or a string
        if (typeof hora === "string") {
            // If it's just a time string like "10:00:00"
            if (hora.indexOf(":") > -1 && hora.length <= 8) {
                const [hours, minutes] = hora.split(":");
                return `${hours}:${minutes}`;
            }

            // Otherwise try to parse it as a full datetime
            return new Date(hora).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        return new Date(hora).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Función para disminuir contador
    const decreaseCounter = () => {
        if (counter > 0) {
            setCounter(0);
        }
    };

    // Componente para mostrar información con icono
    const InfoItem = ({ icon: Icon, label, value, link }) => (
        <div className="flex items-start gap-3 mb-4">
            <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-base font-medium">
                    {value}
                    {link && (
                        <Link
                            href={link.href}
                            className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                            {link.text}
                        </Link>
                    )}
                </p>
            </div>
        </div>
    );

    // Get the capacidad safely
    const capacidad = evento.capacidad || evento.capacity || 100;
    // Safe access to asistenciasConfirmadas
    const confirmedAttendees = asistenciasConfirmadas || 0;

    return (
        <MainLayout>
            <Head title={evento.titulo || "Detalles del evento"} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Event Header - Eventbrite Style */}
                <div className="mb-8">
                    <p className="text-gray-600 mb-2">
                        {formatearFecha(evento.fecha_inicio)}
                    </p>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {evento.titulo || "Título del evento"}
                    </h1>
                    <p className="text-gray-700 mb-4">
                        {evento.descripcion &&
                            evento.descripcion.substring(0, 140)}
                        {evento.descripcion && evento.descripcion.length > 140
                            ? "..."
                            : ""}
                    </p>

                    <div className="flex items-center mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                                <img
                                    src={
                                        evento.organizador?.imagen ||
                                        "/placeholder-organizer.jpg"
                                    }
                                    alt="Organizador"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/placeholder-organizer.jpg";
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Por:</p>
                                <p className="font-medium">
                                    {evento.organizador?.persona?.nombres ||
                                        evento.organizador?.persona
                                            ?.nombre_completo ||
                                        (evento.organizador &&
                                            evento.organizador.name) ||
                                        "CEATVCC"}
                                </p>
                            </div>
                        </div>

                        <div className="ml-8">
                            <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-5 py-2 flex items-center gap-2">
                                <Heart className="h-5 w-5" />
                                <span>Seguir</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2">
                        {/* Event Image */}
                        <div className="rounded-lg overflow-hidden bg-gray-100 mb-8">
                            {evento.imagen ? (
                                <img
                                    src={evento.imagen}
                                    alt={evento.titulo}
                                    className="w-full h-auto object-cover"
                                />
                            ) : (
                                <img
                                    src="/placeholder-event.jpg"
                                    alt="Imagen del evento"
                                    className="w-full h-96 object-cover"
                                />
                            )}
                        </div>

                        {/* Date and Time Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Fecha y hora
                            </h2>
                            <div className="flex items-start gap-3 mb-4">
                                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {formatearFecha(evento.fecha_inicio)}
                                    </p>
                                    <p className="text-gray-600">
                                        {formatearHora(
                                            evento.hora || evento.start_time
                                        )}{" "}
                                        PDT
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Ubicacion
                            </h2>
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    {evento.modalidad === "Virtual" ? (
                                        <p className="font-medium"></p>
                                    ) : (
                                        <p className="font-medium">
                                            {evento.direccion
                                                ?.direccion_completa ||
                                                (evento.location &&
                                                    (typeof evento.location ===
                                                    "string"
                                                        ? evento.location
                                                        : evento.location
                                                              .direction
                                                        ? `${evento.location.direction}, ${evento.location.city}`
                                                        : evento.location
                                                              .name)) ||
                                                "Ubicación por confirmar"}
                                        </p>
                                    )}

                                    <Link
                                        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                                            evento.location?.direction
                                                ? `${evento.location.direction}, ${evento.location.city}`
                                                : "Ubicación por confirmar"
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver mapa
                                    </Link>
                                </div>
                            </div>
                            <GoogleMapsLocation
                                location={evento.location}
                                className="mt-4"
                            />
                        </div>

                        {/* About Event Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Acerca del evento
                            </h2>

                            <div className="flex items-center gap-2 mb-4 text-gray-600">
                                <Clock className="h-5 w-5" />
                                <span>
                                    Event lasts {evento.duracion || 3} hours
                                </span>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-line">
                                    {evento.descripcion}
                                </p>

                                {/* If you have categories or tags */}
                                {evento.categorias && (
                                    <div className="mt-6">
                                        <p className="font-medium mb-2">
                                            Categorias:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {evento.categorias.map(
                                                (cat, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                                    >
                                                        {cat.nombre}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration Card */}
                    <div>
                        <div className="sticky top-4">
                            <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                                <CardContent className="p-0">
                                    {/* RSVP Header - MODIFICADO: solo permite un registro */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-bold">
                                                Registro
                                            </h3>
                                            <div className="flex items-center">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 mr-2"
                                                    onClick={decreaseCounter}
                                                    disabled={counter === 0}
                                                >
                                                    <span>-</span>
                                                </button>
                                                <span className="mx-2 text-lg">
                                                    {counter}
                                                </span>
                                                {/* Botón + eliminado */}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <span className="font-medium mr-2">
                                                {evento.its_free
                                                    ? "Free"
                                                    : `$${evento.precio || 0}`}
                                            </span>
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                                <path
                                                    d="M12 8V12M12 16H12.01"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Capacity display */}
                                    {capacidad && (
                                        <div className="px-6 py-3 bg-gray-50">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-600">
                                                    Capacidad
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {confirmedAttendees}/
                                                    {capacidad} Lugares
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        confirmedAttendees >=
                                                        capacidad
                                                            ? "bg-red-600"
                                                            : "bg-blue-600"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            (confirmedAttendees /
                                                                capacidad) *
                                                                100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            {confirmedAttendees >=
                                                capacidad && (
                                                <p className="mt-1 text-red-600 text-sm">
                                                    ¡Este evento ha alcanzado su
                                                    capacidad máxima!
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Register button */}
                                    <div className="p-6">
                                        {auth && auth.user ? (
                                            <Link
                                                href={route(
                                                    "eventos.registro.form",
                                                    evento.id
                                                )}
                                            >
                                                <Button
                                                    className={`w-full py-3 rounded-md ${
                                                        confirmedAttendees >=
                                                        capacidad
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-orange-600 hover:bg-orange-700"
                                                    } text-white font-medium`}
                                                    disabled={
                                                        confirmedAttendees >=
                                                        capacidad
                                                    }
                                                >
                                                    {confirmedAttendees >=
                                                    capacidad
                                                        ? "Evento sin cupo disponible"
                                                        : "Reserve a spot"}
                                                </Button>
                                            </Link>
                                        ) : (
                                            <div>
                                                <Button
                                                    onClick={() =>
                                                        (window.location.href =
                                                            route("login", {
                                                                redirect: route(
                                                                    "eventos.show",
                                                                    evento.id
                                                                ),
                                                            }))
                                                    }
                                                    className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                                >
                                                    Inicia sesión para
                                                    registrarte
                                                </Button>
                                                <p className="text-sm text-gray-500 mt-2 text-center">
                                                    Necesitas una cuenta para
                                                    registrarte a este evento
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-center mt-4">
                                            <Button className="bg-white text-gray-600 hover:bg-gray-50 px-4 py-2 flex items-center gap-2 mr-3">
                                                <Share2 className="h-4 w-4" />
                                                <span>Compartir</span>
                                            </Button>

                                            <Button className="bg-white text-gray-600 hover:bg-gray-50 px-4 py-2 flex items-center gap-2">
                                                <DownloadIcon className="h-4 w-4" />
                                                <span>Guardar</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Organizer Information */}
                            <div className="mt-6">
                                <h3 className="text-xl font-bold mb-4">
                                    Organizado por:
                                </h3>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                                            <img
                                                src={
                                                    evento.organizador
                                                        ?.imagen ||
                                                    "/placeholder-organizer.jpg"
                                                }
                                                alt="Organizador"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/placeholder-organizer.jpg";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {evento.organizador?.persona
                                                    ?.nombres ||
                                                    evento.organizador?.persona
                                                        ?.nombre_completo ||
                                                    (evento.organizador &&
                                                        evento.organizador
                                                            .name) ||
                                                    "CEATVCC"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {evento.organizador
                                                    ?.eventos_organizados ||
                                                    0}{" "}
                                                events hosted
                                            </p>
                                        </div>
                                    </div>

                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">
                                        Contacto
                                    </Button>
                                </div>

                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 w-full mt-2">
                                    Seguir
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
