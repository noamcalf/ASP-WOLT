import React, { createContext, useState, useEffect } from 'react';

// Create the context for managing light/dark themes globally
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('wolt_theme');
        if (savedTheme) return savedTheme;
        // Optionally, check system preference here:
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });

    useEffect(() => {
        // Apply the Bootstrap 5 attribute to the HTML tag
        document.documentElement.setAttribute('data-bs-theme', theme);
        // Persist the choice
        localStorage.setItem('wolt_theme', theme);
    }, [theme]);

    // Toggle function to switch between light and dark modes
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
