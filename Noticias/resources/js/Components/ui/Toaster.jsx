import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Toast component
const Toast = ({ id, title, description, variant = "default", onClose }) => {
    return (
        <div
            className={cn(
                "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
                {
                    "border-neutral-200 bg-white text-neutral-950":
                        variant === "default",
                    "border-red-200 bg-red-50 text-red-900":
                        variant === "destructive",
                    "border-green-200 bg-green-50 text-green-900":
                        variant === "success",
                }
            )}
        >
            <div className="grid gap-1">
                {title && <div className="text-sm font-medium">{title}</div>}
                {description && (
                    <div className="text-sm opacity-90">{description}</div>
                )}
            </div>
            <button
                onClick={() => onClose(id)}
                className="absolute right-2 top-2 rounded-md p-1 text-neutral-950/50 opacity-0 transition-opacity hover:text-neutral-950 group-hover:opacity-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Toast context
const ToastContext = createContext({
    toasts: [],
    addToast: () => {},
    removeToast: () => {},
});

// Toast provider
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);

        return id;
    };

    const removeToast = (id) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <Toaster />
        </ToastContext.Provider>
    );
}

// Hook for using toast
export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}

// Toaster component that displays the toasts
export function Toaster() {
    const { toasts, removeToast } = useContext(ToastContext);

    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    description={toast.description}
                    variant={toast.variant}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
}
