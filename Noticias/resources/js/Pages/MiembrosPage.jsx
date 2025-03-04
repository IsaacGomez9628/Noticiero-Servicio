import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import Image from "@/Components/Image";
import axios from "axios";

export default function MiembrosPage() {
    const [miembros, setMiembros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para cargar los miembros
        const cargarMiembros = async () => {
            try {
                setCargando(true);
                const respuesta = await axios.get("/api/miembros");
                setMiembros(respuesta.data);
                setCargando(false);
            } catch (err) {
                setError(
                    "Error al cargar los miembros. Por favor, intenta nuevamente más tarde."
                );
                setCargando(false);
                console.error("Error al cargar miembros:", err);
            }
        };

        cargarMiembros();
    }, []);

    if (cargando) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Cargando miembros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                >
                    Intentar nuevamente
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-12">
                Nuestro Equipo
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {miembros.map((miembro) => (
                    <Card key={miembro.id} className="overflow-hidden">
                        <div className="relative h-48">
                            {miembro.multimedia ? (
                                <Image
                                    src={miembro.multimedia.url}
                                    alt={`Foto de ${miembro.persona.nombres} ${miembro.persona.apellido_paterno}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <Image
                                    src="/placeholder-person.jpg"
                                    alt="Imagen de perfil"
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-1">
                                {miembro.persona.nombres}{" "}
                                {miembro.persona.apellido_paterno}{" "}
                                {miembro.persona.apellido_materno}
                            </h3>
                            <p className="text-primary font-medium mb-3">
                                {miembro.cargo.nombre}
                            </p>
                            <p className="text-muted-foreground text-sm line-clamp-3">
                                {miembro.descripcion_profesional ||
                                    "Miembro del equipo."}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
