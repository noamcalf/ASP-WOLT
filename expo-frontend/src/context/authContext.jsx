import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';

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
    const [token, setToken] = useState(null);
    
    // User profile state
    const [user, setUser] = useState(null);

    // Track loading state so the app doesn't flash the login screen before AsyncStorage finishes reading
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from AsyncStorage
    useEffect(() => {
        const loadStoredToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error("Failed to load token from AsyncStorage", error);
            } finally {
                // Done checking storage, we can render the app now
                setIsLoading(false); 
            }
        };
        loadStoredToken();
    }, []);

    // Login func
    const login = async (newToken) => {
        setToken(newToken);
        try {
            await AsyncStorage.setItem('token', newToken); // Save in AsyncStorage
        } catch (error) {
            console.error("Failed to save token to AsyncStorage", error);
        }
    };

    // Logout func
    const logout = async () => {
        setToken(null);
        setUser(null);
        try {
            await AsyncStorage.removeItem('token'); // Delete from AsyncStorage
        } catch (error) {
            console.error("Failed to remove token from AsyncStorage", error);
        }
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
                // apiClient automatically handles the base URL and Authorization headers
                const { response, data: userData } = await apiClient(`/api/users/${decoded.userId}`);

                if (response.ok) {
                    setUser(userData);
                } else {
                    // If fetching fails (e.g. token expired/invalidated server-side)
                    logout();
                }
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            }
        };

        // We only want to fetch the profile once the token is loaded and not null
        if (!isLoading) {
            fetchUserProfile();
        }
    }, [token, isLoading]);

    // Every app part will get accsess to the token, the login\loguot functions and boolean variable isAuthenticated
    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, isLoading }}>
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