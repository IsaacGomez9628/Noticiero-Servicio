import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import RegistroEventoModal from "@/Components/ModalRegistro";

export default function EventosPage({
    eventos: eventosProp = [],
    success = true,
    errorMessage = null,
    empresas = [],
    auth,
}) {
    const [eventos, setEventos] = useState([]);
    const [eventosDestacados, setEventosDestacados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(errorMessage);
    const [usandoDatosEjemplo, setUsandoDatosEjemplo] = useState(false);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    const eventosEjemplo = [
        {
            id: "ejemplo-1",
            titulo: "Evento de ejemplo 1",
            descripcion:
                "Descripción del evento de ejemplo 1. Este es un evento ficticio creado para mostrar cómo se verían los eventos en el sitio.",
            fecha_inicio: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // 7 días en el futuro
            modalidad: "Presencial",
            organizador: {
                persona: {
                    nombres: "Organizador Ejemplo",
                },
            },
            direccion: {
                direccion_completa: "Dirección de ejemplo, Ciudad",
            },
        },
        {
            id: "ejemplo-2",
            titulo: "Evento de ejemplo 2",
            descripcion:
                "Descripción del evento de ejemplo 2. Este es un evento ficticio creado para mostrar cómo se verían los eventos en el sitio.",
            fecha_inicio: new Date(
                new Date().getTime() + 14 * 24 * 60 * 60 * 1000
            ).toISOString(), // 14 días en el futuro
            modalidad: "Virtual",
            organizador: {
                persona: {
                    nombres: "CEATVCC",
                },
            },
        },
        {
            id: "ejemplo-3",
            titulo: "Taller de ejemplo",
            descripcion:
                "Descripción del taller de ejemplo. Este es un evento ficticio creado para mostrar cómo se verían los eventos en el sitio.",
            fecha_inicio: new Date(
                new Date().getTime() + 21 * 24 * 60 * 60 * 1000
            ).toISOString(), // 21 días en el futuro
            modalidad: "Híbrido",
            organizador: {
                persona: {
                    nombres: "Organizador Ejemplo",
                },
            },
            direccion: {
                direccion_completa: "Centro de Convenciones, Ciudad",
            },
        },
    ];

    const abrirModalRegistro = (evento) => {
        setEventoSeleccionado(evento);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setEventoSeleccionado(null);
    };

    useEffect(() => {
        console.log("Props recibidos:", { eventosProp, success, errorMessage });

        if (!success) {
            setError(errorMessage || "Error al cargar los eventos.");
            setCargando(false);
            return;
        }

        // Verificar si hay eventos
        if (eventosProp && eventosProp.length > 0) {
            procesarEventos(eventosProp);
        } else {
            // Si no hay eventos, usar datos de ejemplo
            console.log(
                "No hay eventos disponibles, mostrando datos de ejemplo"
            );
            setUsandoDatosEjemplo(true);
            procesarEventos(eventosEjemplo);
        }
    }, [eventosProp, success, errorMessage]);

    const procesarEventos = (listaEventos) => {
        try {
            // Separar eventos destacados
            const destacados = listaEventos
                .filter((e) => {
                    // Verificación defensiva de datos
                    if (!e || !e.fecha_inicio) return false;

                    return (
                        new Date(e.fecha_inicio) > new Date() &&
                        (e.status?.nombre === "Programado" ||
                            e.status?.nombre === "En curso" ||
                            !e.status)
                    );
                })
                .slice(0, 2);

            const restantes = listaEventos.filter(
                (e) => e && e.id && !destacados.some((d) => d.id === e.id)
            );

            setEventosDestacados(destacados);
            setEventos(restantes);
        } catch (error) {
            console.error("Error al procesar eventos:", error);
            setError("Error al procesar los datos de eventos.");
        } finally {
            setCargando(false);
        }
    };

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
            <MainLayout selectedTab="eventos">
                <div className="container mx-auto px-4 py-8 text-center">
                    <p>Cargando eventos...</p>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout selectedTab="eventos">
                <div className="container mx-auto px-4 py-8 text-center">
                    <p className="text-red-500">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Intentar nuevamente
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout selectedTab="eventos">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Consulta nuestros eventos
                </h1>

                {usandoDatosEjemplo && (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-700">
                            ⚠️ Nota: Estamos mostrando datos de ejemplo porque
                            aún no hay eventos registrados en el sistema.
                        </p>
                    </div>
                )}

                {/* Sección de Eventos Destacados */}
                {eventosDestacados.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                            Eventos Destacados
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {eventosDestacados.map((evento) => (
                                <Card
                                    key={evento.id}
                                    className="overflow-hidden"
                                >
                                    <div className="relative h-48">
                                        {evento.multimedia ? (
                                            <img
                                                src={evento.multimedia.url}
                                                alt={evento.titulo}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src="/placeholder-event.jpg"
                                                alt="Imagen del evento"
                                                className="w-full h-full object-cover"
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
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                            <div>
                                                <p className="font-medium text-gray-600">
                                                    Fecha:
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span>
                                                        {formatearFecha(
                                                            evento.fecha_inicio
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-600">
                                                    Hora:
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span>
                                                        {formatearHora(
                                                            evento.fecha_inicio
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 mt-2">
                                                <p className="font-medium text-gray-600">
                                                    Organizador:
                                                </p>
                                                <p className="mt-1">
                                                    {evento.organizador?.persona
                                                        ?.nombres || "CEATVCC"}
                                                </p>
                                            </div>
                                            <div className="col-span-2 mt-2">
                                                <p className="font-medium text-gray-600">
                                                    Ubicación:
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <span>
                                                        {evento.direccion
                                                            ? evento.direccion
                                                                  .direccion_completa
                                                            : "Virtual"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            {!usandoDatosEjemplo ? (
                                                <>
                                                    <Link
                                                        href={route(
                                                            "eventos.show",
                                                            evento.id
                                                        )}
                                                    >
                                                        <Button>Ver más</Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            abrirModalRegistro(
                                                                evento
                                                            )
                                                        }
                                                    >
                                                        Registrarse
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button>
                                                    Ejemplo de evento
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sección de Más Eventos */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">
                        Más eventos para ti
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        No te pierdas estos eventos y todas las sorpresas que
                        tenemos para nuestra comunidad
                    </p>

                    {/* Encabezados de columnas para dispositivos medianos y grandes */}
                    <div className="hidden md:grid md:grid-cols-6 gap-4 mb-4 px-4 font-semibold text-gray-600">
                        <div>Hora</div>
                        <div className="md:col-span-2">Evento</div>
                        <div>Organizador</div>
                        <div>Ubicación</div>
                        <div className="text-right">Acciones</div>
                    </div>

                    {eventos.length > 0 ? (
                        <div className="space-y-4">
                            {eventos.map((evento) => (
                                <Card key={evento.id}>
                                    <CardContent className="p-4">
                                        <div className="grid md:grid-cols-6 gap-4 items-center">
                                            <div>
                                                {/* Título visible solo en móvil */}
                                                <p className="font-medium text-gray-600 text-sm md:hidden">
                                                    Hora del evento:
                                                </p>
                                                <p className="font-medium">
                                                    {formatearHora(
                                                        evento.fecha_inicio
                                                    )}
                                                </p>
                                            </div>
                                            <div className="md:col-span-2">
                                                {/* Título visible solo en móvil */}
                                                <p className="font-medium text-gray-600 text-sm md:hidden">
                                                    Nombre del evento:
                                                </p>
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
                                                {/* Título visible solo en móvil */}
                                                <p className="font-medium text-gray-600 text-sm md:hidden">
                                                    Organizador:
                                                </p>
                                                <p>
                                                    {evento.organizador?.persona
                                                        ?.nombres || "CEATVCC"}
                                                </p>
                                            </div>
                                            <div>
                                                {/* Título visible solo en móvil */}
                                                <p className="font-medium text-gray-600 text-sm md:hidden">
                                                    Ubicación:
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {evento.direccion
                                                            ? evento.direccion
                                                                  .direccion_completa
                                                            : "Virtual"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                {/* Título visible solo en móvil */}
                                                <p className="font-medium text-gray-600 text-sm md:hidden mr-auto">
                                                    Acciones:
                                                </p>
                                                {!usandoDatosEjemplo ? (
                                                    <>
                                                        <Link
                                                            href={route(
                                                                "eventos.show",
                                                                evento.id
                                                            )}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Ver detalles
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                abrirModalRegistro(
                                                                    evento
                                                                )
                                                            }
                                                        >
                                                            Registrarse
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button size="sm">
                                                        Ejemplo
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-md">
                            <p className="text-gray-500">
                                No hay más eventos disponibles en este momento.
                            </p>
                        </div>
                    )}
                </section>

                {!usandoDatosEjemplo && (
                    <div className="mt-12 text-center">
                        <p className="text-gray-500 mb-4">
                            ¿Eres organizador y quieres publicar un evento?
                        </p>
                        <Link href="/contacto">
                            <Button variant="outline">Contáctanos</Button>
                        </Link>
                    </div>
                )}

                {/* Modal de registro */}
                {modalAbierto && eventoSeleccionado && (
                    <RegistroEventoModal
                        isOpen={modalAbierto}
                        onClose={cerrarModal}
                        evento={eventoSeleccionado}
                        empresas={empresas}
                        auth={auth}
                    />
                )}
            </div>
        </MainLayout>
    );
}
