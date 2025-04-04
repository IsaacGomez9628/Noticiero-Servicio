import React from "react";

// TabsList - Contenedor de los botones/triggers de las pestañas
const TabsList = ({ className, children, ...props }) => (
    <div
        className={`inline-flex h-10 items-center justify-center rounded-md bg-blue-100 p-1 rounded-full ${
            className || ""
        }`}
        {...props}
    >
        {children}
    </div>
);

// TabsTrigger - Botones/triggers para cambiar entre pestañas
const TabsTrigger = ({
    value,
    selected,
    onChange,
    className,
    children,
    ...props
}) => (
    <button
        type="button"
        role="tab"
        data-state={selected ? "active" : "inactive"}
        aria-selected={selected ? "true" : "false"}
        onClick={() => onChange(value)}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
            selected
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-transparent text-gray-700 hover:bg-blue-50 hover:text-gray-900"
        } ${className || ""}`}
        {...props}
    >
        {children}
    </button>
);

// TabsContent - Contenedor del contenido de cada pestaña
const TabsContent = ({ value, selected, className, children, ...props }) => {
    if (!selected) return null;

    return (
        <div
            role="tabpanel"
            data-state={selected ? "active" : "inactive"}
            className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                className || ""
            }`}
            {...props}
        >
            {children}
        </div>
    );
};

// Tabs - Componente principal que gestiona el estado
const Tabs = ({
    defaultValue,
    value,
    onValueChange,
    children,
    className,
    ...props
}) => {
    const [selectedValue, setSelectedValue] = React.useState(
        value || defaultValue
    );

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    const handleValueChange = (newValue) => {
        if (value === undefined) {
            setSelectedValue(newValue);
        }
        onValueChange?.(newValue);
    };

    // Clonar los hijos para pasar las props necesarias
    const enhancedChildren = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === TabsList) {
            // Modificar los TabsTrigger dentro de TabsList
            const tabsListChildren = React.Children.map(
                child.props.children,
                (tabsTrigger) => {
                    if (
                        !React.isValidElement(tabsTrigger) ||
                        tabsTrigger.type !== TabsTrigger
                    ) {
                        return tabsTrigger;
                    }

                    return React.cloneElement(tabsTrigger, {
                        selected: tabsTrigger.props.value === selectedValue,
                        onChange: handleValueChange,
                    });
                }
            );

            return React.cloneElement(child, {}, tabsListChildren);
        }

        if (child.type === TabsContent) {
            return React.cloneElement(child, {
                selected: child.props.value === selectedValue,
            });
        }

        return child;
    });

    return (
        <div className={`${className || ""}`} {...props}>
            {enhancedChildren}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
