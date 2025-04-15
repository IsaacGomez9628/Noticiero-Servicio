import React from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { CheckCircle, Calendar, Clock, MapPin, Ticket } from "lucide-react";

export default function RegistroConfirmado({ evento, registro, success }) {
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
                        <Link href={route("eventos.index")}>
                            <Button>Volver a Eventos</Button>
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
                    <Card className="overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-6">
                                <CheckCircle className="h-16 w-16 text-green-500" />
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
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <p>
                                            <span className="font-medium">
                                                Fecha:
                                            </span>{" "}
                                            {formatDate(
                                                evento.fecha_inicio ||
                                                    evento.start_date
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <p>
                                            <span className="font-medium">
                                                Hora:
                                            </span>{" "}
                                            {formatTime(
                                                evento.hora || evento.start_time
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <p>
                                            <span className="font-medium">
                                                Ubicación:
                                            </span>{" "}
                                            {evento.location?.name ||
                                                evento.direccion
                                                    ?.direccion_completa ||
                                                "Por confirmar"}
                                        </p>
                                    </div>
                                    {registro && registro.codigo_registro && (
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-gray-500" />
                                            <p>
                                                <span className="font-medium">
                                                    Código de registro:
                                                </span>{" "}
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                    {registro.codigo_registro}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                                <h3 className="font-medium mb-2 text-blue-800">
                                    Información importante
                                </h3>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5">•</span>
                                        <span>
                                            Se ha enviado un correo de
                                            confirmación a tu dirección de
                                            email.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5">•</span>
                                        <span>
                                            Por favor, llega 15 minutos antes
                                            del inicio del evento.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5">•</span>
                                        <span>
                                            No olvides tu código de registro
                                            para acceder al evento.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href={route("eventos.show", evento.id)}>
                                    <Button variant="outline">
                                        Ver detalles del evento
                                    </Button>
                                </Link>
                                <Link href={route("eventos.index")}>
                                    <Button>Explorar más eventos</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return "Fecha por confirmar";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Función para formatear horas
function formatTime(timeString) {
    if (!timeString) return "Hora por confirmar";

    // Si es una fecha/hora completa, extraer solo la hora
    if (timeString.includes("T") || timeString.includes("-")) {
        const date = new Date(timeString);
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Si ya es solo una hora en formato HH:MM:SS
    return timeString.substring(0, 5);
}
