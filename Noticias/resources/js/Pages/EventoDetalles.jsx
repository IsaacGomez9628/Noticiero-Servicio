import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import { Calendar, Clock, MapPin, Users, User } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function EventoDetalle({ evento }) {
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

    return (
        <MainLayout>
            <Head title={evento.titulo} />

            <div className="container mx-auto px-4 py-8">
                <Link
                    href={route("eventos.index")}
                    className="text-primary hover:underline mb-4 inline-block"
                >
                    &larr; Volver a eventos
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Card>
                            <div className="relative h-64 w-full">
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

                            <CardContent className="p-6">
                                <h1 className="text-3xl font-bold mb-4">
                                    {evento.titulo}
                                </h1>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Fecha
                                            </p>
                                            <p>
                                                {formatearFecha(
                                                    evento.fecha_inicio
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Hora
                                            </p>
                                            <p>
                                                {formatearHora(
                                                    evento.fecha_inicio
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Ubicación
                                            </p>
                                            <p>
                                                {evento.direccion
                                                    ? evento.direccion
                                                          .direccion_completa
                                                    : "Evento virtual"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Organizador
                                            </p>
                                            <p>
                                                {evento.organizador?.persona
                                                    ?.nombre_completo ||
                                                    "CEATVCC"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <h2 className="text-xl font-semibold mb-3">
                                        Descripción
                                    </h2>
                                    <p>{evento.descripcion}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Registro
                                </h2>
                                {evento.capacidad && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Capacidad
                                            </p>
                                            <p>{evento.capacidad} personas</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mb-6">
                                    <p className="text-muted-foreground mb-2">
                                        Asegura tu lugar en este evento
                                        registrándote ahora.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Ubicación
                                        </p>
                                        <p>
                                            {
                                                evento.direccion
                                                    .direccion_completa
                                            }
                                            <Link
                                                href={route(
                                                    "eventos.location",
                                                    evento.id
                                                )}
                                                className="ml-2 text-primary hover:underline"
                                            >
                                                Ver mapa
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route(
                                        "eventos.registro.form",
                                        evento.id
                                    )}
                                >
                                    <Button className="w-full">
                                        Registrarse
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
