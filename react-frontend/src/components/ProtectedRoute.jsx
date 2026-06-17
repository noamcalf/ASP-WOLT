import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

/**
 * ProtectedRoute Component (Route Guard)
 * Acts as a bouncer for our application. It checks if the user is authenticated 
 * before letting them access specific routes (like the Dashboard).
 */
const ProtectedRoute = ({ children, requireOwner = false }) => {
    // We pull the authentication status and user object from our global AuthContext
    const { isAuthenticated, user } = useAuth();

    // If the user is NOT logged in, bounce them to the login page immediately.
    // The "replace" attribute ensures they can't use the back button to return to the protected route.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If the route requires an owner but the user is not an owner, bounce them to the dashboard
    if (requireOwner && user && user.role !== 'owner') {
        return <Navigate to="/" replace />;
    }

    // If they ARE logged in (and have the right role), render the child component
    return children;
};

export default ProtectedRoute;
