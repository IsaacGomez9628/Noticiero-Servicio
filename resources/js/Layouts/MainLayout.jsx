import React from "react";
import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";
import { Input } from "@/Components/Input";
import sedeq from "@/assets/SEDEQ.jpg";

export default function MainLayout({ children, selectedTab = null }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Barra de navegación principal */}
            <header className="bg-white border-b">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-primary flex items-center space-x-2"
                    >
                        <img src={sedeq} alt="Logo" className="h-8 w-8" />
                        <span>Secretaria de Educación</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/eventos"
                            className="text-sm font-medium hover:text-primary"
                        >
                            Eventos
                        </Link>
                        <Link
                            href="/equipo"
                            className="text-sm font-medium hover:text-primary"
                        >
                            Equipo
                        </Link>
                        <Link
                            href="/quienes-somos"
                            className="text-sm font-medium hover:text-primary"
                        >
                            ¿Quiénes Somos?
                        </Link>

                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar noticias..."
                                className="pl-8"
                            />
                        </div>
                    </div>
                </nav>
            </header>

            {/* Barra de navegación secundaria (tabs) */}
            <div className="border-b bg-white">
                <div className="container mx-auto px-4">
                    <nav className="flex space-x-8">
                        <Link
                            href="/"
                            className={`py-4 border-b-2 ${
                                selectedTab === "presentando"
                                    ? "border-primary text-primary"
                                    : "border-transparent hover:border-primary hover:text-primary"
                            }`}
                        >
                            Presentando
                        </Link>
                        <Link
                            href="/lo-mas-nuevo"
                            className={`py-4 border-b-2 ${
                                selectedTab === "lo-mas-nuevo"
                                    ? "border-primary text-primary"
                                    : "border-transparent hover:border-primary hover:text-primary"
                            }`}
                        >
                            Lo más nuevo
                        </Link>
                        <Link
                            href="/tendencia"
                            className={`py-4 border-b-2 ${
                                selectedTab === "tendencia"
                                    ? "border-primary text-primary"
                                    : "border-transparent hover:border-primary hover:text-primary"
                            }`}
                        >
                            Tendencia
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Contenido principal */}
            <main className="container mx-auto px-4 py-8">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-50 py-12 border-t">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contacto</h3>
                            <p className="mb-2">Email: contacto@ejemplo.com</p>
                            <p>Teléfono: (123) 456-7890</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Enlaces</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/eventos"
                                        className="hover:text-primary"
                                    >
                                        Eventos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/noticias"
                                        className="hover:text-primary"
                                    >
                                        Noticias
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/quienes-somos"
                                        className="hover:text-primary"
                                    >
                                        Quiénes Somos
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Síguenos</h3>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Facebook
                                </a>
                                <a
                                    href="#"
                                    className="text-blue-400 hover:text-blue-600"
                                >
                                    Twitter
                                </a>
                                <a
                                    href="#"
                                    className="text-pink-600 hover:text-pink-800"
                                >
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-500">
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
