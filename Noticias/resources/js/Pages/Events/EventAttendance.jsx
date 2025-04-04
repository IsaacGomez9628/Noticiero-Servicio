import React from "react";
import { usePage } from "@inertiajs/react";
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
    Search,
    Filter,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export function EventsAttendance() {
    const { auth, eventAttendances = [] } = usePage().props;

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

    const eventCards = eventAttendances.map((attendance) => {
        return {
            id: attendance.id,
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
            attendees: attendance.event.capacity
                ? Math.floor(Math.random() * attendance.event.capacity)
                : 120,
            tags: [
                { name: attendance.event.categoria || "Evento", color: "blue" },
                {
                    name: attendance.status?.nombre || "Pendiente",
                    color:
                        attendance.status?.slug === "confirmado"
                            ? "green"
                            : "orange",
                },
            ],
            color: "blue",
        };
    });

    // Si no hay eventos registrados, mostrar ejemplos
    const displayEvents =
        eventCards.length > 0
            ? eventCards
            : [
                  {
                      id: 1,
                      title: "Encuentro Gastronómico de Querétaro",
                      date: "25 de mayo de 2025",
                      time: "10:00 AM - 6:00 PM",
                      location: "Centro Cultural de San Juan del Río",
                      attendees: 120,
                      tags: [
                          { name: "Gastronomía", color: "orange" },
                          { name: "Cultural", color: "purple" },
                          { name: "Networking", color: "blue" },
                      ],
                      color: "orange",
                  },
                  {
                      id: 2,
                      title: "Querétaro Tech Summit",
                      date: "25 de abril de 2025",
                      time: "9:00 AM - 5:00 PM",
                      location: "Centro Cultural de Tequisquiapan",
                      attendees: 250,
                      tags: [
                          { name: "Tecnología", color: "blue" },
                          { name: "Innovación", color: "green" },
                          { name: "Conferencias", color: "teal" },
                      ],
                      color: "blue",
                  },
              ];

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
                            {auth.user?.name || "Usuario"}
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
                                <span>0 completados</span>
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
                <Tabs defaultValue="asistencias" className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-md">
                            <TabsTrigger
                                value="asistencias"
                                className="px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-gray-200"
                            >
                                Mis Asistencias
                            </TabsTrigger>

                            <TabsTrigger
                                value="historial"
                                className="px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-gray-200"
                            >
                                Historial
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Buscar evento..."
                                    className="pl-10 h-10 w-[220px] bg-white dark:bg-gray-800 shadow-sm"
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="default"
                                        className="gap-2 px-4 bg-white dark:bg-gray-800 shadow-sm"
                                    >
                                        <div className="flex items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 p-2">
                                            <Filter className="h-4 w-4" />
                                        </div>
                                        <span>Filtrar</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        Todos los eventos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Pendientes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Completados
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Cancelados
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <TabsContent value="asistencias" className="mt-0">
                        <div className="grid gap-12">
                            {displayEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    date={event.date}
                                    time={event.time}
                                    location={event.location}
                                    attendees={event.attendees}
                                    tags={event.tags}
                                    color={event.color}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="historial" className="mt-0">
                        <Card className="text-center p-10 border-dashed bg-white dark:bg-gray-800">
                            <CardContent className="pt-6 flex flex-col items-center">
                                <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 mb-6 shadow-inner">
                                    <Ticket className="h-12 w-12 text-indigo-600 opacity-70" />
                                </div>
                                <CardTitle className="text-xl mb-3 text-blue-600">
                                    No hay eventos completados
                                </CardTitle>
                                <CardDescription className="mb-6 text-base">
                                    Aún no has asistido a ningún evento. Cuando
                                    asistas a un evento, aparecerá aquí.
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function EventCard({ title, date, time, location, attendees, tags, color }) {
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
            className={`relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-lg transition-all duration-300 ${colorMap[color].accent}`}
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
                    <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Asistido
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
                            <User className="h-4 w-4 flex-shrink-0" />
                        </div>
                        <span>{attendees} asistentes confirmados</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-5 mt-6">
                    {tags.map((tag) => (
                        <Badge
                            key={tag.name}
                            className={`px-5 py-2 text-sm bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300 rounded-full`}
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
                    className={`px-8 py-6 mt-2 mb-2 hover:bg-${color}-50 hover:text-${color}-700 dark:hover:bg-${color}-900/20 dark:hover:text-${color}-400`}
                >
                    Ver detalles
                </Button>
            </div>
        </Card>
    );
}
