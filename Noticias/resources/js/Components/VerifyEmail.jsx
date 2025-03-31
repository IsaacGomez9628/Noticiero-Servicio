import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import { Button } from "@/Components/Button";
import VerificationModal from "@/Components/VerificationModal";

export default function VerifyEmail({
    email,
    success,
    error,
    verification_token,
}) {
    console.log("VerifyEmail renderizado con email:", email);
    console.log("Success:", success);
    console.log("Error:", error);
    console.log("Token de respaldo:", verification_token);

    // Abre automáticamente el modal cuando hay un email
    const [isModalOpen, setIsModalOpen] = useState(Boolean(email));

    const { post, processing } = useForm({
        email: email || "",
    });

    const handleResendEmail = () => {
        post(route("verification.resend"), {
            data: { email: email },
            preserveScroll: true,
        });
    };

    const handleVerificationSuccess = () => {
        setIsModalOpen(false);
        window.location.href = route("login");
    };

    // Efecto para abrir el modal si llega un email después
    useEffect(() => {
        if (email && !isModalOpen) {
            console.log("Abriendo modal debido a email recibido");
            setIsModalOpen(true);
        }
    }, [email]);

    return (
        <LoginLayout>
            <Head title="Verificación de Correo" />

            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-10">
                <div className="px-6 py-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-50 rounded-full p-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-blue-500"
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
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                        Verifica tu Correo Electrónico
                    </h2>

                    {success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <p className="text-gray-600 text-center mb-6">
                        {verification_token
                            ? "Hubo un problema al enviar el correo electrónico. Usa el siguiente código:"
                            : "Hemos enviado un correo electrónico con un código de verificación a:"}
                    </p>

                    {verification_token ? (
                        <div className="mb-6 p-4 bg-gray-100 rounded-md">
                            <p className="text-center font-mono text-2xl tracking-widest font-bold">
                                {verification_token}
                            </p>
                        </div>
                    ) : (
                        <p className="text-center font-medium text-blue-600 mb-6">
                            {email ||
                                "No se ha especificado un correo electrónico"}
                        </p>
                    )}

                    {!verification_token && (
                        <p className="text-gray-600 text-center mb-6">
                            Por favor, revisa tu bandeja de entrada e ingresa el
                            código de 5 dígitos para completar tu registro.
                        </p>
                    )}

                    <div className="flex flex-col space-y-4">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full"
                        >
                            Ingresar código de verificación
                        </Button>

                        {email && !verification_token && (
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendEmail}
                                    disabled={processing}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    {processing
                                        ? "Enviando..."
                                        : "Reenviar código de verificación"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mostrar el modal solo si hay un email */}
            {email && (
                <VerificationModal
                    isOpen={isModalOpen}
                    email={email}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleVerificationSuccess}
                />
            )}
        </LoginLayout>
    );
}
