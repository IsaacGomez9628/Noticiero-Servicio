import React, { useEffect, useRef } from "react";

export default function TextInput({
    type = "text",
    name,
    id,
    value,
    className,
    autoComplete,
    required,
    isFocused,
    handleChange,
    placeholder,
    disabled = false,
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            type={type}
            name={name}
            id={id || name}
            value={value}
            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
            ref={input}
            autoComplete={autoComplete}
            required={required}
            onChange={handleChange} // IMPORTANTE: Cambio de (e) => handleChange(e) a simplemente handleChange
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}
