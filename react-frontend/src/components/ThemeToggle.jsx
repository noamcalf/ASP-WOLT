import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

// ThemeToggle is an interactive button that allows users to switch between light and dark modes.
// It connects directly to the global ThemeContext.
const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <button 
            onClick={toggleTheme} 
            className="btn btn-light d-flex align-items-center justify-content-center p-2 shadow-sm rounded-circle"
            style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
