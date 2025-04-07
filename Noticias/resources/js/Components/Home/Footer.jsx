import React from "react";
import { Link } from "@inertiajs/react";
import { TrendingUp } from "lucide-react";

export default function EnhancedFooter() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 border-t py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-2">
                            <div className="gradient-bg p-2 rounded-lg">
                                <TrendingUp size={24} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold gradient-text">
                                Noticiero
                            </h2>
                        </div>
                        <p className="text-contrast-subtle mt-2">
                            Información confiable, al instante.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-8">
                        <div>
                            <h3 className="font-medium text-contrast-light mb-3">
                                Secciones
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Política
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Economía
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Deportes
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
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
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Sobre nosotros
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Contacto
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Trabaja con nosotros
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
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
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Privacidad
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Términos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-contrast-subtle hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Cookies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center">
                    <p className="text-contrast-subtle text-sm">
                        © 2025 Noticiero. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
