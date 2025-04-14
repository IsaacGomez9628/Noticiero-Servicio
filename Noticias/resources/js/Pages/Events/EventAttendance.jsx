// EventsAttendance.jsx
import React, { useState } from "react";
import { usePage, Link, useForm } from "@inertiajs/react";
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/Components/ui/Avatar";
import { Button } from "@/Components/ui/ButtonDashboard";
import {
    Card, CardContent, CardDescription, CardTitle
} from "@/Components/ui/card";
import {
    Calendar, MapPin, Ticket, ArrowRight, Clock, User,
    Check, X, AlertTriangle, Info
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogFooter
} from "@/Components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/Components/ui/alert-dialog";

export function EventsAttendance() {
    const { auth, eventAttendances = [] } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const { delete: destroy, processing } = useForm();

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

    const pastEvents = eventAttendances.filter(attendance => {
        const eventDate = new Date(attendance.event?.fecha_inicio || attendance.event?.start_date);
        return eventDate < now;
    });

    const upcomingEvents = eventAttendances.filter(attendance => {
        const eventDate = new Date(attendance.event?.fecha_inicio || attendance.event?.start_date);
        return eventDate >= now;
    });

    // Formatear los eventos para mostrarlos
    const formatEvents = (events) => events.map((attendance) => ({
        id: attendance.id,
        eventId: attendance.event?.id,
        title: attendance.event?.titulo || attendance.event?.titule || "Evento sin título",
        date: formatDate(attendance.event?.fecha_inicio || attendance.event?.start_date),
        time: attendance.event?.hora || attendance.event?.start_time || "10:00 AM",
        location: attendance.event?.location?.name ||
                attendance.event?.direccion?.direccion_completa ||
                "Ubicación por confirmar",
        description: attendance.event?.descripcion || "Sin descripción disponible",
        capacity: attendance.event?.capacity || attendance.event?.capacidad || 0,
        attendees: attendance.event?.registered_attendees || 0,
        image: attendance.event?.imagen,
        tags: [
            { name: attendance.event?.categoria || "Evento", color: "blue" },
            {
                name: attendance.status?.nombre || attendance.status?.name || "Pendiente",
                color: attendance.status?.slug === "confirmado" ? "green" : "orange",
            },
        ],
        status: attendance.status?.nombre || attendance.status?.name || "Pendiente",
        statusSlug: attendance.status?.slug || "pendiente",
        color: attendance.status?.slug === "confirmado" ? "green" : "orange",
    }));

    const upcomingEventCards = formatEvents(upcomingEvents);
    const pastEventCards = formatEvents(pastEvents);

    // Función para cancelar la inscripción
    const handleCancelAttendance = (id) => {
        destroy(route('eventos.asistencia.cancelar', id), {
            onSuccess: () => {
                // El servidor debería manejar la actualización de la capacidad
                // Mostrar mensaje de éxito (asumiendo que tienes un sistema de notificaciones)
                console.log("Inscripción cancelada exitosamente");
            },
        });
    };

    // Mostrar detalles del evento
    const showEventDetails = (event) => {
        setSelectedEvent(event);
        setDetailsOpen(true);
    };

    return (
        <div className="space-y-12 px-2 md:px-4">
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
                            {auth.user?.name || auth.user?.full_name || "Usuario"}
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
                    onClick={() => (window.location.href = route("eventos.index"))}
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
                                        onShowDetails={() => showEventDetails(event)}
                                        onCancelAttendance={() => handleCancelAttendance(event.id)}
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
                                        Aún no te has registrado a ningún evento. Explora nuestros eventos y regístrate.
                                    </CardDescription>
                                    <Button
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                                        onClick={() => (window.location.href = route("eventos.index"))}
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
                                        onShowDetails={() => showEventDetails(event)}
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
                                        Aún no has asistido a ningún evento. Cuando asistas a un evento, aparecerá aquí.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal de detalles del evento */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                {selectedEvent && (
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{selectedEvent.title}</DialogTitle>
                            <DialogDescription>
                                Detalles importantes para tu asistencia
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {selectedEvent.image && (
                                <div className="rounded-md overflow-hidden h-48">
                                    <img
                                        src={selectedEvent.image}
                                        alt={selectedEvent.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center text-sm">
                                <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Fecha</div>
                                    <div>{selectedEvent.date}</div>
                                </div>
                            </div>

                            <div className="flex items-center text-sm">
                                <div className="bg-green-100 text-green-600 rounded-full p-2 mr-3">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Hora</div>
                                    <div>{selectedEvent.time}</div>
                                </div>
                            </div>

                            <div className="flex items-center text-sm">
                                <div className="bg-purple-100 text-purple-600 rounded-full p-2 mr-3">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Ubicación</div>
                                    <div>{selectedEvent.location}</div>
                                </div>
                            </div>

                            <div className="flex items-center text-sm">
                                <div className="bg-orange-100 text-orange-600 rounded-full p-2 mr-3">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Estado</div>
                                    <div className="flex gap-2 items-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                selectedEvent.statusSlug === "confirmado" ? "bg-green-100 text-green-800" :
                                                selectedEvent.statusSlug === "cancelado" ? "bg-red-100 text-red-800" :
                                                "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {selectedEvent.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex justify-end">
                            <Button
                                onClick={() => setDetailsOpen(false)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

function EventCard({ event, onShowDetails, onCancelAttendance, isPast = false, processing = false }) {
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
    };

    return (
        <Card
            className={`relative overflow-hidden rounded-xl border-l-8 ${colorMap[event.color]?.accent || "border-l-blue-500"} bg-white shadow-sm hover:shadow-md transition-all`}
        >
            <div className="p-6 pt-8 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col">
                    <h4 className={`text-xl font-medium ${colorMap[event.color]?.title || "text-blue-700"} mb-3`}>
                        {event.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mt-2 space-x-6">
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center rounded-full p-2 ${colorMap[event.color]?.icon || "bg-blue-100 text-blue-600"} mr-3`}>
                                <Calendar className="h-4 w-4" />
                            </div>
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center rounded-full p-2 ${colorMap[event.color]?.icon || "bg-blue-100 text-blue-600"} mr-3`}>
                                <Clock className="h-4 w-4" />
                            </div>
                            <span>{event.time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${
                        event.statusSlug === "confirmado" ? "bg-green-100 text-green-800" :
                        event.statusSlug === "cancelado" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                    }`}>
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center text-sm text-gray-600">
                        <div className={`flex items-center justify-center rounded-full p-2 ${colorMap[event.color]?.icon || "bg-blue-100 text-blue-600"} mr-3`}>
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                        </div>
                        <span>{event.location}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                        <Badge
                            key={tag.name}
                            className={`px-3 py-1 text-sm rounded-full
                                ${tag.color === "blue" ? "bg-blue-100 text-blue-800" :
                                tag.color === "green" ? "bg-green-100 text-green-800" :
                                tag.color === "orange" ? "bg-orange-100 text-orange-800" :
                                tag.color === "purple" ? "bg-purple-100 text-purple-800" :
                                "bg-gray-100 text-gray-800"}`
                            }
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-between">
                <Button
                    variant="outline"
                    onClick={onShowDetails}
                    className={`px-4 py-2 ${colorMap[event.color]?.button || "hover:bg-blue-50"}`}
                >
                    <Info className="h-4 w-4 mr-2" />
                    Ver detalles
                </Button>

                {!isPast && event.statusSlug !== "cancelado" && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="px-4 py-2 text-red-600 border-red-200 hover:bg-red-50"
                                disabled={processing}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar inscripción
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Estás a punto de cancelar tu inscripción para este evento. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onCancelAttendance}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {processing ? 'Procesando...' : 'Confirmar cancelación'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {isPast && (
                    <Link href={route('eventos.show', event.eventId)}>
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
