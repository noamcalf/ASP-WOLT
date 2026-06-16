import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context with default value "null" - when the app first reboot's - no user is connected
const AuthContext = createContext(null);

// Utility function to parse JWT payload manually (since we don't have jwt-decode)
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// The authenticator function
// ({ children }) are all the parts of our aplication
export const AuthProvider = ({ children }) => {

    // Create token state 
    // If the user is connected, set his token. else set null that means that the user is not connected
    // Use the web storage API
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    
    // User profile state
    const [user, setUser] = useState(null);

    // Login func
    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken); // Save in the web storage API to prevent token loss when refreshing the page
    };

    // Logout func
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');// delete from the web storage API when the user is disconnected
    };

    // Listen to token changes to fetch user profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                setUser(null);
                return;
            }

            const decoded = parseJwt(token);
            if (!decoded || !decoded.userId) {
                logout(); // Invalid token
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/users/${decoded.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // If fetching fails (e.g. token expired/invalidated server-side)
                    logout();
                }
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            }
        };

        fetchUserProfile();
    }, [token]);

    // Every app part will get accsess to the token, the login\loguot functions and boolean variable isAuthenticated
    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
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