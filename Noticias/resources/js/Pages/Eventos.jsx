import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import Image from "@/Components/Image";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EventosPage() {
    const [eventos, setEventos] = useState([]);
    const [eventosDestacados, setEventosDestacados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para cargar los eventos
        const cargarEventos = async () => {
            try {
                setCargando(true);
                const respuesta = await axios.get("/api/eventos");

                // Separar eventos destacados (eventos próximos o importantes)
                const destacados = respuesta.data
                    .filter(
                        (e) =>
                            new Date(e.fecha_inicio) > new Date() &&
                            (e.status.nombre === "Programado" ||
                                e.status.nombre === "En curso")
                    )
                    .slice(0, 2); // Tomar los 2 primeros para destacar

                const restantes = respuesta.data.filter(
                    (e) => !destacados.some((d) => d.id === e.id)
                );

                setEventosDestacados(destacados);
                setEventos(restantes);
                setCargando(false);
            } catch (err) {
                setError(
                    "Error al cargar los eventos. Por favor, intenta nuevamente más tarde."
                );
                setCargando(false);
                console.error("Error al cargar eventos:", err);
            }
        };

        cargarEventos();
    }, []);

    // Función para formatear fechas
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Función para formatear horas
    const formatearHora = (fecha) => {
        return new Date(fecha).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (cargando) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Cargando eventos...</p>
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
            <h1 className="text-3xl font-bold mb-8">
                Consulta nuestros eventos
            </h1>

            {eventosDestacados.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {eventosDestacados.map((evento) => (
                        <Card key={evento.id} className="overflow-hidden">
                            <div className="relative h-48">
                                {evento.multimedia ? (
                                    <Image
                                        src={evento.multimedia.url}
                                        alt={evento.titulo}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Image
                                        src="/placeholder-event.jpg"
                                        alt="Imagen del evento"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">
                                    {evento.titulo}
                                </h3>
                                <p className="text-muted-foreground mb-4 line-clamp-2">
                                    {evento.descripcion}
                                </p>
                                <div className="flex items-center gap-2 text-sm mb-4">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>
                                        {formatearFecha(evento.fecha_inicio)}
                                    </span>
                                    <Clock className="h-4 w-4 text-primary ml-2" />
                                    <span>
                                        {formatearHora(evento.fecha_inicio)}
                                    </span>
                                </div>
                                <Link to={`/eventos/${evento.id}`}>
                                    <Button>Ver más</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <section>
                <h2 className="text-2xl font-bold mb-6">Más eventos para ti</h2>
                <p className="text-muted-foreground mb-8">
                    No te pierdas estos eventos y todas las sorpresas que
                    tenemos para nuestra comunidad
                </p>

                <div className="space-y-4">
                    {eventos.map((evento) => (
                        <Card key={evento.id}>
                            <CardContent className="p-4">
                                <div className="grid md:grid-cols-6 gap-4 items-center">
                                    <div className="font-medium">
                                        {formatearHora(evento.fecha_inicio)}
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold">
                                            {evento.titulo}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {evento.modalidad ||
                                                (evento.direccion
                                                    ? "Presencial"
                                                    : "Online")}
                                        </p>
                                    </div>
                                    <div>
                                        {evento.organizador?.persona?.nombres ||
                                            "CEATVCC"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {evento.direccion
                                            ? evento.direccion
                                                  .direccion_completa
                                            : "Virtual"}
                                    </div>
                                    <div className="text-right">
                                        <Link to={`/eventos/${evento.id}`}>
                                            <Button variant="outline" size="sm">
                                                Ver detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
