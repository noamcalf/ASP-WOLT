import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

/**
 * ProtectedRoute Component (Route Guard)
 * Acts as a bouncer for our application. It checks if the user is authenticated 
 * before letting them access specific routes (like the Dashboard).
 */
const ProtectedRoute = ({ children }) => {
    // We pull the authentication status from our global AuthContext
    const { isAuthenticated } = useAuth();

    // If the user is NOT logged in, bounce them to the login page immediately.
    // The "replace" attribute ensures they can't use the back button to return to the protected route.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If they ARE logged in, render the child component they requested (e.g., DashboardScreen)
    return children;
};

export default ProtectedRoute;
