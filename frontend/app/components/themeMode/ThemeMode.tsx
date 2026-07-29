import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

const DarkModeSwitcher = () => {
    // 1. Initialize theme from localStorage or system preference
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    // 2. Sync HTML root class and localStorage whenever `theme` changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    // 3. Toggle action
    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <button
            type="button"
            className="dark:pl-8 cursor-pointer text-[#37352f] dark:text-[#ffffffcf] hover:bg-neutral-200 dark:hover:bg-neutral-800 p-1.5 rounded transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
            onClick={toggleTheme}
        >
            {theme === "dark" ? (
                <BsSun size={20} className="text-red-500" />
            ) : (
                <BsMoon size={20} className="text-neutral-700" />
            )}
        </button>
    );
};

export default DarkModeSwitcher;