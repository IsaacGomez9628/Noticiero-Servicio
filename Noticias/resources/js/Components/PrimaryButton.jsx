import React from "react";

export default function PrimaryButton({
    type = "submit",
    className = "",
    processing,
    children,
    ...props
}) {
    return (
        <button
            type={type}
            className={
                `inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    processing ? "opacity-25" : ""
                } ` + className
            }
            disabled={processing ? true : false}
            {...props}
        >
            {children}
        </button>
    );
}
