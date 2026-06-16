import React from 'react';
import { useParams, Link } from 'react-router-dom';

const RestaurantScreen = () => {
    // Extract the dynamic 'id' parameter from the URL (/restaurant/:id)
    const { id } = useParams();

    return (
        <div className="container-fluid min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center">
            <h2 className="text-dark fw-bold mb-3">Restaurant Details</h2>
            <p className="lead text-secondary mb-4">
                You are currently viewing the menu for restaurant ID: <strong>{id}</strong>
            </p>
            
            <Link to="/" className="wolt-btn text-white px-4 py-2 text-decoration-none">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default RestaurantScreen;
