import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import { MapPin, ChevronLeft } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function EventoUbicacion({ location }) {
    return (
        <MainLayout>
            <Head title={`Ubicación - ${location.evento.titulo}`} />

            <div className="container mx-auto px-4 py-8">
                <Link
                    href={route("eventos.show", location.evento.id)}
                    className="text-primary hover:underline mb-4 inline-flex items-center"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Volver a detalles
                    del evento
                </Link>

                <Card className="overflow-hidden">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold mb-4">
                            Ubicación del Evento
                        </h1>

                        <div className="flex items-start gap-2 mb-6">
                            <MapPin className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <h2 className="font-semibold text-lg">
                                    {location.name}
                                </h2>
                                <p>{location.direction}</p>
                                <p>
                                    {location.city}, {location.estate}{" "}
                                    {location.zip_code}
                                </p>
                                <p>{location.country}</p>
                            </div>
                        </div>

                        {location.link_google_maps && (
                            <div className="mb-6">
                                <a
                                    href={location.link_google_maps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    <Button>Ver en Google Maps</Button>
                                </a>
                            </div>
                        )}

                        {location.latitude && location.length && (
                            <div className="aspect-video bg-gray-200 rounded-md mb-6">
                                {/* Aquí podría ir un mapa con las coordenadas */}
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-gray-500">
                                        Mapa de la ubicación
                                    </p>
                                </div>
                            </div>
                        )}

                        {location.images && location.images.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">
                                    Fotos del lugar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {location.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-video bg-gray-100 rounded-md overflow-hidden"
                                        >
                                            <img
                                                src={image.ruta}
                                                alt={
                                                    image.alt_texto ||
                                                    "Imagen de la ubicación"
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
