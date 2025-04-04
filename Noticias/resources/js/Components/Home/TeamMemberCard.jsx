import React from "react";
import { motion } from "framer-motion";

export default function TeamMemberCard({
    image,
    name,
    title,
    location,
    description,
}) {
    return (
        <motion.div
            className="relative overflow-hidden rounded-lg bg-gray-800 h-80 group cursor-pointer flex-shrink-0 w-80 mx-2"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
        >
            <div className="h-full w-full">
                <img
                    src={image || "/placeholder.jpg"}
                    alt={name}
                    className="object-cover object-center h-full w-full transition-transform duration-500 group-hover:scale-110 brightness-75"
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-10 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-12">
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-gray-300">{title}</p>
                <p className="text-gray-400 text-sm">{location}</p>
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-70 p-6 flex flex-col justify-end transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
                <p className="text-gray-300 mb-1">{title}</p>
                <p className="text-gray-400 text-sm mb-4">{location}</p>
                <p className="text-gray-200 text-sm">{description}</p>
            </div>
        </motion.div>
    );
}
