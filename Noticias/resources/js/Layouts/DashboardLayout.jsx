import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    Calendar,
    FileText,
    PlusCircle,
    LogOut,
    User,
    LayoutDashboard, // Importamos este ícono para el Panel de Control
} from "lucide-react";
import { Button } from "@/Components/Button";

export default function DashboardLayout({ children, activePage = "home" }) {
    const { auth } = usePage().props;

    // Si el usuario no está autenticado, no renderizamos el dashboard
    if (!auth || !auth.user) {
        return null;
    }

    const navigation = [
        {
            name: "Página de inicio",
            href: route("welcome"),
            icon: Home,
            current: activePage === "home",
        },
        {
            name: "Panel de Control",
            href: route("dashboard.panel"),
            icon: LayoutDashboard,
            current: activePage === "panel",
        },
        {
            name: "Eventos",
            href: route("eventos.index"),
            icon: Calendar,
            current: activePage === "eventos",
        },
        {
            name: "Crear Noticia",
            href: route("dashboard.crear-noticia"),
            icon: FileText,
            current: activePage === "crear-noticia",
        },
        {
            name: "Crear Evento",
            href: route("dashboard.crear-evento"),
            icon: PlusCircle,
            current: activePage === "crear-evento",
        },
        {
            name: "Editar Perfil",
            href: route("perfil.edit"),
            icon: User,
            current: activePage === "editar-perfil",
        },
    ];

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <span className="text-xl font-bold text-blue-700">
                                Mi Dashboard
                            </span>
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 space-y-1 bg-white">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            item.current
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                                item.current
                                                    ? "text-blue-600"
                                                    : "text-gray-500 group-hover:text-blue-600"
                                            }`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="p-4 border-t">
                            <div className="flex items-center mb-4">
                                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                                    {auth.user.name
                                        ? auth.user.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {auth.user.name || auth.user.email}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {auth.user.email}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
