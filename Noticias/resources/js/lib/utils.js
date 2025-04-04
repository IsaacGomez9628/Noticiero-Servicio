import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatena y mezcla clases de Tailwind, resolviendo conflictos
 * @param {...any} inputs - Clases CSS, objetos condicionales o arrays
 * @returns {string} - Clases CSS combinadas y optimizadas
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
