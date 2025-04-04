import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
} from "react";
import { cn } from "@/lib/utils";

const SheetContext = createContext({
    open: false,
    setOpen: () => {},
});

function Sheet({ children, open: controlledOpen, onOpenChange }) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = (newOpen) => {
        if (isControlled) {
            onOpenChange?.(newOpen);
        } else {
            setUncontrolledOpen(newOpen);
        }
    };

    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    );
}

function SheetTrigger({ children, asChild, ...props }) {
    const { setOpen } = useContext(SheetContext);

    const handleClick = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    return React.cloneElement(
        asChild ? React.Children.only(children) : <button {...props} />,
        {
            onClick: handleClick,
            ...props,
        }
    );
}

function SheetContent({ children, className, side = "right", ...props }) {
    const { open, setOpen } = useContext(SheetContext);
    const contentRef = useRef(null);

    // Cerrar al hacer clic fuera o al presionar Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                open &&
                contentRef.current &&
                !contentRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (open && e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, setOpen]);

    if (!open) return null;

    const sideClassNames = {
        top: "inset-x-0 top-0 border-b",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50"
                onClick={() => setOpen(false)}
            />

            {/* Sheet content */}
            <div
                ref={contentRef}
                className={cn(
                    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
                    sideClassNames[side],
                    className
                )}
                {...props}
            >
                {children}

                {/* Close button */}
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => setOpen(false)}
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
                        className="h-4 w-4"
                    >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                    </svg>
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </>
    );
}

export { Sheet, SheetTrigger, SheetContent };
