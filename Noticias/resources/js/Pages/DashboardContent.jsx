import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardFooter, CardTitle } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/ButtonDashboard";
import {
    Calendar,
    Users,
    FileText,
    Clock,
    MapPin,
    ArrowRight,
} from "lucide-react";
import { Badge } from "@/Components/ui/Badge";

export function DashboardContent() {
    const { auth, eventAttendances = [] } = usePage().props;

    const stats = [
        {
            title: "Eventos Disponibles",
            value: "12", // Idealmente esto vendría del backend
            icon: <Calendar className="h-6 w-6" />,
            description: "+2 desde la semana pasada",
            color: "blue",
        },
        {
            title: "Mis Asistencias",
            value: eventAttendances.length || "0",
            icon: <Users className="h-6 w-6" />,
            description: "Próximo evento: 25 de mayo",
            color: "purple",
        },
        {
            title: "Noticias Recientes",
            value: "8", // Idealmente esto vendría del backend
            icon: <FileText className="h-6 w-6" />,
            description: "Última actualización: hoy",
            color: "orange",
        },
        {
            title: "Próximos Eventos",
            value: "3", // Idealmente esto vendría del backend
            icon: <Clock className="h-6 w-6" />,
            description: "En los próximos 30 días",
            color: "green",
        },
    ];

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

    // Mostrar los eventos a los que el usuario está registrado
    const userEvents = eventAttendances.slice(0, 2).map((attendance) => {
        return {
            title:
                attendance.event.titulo ||
                attendance.event.titule ||
                "Evento sin título",
            date: formatDate(
                attendance.event.fecha_inicio || attendance.event.start_date
            ),
            time: attendance.event.hora_inicio || "10:00 AM - 6:00 PM",
            location:
                attendance.event.location?.name || "Ubicación por confirmar",
            tags: [
                {
                    name: attendance.event.categoria || "Evento",
                    color: "orange",
                },
                { name: "Cultural", color: "purple" },
                { name: "Networking", color: "blue" },
            ],
            status: attendance.status?.nombre || "Pendiente",
            color: "orange",
        };
    });

    // Si no hay eventos registrados, mostrar ejemplos
    if (userEvents.length === 0) {
        userEvents.push(
            {
                title: "Encuentro Gastronómico de Querétaro",
                date: "25 de mayo de 2025",
                time: "10:00 AM - 6:00 PM",
                location: "Centro Cultural de San Juan del Río",
                tags: [
                    { name: "Gastronomía", color: "orange" },
                    { name: "Cultural", color: "purple" },
                    { name: "Networking", color: "blue" },
                ],
                status: "Pendiente",
                color: "orange",
            },
            {
                title: "Querétaro Tech Summit",
                date: "25 de abril de 2025",
                time: "9:00 AM - 5:00 PM",
                location: "Centro Cultural de Tequisquiapan",
                tags: [
                    { name: "Tecnología", color: "blue" },
                    { name: "Innovación", color: "green" },
                    { name: "Conferencias", color: "teal" },
                ],
                status: "Pendiente",
                color: "blue",
            }
        );
    }

    return (
        <div className="space-y-12 px-2 md:px-4">
            <div className="mt-6">
                <h2 className="text-3xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Bienvenido, {auth.user?.name || "Usuario"}
                </h2>
                <p className="text-muted-foreground">
                    Aquí puedes administrar tus eventos, noticias y más.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        description={stat.description}
                        color={stat.color}
                    />
                ))}
            </div>

            <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-8 text-blue-600 dark:text-teal-400">
                    Mis Registros a Eventos
                </h3>
                <div className="space-y-12">
                    {userEvents.map((event, index) => (
                        <EventCard
                            key={index}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            location={event.location}
                            tags={event.tags}
                            status={event.status}
                            color={event.color}
                        />
                    ))}
                </div>

                <div className="mt-12 flex justify-end space-x-3">
                    <Button
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                        onClick={() =>
                            (window.location.href = route("eventos.index"))
                        }
                    >
                        <span>Ver todos los eventos</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, description, color }) {
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
            className={`relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md p-8 flex flex-col gap-4 ${colorMap[color].border} ${colorMap[color].shadow} hover:shadow-lg transition-all duration-300`}
        >
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center ${colorMap[color].bg} text-white`}
                >
                    <div>{icon}</div>
                </div>
            </div>
            <div className="mt-3">
                <div className={`text-4xl font-bold ${colorMap[color].text}`}>
                    {value}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    <span>{description}</span>
                </p>
            </div>
            <CardFooter className="p-0 pt-4">
                <Button
                    variant="link"
                    className={`h-auto p-0 text-sm ${colorMap[color].text}`}
                >
                    Ver detalles
                    <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    );
}

function EventCard({ title, date, time, location, tags, status, color }) {
    const statusClass =
        status === "Pendiente"
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            : status === "Completado"
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
            : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";

    const colorMap = {
        blue: {
            accent: "border-l-8 border-l-blue-500",
            title: "text-blue-700 dark:text-blue-400",
            lightBg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
        },
        purple: {
            accent: "border-l-8 border-l-purple-500",
            title: "text-purple-700 dark:text-purple-400",
            lightBg: "bg-purple-50 dark:bg-purple-900/20",
            icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
        },
        orange: {
            accent: "border-l-8 border-l-orange-500",
            title: "text-orange-700 dark:text-orange-400",
            lightBg: "bg-orange-50 dark:bg-orange-900/20",
            icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
        },
        green: {
            accent: "border-l-8 border-l-emerald-500",
            title: "text-emerald-700 dark:text-emerald-400",
            lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
        },
        teal: {
            accent: "border-l-8 border-l-teal-500",
            title: "text-teal-700 dark:text-teal-400",
            lightBg: "bg-teal-50 dark:bg-teal-900/20",
            icon: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300",
        },
    };

    return (
        <Card
            className={`relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-lg transition-all duration-300 mx-4 md:mx-6 mb-12 ml-10 ${colorMap[color].accent}`}
        >
            <div className="p-8 pt-10 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col">
                    <h4
                        className={`text-xl font-medium ${colorMap[color].title} mb-4`}
                    >
                        {title}
                    </h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-3 space-x-6">
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 ${colorMap[color].icon} mr-3`}
                            >
                                <Calendar className="h-4 w-4" />
                            </div>
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 ${colorMap[color].icon} mr-3`}
                            >
                                <Clock className="h-4 w-4" />
                            </div>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <span
                        className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${statusClass}`}
                    >
                        {status}
                    </span>
                </div>
            </div>
            <div className="p-8 pl-10 flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <div
                            className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 ${colorMap[color].icon} mr-3`}
                        >
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                        </div>
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <div
                            className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 ${colorMap[color].icon} mr-3`}
                        >
                            <Users className="h-4 w-4 flex-shrink-0" />
                        </div>
                        <span>
                            {tags.length > 2 ? "120" : "250"} asistentes
                            confirmados
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-5 mt-6">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            className={`px-5 py-2 text-sm rounded-full
                ${
                    tag.color === "blue"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : tag.color === "purple"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        : tag.color === "orange"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        : tag.color === "green"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : tag.color === "teal"
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                }`}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="p-8 py-10 border-t bg-gray-50 dark:bg-gray-700/50 flex justify-between">
                <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 mt-2 mb-2"
                    onClick={() => {
                        if (window.location.href.includes("/evento/")) {
                            return; // Ya estamos en la página del evento
                        } else {
                            // Redirigir a la página de eventos
                            window.location.href = route("eventos.index");
                        }
                    }}
                >
                    Ver detalles
                </Button>
            </div>
        </Card>
    );
}
