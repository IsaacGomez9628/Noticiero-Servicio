// components/ui/dialog.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const DialogContext = React.createContext({
    open: false,
    setOpen: () => {},
});

export function Dialog({ children, open, onOpenChange }) {
    const [isOpen, setIsOpen] = React.useState(open || false);

    React.useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
        }
    }, [open]);

    const handleOpenChange = React.useCallback(
        (open) => {
            setIsOpen(open);
            onOpenChange?.(open);
        },
        [onOpenChange]
    );

    return (
        <DialogContext.Provider
            value={{
                open: isOpen,
                setOpen: handleOpenChange,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({ children, asChild, ...props }) {
    const { setOpen } = React.useContext(DialogContext);

    return (
        <button type="button" onClick={() => setOpen(true)} {...props}>
            {children}
        </button>
    );
}

export function DialogContent({ children, className, ...props }) {
    const { open, setOpen } = React.useContext(DialogContext);
    const ref = React.useRef(null);

    // Cerrar el diálogo al hacer clic fuera
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

    // Cerrar el diálogo al presionar Escape
    React.useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, setOpen]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div
                ref={ref}
                className={cn(
                    "bg-white rounded-lg shadow-lg w-full max-w-md max-h-[85vh] overflow-auto",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ className, ...props }) {
    return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
    return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
    return <p className={cn("text-sm text-gray-500", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
    return (
        <div
            className={cn("flex justify-end gap-2 p-6 pt-4", className)}
            {...props}
        />
    );
}

export function DialogClose({ className, ...props }) {
    const { setOpen } = React.useContext(DialogContext);

    return (
        <button
            className={cn(
                "absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-500",
                className
            )}
            onClick={() => setOpen(false)}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
}
