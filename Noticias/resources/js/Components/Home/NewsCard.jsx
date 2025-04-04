import React from "react";
import { Link } from "@inertiajs/react";
import { Bookmark } from "lucide-react";

export default function NewsCard({
    id,
    image,
    category,
    readTime,
    title,
    description,
}) {
    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="relative h-48">
                <img
                    src={image || "/placeholder.jpg"}
                    alt={title}
                    className="object-cover h-full w-full"
                />
            </div>
            <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{category}</span>
                    <span>• {readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 mb-3">{description}</p>
                <div className="flex items-center space-x-4">
                    <a
                        href="#"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Leer Más
                    </a>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Bookmark className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
