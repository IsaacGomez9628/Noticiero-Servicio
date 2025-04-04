import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notification({ type, title, message, show, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const getBorderColor = () => {
        return type === "success" ? "border-green-500" : "border-blue-500";
    };

    const getIconBgColor = () => {
        return type === "success" ? "bg-green-100" : "bg-blue-100";
    };

    const getIconColor = () => {
        return type === "success" ? "text-green-600" : "text-blue-600";
    };

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
                        className={`bg-white backdrop-blur-sm bg-opacity-95 border-l-4 ${getBorderColor()} rounded-lg shadow-xl px-6 py-4 flex items-center justify-between`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`${getIconBgColor()} rounded-full p-2 mr-4`}
                            >
                                <svg
                                    className={`w-6 h-6 ${getIconColor()}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {title}
                                </h3>
                                <p className="text-gray-600">{message}</p>
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
