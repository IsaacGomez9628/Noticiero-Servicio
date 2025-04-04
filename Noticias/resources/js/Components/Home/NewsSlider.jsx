import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsSlider({ articles }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [articles.length]);

    const handlePrev = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + articles.length) % articles.length
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    };

    return (
        <div className="relative w-full h-80">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                >
                    <div className="overflow-hidden h-full rounded-lg shadow-lg border border-gray-200">
                        <div className="grid md:grid-cols-2 h-full">
                            <div className="relative h-full">
                                <img
                                    src={
                                        articles[currentIndex].image ||
                                        "/placeholder.jpg"
                                    }
                                    alt={articles[currentIndex].title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="p-6 flex flex-col justify-center bg-white">
                                <h2 className="text-2xl font-bold">
                                    {articles[currentIndex].title}
                                </h2>
                                <p className="text-gray-600 my-4">
                                    {articles[currentIndex].description}
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 self-start"
                                >
                                    Leer Más
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md z-10 hover:bg-black transition-colors"
                aria-label="Anterior"
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
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md z-10 hover:bg-black transition-colors"
                aria-label="Siguiente"
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
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {articles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                            index === currentIndex ? "bg-black" : "bg-gray-300"
                        }`}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
