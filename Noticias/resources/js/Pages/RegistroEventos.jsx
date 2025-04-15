import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Calendar, Clock, MapPin } from "lucide-react";
import Swal from "sweetalert2";

export default function RegistroEventos({
    evento,
    auth,
    isPersonal = false,
    yaRegistrado = false,
}) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: auth.user?.nombre || "",
        email: auth.user?.email || "",
        telefono: "",
        numero_asistentes: 1,
        asistentes: [{ nombre: "", email: "", cargo: "" }],
    });

    // Estado para controlar la adición de asistentes adicionales
    const [maxAsistentes, setMaxAsistentes] = useState(5);

    // Estado para controlar si el usuario ya está registrado en este evento
    const [registroExistente, setRegistroExistente] = useState(yaRegistrado);

    // Cargar información del usuario cuando el componente se monta y verificar si ya está registrado
    useEffect(() => {
        if (auth.user) {
            setData({
                ...data,
                nombre: auth.user.nombre || "",
                email: auth.user.email || "",
            });

            // Comprobar si el usuario ya está registrado en este evento
            checkExistingRegistration();
        }
    }, [auth.user]);

    // Función para verificar si el usuario ya está registrado en este evento
    const checkExistingRegistration = async () => {
        try {
            // Si ya viene con la propiedad yaRegistrado como true, mostramos el mensaje
            if (yaRegistrado) {
                mostrarAlertaYaRegistrado();
                return;
            }

            // Aquí se podría hacer una petición al servidor para verificar el registro
            // pero como ya tenemos la información en el controlador, simplemente
            // utilizamos la prop yaRegistrado
        } catch (error) {
            console.error("Error al verificar registro existente:", error);
        }
    };

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

    // Determinar si el usuario es institucional
    const esUsuarioInstitucional = () => {
        return auth.user?.tipoUsuario?.nombre === "Institucional";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar primero si el usuario ya está registrado
        if (registroExistente) {
            mostrarAlertaYaRegistrado();
            return;
        }

        // Enviar a la ruta correcta según el tipo de usuario
        if (esUsuarioInstitucional()) {
            post(route("eventos.registro.institucional", evento.id));
        } else {
            post(route("eventos.registro", evento.id));
        }
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

    // Verificar si el usuario ya está registrado cuando se monta el componente
    useEffect(() => {
        if (yaRegistrado) {
            mostrarAlertaYaRegistrado();
        }
    }, []);

    return (
        <MainLayout>
            <Head title={`Registro para ${evento.titulo || evento.titule}`} />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Registro para evento
                </h1>

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
                                    {/* Datos personales */}
                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-lg font-semibold">
                                            Tus datos
                                        </h3>

                                        <div>
                                            <label
                                                htmlFor="nombre"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Nombre completo
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                value={data.nombre}
                                                onChange={(e) =>
                                                    setData(
                                                        "nombre",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.nombre && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.nombre}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="telefono"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Teléfono (opcional)
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefono"
                                                value={data.telefono}
                                                onChange={(e) =>
                                                    setData(
                                                        "telefono",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            {errors.telefono && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.telefono}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sección de asistentes adicionales - Solo visible para cuentas institucionales */}
                                    {esUsuarioInstitucional() && (
                                        <div className="mt-8 border-t pt-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">
                                                    Asistentes adicionales
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
                                                            const num =
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                );
                                                            setData(
                                                                "numero_asistentes",
                                                                num
                                                            );

                                                            // Ajustar el array de asistentes
                                                            let newAsistentes =
                                                                [
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
                                                                {index === 0
                                                                    ? "Asistente principal"
                                                                    : `Asistente ${
                                                                          index +
                                                                          1
                                                                      }`}
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
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAsistenteChange(
                                                                            index,
                                                                            "nombre",
                                                                            e
                                                                                .target
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
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAsistenteChange(
                                                                            index,
                                                                            "email",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Cargo
                                                                    (opcional)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        asistente.cargo
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAsistenteChange(
                                                                            index,
                                                                            "cargo",
                                                                            e
                                                                                .target
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
                                    )}

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
                                            disabled={processing}
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
