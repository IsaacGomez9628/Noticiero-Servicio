import React, { useState, useEffect } from "react";
import { usePage, Link, useForm } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/Avatar";
import { Button } from "@/Components/ui/ButtonDashboard";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/Components/ui/card";
import {
    Calendar,
    MapPin,
    Ticket,
    ArrowRight,
    Clock,
    User,
    Check,
    X,
    AlertTriangle,
    Info,
    Copy,
    FileText,
    Users,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";

export function EventsAttendance() {
    const { auth, eventAttendances = [], flash } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [eventToCancel, setEventToCancel] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [codeCopied, setCodeCopied] = useState(false);

    const { post, processing } = useForm();

    // Set flash message if available
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            // Auto-hide the message after 5 seconds
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha pendiente";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Dividir entre eventos pasados (asistencias) y futuros (registros)
    const now = new Date();

    const pastEvents = eventAttendances.filter((attendance) => {
        const eventDate = new Date(
            attendance.event?.fecha_inicio || attendance.event?.start_date
        );
        return eventDate < now;
    });

    const upcomingEvents = eventAttendances.filter((attendance) => {
        const eventDate = new Date(
            attendance.event?.fecha_inicio || attendance.event?.start_date
        );
        return eventDate >= now;
    });

    // Formatear los eventos para mostrarlos
    const formatEvents = (events) =>
        events.map((attendance) => ({
            id: attendance.id,
            eventId: attendance.event?.id,
            title:
                attendance.event?.titulo ||
                attendance.event?.titule ||
                "Evento sin título",
            date: formatDate(
                attendance.event?.fecha_inicio || attendance.event?.start_date
            ),
            time:
                attendance.event?.hora ||
                attendance.event?.start_time ||
                "10:00 AM",
            location:
                attendance.event?.location?.name ||
                attendance.event?.direccion?.direccion_completa ||
                "Ubicación por confirmar",
            locationDetails: {
                name: attendance.event?.location?.name || "",
                direction: attendance.event?.location?.direction || "",
                city: attendance.event?.location?.city || "",
                estate: attendance.event?.location?.estate || "",
                link_google_maps:
                    attendance.event?.location?.link_google_maps || "",
            },
            description:
                attendance.event?.descripcion ||
                attendance.event?.description ||
                "Sin descripción disponible",
            capacity:
                attendance.event?.capacity || attendance.event?.capacidad || 0,
            attendees: attendance.event?.registered_attendees || 0,
            image: attendance.event?.imagen,
            // Incluir el código de registro
            codigoRegistro: attendance.codigo_registro || "No disponible",
            organizador:
                attendance.event?.organizador?.persona?.nombre_completo ||
                attendance.event?.organizador?.persona?.nombres ||
                "Organizador no especificado",
            tags: [
                {
                    name: attendance.event?.categoria || "Evento",
                    color: "blue",
                },
                {
                    name:
                        attendance.status?.nombre ||
                        attendance.status?.name ||
                        "Pendiente",
                    color:
                        attendance.status?.slug === "confirmado"
                            ? "green"
                            : "orange",
                },
            ],
            status:
                attendance.status?.nombre ||
                attendance.status?.name ||
                "Pendiente",
            statusSlug: attendance.status?.slug || "pendiente",
            color:
                attendance.status?.slug === "confirmado" ? "green" : "orange",
        }));

    const upcomingEventCards = formatEvents(upcomingEvents);
    const pastEventCards = formatEvents(pastEvents);

    // Función para mostrar el diálogo de confirmación
    const showCancelConfirmation = (event) => {
        setEventToCancel(event);
        setConfirmCancelOpen(true);
    };

    // Función para cancelar la inscripción
    const handleCancelAttendance = () => {
        if (!eventToCancel) return;

        post(
            route("eventos.asistencia.cancelar", eventToCancel.id),
            {},
            {
                onSuccess: () => {
                    // Cerrar el diálogo de confirmación
                    setConfirmCancelOpen(false);
                    // Mostrar mensaje de éxito
                    setSuccessMessage(
                        "Inscripción cancelada exitosamente. Se ha liberado un cupo en el evento."
                    );
                },
            }
        );
    };

    // Mostrar detalles del evento
    const showEventDetails = (event) => {
        setSelectedEvent(event);
        setDetailsOpen(true);
        // Resetear el estado de código copiado
        setCodeCopied(false);
    };

    // Función para copiar el código de registro al portapapeles
    const copyRegistrationCode = (code) => {
        navigator.clipboard.writeText(code);
        setCodeCopied(true);

        // Resetear después de 3 segundos
        setTimeout(() => {
            setCodeCopied(false);
        }, 3000);
    };

    return (
        <div className="space-y-12 px-2 md:px-4">
            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-md fixed top-4 right-4 z-50 max-w-md">
                    <div className="flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        <p>{successMessage}</p>
                    </div>
                    <button
                        className="absolute top-2 right-2 text-green-700 hover:text-green-900"
                        onClick={() => setSuccessMessage(null)}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-16 w-16 border-2 border-blue-600 shadow-lg">
                        <AvatarImage
                            src="/placeholder.svg"
                            alt={auth.user?.name || "Usuario"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                            {auth.user?.name
                                ? auth.user.name.charAt(0).toUpperCase()
                                : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            {auth.user?.name ||
                                auth.user?.full_name ||
                                "Usuario"}
                        </h2>
                        <div className="flex items-center gap-8 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 p-2 mr-3">
                                    <Ticket className="h-4 w-4 text-purple-600" />
                                </div>
                                <span>
                                    {eventAttendances.length || 0} eventos
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 p-2 mr-3">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <span>{pastEventCards.length} completados</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                    onClick={() =>
                        (window.location.href = route("eventos.index"))
                    }
                >
                    <span>Buscar más eventos</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            <div className="mt-6">
                <Tabs defaultValue="proximos" className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-md">
                            <TabsTrigger
                                value="proximos"
                                className="px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-gray-200"
                            >
                                Próximos Eventos
                            </TabsTrigger>

                            <TabsTrigger
                                value="historial"
                                className="px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-gray-200"
                            >
                                Historial
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="proximos" className="mt-0">
                        {upcomingEventCards.length > 0 ? (
                            <div className="grid gap-8">
                                {upcomingEventCards.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onShowDetails={() =>
                                            showEventDetails(event)
                                        }
                                        onCancelAttendance={() =>
                                            showCancelConfirmation(event)
                                        }
                                        isPast={false}
                                        processing={processing}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center p-10 border-dashed bg-white dark:bg-gray-800">
                                <CardContent className="pt-6 flex flex-col items-center">
                                    <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 mb-6 shadow-inner">
                                        <Ticket className="h-12 w-12 text-indigo-600 opacity-70" />
                                    </div>
                                    <CardTitle className="text-xl mb-3 text-blue-600">
                                        No tienes próximos eventos
                                    </CardTitle>
                                    <CardDescription className="mb-6 text-base">
                                        Aún no te has registrado a ningún
                                        evento. Explora nuestros eventos y
                                        regístrate.
                                    </CardDescription>
                                    <Button
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                                        onClick={() =>
                                            (window.location.href =
                                                route("eventos.index"))
                                        }
                                    >
                                        Explorar eventos
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="historial" className="mt-0">
                        {pastEventCards.length > 0 ? (
                            <div className="grid gap-8">
                                {pastEventCards.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onShowDetails={() =>
                                            showEventDetails(event)
                                        }
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center p-10 border-dashed bg-white dark:bg-gray-800">
                                <CardContent className="pt-6 flex flex-col items-center">
                                    <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 mb-6 shadow-inner">
                                        <Ticket className="h-12 w-12 text-indigo-600 opacity-70" />
                                    </div>
                                    <CardTitle className="text-xl mb-3 text-blue-600">
                                        No hay eventos completados
                                    </CardTitle>
                                    <CardDescription className="mb-6 text-base">
                                        Aún no has asistido a ningún evento.
                                        Cuando asistas a un evento, aparecerá
                                        aquí.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal de detalles del evento - ACTUALIZADO */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                {selectedEvent && (
                    <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-xl p-0 overflow-hidden">
                        {selectedEvent.image && (
                            <div className="w-full h-40 relative">
                                <img
                                    src={selectedEvent.image}
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <Button
                                    className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full w-8 h-8 p-0"
                                    onClick={() => setDetailsOpen(false)}
                                >
                                    <X className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                        )}

                        <div className="p-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                    {selectedEvent.title}
                                </DialogTitle>
                                <DialogDescription>
                                    Información detallada de tu registro
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-6">
                                {/* Código de Registro */}
                                <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                    <div className="bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300 rounded-full p-3">
                                        <Ticket className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                            Código de Registro
                                        </div>
                                        <div className="font-mono font-semibold text-lg flex items-center">
                                            {selectedEvent.codigoRegistro}
                                            <button
                                                onClick={() =>
                                                    copyRegistrationCode(
                                                        selectedEvent.codigoRegistro
                                                    )
                                                }
                                                className="ml-2 p-1 hover:bg-indigo-100 rounded-md transition-colors"
                                                title="Copiar código"
                                            >
                                                {codeCopied ? (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4 text-indigo-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Fecha y Hora */}
                                <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 rounded-full p-3">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                            Fecha y Hora
                                        </div>
                                        <div className="font-semibold">
                                            {selectedEvent.date} ·{" "}
                                            {selectedEvent.time}
                                        </div>
                                    </div>
                                </div>

                                {/* Ubicación */}
                                <div className="flex items-center gap-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <div className="bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300 rounded-full p-3">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                            Ubicación
                                        </div>
                                        <div className="font-semibold">
                                            {selectedEvent.location}
                                        </div>
                                        {selectedEvent.locationDetails
                                            .link_google_maps && (
                                            <a
                                                href={
                                                    selectedEvent
                                                        .locationDetails
                                                        .link_google_maps
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 text-sm hover:underline mt-1 inline-block"
                                            >
                                                Ver en Google Maps
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Organizador */}
                                <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                                    <div className="bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300 rounded-full p-3">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                            Organizador
                                        </div>
                                        <div className="font-semibold">
                                            {selectedEvent.organizador}
                                        </div>
                                    </div>
                                </div>

                                {/* Capacidad */}
                                {selectedEvent.capacity > 0 && (
                                    <div className="flex items-center gap-4 bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                                        <div className="bg-teal-100 text-teal-600 dark:bg-teal-800 dark:text-teal-300 rounded-full p-3">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                                Capacidad
                                            </div>
                                            <div className="font-semibold">
                                                {selectedEvent.capacity}{" "}
                                                asistentes
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Estado */}
                                <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <div className="bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300 rounded-full p-3">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                            Estado
                                        </div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                                selectedEvent.statusSlug ===
                                                "confirmado"
                                                    ? "bg-green-100 text-green-800"
                                                    : selectedEvent.statusSlug ===
                                                      "cancelado"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {selectedEvent.statusSlug ===
                                            "confirmado" ? (
                                                <Check className="h-4 w-4 mr-1" />
                                            ) : selectedEvent.statusSlug ===
                                              "cancelado" ? (
                                                <X className="h-4 w-4 mr-1" />
                                            ) : (
                                                <AlertTriangle className="h-4 w-4 mr-1" />
                                            )}
                                            {selectedEvent.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-5 w-5 text-gray-600" />
                                        <div className="font-medium text-gray-700">
                                            Acerca del evento
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            </div>

                            <DialogFooter className="flex sm:justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setDetailsOpen(false)}
                                    className="border-gray-200 hover:bg-gray-50 text-gray-700"
                                >
                                    Cerrar
                                </Button>

                                {!selectedEvent.isPast &&
                                    selectedEvent.statusSlug !==
                                        "cancelado" && (
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => {
                                                setDetailsOpen(false);
                                                showCancelConfirmation(
                                                    selectedEvent
                                                );
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancelar inscripción
                                        </Button>
                                    )}
                            </DialogFooter>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            {/* Diálogo de confirmación para cancelar */}
            <Dialog
                open={confirmCancelOpen}
                onOpenChange={setConfirmCancelOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Estás a punto de cancelar tu inscripción para el
                            evento "{eventToCancel?.title}". Esta acción
                            liberará tu cupo para que otra persona pueda asistir
                            y no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmCancelOpen(false)}
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                            No, mantener inscripción
                        </Button>
                        <Button
                            onClick={handleCancelAttendance}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={processing}
                        >
                            {processing
                                ? "Procesando..."
                                : "Sí, cancelar inscripción"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function EventCard({
    event,
    onShowDetails,
    onCancelAttendance,
    isPast = false,
    processing = false,
}) {
    const colorMap = {
        blue: {
            accent: "border-l-blue-500",
            title: "text-blue-700",
            icon: "bg-blue-100 text-blue-600",
            button: "hover:bg-blue-50 hover:text-blue-700",
        },
        green: {
            accent: "border-l-green-500",
            title: "text-green-700",
            icon: "bg-green-100 text-green-600",
            button: "hover:bg-green-50 hover:text-green-700",
        },
        orange: {
            accent: "border-l-orange-500",
            title: "text-orange-700",
            icon: "bg-orange-100 text-orange-600",
            button: "hover:bg-orange-50 hover:text-orange-700",
        },
        red: {
            accent: "border-l-red-500",
            title: "text-red-700",
            icon: "bg-red-100 text-red-600",
            button: "hover:bg-red-50 hover:text-red-700",
        },
    };

    // Choose the card color style based on status
    const cardColor = event.statusSlug === "cancelado" ? "red" : event.color;

    return (
        <Card
            className={`relative overflow-hidden rounded-xl border-l-8 ${
                colorMap[cardColor]?.accent || "border-l-blue-500"
            } bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all`}
        >
            <div className="p-6 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col">
                    <h4
                        className={`text-xl font-medium ${
                            colorMap[cardColor]?.title || "text-blue-700"
                        } mb-3`}
                    >
                        {event.title}
                    </h4>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-300 mt-2 gap-4 sm:gap-6">
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center rounded-full p-2 ${
                                    colorMap[cardColor]?.icon ||
                                    "bg-blue-100 text-blue-600"
                                } mr-3`}
                            >
                                <Calendar className="h-4 w-4" />
                            </div>
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center rounded-full p-2 ${
                                    colorMap[cardColor]?.icon ||
                                    "bg-blue-100 text-blue-600"
                                } mr-3`}
                            >
                                <Clock className="h-4 w-4" />
                            </div>
                            <span>{event.time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <span
                        className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${
                            event.statusSlug === "confirmado"
                                ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                                : event.statusSlug === "cancelado"
                                ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                        }`}
                    >
                        {event.statusSlug === "confirmado" ? (
                            <Check className="h-4 w-4 mr-1" />
                        ) : event.statusSlug === "cancelado" ? (
                            <X className="h-4 w-4 mr-1" />
                        ) : (
                            <AlertTriangle className="h-4 w-4 mr-1" />
                        )}
                        {event.status}
                    </span>
                </div>
            </div>
            <div className="p-6 pl-8 flex flex-col gap-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <div
                        className={`flex items-center justify-center rounded-full p-2 ${
                            colorMap[cardColor]?.icon ||
                            "bg-blue-100 text-blue-600"
                        } mr-3`}
                    >
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span>{event.location}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                        <Badge
                            key={tag.name}
                            className={`px-3 py-1 text-sm rounded-full
                                ${
                                    tag.color === "blue"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300"
                                        : tag.color === "green"
                                        ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                                        : tag.color === "orange"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300"
                                        : tag.color === "purple"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                                }`}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex justify-between">
                <Button
                    variant="outline"
                    onClick={onShowDetails}
                    className={`px-4 py-2 border-gray-200 ${
                        colorMap[cardColor]?.button || "hover:bg-blue-50"
                    }`}
                >
                    <Info className="h-4 w-4 mr-2" />
                    Ver detalles
                </Button>

                {!isPast && event.statusSlug !== "cancelado" && (
                    <Button
                        variant="outline"
                        className="px-4 py-2 text-red-600 border-red-200 hover:bg-red-50"
                        disabled={processing}
                        onClick={onCancelAttendance}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar inscripción
                    </Button>
                )}

                {isPast && (
                    <Link href={route("eventos.show", event.eventId)}>
                        <Button
                            variant="outline"
                            className="px-4 py-2 text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                            Ver evento
                        </Button>
                    </Link>
                )}
            </div>
        </Card>
    );
}
