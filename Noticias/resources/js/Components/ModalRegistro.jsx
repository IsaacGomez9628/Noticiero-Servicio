import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function ModalRegistro({
    isOpen,
    onClose,
    evento,
    empresas = [],
    auth,
}) {
    // Estado para datos del formulario
    const { data, setData, post, processing, errors } = useForm({
        nombre: auth?.user?.name || "",
        email: auth?.user?.email || "",
        telefono: "",
        numero_asistentes: 1,
    });

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Enviar formulario - IMPORTANTE: URL correcta
        post(`/evento/${evento.id}/registro`, {
            onSuccess: () => {
                console.log("Registro exitoso");
                onClose();
            },
            onError: (errors) => {
                console.error("Errores en el registro:", errors);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                    Registro para: {evento.titulo || evento.titule}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                            {errors.nombre && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Teléfono (opcional)
                            </label>
                            <input
                                type="tel"
                                value={data.telefono}
                                onChange={(e) =>
                                    setData("telefono", e.target.value)
                                }
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {processing
                                ? "Procesando..."
                                : "Confirmar registro"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
