import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/Dialog";
import { Button } from "@/Components/Button";
import { Input } from "@/Components/Input";
import { Label } from "@/Components/Label";
import { useForm } from "@inertiajs/react";

// Modal de registro para eventos
export default function RegistroEventoModal({
    isOpen,
    onClose,
    evento,
    empresas,
    auth,
}) {
    // Estado para el tipo de registro
    const [esEmpresa, setEsEmpresa] = useState(false);
    const [numAsistentes, setNumAsistentes] = useState(1);
    const [paso, setPaso] = useState(1); // 1: Verificación sesión, 2: Formulario registro, 3: Confirmación

    // Inicializar formulario con Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: auth?.user?.nombre || "",
        email: auth?.user?.email || "",
        empresa_id: "",
        es_empresa: false,
        numero_asistentes: 1,
        asistentes: [{ nombre: "", email: "" }],
    });

    // Actualizar formulario cuando cambia el usuario autenticado
    useEffect(() => {
        if (auth?.user) {
            setData({
                ...data,
                nombre: auth.user.nombre || "",
                email: auth.user.email || "",
            });
        }
    }, [auth]);

    // Manejar cambio en el número de asistentes
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

    // Actualizar datos de un asistente
    const updateAsistente = (index, field, value) => {
        const updatedAsistentes = [...data.asistentes];
        updatedAsistentes[index] = {
            ...updatedAsistentes[index],
            [field]: value,
        };
        setData("asistentes", updatedAsistentes);
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("eventos.registro", evento.id), {
            onSuccess: () => {
                setPaso(3); // Mostrar confirmación
                reset();
            },
        });
    };

    // Manejar inicio de sesión
    const redirigirALogin = () => {
        window.location.href = route("login", {
            redirect: route("eventos.index"),
        });
    };

    // Manejar registro de usuarios
    const redirigirARegistro = () => {
        window.location.href = route("signup", {
            redirect: route("eventos.index"),
        });
    };

    // Manejar cierre del modal
    const handleClose = () => {
        reset();
        setPaso(1);
        onClose();
    };

    // Formatear fecha para mostrar
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Renderizar paso de verificación de sesión
    const renderPasoVerificacionSesion = () => (
        <>
            <DialogHeader className="text-center pb-2">
                <DialogTitle className="text-xl md:text-2xl">
                    Registro para evento
                </DialogTitle>
            </DialogHeader>
            <div className="py-6">
                <div className="mb-6 p-5 bg-blue-50 rounded-lg text-center">
                    <h3 className="font-medium text-lg mb-2">
                        {evento.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {formatearFecha(evento.fecha_inicio)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {evento.direccion
                            ? evento.direccion.direccion_completa
                            : "Evento virtual"}
                    </p>
                </div>

                {auth?.user ? (
                    <div className="space-y-6 text-center">
                        <p className="text-center px-4">
                            Estás iniciando el proceso de registro como{" "}
                            <strong>{auth.user.nombre}</strong>
                        </p>
                        <div className="space-y-3 px-4">
                            <p className="font-medium text-center">
                                ¿Te estás registrando como parte de una empresa?
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <Button
                                    className="w-full sm:w-auto"
                                    variant="outline"
                                    onClick={() => {
                                        setEsEmpresa(true);
                                        setData("es_empresa", true);
                                        setPaso(2);
                                    }}
                                >
                                    Sí, represento a una empresa
                                </Button>
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        setEsEmpresa(false);
                                        setData("es_empresa", false);
                                        setPaso(2);
                                    }}
                                >
                                    No, me registro como individuo
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 text-center">
                        <p className="text-center px-4">
                            Para registrarte a este evento, necesitas iniciar
                            sesión o crear una cuenta.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <Button
                                className="w-full sm:w-auto"
                                onClick={redirigirALogin}
                            >
                                Iniciar sesión
                            </Button>
                            <Button
                                className="w-full sm:w-auto"
                                variant="outline"
                                onClick={redirigirARegistro}
                            >
                                Crear cuenta
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter className="sm:justify-center pt-2">
                <Button variant="outline" onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogFooter>
        </>
    );

    // Renderizar paso de formulario de registro
    const renderFormularioRegistro = () => (
        <>
            <DialogHeader className="text-center pb-2">
                <DialogTitle className="text-xl md:text-2xl">
                    {esEmpresa
                        ? "Registro empresarial para evento"
                        : "Registro para evento"}
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="py-4">
                <div className="mb-6 p-5 bg-blue-50 rounded-lg text-center">
                    <h3 className="font-medium text-lg mb-2">
                        {evento.titulo}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {formatearFecha(evento.fecha_inicio)}
                    </p>
                </div>

                <div className="space-y-5 px-1">
                    {/* Campos comunes para ambos tipos de registro */}
                    <div>
                        <Label
                            htmlFor="nombre"
                            className="block text-center mb-2"
                        >
                            Nombre completo *
                        </Label>
                        <Input
                            id="nombre"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                            className="w-full"
                            disabled={auth?.user?.nombre}
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-sm mt-1 text-center">
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="email"
                            className="block text-center mb-2"
                        >
                            Correo electrónico *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            className="w-full"
                            disabled={auth?.user?.email}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1 text-center">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Campos específicos para registro empresarial */}
                    {esEmpresa && (
                        <>
                            <div>
                                <Label
                                    htmlFor="empresa"
                                    className="block text-center mb-2"
                                >
                                    Selecciona tu empresa *
                                </Label>
                                <select
                                    id="empresa"
                                    value={data.empresa_id}
                                    onChange={(e) =>
                                        setData("empresa_id", e.target.value)
                                    }
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">
                                        Selecciona una empresa
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
                                    <p className="text-red-500 text-sm mt-1 text-center">
                                        {errors.empresa_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="numAsistentes"
                                    className="block text-center mb-2"
                                >
                                    Número de personas que asistirán
                                </Label>
                                <select
                                    id="numAsistentes"
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

                            {/* Mostrar campos para asistentes adicionales */}
                            {numAsistentes > 1 && (
                                <div className="mt-6 space-y-6">
                                    <h3 className="font-medium border-b pb-2 text-center">
                                        Información de asistentes adicionales
                                    </h3>

                                    {data.asistentes
                                        .slice(1)
                                        .map((asistente, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border rounded-md bg-gray-50"
                                            >
                                                <h4 className="font-medium mb-3 text-center">
                                                    Asistente {index + 2}
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label
                                                            htmlFor={`nombre-${index}`}
                                                            className="block text-center mb-2"
                                                        >
                                                            Nombre completo *
                                                        </Label>
                                                        <Input
                                                            id={`nombre-${index}`}
                                                            type="text"
                                                            value={
                                                                asistente.nombre
                                                            }
                                                            onChange={(e) =>
                                                                updateAsistente(
                                                                    index + 1,
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
                                                        <Label
                                                            htmlFor={`email-${index}`}
                                                            className="block text-center mb-2"
                                                        >
                                                            Correo electrónico
                                                        </Label>
                                                        <Input
                                                            id={`email-${index}`}
                                                            type="email"
                                                            value={
                                                                asistente.email
                                                            }
                                                            onChange={(e) =>
                                                                updateAsistente(
                                                                    index + 1,
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
                        </>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-center space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPaso(1)}
                    >
                        Atrás
                    </Button>
                    <Button type="submit" disabled={processing}>
                        Confirmar asistencia
                    </Button>
                </DialogFooter>
            </form>
        </>
    );

    // Renderizar paso de confirmación
    const renderConfirmacion = () => (
        <>
            <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-xl md:text-2xl">
                    ¡Registro exitoso!
                </DialogTitle>
            </DialogHeader>
            <div className="py-6 px-2">
                <div className="flex items-center justify-center mb-5">
                    <div className="bg-green-100 p-3 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8 text-green-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-lg font-medium mb-3">
                        Tu registro ha sido confirmado
                    </h3>
                    <p className="text-gray-600 mb-2">
                        Te has registrado correctamente para el evento:
                    </p>
                    <p className="font-medium text-lg">{evento.titulo}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md mb-4 text-center">
                    <p className="text-sm text-blue-800">
                        Recibirás un correo con los detalles de tu registro.
                        También puedes consultar tus registros a eventos en tu
                        perfil.
                    </p>
                </div>
            </div>
            <DialogFooter className="sm:justify-center">
                <Button onClick={handleClose}>Cerrar</Button>
            </DialogFooter>
        </>
    );

    // Renderizar el paso actual
    const renderPasoActual = () => {
        switch (paso) {
            case 1:
                return renderPasoVerificacionSesion();
            case 2:
                return renderFormularioRegistro();
            case 3:
                return renderConfirmacion();
            default:
                return renderPasoVerificacionSesion();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg">
                {renderPasoActual()}
            </DialogContent>
        </Dialog>
    );
}
