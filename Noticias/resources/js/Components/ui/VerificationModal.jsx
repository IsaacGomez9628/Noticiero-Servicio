import React, { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/Dialog";
import { Button } from "@/Components/ui/Button";
import InputError from "@/Components/ui/InputError";
import { Transition } from "@headlessui/react";

export default function VerificationModal({
    isOpen,
    email,
    onClose,
    onSuccess,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || "",
        token: ["", "", "", "", ""],
    });

    // States for custom notifications
    const [showExitWarning, setShowExitWarning] = useState(false);
    const [notification, setNotification] = useState({
        visible: false,
        message: "",
        type: "info", // 'info', 'success', 'error'
    });

    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    // Show notification helper
    const showNotification = (message, type = "info") => {
        setNotification({
            visible: true,
            message,
            type,
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setNotification((prev) => ({ ...prev, visible: false }));
        }, 5000);
    };

    // Focus the first input when the modal opens
    useEffect(() => {
        if (isOpen && inputRefs[0].current) {
            setTimeout(() => {
                inputRefs[0].current.focus();
            }, 100);
        }
    }, [isOpen]);

    // Handle input change for a specific digit
    const handleDigitChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d*$/.test(value)) return;

        // Copy the current token array
        const newToken = [...data.token];

        // Update the specific digit
        newToken[index] = value;

        // Update form data
        setData("token", newToken);

        // If the input is filled and not the last one, focus the next input
        if (value && index < 4) {
            inputRefs[index + 1].current.focus();
        }
    };

    // Handle key press events for navigation between inputs
    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === "Backspace" && !data.token[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }

        // Move to next input on right arrow
        if (e.key === "ArrowRight" && index < 4) {
            inputRefs[index + 1].current.focus();
        }

        // Move to previous input on left arrow
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    // Handle paste event (allow pasting 5 digits at once)
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const digits = pastedData.replace(/\D/g, "").split("").slice(0, 5);

        if (digits.length) {
            // Fill as many inputs as we have digits
            const newToken = [...data.token];

            digits.forEach((digit, index) => {
                if (index < 5) newToken[index] = digit;
            });

            setData("token", newToken);

            // Focus the next empty input or the last one if all are filled
            const nextEmptyIndex = newToken.findIndex((digit) => !digit);
            const indexToFocus = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
            inputRefs[indexToFocus].current.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!Array.isArray(data.token)) {
            showNotification("El formato del token es inválido", "error");
            return;
        }

        // Combina los dígitos en un único string
        const tokenString = data.token.join("");

        // Verifica que tokenString sea un string no vacío de 5 caracteres
        if (typeof tokenString !== "string" || tokenString.length !== 5) {
            showNotification("Debes ingresar un token de 5 dígitos", "error");
            return;
        }

        // Envía la verificación
        post(
            route("verification.verify"),
            {
                email: data.email,
                token: tokenString,
            },
            {
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    // Handle specific error for invalid token
                    if (errors.token) {
                        showNotification(
                            "Código inválido. Por favor, intenta nuevamente.",
                            "error"
                        );
                    } else {
                        showNotification(
                            "Error de verificación. Inténtalo de nuevo.",
                            "error"
                        );
                    }
                },
            }
        );
    };

    const handleResendToken = () => {
        post(
            route("verification.resend"),
            { email: data.email },
            {
                onSuccess: () => {
                    showNotification(
                        "Se ha enviado un nuevo código a tu correo electrónico.",
                        "success"
                    );
                },
                onError: () => {
                    showNotification(
                        "Error al reenviar el código. Inténtalo nuevamente.",
                        "error"
                    );
                },
            }
        );
    };

    const handleCloseAttempt = () => {
        // Instead of an alert, show our custom exit warning
        setShowExitWarning(true);
    };

    const confirmClose = () => {
        setShowExitWarning(false);
        onClose();
    };

    const cancelClose = () => {
        setShowExitWarning(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">
                            Verificación de correo electrónico
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">
                                    Hemos enviado un código de verificación de 5
                                    dígitos a:
                                </p>
                                <p className="font-medium text-gray-900">
                                    {data.email}
                                </p>
                            </div>

                            <div className="flex justify-center space-x-3 mt-8">
                                {data.token.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        ref={inputRefs[index]}
                                        className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleDigitChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(index, e)
                                        }
                                        onPaste={
                                            index === 0
                                                ? handlePaste
                                                : undefined
                                        }
                                    />
                                ))}
                            </div>

                            {errors.token && (
                                <div className="text-center">
                                    <InputError message={errors.token} />
                                </div>
                            )}

                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-1">
                                    ¿No recibiste el código?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendToken}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Reenviar código de verificación
                                </button>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    processing ||
                                    data.token.some((digit) => !digit)
                                }
                            >
                                {processing ? "Verificando..." : "Verificar"}
                            </Button>
                        </DialogFooter>
                    </form>

                    {/* Custom notification */}
                    <Transition
                        show={notification.visible}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="absolute bottom-4 left-0 right-0 mx-auto w-5/6"
                    >
                        <div
                            className={`
                            rounded-md p-3 shadow-md
                            ${
                                notification.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : notification.type === "error"
                                    ? "bg-red-50 text-red-800 border border-red-200"
                                    : "bg-blue-50 text-blue-800 border border-blue-200"
                            }
                        `}
                        >
                            <div className="flex items-center">
                                {notification.type === "success" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-green-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                {notification.type === "error" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-red-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                {notification.type === "info" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-blue-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                <p className="text-sm">
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </Transition>
                </DialogContent>
            </Dialog>

            {/* Exit warning modal */}
            <Transition
                show={showExitWarning}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full animate-scale-in">
                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-yellow-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                                ¿Estás seguro?
                            </h3>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                Tu cuenta no estará activa hasta que verifiques
                                tu correo electrónico. ¿Deseas salir de todas
                                formas?
                            </p>
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-center space-y-2 space-y-reverse sm:space-y-0 sm:space-x-2">
                                <button
                                    type="button"
                                    onClick={cancelClose}
                                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Continuar verificación
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmClose}
                                    className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Salir sin verificar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    );
}
