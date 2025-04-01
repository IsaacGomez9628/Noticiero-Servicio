import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import { Calendar, Clock, MapPin, Users, User, ArrowLeft } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function EventoDetalle({ evento, asistenciasConfirmadas }) {
    // Función para formatear fechas
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Función para formatear horas
    const formatearHora = (fecha) => {
        return new Date(fecha).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Componente para mostrar información con icono
    const InfoItem = ({ icon: Icon, label, value, link }) => (
        <div className="flex items-start gap-3 mb-4">
            <Icon className="h-5 w-5 text-primary mt-0.5" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-base">
                    {value}
                    {link && (
                        <Link
                            href={link.href}
                            className="ml-2 text-primary hover:underline text-sm"
                        >
                            {link.text}
                        </Link>
                    )}
                </p>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <Head title={evento.titulo} />

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Link
                    href={route("eventos.index")}
                    className="text-primary hover:underline mb-6 inline-flex items-center gap-1 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a eventos
                </Link>

                <div className="space-y-6">
                    {/* Imagen destacada y título */}
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                        <div className="h-72 w-full">
                            {evento.multimedia ? (
                                <img
                                    src={evento.multimedia.url}
                                    alt={evento.titulo}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src="/placeholder-event.jpg"
                                    alt="Imagen del evento"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
                            <div className="p-6 text-white">
                                <h1 className="text-3xl font-bold">
                                    {evento.titulo}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Columna izquierda: Descripción */}
                        <div className="md:col-span-2">
                            <Card className="shadow-sm">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <InfoItem
                                            icon={Calendar}
                                            label="Fecha"
                                            value={formatearFecha(
                                                evento.fecha_inicio
                                            )}
                                        />
                                        <InfoItem
                                            icon={Clock}
                                            label="Hora"
                                            value={formatearHora(
                                                evento.fecha_inicio
                                            )}
                                        />
                                        <InfoItem
                                            icon={MapPin}
                                            label="Ubicación"
                                            value={
                                                evento.direccion
                                                    ? evento.direccion
                                                          .direccion_completa
                                                    : "Evento virtual"
                                            }
                                        />
                                        <InfoItem
                                            icon={User}
                                            label="Organizador"
                                            value={
                                                evento.organizador?.persona
                                                    ?.nombre_completo ||
                                                "CEATVCC"
                                            }
                                        />
                                    </div>

                                    <div className="prose max-w-none">
                                        <h2 className="text-xl font-medium mb-3">
                                            Descripción
                                        </h2>
                                        <p className="text-gray-700">
                                            {evento.descripcion}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Columna derecha: Registro */}
                        <div>
                            <Card className="shadow-sm sticky top-4">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-medium mb-6">
                                        Registro
                                    </h2>
                                    // En EventoDetalles.jsx
                                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-blue-800 mb-2">
                                            Capacidad del evento
                                        </h3>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        asistenciasConfirmadas >=
                                                        evento.capacidad
                                                            ? "bg-red-600"
                                                            : "bg-blue-600"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            (asistenciasConfirmadas /
                                                                evento.capacidad) *
                                                                100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="ml-3 text-sm font-medium">
                                                {asistenciasConfirmadas}/
                                                {evento.capacidad} lugares
                                            </span>
                                        </div>

                                        {asistenciasConfirmadas >=
                                            evento.capacidad && (
                                            <p className="mt-2 text-red-600 text-sm">
                                                ¡Este evento ha alcanzado su
                                                capacidad máxima!
                                            </p>
                                        )}
                                    </div>
                                    <InfoItem
                                        icon={MapPin}
                                        label="Ubicación"
                                        value={
                                            evento.location?.name ||
                                            (typeof evento.location ===
                                                "object" &&
                                                evento.location.name) ||
                                            (typeof evento.location === "string"
                                                ? evento.location
                                                : "Ubicación por confirmar")
                                        }
                                        link={{
                                            href: route(
                                                "eventos.location",
                                                evento.id
                                            ),
                                            text: "Ver mapa",
                                        }}
                                    />
                                    <p className="text-sm text-muted-foreground mt-4 mb-6">
                                        Asegura tu lugar en este evento
                                        registrándote ahora.
                                    </p>
                                    <Link
                                        href={route(
                                            "eventos.registro.form",
                                            evento.id
                                        )}
                                    >
                                        <Button
                                            type="button"
                                            disabled={
                                                asistenciasConfirmadas >=
                                                evento.capacity
                                            }
                                            className={`px-4 py-2 rounded-md ${
                                                asistenciasConfirmadas >=
                                                evento.capacity
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700"
                                            } text-white`}
                                        >
                                            {asistenciasConfirmadas >=
                                            evento.capacidad
                                                ? "Evento sin cupo disponible"
                                                : "Registrarme al evento"}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
