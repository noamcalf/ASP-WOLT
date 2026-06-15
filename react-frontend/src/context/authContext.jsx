import React, { createContext, useState, useContext } from 'react';

// Create the context with default value "null" - when the app first reboot's - no user is connected
const AuthContext = createContext(null);

// The authenticator function
// ({ children }) are all the parts of our aplication
export const AuthProvider = ({ children }) => {

    // Create token state 
    // If the user is connected, set his token. else set null that means that the user is not connectedֿ
    // Use the web storage API
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Login func
    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken); // Save in the web storage API to prevent token loss when refreshing the page
    };

    // Logout func
    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');// delete from the web storage API when the user is disconnected
    };

    // Every app part will get accsess to the token, the login\loguot functions and boolean variable isAuthenticated
    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export in easier form
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // Return error
        console.error("useAuth must be used within an AuthProvider");
    }
    return context;
};