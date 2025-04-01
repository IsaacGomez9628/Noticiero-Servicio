import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";

export default function EditProfile({ user, person, phone, genders }) {
    const { flash } = usePage().props;

    // Preparar los datos iniciales con los valores existentes
    const { data, setData, post, processing, errors } = useForm({
        name: person ? person.name : "",
        last_name: person ? person.last_name : "",
        second_last_name: person ? person.second_last_name || "" : "",
        birthdate: person ? person.birthdate : "",
        gender_id: person ? person.gender_id : "",
        phone: phone || "",
        email: user ? user.email : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("perfil.update"));
    };

    // Formatear la fecha para mostrar en el input date
    const formatDate = (dateString) => {
        if (!dateString) return "";

        // Convertir la fecha al formato YYYY-MM-DD para el input type="date"
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    return (
        <DashboardLayout activePage="editar-perfil">
            <div className="py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Editar Perfil
                </h1>
                <p className="text-gray-600 mb-8">
                    Actualiza tu información personal
                </p>

                {flash && flash.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.success}
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre *
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={`w-full ${
                                            errors.name ? "border-red-500" : ""
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido Paterno *
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        className={`w-full ${
                                            errors.last_name
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido Materno
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.second_last_name}
                                        onChange={(e) =>
                                            setData(
                                                "second_last_name",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full ${
                                            errors.second_last_name
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {errors.second_last_name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.second_last_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Nacimiento *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formatDate(data.birthdate)}
                                        onChange={(e) =>
                                            setData("birthdate", e.target.value)
                                        }
                                        className={`w-full ${
                                            errors.birthdate
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {errors.birthdate && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.birthdate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Género *
                                    </label>
                                    <select
                                        value={data.gender_id}
                                        onChange={(e) =>
                                            setData("gender_id", e.target.value)
                                        }
                                        className={`w-full rounded-md shadow-sm border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                                            errors.gender_id
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    >
                                        <option value="">
                                            Selecciona un género
                                        </option>
                                        {genders &&
                                            genders.map((gender) => (
                                                <option
                                                    key={gender.id}
                                                    value={gender.id}
                                                >
                                                    {gender.name === "M"
                                                        ? "Masculino"
                                                        : gender.name === "F"
                                                        ? "Femenino"
                                                        : gender.name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.gender_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.gender_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <Input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className={`w-full ${
                                            errors.phone ? "border-red-500" : ""
                                        }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico *
                                    </label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`w-full ${
                                            errors.email ? "border-red-500" : ""
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-gray-500 text-sm mb-4">
                                    * Campos obligatorios
                                </p>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mr-3"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {processing
                                            ? "Guardando..."
                                            : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
