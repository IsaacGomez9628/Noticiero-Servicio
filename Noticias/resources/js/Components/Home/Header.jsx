import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import Logo_CEATyCC from "@/assets/Logo_CEATyCC.png";
import Logo_SecretariaDeEducacion from "@/assets/Logo_SecretariaDeEducacion.png";

export default function AnimatedHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const logoRef = useRef(null);

    // Usaremos auth del contexto de Inertia
    const isAuthenticated = false; // Esto debe venir de tus props o estado de autenticación
    const user = isAuthenticated
        ? { name: "Usuario", email: "usuario@ejemplo.com" }
        : null;

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
                    <img
                        src={Logo_CEATyCC}
                        alt="Logo CEATyCC"
                        className="h-17 w-28 object-contain"
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
                                                    {user?.name || "Usuario"}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        // Opciones para usuario no autenticado
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-700">
                                                Menú
                                            </p>
                                        </div>
                                    )}

                                    {/* Opciones comunes para todos los usuarios */}
                                    <Link
                                        href="/eventos"
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                    >
                                        Eventos
                                    </Link>
                                    <Link
                                        href="/noticias"
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                    >
                                        Noticias
                                    </Link>

                                    {/* Usuario autenticado */}
                                    {isAuthenticated ? (
                                        <>
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <Link
                                                    href="/dashboard"
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/mis-asistencias"
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    Mis asistencias
                                                </Link>
                                                <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                                    Cerrar sesión
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        // Opciones de autenticación para usuario no autenticado
                                        <div className="border-t border-gray-100 mt-2 pt-2">
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
