import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Search, User, LogOut, Settings, Bell } from "lucide-react";
import { Input } from "@/Components/Input";
import Secretaria from "@/assets/Logo_SecretariaDeEducacion.png";
import Ceat from "@/assets/Logo_CEATyCC.png";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/Components/Button";
import { AnimatePresence, motion } from "framer-motion";

export default function MainLayout({ children, selectedTab = null }) {
    const { auth } = usePage().props;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const userMenuRef = useRef(null);
    const searchRef = useRef(null);

    // Add CSS keyframes for animations
    useEffect(() => {
        // Add keyframes for search expansion animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes expandSearch {
                from { width: 0; opacity: 0; }
                to { width: 100%; opacity: 1; }
            }
            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
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

    const isAuthenticated = auth && auth.user;

    // Función para obtener la inicial del usuario de forma segura
    const getUserInitial = () => {
        if (!isAuthenticated) return "U";

        // Verificar si existe el nombre y tiene contenido
        if (auth.user.name && auth.user.name.trim() !== "") {
            return auth.user.name.charAt(0).toUpperCase();
        }

        // Si no tiene nombre o está vacío, intentar con el email
        if (auth.user.email && auth.user.email.trim() !== "") {
            return auth.user.email.charAt(0).toUpperCase();
        }

        // Si nada funciona, devolver U
        return "U";
    };

    // Obtener la inicial
    const userInitial = getUserInitial();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Barra de navegación principal con dos partes */}
            <header className="bg-blue-50 border-b">
                {/* Parte superior: Logos, buscador e icono de usuario */}
                <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-primary flex items-center space-x-3"
                    >
                        <img
                            src={Secretaria}
                            alt="Logo Secretaría de Educación"
                            className="h-14 object-contain"
                        />
                        <img
                            src={Ceat}
                            alt="Logo CEATyCC"
                            className="h-12 object-contain"
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
                                            <Input
                                                type="search"
                                                placeholder="Buscar noticias..."
                                                className="w-64 pl-10 pr-4 py-2 rounded-full border-2 border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                autoFocus
                                            />
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="rounded-full p-2 hover:bg-blue-50 transition-colors"
                                aria-label="Buscar"
                            >
                                <Search className="h-5 w-5 text-gray-700" />
                            </Button>
                        </div>

                        {/* Menú de usuario */}
                        <div className="relative" ref={userMenuRef}>
                            {isAuthenticated ? (
                                // Usuario autenticado - mostrar avatar con iniciales
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="rounded-full p-0 hover:bg-blue-50 transition-colors"
                                    aria-label="Usuario"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                                        {userInitial}
                                    </div>
                                </Button>
                            ) : (
                                // Usuario no autenticado - mostrar icono de usuario
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="rounded-full p-2 hover:bg-blue-50 transition-colors"
                                    aria-label="Usuario"
                                >
                                    <User className="h-5 w-5 text-gray-700" />
                                </Button>
                            )}

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100 overflow-hidden"
                                    >
                                        {isAuthenticated ? (
                                            // Opciones para usuario autenticado
                                            <>
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {auth.user.name ||
                                                            "Usuario"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {auth.user.email}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route("dashboard")}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <Settings className="w-4 h-4 mr-2" />
                                                        Dashboard
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "eventos.mis-asistencias"
                                                    )}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <Bell className="w-4 h-4 mr-2" />
                                                        Mis asistencias
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-t border-gray-100"
                                                >
                                                    <div className="flex items-center">
                                                        <LogOut className="w-4 h-4 mr-2" />
                                                        Cerrar sesión
                                                    </div>
                                                </Link>
                                            </>
                                        ) : (
                                            // Opciones para usuario no autenticado
                                            <>
                                                <Link
                                                    href={route("login")}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    Iniciar sesión
                                                </Link>
                                                <Link
                                                    href={route("registro")}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    Registrarse
                                                </Link>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Parte inferior: Enlaces de navegación centrados */}
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto flex justify-center">
                        <nav className="flex items-center space-x-16 py-4">
                            <Link
                                href="/eventos"
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
                            >
                                Eventos
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            {/* <Link
                                href="/noticias"
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
                            >
                                Noticias
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                            </Link> */}
                            <Link
                                href="/home/Quienes-Somos"
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
                            >
                                ¿Quiénes Somos?
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="container mx-auto px-4 py-8">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-50 py-12 border-t">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 mx-36 gap-8 justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-700">
                                Contacto
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    contacto@ejemplo.com
                                </p>
                                <p className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    (123) 456-7890
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-700">
                                Enlaces
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/eventos"
                                        className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                        Eventos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/noticias"
                                        className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                        Noticias
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/quienes-somos"
                                        className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                        Quiénes Somos
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-700">
                                Síguenos
                            </h3>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                                    aria-label="Facebook"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="bg-black text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
                                    aria-label="Twitter"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 50 50"
                                    >
                                        <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors"
                                    aria-label="Instagram"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
                        <p>
                            © 2025 Secretaría de Educación. Todos los derechos
                            reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
