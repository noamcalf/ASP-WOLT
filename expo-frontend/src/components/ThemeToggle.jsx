import React, { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';

// ThemeToggle is an interactive button that allows users to switch between light and dark modes.
// It connects directly to the global ThemeContext.
const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <button 
            onClick={toggleTheme} 
            className="btn btn-light shadow-sm border wolt-nav-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
