import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";

export default function RegistroConfirmado({ evento, registro }) {
    return (
        <MainLayout>
            <Head title="Registro Confirmado" />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-12 h-12 text-green-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">
                            ¡Registro Confirmado!
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Tu asistencia al evento ha sido registrada
                            correctamente.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Detalles del evento
                            </h2>

                            <div className="mb-6">
                                <h3 className="font-medium text-lg">
                                    {evento.titulo}
                                </h3>
                                <p className="text-gray-600">
                                    {formatearFecha(evento.fecha_inicio)} a las{" "}
                                    {formatearHora(evento.fecha_inicio)}
                                </p>
                                <p className="text-gray-600">
                                    {evento.direccion
                                        ? evento.direccion.direccion_completa
                                        : "Evento virtual"}
                                </p>
                            </div>

                            <div className="mb-6 p-4 bg-blue-50 rounded-lg text-left">
                                <h3 className="font-medium mb-2 text-blue-800">
                                    Información importante
                                </h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>
                                        • Hemos enviado un correo de
                                        confirmación a tu dirección de email.
                                    </li>
                                    <li>
                                        • Por favor, llega 15 minutos antes del
                                        inicio del evento.
                                    </li>
                                    <li>
                                        • Si tienes alguna pregunta, contáctanos
                                        al correo eventos@ejemplo.com
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
                                    <Button>Ver más eventos</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}

// Función para formatear fechas
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Función para formatear horas
function formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
