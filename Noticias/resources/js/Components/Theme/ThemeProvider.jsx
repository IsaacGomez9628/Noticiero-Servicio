import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
    theme: "light",
    setTheme: () => null,
});

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "ui-theme",
}) {
    const [theme, setTheme] = useState(defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        const savedTheme = localStorage.getItem(storageKey);

        if (savedTheme) {
            setTheme(savedTheme);
            root.classList.toggle("dark", savedTheme === "dark");
        } else {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            setTheme(systemTheme);
            root.classList.toggle("dark", systemTheme === "dark");
        }
    }, [storageKey]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme);
            const root = window.document.documentElement;
            root.classList.toggle("dark", newTheme === "dark");
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
