import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button, Card, CardContent } from "@/Components";

export default function RegistroEventoForm({ evento, empresas }) {
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
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                    Registro para evento: {evento.titulo}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Datos principales */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.nombre && (
                            <div className="text-red-500 text-sm">
                                {errors.nombre}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.email && (
                            <div className="text-red-500 text-sm">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Selección de tipo de registro */}
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={esEmpresa}
                                onChange={(e) => {
                                    setEsEmpresa(e.target.checked);
                                    setData("es_empresa", e.target.checked);
                                }}
                                className="mr-2"
                            />
                            <span>Vengo de una empresa o institución</span>
                        </label>
                    </div>

                    {/* Selector de empresa/institución */}
                    {esEmpresa && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Selecciona tu organización *
                            </label>
                            <select
                                value={data.empresa_id}
                                onChange={(e) =>
                                    setData("empresa_id", e.target.value)
                                }
                                className="w-full p-2 border rounded"
                                required={esEmpresa}
                            >
                                <option value="">Selecciona una opción</option>
                                {empresas.map((empresa) => (
                                    <option key={empresa.id} value={empresa.id}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.empresa_id && (
                                <div className="text-red-500 text-sm">
                                    {errors.empresa_id}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Número de asistentes */}
                    <div className="mb-4">
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
                            className="w-full p-2 border rounded"
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Formularios para asistentes adicionales */}
                    {numAsistentes > 1 && (
                        <div className="mb-6">
                            <h3 className="font-medium mb-3">
                                Información de asistentes adicionales
                            </h3>

                            {data.asistentes
                                .slice(1)
                                .map((asistente, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded mb-3"
                                    >
                                        <h4 className="font-medium mb-2">
                                            Asistente {index + 2}
                                        </h4>
                                        <div className="mb-2">
                                            <label className="block text-sm mb-1">
                                                Nombre completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={asistente.nombre}
                                                onChange={(e) =>
                                                    updateAsistente(
                                                        index + 1,
                                                        "nombre",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={asistente.email}
                                                onChange={(e) =>
                                                    updateAsistente(
                                                        index + 1,
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    <Button type="submit" disabled={processing}>
                        Confirmar asistencia
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
