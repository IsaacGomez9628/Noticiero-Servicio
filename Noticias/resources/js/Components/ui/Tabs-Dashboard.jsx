import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext({
    value: "",
    setValue: () => {},
});

function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    ...props
}) {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
        defaultValue || ""
    );

    const value = isControlled ? controlledValue : uncontrolledValue;

    const setValue = (newValue) => {
        if (isControlled) {
            onValueChange?.(newValue);
        } else {
            setUncontrolledValue(newValue);
        }
    };

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div {...props}>{children}</div>
        </TabsContext.Provider>
    );
}

function TabsList({ className, ...props }) {
    return (
        <div
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}

function TabsTrigger({ className, value, ...props }) {
    const { value: selectedValue, setValue } = useContext(TabsContext);
    const isActive = selectedValue === value;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-background text-foreground shadow-sm" : "",
                className
            )}
            onClick={() => setValue(value)}
            data-state={isActive ? "active" : "inactive"}
            {...props}
        />
    );
}

function TabsContent({ className, value, ...props }) {
    const { value: selectedValue } = useContext(TabsContext);
    const isActive = selectedValue === value;

    if (!isActive) return null;

    return (
        <div
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            data-state={isActive ? "active" : "inactive"}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
