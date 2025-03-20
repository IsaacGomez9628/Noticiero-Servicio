import React from "react";
import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";
import { Input } from "@/Components/Input";
import Secretaria from "@/assets/Logo_SecretariaDeEducacion.png";
import Ceat from "@/assets/Logo_CEATyCC.png";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/Components/Button";
import { AnimatePresence, motion } from "framer-motion";

export default function MainLayout({ children, selectedTab = null }) {
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

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100 overflow-hidden"
                                    >
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="container mx-auto px-4 py-8">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-50 py-12">
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
                    <p>
                        © 2025 Secretaría de Educación. Todos los derechos
                        reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
