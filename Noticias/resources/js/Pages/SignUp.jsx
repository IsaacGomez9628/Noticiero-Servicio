import { Input } from "@/Components/ui/Input";
import { Button } from "@/Components/ui/Button";
import { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";

export default function Welcome() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos enviados:", formData);
        alert("Registro enviado con éxito!");
    };

    const handleCancel = () => {
        setFormData({ name: "", email: "", phone: "" });
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Registro al Evento
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input de nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre completo
                                </label>
                                <Input
                                    type="nom"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej.Roberto Gómez Bolaños"
                                    className="w-full mt-1"
                                />
                            </div>
                            {/* Input de Correo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="ejemplo@correo.com"
                                    className="w-full mt-1"
                                />
                            </div>

                            {/* Input de Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono de Contacto
                                </label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="123-456-7890"
                                    className="w-full mt-1"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary">
                                    Confirmar
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}
