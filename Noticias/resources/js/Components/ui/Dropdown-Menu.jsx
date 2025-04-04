import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
} from "react";
import { cn } from "@/lib/utils";

const DropdownMenuContext = createContext({
    open: false,
    setOpen: () => {},
    triggerRef: { current: null },
});

function DropdownMenu({ children }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
            <div className="relative">{children}</div>
        </DropdownMenuContext.Provider>
    );
}

function DropdownMenuTrigger({ children, asChild, ...props }) {
    const { open, setOpen, triggerRef } = useContext(DropdownMenuContext);

    const handleClick = (e) => {
        e.preventDefault();
        setOpen(!open);
    };

    return React.cloneElement(
        asChild ? React.Children.only(children) : <button {...props} />,
        {
            ref: triggerRef,
            onClick: handleClick,
            "aria-expanded": open,
            "aria-haspopup": "menu",
            ...props,
        }
    );
}

function DropdownMenuContent({
    children,
    className,
    align = "end",
    sideOffset = 4,
    ...props
}) {
    const { open, setOpen, triggerRef } = useContext(DropdownMenuContext);
    const menuRef = useRef(null);

    // Cerrar menú al hacer clic fuera o al presionar Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                open &&
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)
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
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    return (
        <div
            ref={menuRef}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                {
                    "left-0": align === "start",
                    "right-0": align === "end",
                },
                "absolute mt-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function DropdownMenuItem({ className, onClick, ...props }) {
    const { setOpen } = useContext(DropdownMenuContext);

    const handleClick = (e) => {
        onClick?.(e);
        setOpen(false);
    };

    return (
        <button
            className={cn(
                "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={handleClick}
            {...props}
        />
    );
}

function DropdownMenuSeparator({ className, ...props }) {
    return (
        <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
    );
}

function DropdownMenuLabel({ className, ...props }) {
    return (
        <div
            className={cn("px-2 py-1.5 text-sm font-semibold", className)}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
};
