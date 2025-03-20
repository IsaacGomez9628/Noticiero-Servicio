import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/inertia-react";
import MainLayout from "@/Layouts/MainLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TrashIcon from "@/Components/icons/TrashIcon";

export default function RegistroEventoInstitucional({
    evento,
    empresa,
    usuarioAutenticado,
}) {
    const [asistentes, setAsistentes] = useState([
        {
            nombre: usuarioAutenticado.persona.nombre_completo || "",
            email: usuarioAutenticado.email || "",
            cargo: "",
        },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        empresa_id: empresa?.id || "",
        asistentes: asistentes,
    });

    const addAsistente = () => {
        if (asistentes.length < 5) {
            const nuevosAsistentes = [
                ...asistentes,
                { nombre: "", email: "", cargo: "" },
            ];
            setAsistentes(nuevosAsistentes);
            setData("asistentes", nuevosAsistentes);
        }
    };

    const removeAsistente = (index) => {
        if (asistentes.length > 1 && index > 0) {
            const nuevosAsistentes = asistentes.filter((_, i) => i !== index);
            setAsistentes(nuevosAsistentes);
            setData("asistentes", nuevosAsistentes);
        }
    };

    const updateAsistente = (index, field, value) => {
        const nuevosAsistentes = [...asistentes];
        nuevosAsistentes[index][field] = value;
        setAsistentes(nuevosAsistentes);
        setData("asistentes", nuevosAsistentes);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("eventos.registro.institucional", evento.id));
    };

    return (
        <MainLayout title={`Registro para ${evento.titulo}`}>
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Registro institucional para el evento
                        </h2>
                        <h3 className="mt-1 text-xl font-bold text-gray-900">
                            {evento.titulo}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {evento.fecha_inicio
                                ? new Date(
                                      evento.fecha_inicio
                                  ).toLocaleDateString()
                                : "Fecha por confirmar"}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-medium text-gray-700">
                                    Institución/Empresa:
                                </span>
                                <span className="text-lg text-gray-900">
                                    {empresa?.nombre || "No especificada"}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Asistentes
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Especifica los datos de las personas que
                                        asistirán al evento en representación de
                                        tu institución.
                                    </p>
                                </div>

                                {asistentes.map((asistente, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border border-gray-200 rounded-md bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-md font-medium text-gray-900">
                                                {index === 0
                                                    ? "Asistente principal"
                                                    : `Asistente adicional ${index}`}
                                            </h4>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAsistente(index)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                                            <div className="sm:col-span-4">
                                                <InputLabel
                                                    forInput={`asistentes[${index}].nombre`}
                                                    value="Nombre completo"
                                                />
                                                <TextInput
                                                    type="text"
                                                    name={`asistentes[${index}].nombre`}
                                                    value={asistente.nombre}
                                                    className="mt-1 block w-full"
                                                    handleChange={(e) =>
                                                        updateAsistente(
                                                            index,
                                                            "nombre",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    disabled={index === 0} // No permitir editar el asistente principal (usuario autenticado)
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `asistentes.${index}.nombre`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <InputLabel
                                                    forInput={`asistentes[${index}].email`}
                                                    value="Correo electrónico"
                                                />
                                                <TextInput
                                                    type="email"
                                                    name={`asistentes[${index}].email`}
                                                    value={asistente.email}
                                                    className="mt-1 block w-full"
                                                    handleChange={(e) =>
                                                        updateAsistente(
                                                            index,
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={index === 0} // No permitir editar el asistente principal
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `asistentes.${index}.email`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <InputLabel
                                                    forInput={`asistentes[${index}].cargo`}
                                                    value="Cargo"
                                                />
                                                <TextInput
                                                    type="text"
                                                    name={`asistentes[${index}].cargo`}
                                                    value={asistente.cargo}
                                                    className="mt-1 block w-full"
                                                    handleChange={(e) =>
                                                        updateAsistente(
                                                            index,
                                                            "cargo",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `asistentes.${index}.cargo`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {asistentes.length < 5 && (
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={addAsistente}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg
                                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Añadir asistente
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-6">
                                    <Link
                                        href={route("eventos.show", evento.id)}
                                    >
                                        <SecondaryButton type="button">
                                            Cancelar
                                        </SecondaryButton>
                                    </Link>

                                    <PrimaryButton
                                        className="ml-4"
                                        processing={processing}
                                    >
                                        Confirmar registro
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
