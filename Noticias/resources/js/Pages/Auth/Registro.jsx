import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import { Button } from "@/Components/Button";

export default function Registro() {
    const [tipoRegistro, setTipoRegistro] = useState(null);

    return (
        <LoginLayout>
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-10">
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                        Registro de Cuenta
                    </h2>

                    <div className="mb-6">
                        <p className="text-gray-600 text-center mb-6">
                            Selecciona el tipo de cuenta que deseas crear:
                        </p>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div
                                className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
                                    tipoRegistro === "personal"
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                                onClick={() => setTipoRegistro("personal")}
                            >
                                <div className="flex justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Cuenta Personal
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Para estudiantes, profesionales y público en
                                    general
                                </p>
                            </div>

                            <div
                                className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
                                    tipoRegistro === "institucional"
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                                onClick={() => setTipoRegistro("institucional")}
                            >
                                <div className="flex justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Cuenta Institucional
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Para universidades, centros de investigación
                                    y empresas
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <Button
                            disabled={!tipoRegistro}
                            className={`px-6 py-2 rounded-md ${
                                !tipoRegistro
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                            onClick={() => {
                                if (tipoRegistro === "personal") {
                                    window.location.href = "/registro/personal";
                                } else if (tipoRegistro === "institucional") {
                                    window.location.href =
                                        "/registro/institucional";
                                }
                            }}
                        >
                            Continuar
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </LoginLayout>
    );
}
