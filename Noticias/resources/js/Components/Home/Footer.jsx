import React from "react";
import { Link } from "@inertiajs/react";
import { TrendingUp } from "lucide-react";

export default function EnhancedFooter() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 border-t py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    {/* Logo y descripción */}
                    <div className="mb-8 md:mb-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold gradient-text">
                                CEATyCC
                            </h2>
                        </div>
                        <p className="text-contrast-subtle mt-2">
                            Información confiable, al instante.
                        </p>

                        {/* Redes Sociales - Ahora con mejor formato */}
                        <div className="mt-6">
                            <h3 className="font-medium text-contrast-light mb-3">
                                Redes Sociales
                            </h3>
                            <div className="flex items-center space-x-4">
                                <a
                                    href="https://www.facebook.com/CEATYCC"
                                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 hover:scale-110 transform"
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
                                    href="https://twitter.com/CEATyCC_q"
                                    className="bg-black text-white p-2 rounded-full hover:bg-blue-500 transition-colors duration-300 hover:scale-110 transform"
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
                                    href="https://www.instagram.com/tuUsuario"
                                    className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors duration-300 hover:scale-110 transform"
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
                                {/* Se podría añadir más iconos aquí */}
                            </div>
                        </div>
                    </div>

                    {/* Enlaces útiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full md:w-auto">
                        <div>
                            <h3 className="font-medium text-contrast-light mb-3">
                                Secciones
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Política
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Economía
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Deportes
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Tecnología
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-contrast-light mb-3">
                                Empresa
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Sobre nosotros
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Contacto
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Trabaja con nosotros
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Publicidad
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-contrast-light mb-3">
                                Legal
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Privacidad
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Términos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Cookies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t mt-8 pt-8 text-center">
                    <p className="text-contrast-subtle text-sm">
                        © 2025 CEATyCC. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
