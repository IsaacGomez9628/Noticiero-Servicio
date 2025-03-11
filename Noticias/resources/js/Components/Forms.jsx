// components/ui/form.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const FormContext = React.createContext({
    errors: {},
});

export function Form({ children, onSubmit, className, ...props }) {
    return (
        <form onSubmit={onSubmit} className={cn(className)} {...props}>
            {children}
        </form>
    );
}

export function FormField({
    name,
    control,
    rules,
    render,
    className,
    ...props
}) {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(null);
    const [touched, setTouched] = React.useState(false);

    // Esta es una simplificación de la funcionalidad de react-hook-form
    const onChange = (e) => {
        let newValue = e;

        // Si viene de un evento de input
        if (e && e.target && e.target.value !== undefined) {
            newValue = e.target.value;
        }

        setValue(newValue);

        // Validar según las reglas
        if (rules) {
            if (rules.required && (!newValue || newValue === "")) {
                setError(
                    typeof rules.required === "string"
                        ? rules.required
                        : `${name} es requerido`
                );
            } else if (rules.pattern && !rules.pattern.value.test(newValue)) {
                setError(
                    rules.pattern.message ||
                        `${name} no tiene el formato correcto`
                );
            } else {
                setError(null);
            }
        }

        // Si control es de react-hook-form, usarlo
        if (control && control.register) {
            const fieldInfo = control.register(name, rules);
            fieldInfo.onChange(e);
        }
    };

    const onBlur = () => {
        setTouched(true);

        // Si control es de react-hook-form, usarlo
        if (control && control.register) {
            const fieldInfo = control.register(name, rules);
            fieldInfo.onBlur();
        }
    };

    // Si control es de react-hook-form, obtener el error
    React.useEffect(() => {
        if (control && control.formState && control.formState.errors) {
            const fieldError = control.formState.errors[name];
            if (fieldError) {
                setError(fieldError.message);
            }
        }
    }, [control, name]);

    return render({
        field: {
            name,
            value,
            onChange,
            onBlur,
        },
        fieldState: {
            error,
            touched,
        },
    });
}

export function FormItem({ className, children, ...props }) {
    return (
        <div className={cn("space-y-1", className)} {...props}>
            {children}
        </div>
    );
}

export function FormLabel({ className, children, ...props }) {
    return (
        <label
            className={cn("text-sm font-medium text-gray-700", className)}
            {...props}
        >
            {children}
        </label>
    );
}

export function FormControl({ className, children, ...props }) {
    return (
        <div className={cn("mt-1", className)} {...props}>
            {children}
        </div>
    );
}

export function FormMessage({ className, children, ...props }) {
    const { fieldState } = React.useContext(FormContext) || {};
    const { error } = fieldState || {};

    if (!error && !children) {
        return null;
    }

    return (
        <p
            className={cn("text-sm font-medium text-red-500", className)}
            {...props}
        >
            {children || error?.message}
        </p>
    );
}

// Componente Input
export function Input({ className, type = "text", ...props }) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                "placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

// Componente Checkbox
export function Checkbox({ className, checked, onCheckedChange, ...props }) {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className={cn(
                    "h-4 w-4 rounded border-gray-300 text-blue-600",
                    "focus:ring-blue-500",
                    className
                )}
                {...props}
            />
        </div>
    );
}

// Componente Button
export function Button({
    className,
    variant = "primary",
    size = "default",
    children,
    ...props
}) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none",
                {
                    // Variants
                    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500":
                        variant === "primary",
                    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500":
                        variant === "outline",
                    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
                        variant === "destructive",

                    // Sizes
                    "h-10 px-4 py-2 text-sm": size === "default",
                    "h-9 px-3 text-xs": size === "sm",
                    "h-11 px-8 text-base": size === "lg",
                },
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
