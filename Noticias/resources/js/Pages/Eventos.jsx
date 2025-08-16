import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import RegistroEventoModal from "@/Components/ui/ModalRegistro";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    MapPin,
    Calendar,
    Clock,
    Users,
    ChevronLeft,
    ChevronRight,
    Filter,
} from "lucide-react";

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

    // Nuevos estados para paginación y filtros
    const [paginaActual, setPaginaActual] = useState(1);
    const [eventosPorPagina] = useState(5);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroFecha, setFiltroFecha] = useState(null);
    const [filtroPrecio, setFiltroPrecio] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [filtrosVisibles, setFiltrosVisibles] = useState(true);

    const formatPrice = (price) => {
        if (price === null || price === undefined) return "0.00";

        // Convertir a número si es un string
        const numericPrice =
            typeof price === "number" ? price : parseFloat(price || 0);

        // Verificar si el precio es cero
        if (numericPrice === 0) return "Gratis";

        // Si no es cero, formatear como antes
        return numericPrice.toFixed(2);
    };

    const categorias = [
        { id: "negocios", nombre: "Negocios" },
        { id: "comida", nombre: "Comida y bebida" },
        { id: "salud", nombre: "Salud" },
        { id: "musica", nombre: "Música" },
        { id: "arte", nombre: "Arte y cultura" },
        { id: "deportes", nombre: "Deportes" },
    ];

    const opcionesFecha = [
        { id: "hoy", nombre: "Hoy" },
        { id: "manana", nombre: "Mañana" },
        { id: "finDeSemana", nombre: "Este fin de semana" },
        { id: "estaSemana", nombre: "Esta semana" },
        { id: "proximaSemana", nombre: "La próxima semana" },
        { id: "esteMes", nombre: "Este mes" },
        { id: "mesSiguiente", nombre: "El mes siguiente" },
        { id: "seleccionarFecha", nombre: "Selecciona una fecha..." },
    ];

    const opcionesPrecio = [
        { id: "gratis", nombre: "Gratis" },
        { id: "pago", nombre: "Pago" },
    ];

    const eventosEjemplo = [
        {
            id: "ejemplo-1",
            titulo: "Concierto: Velada de ópera y música mexicana",
            descripcion:
                "Recaudación gira por Europa con los mejores talentos de ópera mexicana.",
            fecha_inicio: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            hora: "20:00",
            modalidad: "Presencial",
            precio: 216.22,
            categoria: "musica",
            organizador: {
                persona: {
                    nombres: "CEART",
                },
            },
            direccion: {
                direccion_completa: "Centro de las Artes de Querétaro",
            },
            imagen: "/images/opera.jpg",
        },
        {
            id: "ejemplo-2",
            titulo: "Corazón Bordado Fashion Show 2025",
            descripcion:
                "Exhibición de alta moda con diseñadores locales y nacionales.",
            fecha_inicio: new Date(
                new Date().getTime() + 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            hora: "18:00",
            modalidad: "Presencial",
            precio: 350.0,
            categoria: "arte",
            organizador: {
                persona: {
                    nombres: "Universidad Anáhuac",
                },
            },
            direccion: {
                direccion_completa: "Universidad Anáhuac Querétaro",
            },
            imagen: "/images/fashion.jpg",
        },
        {
            id: "ejemplo-3",
            titulo: "Concierto bajo las estrellas - Tributo The Beatles",
            descripcion:
                "Una noche mágica de música bajo las estrellas recordando a los Beatles.",
            fecha_inicio: new Date(
                new Date().getTime() + 9 * 24 * 60 * 60 * 1000
            ).toISOString(),
            hora: "18:30",
            modalidad: "Presencial",
            precio: 450.0,
            categoria: "musica",
            organizador: {
                persona: {
                    nombres: "THE HUB",
                },
            },
            direccion: {
                direccion_completa: "THE HUB @Cuadrante Centro Sur",
            },
            imagen: "/images/beatles.jpg",
        },
        {
            id: "ejemplo-4",
            titulo: "Concierto Ópera - Boleros 'Romances Eternos'",
            descripcion:
                "Una noche especial dedicada a los más grandes boleros de todos los tiempos.",
            fecha_inicio: new Date(
                new Date().getTime() + 12 * 24 * 60 * 60 * 1000
            ).toISOString(),
            hora: "19:30",
            modalidad: "Presencial",
            precio: 250.0,
            categoria: "musica",
            organizador: {
                persona: {
                    nombres: "CEART",
                },
            },
            direccion: {
                direccion_completa: "Centro de las Artes de Querétaro",
            },
            imagen: "/images/boleros.jpg",
        },
        {
            id: "ejemplo-5",
            titulo: "Workshop de Negocios Digitales",
            descripcion:
                "Aprende las mejores estrategias para digitalizar tu negocio.",
            fecha_inicio: new Date(
                new Date().getTime() + 14 * 24 * 60 * 60 * 1000
            ).toISOString(),
            hora: "10:00",
            modalidad: "Híbrido",
            precio: 0,
            categoria: "negocios",
            organizador: {
                persona: {
                    nombres: "Cámara de Comercio",
                },
            },
            direccion: {
                direccion_completa: "Centro de Convenciones Querétaro",
            },
            imagen: "/images/negocios.jpg",
        },
        {
            id: "ejemplo-6",
            titulo: "Festival Gastronómico Internacional",
            descripcion:
                "Degustación de platillos de todo el mundo con los mejores chefs locales.",
            fecha_inicio: new Date(
                new Date().getTime() + 21 * 24 * 60 * 60 * 1000
            ).toISOString(),
            hora: "13:00",
            modalidad: "Presencial",
            precio: 400.0,
            categoria: "comida",
            organizador: {
                persona: {
                    nombres: "Asociación de Restauranteros",
                },
            },
            direccion: {
                direccion_completa: "Parque Alcanfores, Querétaro",
            },
            imagen: "/images/gastronomia.jpg",
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

    // Función para verificar si hay filtros activos
    const hayFiltrosActivos = () => {
        return filtroCategoria || filtroFecha || filtroPrecio;
    };

    // Filtramos los eventos según los criterios
    const eventosFiltrados = (() => {
        // Si no hay filtros activos, usar solo eventos regulares
        if (!hayFiltrosActivos()) {
            return eventos;
        }

        // Si hay filtros activos, combinar todos los eventos y filtrarlos
        const todosLosEventos = [...eventosDestacados, ...eventos];
        
        return todosLosEventos.filter((evento) => {
            // Filtrar por categoría
            if (filtroCategoria && evento.categoria !== filtroCategoria) {
                return false;
            }

            // Filtrar por fecha
            if (filtroFecha) {
                const fechaEvento = new Date(evento.fecha_inicio);
                const fechaFiltro = new Date(filtroFecha);

                if (
                    fechaEvento.getDate() !== fechaFiltro.getDate() ||
                    fechaEvento.getMonth() !== fechaFiltro.getMonth() ||
                    fechaEvento.getFullYear() !== fechaFiltro.getFullYear()
                ) {
                    return false;
                }
            }

            // Filtrar por precio
            if (filtroPrecio === "gratis" && evento.precio > 0) {
                return false;
            } else if (filtroPrecio === "pago" && evento.precio === 0) {
                return false;
            }

            return true;
        });
    })();

    // Cálculos para la paginación
    const indexUltimoEvento = paginaActual * eventosPorPagina;
    const indexPrimerEvento = indexUltimoEvento - eventosPorPagina;
    const eventosActuales = eventosFiltrados.slice(
        indexPrimerEvento,
        indexUltimoEvento
    );
    const totalPaginas = Math.ceil(eventosFiltrados.length / eventosPorPagina);

    // Cambiar de página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    // Función para manejar el cambio de fecha en el calendario
    const handleFechaChange = (fecha) => {
        setFiltroFecha(fecha);
        setShowCalendar(false);
    };

    // Función para limpiar todos los filtros
    const limpiarFiltros = () => {
        setFiltroCategoria("");
        setFiltroFecha(null);
        setFiltroPrecio("");
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
                <div className="flex flex-col md:flex-row md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Eventos en Querétaro
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Busca algo que te encante o échales un ojo a los
                            eventos populares en tu área.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button
                            onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                            className="flex items-center"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {filtrosVisibles
                                ? "Ocultar filtros"
                                : "Mostrar filtros"}
                        </Button>
                    </div>
                </div>

                {usandoDatosEjemplo && (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-700">
                            ⚠️ Nota: Estamos mostrando datos de ejemplo porque
                            aún no hay eventos registrados en el sistema.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sección de Filtros */}
                    {filtrosVisibles && (
                        <div className="md:col-span-1 order-2 md:order-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 border mb-4">
                                <h2 className="text-xl font-bold mb-4">
                                    Filtros
                                </h2>

                                {/* Filtro de Categoría */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-800 mb-3">
                                        Categoría:
                                    </h3>
                                    <div className="space-y-2">
                                        {categorias.map((cat) => (
                                            <div
                                                key={cat.id}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    id={`cat-${cat.id}`}
                                                    name="categoria"
                                                    checked={
                                                        filtroCategoria ===
                                                        cat.id
                                                    }
                                                    onChange={() =>
                                                        setFiltroCategoria(
                                                            cat.id
                                                        )
                                                    }
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`cat-${cat.id}`}
                                                    className="ml-2 text-gray-700"
                                                >
                                                    {cat.nombre}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Filtro de Fecha */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-800 mb-3">
                                        Fecha:
                                    </h3>
                                    <div className="space-y-2">
                                        {opcionesFecha.map((opcion) => (
                                            <div
                                                key={opcion.id}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    id={`fecha-${opcion.id}`}
                                                    name="fecha"
                                                    onChange={() => {
                                                        if (
                                                            opcion.id ===
                                                            "seleccionarFecha"
                                                        ) {
                                                            setShowCalendar(
                                                                true
                                                            );
                                                        } else {
                                                            setShowCalendar(
                                                                false
                                                            );
                                                            // Aquí implementaríamos la lógica para cada opción de fecha
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`fecha-${opcion.id}`}
                                                    className="ml-2 text-gray-700"
                                                >
                                                    {opcion.nombre}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {showCalendar && (
                                        <div className="mt-3">
                                            <DatePicker
                                                selected={filtroFecha}
                                                onChange={handleFechaChange}
                                                inline
                                                className="border rounded-md p-2 w-full"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Filtro de Precio */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-800 mb-3">
                                        Precio:
                                    </h3>
                                    <div className="space-y-2">
                                        {opcionesPrecio.map((opcion) => (
                                            <div
                                                key={opcion.id}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    id={`precio-${opcion.id}`}
                                                    name="precio"
                                                    checked={
                                                        filtroPrecio ===
                                                        opcion.id
                                                    }
                                                    onChange={() =>
                                                        setFiltroPrecio(
                                                            opcion.id
                                                        )
                                                    }
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`precio-${opcion.id}`}
                                                    className="ml-2 text-gray-700"
                                                >
                                                    {opcion.nombre}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={limpiarFiltros}
                                    className="w-full"
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Sección Principal de Eventos */}
                    <div
                        className={`${
                            filtrosVisibles ? "md:col-span-3" : "md:col-span-4"
                        } order-1 md:order-2`}
                    >
                        {/* Sección de Eventos Destacados */}
                        {eventosDestacados.length > 0 && !hayFiltrosActivos() && (
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
                                                {evento.imagen ? (
                                                    <img
                                                        src={evento.imagen}
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
                                                {formatPrice(evento.precio) ===
                                                    "Gratis" && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                        Gratis
                                                    </div>
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
                                                                {evento.hora ||
                                                                    formatearHora(
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
                                                            {evento.organizador
                                                                ?.persona
                                                                ?.nombres ||
                                                                "CEATVCC"}
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
                                                                    ? evento
                                                                          .direccion
                                                                          .direccion_completa
                                                                    : "Virtual"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {evento.precio !== null && (
                                                        <div className="col-span-2 mt-2">
                                                            <p className="font-medium text-gray-600">
                                                                Precio:
                                                            </p>
                                                            <p className="mt-1 font-medium">
                                                                {formatPrice(
                                                                    evento.precio
                                                                ) === "Gratis"
                                                                    ? "Gratis"
                                                                    : `Desde $${formatPrice(
                                                                          evento.precio
                                                                      )}`}
                                                            </p>
                                                        </div>
                                                    )}
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
                                                                <Button>
                                                                    Ver más
                                                                </Button>
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
                                                        <Button>Ver más</Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sección de Listado de Eventos */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">
                                Más eventos para ti
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                No te pierdas estos eventos y todas las
                                sorpresas que tenemos para nuestra comunidad
                            </p>

                            {eventosActuales.length > 0 ? (
                                <div className="space-y-4">
                                    {eventosActuales.map((evento) => (
                                        <div
                                            key={evento.id}
                                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/4 h-40 md:h-auto">
                                                    {evento.imagen ? (
                                                        <img
                                                            src={evento.imagen}
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
                                                <div className="p-6 md:w-3/4">
                                                    <div className="flex flex-col md:flex-row md:justify-between">
                                                        <div className="mb-4 md:mb-0">
                                                            {evento.precio !==
                                                                null && (
                                                                <div className="mt-2">
                                                                    <span className="text-gray-700 font-medium">
                                                                        {formatPrice(
                                                                            evento.precio
                                                                        ) ===
                                                                        "Gratis"
                                                                            ? "Gratis"
                                                                            : `Desde $${formatPrice(
                                                                                  evento.precio
                                                                              )}`}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <h3 className="text-xl font-bold mt-1">
                                                                {evento.titulo}
                                                            </h3>
                                                            <div className="flex items-center gap-1 mt-2 text-gray-600">
                                                                <Calendar className="h-4 w-4" />
                                                                <span className="text-sm">
                                                                    {formatearFecha(
                                                                        evento.fecha_inicio
                                                                    )}
                                                                    ,{" "}
                                                                    {evento.hora ||
                                                                        formatearHora(
                                                                            evento.fecha_inicio
                                                                        )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-1 text-gray-600">
                                                                <MapPin className="h-4 w-4" />
                                                                <span className="text-sm">
                                                                    {evento.direccion
                                                                        ? evento
                                                                              .direccion
                                                                              .direccion_completa
                                                                        : "Virtual"}
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                                                {
                                                                    evento.descripcion
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col justify-end items-start md:items-end mt-4 md:mt-0">
                                                            {!usandoDatosEjemplo ? (
                                                                <>
                                                                    <Link
                                                                        href={route(
                                                                            "eventos.show",
                                                                            evento.id
                                                                        )}
                                                                    >
                                                                        <Button className="mb-2 w-full md:w-auto">
                                                                            Ver
                                                                            detalles
                                                                        </Button>
                                                                    </Link>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            abrirModalRegistro(
                                                                                evento
                                                                            )
                                                                        }
                                                                        className="w-full md:w-auto"
                                                                    >
                                                                        Registrarse
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button className="w-full md:w-auto">
                                                                    Ver detalles
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8bg-gray-50 rounded-md">
                                    <p className="text-gray-500">
                                        No hay eventos disponibles con los
                                        filtros seleccionados.
                                    </p>
                                    <Button
                                        className="mt-4"
                                        onClick={limpiarFiltros}
                                    >
                                        Limpiar filtros
                                    </Button>
                                </div>
                            )}

                            {/* Paginación */}
                            {eventosFiltrados.length > eventosPorPagina && (
                                <div className="flex justify-center mt-8">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        <Button
                                            onClick={() =>
                                                cambiarPagina(paginaActual - 1)
                                            }
                                            disabled={paginaActual === 1}
                                            variant="outline"
                                            className="rounded-l-md"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>

                                        {Array.from(
                                            { length: totalPaginas },
                                            (_, i) => (
                                                <Button
                                                    key={i + 1}
                                                    onClick={() =>
                                                        cambiarPagina(i + 1)
                                                    }
                                                    variant={
                                                        paginaActual === i + 1
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className="rounded-none"
                                                >
                                                    {i + 1}
                                                </Button>
                                            )
                                        )}

                                        <Button
                                            onClick={() =>
                                                cambiarPagina(paginaActual + 1)
                                            }
                                            disabled={
                                                paginaActual === totalPaginas
                                            }
                                            variant="outline"
                                            className="rounded-r-md"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </nav>
                                </div>
                            )}
                        </section>

                        {!usandoDatosEjemplo && (
                            <div className="mt-12 text-center">
                                <p className="text-gray-500 mb-4">
                                    ¿Eres organizador y quieres publicar un
                                    evento?
                                </p>
                                <Link href="/contacto">
                                    <Button variant="outline">
                                        Contáctanos
                                    </Button>
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
                </div>
            </div>
        </MainLayout>
    );
}