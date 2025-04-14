import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import MainLayout from "@/Layouts/MainLayout";

export default function RegistroEvento({ evento, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: auth.user?.name || "",
        email: auth.user?.email || "",
        telefono: "",
        // Eliminar campos relacionados con múltiples asistentes
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("eventos.registro", evento.id));
    };

    return (
        <MainLayout>
            <Head title={`Registro para ${evento.titulo}`} />

            <div className="container mx-auto px-4 py-8">
                <Link
                    href={route("eventos.show", evento.id)}
                    className="text-primary hover:underline mb-4 inline-block"
                >
                    &larr; Volver al evento
                </Link>

                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardContent className="p-6">
                            <h1 className="text-2xl font-bold mb-6">
                                Registro personal para evento: {evento.titulo}
                            </h1>

                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 text-blue-600"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-blue-800">
                                            Información del evento
                                        </h3>
                                        <p className="text-sm text-blue-600">
                                            {formatearFecha(
                                                evento.fecha_inicio
                                            )}{" "}
                                            a las{" "}
                                            {formatearHora(evento.fecha_inicio)}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            {evento.direccion
                                                ? evento.direccion
                                                      .direccion_completa
                                                : "Evento virtual"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Datos del asistente principal */}
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Nombre completo *
                                        </label>
                                        <Input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) =>
                                                setData(
                                                    "nombre",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                            required
                                        />
                                        {errors.nombre && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.nombre}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Email *
                                        </label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full"
                                            required
                                        />
                                        {errors.email && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Teléfono (opcional)
                                        </label>
                                        <Input
                                            type="tel"
                                            value={data.telefono}
                                            onChange={(e) =>
                                                setData(
                                                    "telefono",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={route("eventos.show", evento.id)}
                                    >
                                        <Button variant="outline" type="button">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        Confirmar asistencia
                                    </Button>
                                </div>
                            </form>
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
