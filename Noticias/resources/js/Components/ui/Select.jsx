// components/ui/select.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext({
    value: undefined,
    onValueChange: () => {},
    open: false,
    setOpen: () => {},
});

export function Select({ children, value, defaultValue, onValueChange }) {
    const [selectedValue, setSelectedValue] = React.useState(
        value || defaultValue || ""
    );
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    const handleValueChange = React.useCallback(
        (newValue) => {
            if (value === undefined) {
                setSelectedValue(newValue);
            }
            onValueChange?.(newValue);
            setOpen(false);
        },
        [value, onValueChange]
    );

    return (
        <SelectContext.Provider
            value={{
                value: selectedValue,
                onValueChange: handleValueChange,
                open,
                setOpen,
            }}
        >
            {children}
        </SelectContext.Provider>
    );
}

export function SelectTrigger({ className, children, ...props }) {
    const { value, open, setOpen } = React.useContext(SelectContext);

    return (
        <button
            type="button"
            className={cn(
                "flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                className
            )}
            onClick={() => setOpen(!open)}
            {...props}
        >
            {children}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn("h-4 w-4 transition-transform", {
                    "transform rotate-180": open,
                })}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>
    );
}

export function SelectValue({ placeholder, className, ...props }) {
    const { value } = React.useContext(SelectContext);

    return (
        <span className={cn("flex-grow truncate", className)} {...props}>
            {value || placeholder}
        </span>
    );
}

export function SelectContent({ className, children, ...props }) {
    const { open, setOpen } = React.useContext(SelectContext);
    const ref = React.useRef(null);

    // Cerrar el menú al hacer clic fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setOpen]);

    if (!open) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 w-full mt-1 rounded-md border border-gray-200 bg-white shadow-lg",
                "max-h-60 overflow-auto",
                className
            )}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    );
}

export function SelectItem({ className, children, value, ...props }) {
    const { value: selectedValue, onValueChange } =
        React.useContext(SelectContext);
    const isSelected = selectedValue === value;

    return (
        <div
            className={cn(
                "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer",
                {
                    "bg-blue-100 text-blue-900": isSelected,
                    "hover:bg-gray-100": !isSelected,
                },
                className
            )}
            onClick={() => onValueChange(value)}
            {...props}
        >
            {children}
            {isSelected && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-auto"
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
            )}
        </div>
    );
}
