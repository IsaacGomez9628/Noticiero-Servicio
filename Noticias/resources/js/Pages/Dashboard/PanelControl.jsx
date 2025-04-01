import React from "react";
import { Link, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Calendar, Users, FileText, Clock } from "lucide-react";

export default function PanelDeControl() {
    const { auth } = usePage().props;

    return (
        <DashboardLayout activePage="panel">
            <div className="pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Bienvenido, {auth.user.name || "Usuario"}
                </h1>
                <p className="text-gray-600 mb-8">
                    Aquí puedes administrar tus eventos, noticias y más.
                </p>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <Calendar
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Eventos Disponibles
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                12
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link
                                    href="#"
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <Users
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Mis Asistencias
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                4
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link
                                    href="#"
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                                    <FileText
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Noticias Recientes
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                8
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link
                                    href="#"
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                    <Clock
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Próximos Eventos
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                3
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link
                                    href="#"
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de actividad reciente */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Actividad Reciente
                    </h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-600 truncate">
                                                Evento de Tecnología 1
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
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-600 truncate">
                                                Evento de Tecnología 2
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
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-600 truncate">
                                                Evento de Tecnología 3
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
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
