import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import { Input } from "@/Components/Input";
import MainLayout from "@/Layouts/MainLayout";

export default function RegistroEvento({ evento, empresas }) {
    const [numAsistentes, setNumAsistentes] = useState(1);
    const [esEmpresa, setEsEmpresa] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        email: "",
        empresa_id: "",
        es_empresa: false,
        numero_asistentes: 1,
        asistentes: [{ nombre: "", email: "" }],
    });

    const updateAsistente = (index, field, value) => {
        const updatedAsistentes = [...data.asistentes];
        updatedAsistentes[index] = {
            ...updatedAsistentes[index],
            [field]: value,
        };
        setData("asistentes", updatedAsistentes);
    };

    const cambiarNumeroAsistentes = (num) => {
        setNumAsistentes(num);

        // Ajustar array de asistentes
        const asistentes = [...data.asistentes];
        if (num > asistentes.length) {
            // Añadir asistentes
            for (let i = asistentes.length; i < num; i++) {
                asistentes.push({ nombre: "", email: "" });
            }
        } else {
            // Reducir asistentes
            asistentes.splice(num);
        }

        setData({
            ...data,
            numero_asistentes: num,
            asistentes,
        });
    };

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
                                Registro para evento: {evento.titulo}
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
                                {/* Datos principales */}
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

                                    {/* Selección de tipo de registro */}
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={esEmpresa}
                                                onChange={(e) => {
                                                    setEsEmpresa(
                                                        e.target.checked
                                                    );
                                                    setData(
                                                        "es_empresa",
                                                        e.target.checked
                                                    );
                                                }}
                                                className="mr-2"
                                            />
                                            <span>
                                                Vengo de una empresa o
                                                institución
                                            </span>
                                        </label>
                                    </div>

                                    {/* Selector de empresa/institución */}
                                    {esEmpresa && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Selecciona tu organización *
                                            </label>
                                            <select
                                                value={data.empresa_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "empresa_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded-md"
                                                required={esEmpresa}
                                            >
                                                <option value="">
                                                    Selecciona una opción
                                                </option>
                                                {empresas.map((empresa) => (
                                                    <option
                                                        key={empresa.id}
                                                        value={empresa.id}
                                                    >
                                                        {empresa.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.empresa_id && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {errors.empresa_id}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Número de asistentes */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Número de asistentes
                                        </label>
                                        <select
                                            value={numAsistentes}
                                            onChange={(e) =>
                                                cambiarNumeroAsistentes(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full p-2 border rounded-md"
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Formularios para asistentes adicionales */}
                                {numAsistentes > 1 && (
                                    <div className="mb-8">
                                        <h3 className="font-medium mb-4 text-lg border-b pb-2">
                                            Información de asistentes
                                            adicionales
                                        </h3>

                                        {data.asistentes
                                            .slice(1)
                                            .map((asistente, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 border rounded-md mb-4 bg-gray-50"
                                                >
                                                    <h4 className="font-medium mb-3">
                                                        Asistente {index + 2}
                                                    </h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm mb-1">
                                                                Nombre completo
                                                                *
                                                            </label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    asistente.nombre
                                                                }
                                                                onChange={(e) =>
                                                                    updateAsistente(
                                                                        index +
                                                                            1,
                                                                        "nombre",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm mb-1">
                                                                Email
                                                            </label>
                                                            <Input
                                                                type="email"
                                                                value={
                                                                    asistente.email
                                                                }
                                                                onChange={(e) =>
                                                                    updateAsistente(
                                                                        index +
                                                                            1,
                                                                        "email",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}

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
