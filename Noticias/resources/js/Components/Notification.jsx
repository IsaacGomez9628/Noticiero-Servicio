import React, { useEffect, useState } from "react";

export default function Notification({
    message,
    type = "success",
    duration = 5000,
    onClose,
}) {
    const [visible, setVisible] = useState(true);
    const [animatingOut, setAnimatingOut] = useState(false);

    // Define colors based on notification type
    const bgColor =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500";

    // Handle notification timeout
    useEffect(() => {
        if (!message) return;

        // Set timeout to start the animation after specified duration
        const timeout = setTimeout(() => {
            setAnimatingOut(true);
        }, duration);

        // Set timeout to hide the notification after animation completes
        const hideTimeout = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration + 500); // 500ms is the animation duration

        // Clean up timeouts
        return () => {
            clearTimeout(timeout);
            clearTimeout(hideTimeout);
        };
    }, [message, duration, onClose]);

    if (!message || !visible) return null;

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-lg text-white flex items-center transition-all duration-500 ${bgColor} ${
                animatingOut
                    ? "-translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
            }`}
        >
            {/* Icon based on type */}
            {type === "success" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            ) : type === "error" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
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
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            )}
            <span>{message}</span>

            {/* Close button */}
            <button
                onClick={() => {
                    setAnimatingOut(true);
                    setTimeout(() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }, 500);
                }}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}
