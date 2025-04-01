import React from "react";
import { usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Calendar, Users, FileText, Clock } from "lucide-react";

export default function Dashboard() {
    const { auth } = usePage().props;

    // Si no hay usuario autenticado, no renderiamos esto, pero por si acaso
    if (!auth || !auth.user) {
        return null;
    }

    const stats = [
        {
            name: "Eventos Disponibles",
            value: "12",
            icon: Calendar,
            color: "bg-blue-500",
        },
        {
            name: "Mis Asistencias",
            value: "4",
            icon: Users,
            color: "bg-green-500",
        },
        {
            name: "Noticias Recientes",
            value: "8",
            icon: FileText,
            color: "bg-amber-500",
        },
        {
            name: "Próximos Eventos",
            value: "3",
            icon: Clock,
            color: "bg-purple-500",
        },
    ];

    return (
        <DashboardLayout activePage="home">
            <div className="pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Bienvenido, {auth.user.name || "Usuario"}
                </h1>
                <p className="text-gray-600 mb-8">
                    Aquí puedes administrar tus eventos, noticias y más.
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.name}
                            className="bg-white overflow-hidden shadow rounded-lg"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div
                                        className={`flex-shrink-0 ${item.color} rounded-md p-3`}
                                    >
                                        <item.icon
                                            className="h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {item.name}
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {item.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-700 hover:text-blue-900"
                                    >
                                        Ver detalles
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Actividad Reciente
                    </h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {[1, 2, 3].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="block hover:bg-gray-50"
                                    >
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-blue-600 truncate">
                                                    Evento de Tecnología {item}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Confirmado
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        <Users
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        150 asistentes
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <Calendar
                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <p>
                                                        <time dateTime="2025-04-15">
                                                            15 de Abril, 2025
                                                        </time>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
