import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AnimatedNewsSlider({ articles }) {
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
                            <div className="p-6 flex flex-col justify-center bg-white dark:bg-gray-800">
                                <span
                                    className={`status-badge tag-${
                                        articles[currentIndex].categoryColor ||
                                        "blue"
                                    } px-3 py-1 mb-2 inline-flex self-start`}
                                >
                                    {articles[currentIndex].category}
                                </span>
                                <h2 className="text-2xl font-bold text-contrast-light">
                                    {articles[currentIndex].title}
                                </h2>
                                <p className="text-contrast-medium my-4">
                                    {articles[currentIndex].description}
                                </p>
                                <a
                                    href={`/noticias/${articles[currentIndex].id}`}
                                    className="gradient-bg px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-md self-start inline-flex items-center"
                                >
                                    Leer Más
                                    <ChevronRight size={16} className="ml-1" />
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
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md z-10 hover:bg-black transition-colors"
                aria-label="Siguiente"
            >
                <ChevronRight size={24} />
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
