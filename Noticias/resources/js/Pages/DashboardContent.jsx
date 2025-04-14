// Dashboard-Content.jsx
import React, { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Card, CardContent, CardFooter, CardTitle
} from "@/Components/ui/Card";
import { Button } from "@/Components/ui/ButtonDashboard";
import {
    Calendar as CalendarIcon,
    Users,
    FileText,
    Clock,
    MapPin,
    ArrowRight,
} from "lucide-react";

moment.locale('es');
const localizer = momentLocalizer(moment);

export function DashboardContent() {
    const { auth, eventAttendances = [] } = usePage().props;
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Dividir eventos entre próximos y pasados
    const now = new Date();
    const upcomingEvents = eventAttendances.filter(attendance => {
        const eventDate = new Date(attendance.event?.fecha_inicio || attendance.event?.start_date);
        return eventDate >= now;
    });

    const pastEvents = eventAttendances.filter(attendance => {
        const eventDate = new Date(attendance.event?.fecha_inicio || attendance.event?.start_date);
        return eventDate < now;
    });

    // Preparar eventos para el calendario
    useEffect(() => {
        if (eventAttendances.length > 0) {
            const formattedEvents = eventAttendances.map(attendance => {
                const startDate = new Date(attendance.event?.fecha_inicio || attendance.event?.start_date);
                // Añadir la hora si está disponible
                if (attendance.event?.hora) {
                    const [hours, minutes] = attendance.event.hora.split(':');
                    startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                }

                // Crear fecha de fin (2 horas después por defecto)
                const endDate = new Date(startDate);
                endDate.setHours(endDate.getHours() + 2);

                return {
                    id: attendance.id,
                    title: attendance.event?.titulo || attendance.event?.titule || "Evento sin título",
                    start: startDate,
                    end: endDate,
                    status: attendance.status?.nombre || attendance.status?.name,
                    location: attendance.event?.location?.name ||
                             attendance.event?.direccion?.direccion_completa ||
                             "Ubicación por confirmar",
                }
            });

            setCalendarEvents(formattedEvents);
        }
    }, [eventAttendances]);

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

    // Estadísticas para mostrar
    const stats = [
        {
            title: "Eventos Disponibles",
            value: "12", // Idealmente esto vendría del backend
            icon: <CalendarIcon className="h-6 w-6" />,
            description: "Explora eventos actuales",
            color: "blue",
            route: route("eventos.index"),
        },
        {
            title: "Mis Asistencias",
            value: eventAttendances.length.toString(),
            icon: <Users className="h-6 w-6" />,
            description: upcomingEvents.length > 0
                ? `Próximo: ${formatDate(upcomingEvents[0]?.event?.fecha_inicio)}`
                : "No hay eventos próximos",
            color: "purple",
            route: route("eventos.mis-asistencias"),
        },
        {
            title: "Eventos Pasados",
            value: pastEvents.length.toString(),
            icon: <FileText className="h-6 w-6" />,
            description: "Historial de eventos",
            color: "orange",
            route: route("eventos.mis-asistencias"),
        },
        {
            title: "Próximos Eventos",
            value: upcomingEvents.length.toString(),
            icon: <Clock className="h-6 w-6" />,
            description: "Eventos por asistir",
            color: "green",
            route: route("eventos.mis-asistencias"),
        },
    ];

    // Componente para el evento en el calendario
    const EventComponent = ({ event }) => {
        return (
            <div className="p-1 overflow-hidden h-full">
                <div className="text-xs font-bold truncate">{event.title}</div>
                <div className="text-xs truncate">{event.location}</div>
            </div>
        );
    };

    return (
        <div className="space-y-12 px-2 md:px-4">
            <div className="mt-6">
                <h2 className="text-3xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Bienvenido, {auth.user?.name || auth.user?.full_name || "Usuario"}
                </h2>
                <p className="text-muted-foreground">
                    Administra tus eventos, revisa tus inscripciones, y más.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        description={stat.description}
                        color={stat.color}
                        route={stat.route}
                    />
                ))}
            </div>

            {/* Calendario de eventos */}
            <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-teal-400">
                    Calendario de Eventos
                </h3>

                <Card className="shadow-md border border-gray-200 rounded-lg overflow-hidden">
                    <CardContent className="p-6">
                        <div className="h-[500px]">
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%' }}
                                messages={{
                                    next: "Siguiente",
                                    previous: "Anterior",
                                    today: "Hoy",
                                    month: "Mes",
                                    week: "Semana",
                                    day: "Día",
                                    agenda: "Agenda",
                                    date: "Fecha",
                                    time: "Hora",
                                    event: "Evento",
                                    noEventsInRange: "No hay eventos en este rango"
                                }}
                                components={{
                                    event: EventComponent
                                }}
                                eventPropGetter={(event) => {
                                    let style = {
                                        backgroundColor: '#3B82F6', // azul por defecto
                                        borderRadius: '4px',
                                        color: 'white',
                                        border: 'none',
                                    };

                                    // Cambia el color según el estado
                                    if (event.status === 'Completado' || event.status === 'Asistido') {
                                        style.backgroundColor = '#10B981'; // verde
                                    } else if (event.status === 'Cancelado') {
                                        style.backgroundColor = '#EF4444'; // rojo
                                    } else if (new Date(event.start) < new Date()) {
                                        style.backgroundColor = '#6B7280'; // gris para eventos pasados
                                    }

                                    return { style };
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Próximos eventos */}
            {upcomingEvents.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-teal-400">
                        Próximos Eventos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.slice(0, 3).map((attendance) => (
                            <Card key={attendance.id} className="overflow-hidden border border-gray-200 rounded-lg shadow-md">
                                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                                    {attendance.event.imagen && (
                                        <img
                                            src={attendance.event.imagen}
                                            alt={attendance.event.titulo || "Evento"}
                                            className="w-full h-full object-cover opacity-50"
                                        />
                                    )}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                        <h4 className="text-white font-bold text-lg truncate">
                                            {attendance.event.titulo || attendance.event.titule || "Evento sin título"}
                                        </h4>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center text-gray-600 my-2">
                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {formatDate(attendance.event.fecha_inicio || attendance.event.start_date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {attendance.event.hora || attendance.event.start_time || "Hora no especificada"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm truncate">
                                            {attendance.event.location?.name ||
                                            attendance.event.direccion?.direccion_completa ||
                                            "Ubicación por confirmar"}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        attendance.status?.slug === "confirmado" ? "bg-green-100 text-green-800" :
                                        attendance.status?.slug === "cancelado" ? "bg-red-100 text-red-800" :
                                        "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {attendance.status?.nombre || attendance.status?.name || "Pendiente"}
                                    </span>

                                    <Link href={route('eventos.show', attendance.event.id)}>
                                        <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                                            Ver detalles
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {upcomingEvents.length > 3 && (
                        <div className="mt-4 flex justify-end">
                            <Link href={route('eventos.mis-asistencias')}>
                                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity">
                                    <span>Ver todos mis eventos</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, description, color, route }) {
    const colorMap = {
        blue: {
            bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
            lightBg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400",
            border: "border-blue-100 dark:border-blue-800",
            shadow: "shadow-blue-100 dark:shadow-none",
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
            lightBg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-600 dark:text-purple-400",
            border: "border-purple-100 dark:border-purple-800",
            shadow: "shadow-purple-100 dark:shadow-none",
        },
        orange: {
            bg: "bg-gradient-to-br from-orange-500 to-pink-600",
            lightBg: "bg-orange-50 dark:bg-orange-900/20",
            text: "text-orange-600 dark:text-orange-400",
            border: "border-orange-100 dark:border-orange-800",
            shadow: "shadow-orange-100 dark:shadow-none",
        },
        green: {
            bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
            lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-100 dark:border-emerald-800",
            shadow: "shadow-emerald-100 dark:shadow-none",
        },
    };

    return (
        <Card
            className={`relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md p-6 flex flex-col gap-3 ${colorMap[color].border} ${colorMap[color].shadow} hover:shadow-lg transition-all duration-300`}
        >
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${colorMap[color].bg} text-white`}
                >
                    <div>{icon}</div>
                </div>
            </div>
            <div className="mt-2">
                <div className={`text-3xl font-bold ${colorMap[color].text}`}>
                    {value}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    <span>{description}</span>
                </p>
            </div>
            <CardFooter className="p-0 pt-3">
                <Link href={route}>
                    <Button
                        variant="link"
                        className={`h-auto p-0 text-sm ${colorMap[color].text}`}
                    >
                        Ver detalles
                        <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
