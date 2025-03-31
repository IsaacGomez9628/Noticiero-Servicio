import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import { Button } from "@/Components/Button";

export default function VerifyEmail({
    email,
    success,
    error,
    verification_token,
}) {
    console.log("VerifyEmail renderizado con email:", email);

    const [token, setToken] = useState(["", "", "", "", ""]);
    const { post, processing } = useForm({
        email: email || "",
        token: "",
    });

    const handleTokenChange = (index, value) => {
        if (value.length > 1) {
            value = value[0];
        }

        if (!/^\d*$/.test(value) && value !== "") {
            return;
        }

        const newToken = [...token];
        newToken[index] = value;
        setToken(newToken);

        // Si se ingresó un dígito y no es el último campo, mover al siguiente
        if (value !== "" && index < 4) {
            document.getElementById(`token-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Manejar tecla de retroceso para navegar hacia atrás
        if (e.key === "Backspace" && token[index] === "" && index > 0) {
            document.getElementById(`token-${index - 1}`).focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const combinedToken = token.join("");
        post(route("verification.verify"), {
            email: email,
            token: combinedToken,
        });
    };

    const handleResendEmail = () => {
        post(route("verification.resend"), {
            email: email,
        });
    };

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

                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="text-center mb-4">
                            <label className="text-sm text-gray-600 block mb-2">
                                Ingresa el código de 5 dígitos:
                            </label>
                            <div className="flex justify-center space-x-2">
                                {token.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`token-${index}`}
                                        type="text"
                                        value={digit}
                                        onChange={(e) =>
                                            handleTokenChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(index, e)
                                        }
                                        className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                        maxLength={1}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4 mt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    token.join("").length !== 5 || processing
                                }
                            >
                                {processing
                                    ? "Verificando..."
                                    : "Verificar código"}
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
                    </form>
                </div>
            </div>
        </LoginLayout>
    );
}
