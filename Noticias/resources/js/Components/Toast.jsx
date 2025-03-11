// components/ui/toast.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const TOAST_DURATION = 5000; // 5 seconds

// Contexto para el sistema de toast
const ToastContext = React.createContext({
    toasts: [],
    addToast: () => {},
    removeToast: () => {},
});

// Proveedor del sistema de toast
export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);

    const addToast = React.useCallback((toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };

        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Auto-remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, toast.duration || TOAST_DURATION);

        return id;
    }, []);

    const removeToast = React.useCallback((id) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

// Hook para usar el sistema de toast
export function useToast() {
    const context = React.useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    const toast = React.useCallback(
        (props) => {
            return context.addToast(props);
        },
        [context]
    );

    return { toast, dismiss: context.removeToast };
}

// Contenedor para mostrar los toasts
function ToastContainer() {
    const { toasts, removeToast } = React.useContext(ToastContext);

    return (
        <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

// Componente Toast
export function Toast({ title, description, variant = "default", onClose }) {
    return (
        <div
            className={cn(
                "flex items-start p-4 rounded-md shadow-md border transform transition-all duration-300 ease-in-out",
                {
                    "bg-white border-gray-200": variant === "default",
                    "bg-red-50 border-red-200": variant === "destructive",
                    "bg-green-50 border-green-200": variant === "success",
                    "bg-blue-50 border-blue-200": variant === "info",
                    "bg-yellow-50 border-yellow-200": variant === "warning",
                }
            )}
        >
            <div className="flex-1">
                {title && (
                    <h3
                        className={cn("font-medium", {
                            "text-gray-900": variant === "default",
                            "text-red-900": variant === "destructive",
                            "text-green-900": variant === "success",
                            "text-blue-900": variant === "info",
                            "text-yellow-900": variant === "warning",
                        })}
                    >
                        {title}
                    </h3>
                )}
                {description && (
                    <p
                        className={cn("text-sm mt-1", {
                            "text-gray-500": variant === "default",
                            "text-red-700": variant === "destructive",
                            "text-green-700": variant === "success",
                            "text-blue-700": variant === "info",
                            "text-yellow-700": variant === "warning",
                        })}
                    >
                        {description}
                    </p>
                )}
            </div>
            <button
                onClick={onClose}
                className={cn("p-1 rounded-md", {
                    "text-gray-400 hover:text-gray-500": variant === "default",
                    "text-red-400 hover:text-red-500":
                        variant === "destructive",
                    "text-green-400 hover:text-green-500":
                        variant === "success",
                    "text-blue-400 hover:text-blue-500": variant === "info",
                    "text-yellow-400 hover:text-yellow-500":
                        variant === "warning",
                })}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}

// Utility function for cn (className)
export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
