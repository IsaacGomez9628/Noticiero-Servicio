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

    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

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
            console.error("Token no es un array:", data.token);
            return;
        }

        // Combina los dígitos en un único string
        const tokenString = data.token.join("");

        // Verifica que tokenString sea un string no vacío de 5 caracteres
        if (typeof tokenString !== "string" || tokenString.length !== 5) {
            console.error("Token inválido:", tokenString);
            return;
        }

        console.log(
            "Enviando token:",
            tokenString,
            "Tipo:",
            typeof tokenString
        );

        // Envía la verificación
        post(
            route("verification.verify"),
            {
                email: data.email,
                token: String(tokenString),
            },
            {
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    console.error("Error de verificación:", errors);
                },
            }
        );
    };

    const handleResendToken = () => {
        post(route("verification.resend"), {
            email: data.email,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                                        handleDigitChange(index, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={
                                        index === 0 ? handlePaste : undefined
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
                                processing || data.token.some((digit) => !digit)
                            }
                        >
                            {processing ? "Verificando..." : "Verificar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
