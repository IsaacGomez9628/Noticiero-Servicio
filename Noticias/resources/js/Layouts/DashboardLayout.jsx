import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Ticket,
    Heart,
    Users,
    Compass,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    Calendar,
    Newspaper,
    Home,
} from "lucide-react";
import Logo_SecretariaDeEducacion from "@/assets/Logo_SecretariaDeEducacion.png";
import Logo_CEATyCC from "@/assets/logo_ceatycc.png";

export default function DashboardLayout({
    children,
    setCurrentView,
    currentView,
}) {
    const { auth } = usePage().props;
    const [userName, setUserName] = useState(
        auth?.user?.full_name || "Usuario"
    );
    const [userEmail, setUserEmail] = useState(
        auth?.user?.email || "usuario@ejemplo.com"
    );
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const logoRef = useRef(null);

    // Verificación de autenticación
    const isAuthenticated = auth?.user !== undefined && auth?.user !== null;

    // Ensure the component is mounted to avoid hydration issues
    useEffect(() => {
        setMounted(true);

        // Set user name and email if available
        if (auth && auth.user) {
            setUserName(auth.user.full_name || "Usuario");
            setUserEmail(auth.user.email || "usuario@ejemplo.com");
        }

        // Add event listener for clicks outside the menu
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [auth]);

    if (!mounted) {
        return null;
    }

    // Función para cerrar sesión
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    window.location.href = "/";
                },
            }
        );
    };

    // Componente para elementos de navegación en la barra lateral
    const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
        <button
            className={`w-full flex items-center gap-3 my-1 py-2 px-3 rounded-md transition-colors ${
                isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                    : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={onClick}
        >
            <Icon
                className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-gray-500"
                }`}
            />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Header - Estilo similar al Header.jsx */}
            <header className="bg-blue-50 border-b">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-primary flex items-center space-x-3"
                        ref={logoRef}
                    >
                        <img
                            src={Logo_SecretariaDeEducacion}
                            alt="Logo Secretaría de Educación"
                            className="h-17 w-60 object-contain"
                        />
                        <img
                            src={Logo_CEATyCC}
                            alt="Logo CEATyCC"
                            className="h-17 w-28 object-contain"
                        />
                    </Link>

                    <div className="flex items-center space-x-6">
                        {/* Buscador con animación */}
                        <div
                            className="relative flex items-center"
                            ref={searchRef}
                        >
                            <AnimatePresence>
                                {isSearchOpen ? (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "auto", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mr-2"
                                    >
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="search"
                                                placeholder="Buscar eventos..."
                                                className="w-64 pl-10 pr-4 py-2 rounded-full border-2 border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                autoFocus
                                            />
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="rounded-full p-2 hover:bg-blue-50 transition-colors"
                                aria-label="Buscar"
                            >
                                <Search className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>

                        {/* Notificaciones
                        <button
                            className="rounded-full p-2 hover:bg-blue-50 transition-colors relative"
                            aria-label="Notificaciones"
                        >
                            <Bell className="h-5 w-5 text-gray-700" />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button> */}

                        {/* Menú hamburguesa */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="rounded-full p-2 hover:bg-blue-50 transition-colors"
                                aria-label="Menú"
                            >
                                {isMenuOpen ? (
                                    <X className="h-5 w-5 text-gray-700" />
                                ) : (
                                    <Menu className="h-5 w-5 text-gray-700" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        key="menu-dropdown"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-700">
                                                {userName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mt-1">
                                                {userEmail}
                                            </p>
                                        </div>

                                        {/* Opciones comunes para todos los usuarios */}
                                        <Link
                                            href="/"
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                                        >
                                            <Home className="h-4 w-4 mr-2" />
                                            Inicio
                                        </Link>
                                        <Link
                                            href="/eventos"
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                                        >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Eventos
                                        </Link>
                                        <Link
                                            href="/perfil/editar"
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                                        >
                                        <Settings className="h-4 w-4 mr-2" />
                                            Ajustes
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Cerrar sesión
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-1">
                {/* Sidebar (desktop only) */}
                <aside className="hidden w-64 flex-col border-r bg-white md:flex">
                    <div className="flex-1 overflow-auto py-6 px-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">
                            MENÚ PRINCIPAL
                        </h3>
                        <div className="space-y-1">
                            <NavItem
                                icon={LayoutDashboard}
                                label="Dashboard"
                                isActive={currentView === "dashboard"}
                                onClick={() => setCurrentView("dashboard")}
                            />
                            <NavItem
                                icon={Ticket}
                                label="Eventos futuros"
                                isActive={currentView === "mis-asistencias"}
                                onClick={() =>
                                    setCurrentView("mis-asistencias")
                                }
                            />
                        </div>
                    </div>
                    <div className="border-t p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">
                            CUENTA
                        </h3>
                        <div className="space-y-1">
                            <NavItem
                                icon={Settings}
                                label="Ajustes de la cuenta"
                                onClick={() =>
                                    (window.location.href =
                                        route("perfil.edit"))
                                }
                            />
                            <NavItem
                                icon={LogOut}
                                label="Cerrar sesión"
                                onClick={handleLogout}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main content area */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6 md:p-8 max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
