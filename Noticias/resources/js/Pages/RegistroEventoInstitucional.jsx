import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Calendar, Clock, MapPin, Building, User } from "lucide-react";
import Swal from "sweetalert2";

export default function RegistroEventoInstitucional({
    evento,
    empresas = [],
    auth,
    yaRegistrado = false,
}) {
    const { data, setData, post, processing, errors } = useForm({
        empresa_id: empresas.length > 0 ? empresas[0].id : "",
        asistentes: [{ nombre: "", email: "", cargo: "" }],
        numero_asistentes: 1,
    });

    // Estado para controlar la adición de asistentes adicionales
    const [maxAsistentes, setMaxAsistentes] = useState(5);

    // Cargar información del usuario cuando el componente se monta
    useEffect(() => {
        // Verificamos primero que auth y user existan antes de usar sus propiedades
        if (auth?.user) {
            // Inicializar nombre del primer asistente con el del usuario si existe
            const nombreUsuario =
                auth.user?.nombre ||
                (auth.user?.persona
                    ? auth.user.persona.nombreCompleto ||
                      auth.user.persona.nombre
                    : "");

            const emailUsuario = auth.user?.email || "";

            if (nombreUsuario || emailUsuario) {
                const newAsistentes = [...data.asistentes];
                newAsistentes[0] = {
                    ...newAsistentes[0],
                    nombre: nombreUsuario,
                    email: emailUsuario,
                };
                setData("asistentes", newAsistentes);
            }
        }
    }, [auth]);

    // Función para mostrar alerta cuando el usuario ya está registrado
    const mostrarAlertaYaRegistrado = () => {
        Swal.fire({
            title: "¡Ya estás registrado!",
            text: "Ya tienes un registro activo para este evento.",
            icon: "info",
            confirmButtonText: "Ver mis asistencias",
            showCancelButton: true,
            cancelButtonText: "Volver a eventos",
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a la página de mis asistencias
                window.location.href = route("eventos.mis-asistencias");
            } else {
                // Redirigir a la página de eventos
                window.location.href = route("eventos.index");
            }
        });
    };

    // Verificar si el usuario ya está registrado cuando se monta el componente
    useEffect(() => {
        if (yaRegistrado) {
            mostrarAlertaYaRegistrado();
        }
    }, [yaRegistrado]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar si el usuario ya está registrado
        if (yaRegistrado) {
            mostrarAlertaYaRegistrado();
            return;
        }

        // Enviar el formulario
        post(route("eventos.registro.institucional", evento.id));
    };

    const handleAsistenteChange = (index, field, value) => {
        const newAsistentes = [...data.asistentes];
        newAsistentes[index] = {
            ...newAsistentes[index],
            [field]: value,
        };
        setData("asistentes", newAsistentes);
    };

    const addAsistente = () => {
        if (data.asistentes.length < maxAsistentes) {
            setData("asistentes", [
                ...data.asistentes,
                { nombre: "", email: "", cargo: "" },
            ]);
            setData("numero_asistentes", data.numero_asistentes + 1);
        }
    };

    const removeAsistente = (index) => {
        const newAsistentes = [...data.asistentes];
        newAsistentes.splice(index, 1);
        setData("asistentes", newAsistentes);
        setData("numero_asistentes", data.numero_asistentes - 1);
    };

    // Formatear fecha del evento
    const formatearFecha = (fecha) => {
        if (!fecha) return "Fecha por confirmar";
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Formatear hora del evento
    const formatearHora = (hora) => {
        if (!hora) return "Hora por confirmar";
        return hora;
    };

    return (
        <MainLayout>
            <Head
                title={`Registro Institucional - ${
                    evento.titulo || evento.titule
                }`}
            />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-2">
                    Registro Institucional
                </h1>
                <p className="text-gray-600 mb-6">
                    Registra asistentes para tu institución
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Información del evento */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    {evento.titulo || evento.titule}
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <span>
                                            {formatearFecha(
                                                evento.fecha_inicio ||
                                                    evento.start_date
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <span>
                                            {formatearHora(
                                                evento.hora || evento.start_time
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <span>
                                            {evento.direccion
                                                ?.direccion_completa ||
                                                evento.location?.direction ||
                                                "Ubicación por confirmar"}
                                        </span>
                                    </div>
                                </div>

                                {evento.capacity && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-600">
                                            Capacidad: {evento.capacity}{" "}
                                            personas
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Formulario de registro */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit}>
                                    {/* Selección de empresa */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">
                                            Selecciona tu empresa
                                        </h3>

                                        {empresas.length > 0 ? (
                                            <div>
                                                <label
                                                    htmlFor="empresa_id"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Empresa
                                                </label>
                                                <select
                                                    id="empresa_id"
                                                    value={data.empresa_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "empresa_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    required
                                                >
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
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.empresa_id}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 p-4 rounded-md">
                                                <p className="text-yellow-700">
                                                    No tienes empresas
                                                    registradas. Por favor,
                                                    registra una empresa en tu
                                                    perfil antes de continuar.
                                                </p>
                                                <a
                                                    href={route("perfil.edit")}
                                                    className="text-blue-600 font-medium hover:underline mt-2 inline-block"
                                                >
                                                    Ir a mi perfil
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sección de asistentes */}
                                    <div className="mt-8 border-t pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                Asistentes
                                            </h3>

                                            <div>
                                                <label
                                                    htmlFor="numero_asistentes"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Número de asistentes
                                                </label>
                                                <select
                                                    id="numero_asistentes"
                                                    value={
                                                        data.numero_asistentes
                                                    }
                                                    onChange={(e) => {
                                                        const num = parseInt(
                                                            e.target.value
                                                        );
                                                        setData(
                                                            "numero_asistentes",
                                                            num
                                                        );

                                                        // Ajustar el array de asistentes
                                                        let newAsistentes = [
                                                            ...data.asistentes,
                                                        ];
                                                        if (
                                                            num >
                                                            newAsistentes.length
                                                        ) {
                                                            // Añadir asistentes
                                                            while (
                                                                newAsistentes.length <
                                                                num
                                                            ) {
                                                                newAsistentes.push(
                                                                    {
                                                                        nombre: "",
                                                                        email: "",
                                                                        cargo: "",
                                                                    }
                                                                );
                                                            }
                                                        } else if (
                                                            num <
                                                            newAsistentes.length
                                                        ) {
                                                            // Eliminar asistentes
                                                            newAsistentes =
                                                                newAsistentes.slice(
                                                                    0,
                                                                    num
                                                                );
                                                        }
                                                        setData(
                                                            "asistentes",
                                                            newAsistentes
                                                        );
                                                    }}
                                                    className="p-2 border border-gray-300 rounded-md"
                                                >
                                                    {[
                                                        ...Array(
                                                            maxAsistentes
                                                        ).keys(),
                                                    ].map((i) => (
                                                        <option
                                                            key={i + 1}
                                                            value={i + 1}
                                                        >
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {data.asistentes.map(
                                            (asistente, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 bg-gray-50 rounded-md mb-4"
                                                >
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="font-medium">
                                                            {index === 0 ? (
                                                                <div className="flex items-center gap-1">
                                                                    <User className="h-4 w-4 text-blue-500" />
                                                                    <span>
                                                                        Asistente
                                                                        principal
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                `Asistente ${
                                                                    index + 1
                                                                }`
                                                            )}
                                                        </h4>
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeAsistente(
                                                                        index
                                                                    )
                                                                }
                                                                className="text-red-500 text-sm"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Nombre
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    asistente.nombre
                                                                }
                                                                onChange={(e) =>
                                                                    handleAsistenteChange(
                                                                        index,
                                                                        "nombre",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Email
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={
                                                                    asistente.email
                                                                }
                                                                onChange={(e) =>
                                                                    handleAsistenteChange(
                                                                        index,
                                                                        "email",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Cargo (opcional)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    asistente.cargo
                                                                }
                                                                onChange={(e) =>
                                                                    handleAsistenteChange(
                                                                        index,
                                                                        "cargo",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {data.asistentes.length <
                                            maxAsistentes && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addAsistente}
                                                className="mt-2"
                                            >
                                                + Añadir otro asistente
                                            </Button>
                                        )}
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="mt-8 flex justify-end space-x-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                window.history.back()
                                            }
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                empresas.length === 0
                                            }
                                        >
                                            {processing
                                                ? "Procesando..."
                                                : "Confirmar registro"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
