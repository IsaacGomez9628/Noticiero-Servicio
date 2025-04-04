import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notification({
    type = "success", // success, info, error, warning
    title,
    message,
    show,
    onClose,
    duration = 5000,
}) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, onClose, duration]);

    // Configurar colores según el tipo de notificación
    const getStyles = () => {
        const styles = {
            border: "",
            icon: {
                bg: "",
                color: "",
            },
        };

        switch (type) {
            case "success":
                styles.border = "border-green-500";
                styles.icon.bg = "bg-green-100";
                styles.icon.color = "text-green-600";
                break;
            case "info":
                styles.border = "border-blue-500";
                styles.icon.bg = "bg-blue-100";
                styles.icon.color = "text-blue-600";
                break;
            case "error":
                styles.border = "border-red-500";
                styles.icon.bg = "bg-red-100";
                styles.icon.color = "text-red-600";
                break;
            case "warning":
                styles.border = "border-yellow-500";
                styles.icon.bg = "bg-yellow-100";
                styles.icon.color = "text-yellow-600";
                break;
            default:
                styles.border = "border-green-500";
                styles.icon.bg = "bg-green-100";
                styles.icon.color = "text-green-600";
        }

        return styles;
    };

    const styles = getStyles();

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 min-w-96"
                >
                    <div
                        className={`bg-white backdrop-blur-sm bg-opacity-95 border-l-4 ${styles.border} rounded-lg shadow-xl px-6 py-4 flex items-center justify-between`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`${styles.icon.bg} rounded-full p-2 mr-4`}
                            >
                                <svg
                                    className={`w-6 h-6 ${styles.icon.color}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {type === "success" && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    )}
                                    {type === "info" && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    )}
                                    {type === "error" && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    )}
                                    {type === "warning" && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    )}
                                </svg>
                            </div>
                            <div>
                                {title && (
                                    <h3 className="font-bold text-gray-900">
                                        {title}
                                    </h3>
                                )}
                                {message && (
                                    <p className="text-gray-600">{message}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transform hover:scale-110 transition-all duration-200"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
