// resources/js/Components/Image.jsx
import React from "react";

export default function Image({ src, alt, className, ...props }) {
    return (
        <img
            src={src}
            alt={alt || ""}
            className={className}
            loading="lazy" // Para carga perezosa
            {...props}
        />
    );
}
