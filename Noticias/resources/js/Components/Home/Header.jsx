import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react"; // Añadimos router
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Menu,
    X,
    User,
    Bell,
    Calendar,
    Newspaper,
    Settings,
    LogOut,
    Home,
} from "lucide-react";
import Logo_SecretariaDeEducacion from "@/assets/Logo_SecretariaDeEducacion.png";

export default function AnimatedHeader() {
    // Usar usePage para obtener la información de autenticación
    const { auth } = usePage().props;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const logoRef = useRef(null);

    // Usamos auth para determinar si el usuario está autenticado
    // Hacemos una verificación más estricta para asegurar que realmente tenemos un usuario
    const isAuthenticated = auth?.user !== undefined && auth?.user !== null;
    const userName = isAuthenticated
        ? auth.user.full_name || auth.user.email || "Usuario"
        : "Invitado";

    // Log para depuración
    useEffect(() => {
        console.log("Estado de autenticación:", isAuthenticated);
        console.log("Datos de usuario:", auth?.user);
    }, [auth, isAuthenticated]);

    // Animación del logo al cargar la página
    useEffect(() => {
        const logoElement = logoRef.current;
        if (logoElement) {
            logoElement.style.transform = "translateX(-100px)";
            logoElement.style.opacity = "0";

            setTimeout(() => {
                logoElement.style.transition = "all 0.8s ease-out";
                logoElement.style.transform = "translateX(0)";
                logoElement.style.opacity = "1";
            }, 300);
        }
    }, []);

    useEffect(() => {
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
    }, []);

    // Función mejorada para el cierre de sesión usando Inertia.js
    const handleLogout = (e) => {
        e.preventDefault();

        // Usamos router.post de Inertia.js para hacer un cierre de sesión más controlado
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    // Forzar recarga completa para asegurar actualización del estado
                    window.location.href = "/";
                },
            }
        );
    };

    return (
        <header className="bg-blue-50 border-b">
            {/* Parte superior: Logos, buscador e icono de usuario */}
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
                </Link>

                <div className="flex items-center space-x-6">
                    {/* Buscador con animación */}
                    <div className="relative flex items-center" ref={searchRef}>
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
                                            placeholder="Buscar noticias..."
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
                                    {isAuthenticated ? (
                                        // Opciones para usuario autenticado
                                        <>
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {userName}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                    {auth?.user?.email}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        // Opciones para usuario no autenticado
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-700">
                                                Menú
                                            </p>
                                        </div>
                                    )}

                                    {/* Usuario autenticado */}
                                    {isAuthenticated ? (
                                        <>
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
                                                href="/dashboard"
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Mi Perfil
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                                            >
                                                 <LogOut className="h-4 w-4 mr-2" />
                                                 Cerrar sesión
                                            </button>                                          
                                        </>
                                    ) : (
                                        <div className="mt-2 pt-2">
                                            <Link
                                                href="/login"
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                            >
                                                Iniciar sesión
                                            </Link>
                                            <Link
                                                href="/registro"
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                            >
                                                Registrarse
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
