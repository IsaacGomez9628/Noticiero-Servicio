import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/Dialog";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

export default function ModalRegistro({ isOpen, onClose, evento, auth }) {
    const [numAsistentes, setNumAsistentes] = useState(1);

    // Si el usuario no está autenticado, mostrar mensaje
    if (!auth || !auth.user) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Necesitas iniciar sesión</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center py-4">
                        <div className="bg-blue-100 p-3 rounded-full mb-4">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-center mb-4">
                            Para registrarte a este evento, necesitas iniciar
                            sesión o crear una cuenta.
                        </p>

                        <div className="flex gap-3 mt-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    (window.location.href = route("login"))
                                }
                            >
                                Iniciar sesión
                            </Button>
                            <Button
                                onClick={() =>
                                    (window.location.href = route("registro"))
                                }
                            >
                                Crear cuenta
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <Button variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Determinar si el usuario es institucional
    const isInstitucional =
        auth.user.roles?.some((role) => role.id === 6) || false;

    // Si es institucional, redirigir a la página de registro institucional
    if (isInstitucional) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Registro institucional</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="mb-4">
                            Como usuario institucional, puedes registrar a
                            múltiples asistentes.
                        </p>

                        <div className="bg-gray-50 p-3 rounded-md mb-4">
                            <h3 className="font-medium text-gray-800 mb-2">
                                {evento.titulo}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {formatearFecha(evento.fecha_inicio)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {evento.direccion?.direccion_completa ||
                                        "Ubicación no disponible"}
                                </span>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={() =>
                                (window.location.href = route(
                                    "eventos.registro.form",
                                    evento.id
                                ))
                            }
                        >
                            Continuar al registro institucional
                        </Button>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <Button variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Para usuarios personales
    const { data, setData, post, processing, errors } = useForm({
        nombre: auth.user.name || "",
        email: auth.user.email || "",
        telefono: "",
        numero_asistentes: 1,
        asistentes: [
            {
                nombre: auth.user.name || "",
                email: auth.user.email || "",
            },
        ],
    });

    const updateAsistente = (index, field, value) => {
        const updatedAsistentes = [...data.asistentes];
        if (!updatedAsistentes[index]) {
            updatedAsistentes[index] = {};
        }
        updatedAsistentes[index][field] = value;
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
        post(route("eventos.registro", evento.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Registro para evento</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">
                            {evento.titulo}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatearFecha(evento.fecha_inicio)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Clock className="h-4 w-4" />
                            <span>{evento.hora || "Hora no disponible"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>
                                {evento.direccion?.direccion_completa ||
                                    "Ubicación no disponible"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-4">
                        <div>
                            <Label htmlFor="nombre">Nombre completo</Label>
                            <Input
                                id="nombre"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                required
                            />
                            {errors.nombre && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="telefono">
                                Teléfono (opcional)
                            </Label>
                            <Input
                                id="telefono"
                                value={data.telefono}
                                onChange={(e) =>
                                    setData("telefono", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="numero_asistentes">
                                Número de asistentes
                            </Label>
                            <select
                                id="numero_asistentes"
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

                    {numAsistentes > 1 && (
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">
                                Asistentes adicionales
                            </h3>
                            {data.asistentes
                                .slice(1)
                                .map((asistente, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded-md mb-3 bg-gray-50"
                                    >
                                        <p className="text-sm font-medium mb-2">
                                            Asistente {index + 2}
                                        </p>
                                        <div className="space-y-2">
                                            <div>
                                                <Label
                                                    htmlFor={`asistente-${index}-nombre`}
                                                >
                                                    Nombre
                                                </Label>
                                                <Input
                                                    id={`asistente-${index}-nombre`}
                                                    value={
                                                        asistente.nombre || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateAsistente(
                                                            index + 1,
                                                            "nombre",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor={`asistente-${index}-email`}
                                                >
                                                    Email (opcional)
                                                </Label>
                                                <Input
                                                    id={`asistente-${index}-email`}
                                                    type="email"
                                                    value={
                                                        asistente.email || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateAsistente(
                                                            index + 1,
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Confirmar registro
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return "Fecha no disponible";

    try {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (error) {
        return "Fecha no disponible";
    }
}
