import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { useAuth } from '../context/authContext';
import CreateRestaurantForm from '../components/CreateRestaurantForm';
import RestaurantCard from '../components/RestaurantCard';

const OwnerDashboardScreen = () => {
    const { user } = useAuth();
    const [myRestaurants, setMyRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchMyRestaurants = async () => {
        setIsLoading(true);
        try {
            const { response, data } = await apiClient('/api/restaurants');
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to fetch restaurants');
            }
            
            // Filter only restaurants owned by the connected owner
            const owned = data.filter(r => r.ownerId === user.id);
            setMyRestaurants(owned);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchMyRestaurants();
        }
    }, [user]);

    const handleRestaurantCreated = () => {
        setShowCreateForm(false);
        fetchMyRestaurants(); // Refresh the list
    };

    return (
        <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="display-5 fw-bold wolt-text-heading mb-1">My Restaurants</h1>
                        <p className="text-muted fs-5">Manage your restaurants and menus</p>
                    </div>
                    <button 
                        className="wolt-btn text-white px-4 py-2"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancel' : '+ Add New Restaurant'}
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger shadow-sm border-0 rounded-4">
                        <span className="fw-bold">⚠️ Error:</span> {error}
                    </div>
                )}

                {/* Create Form Section */}
                {showCreateForm && (
                    <div className="card border-0 shadow-sm rounded-4 mb-5 p-4 bg-body">
                        <h4 className="fw-bold mb-4">Create New Restaurant</h4>
                        <CreateRestaurantForm onSuccess={handleRestaurantCreated} />
                    </div>
                )}

                {/* Restaurants List */}
                
                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : myRestaurants.length === 0 ? (
                    <div className="text-center wolt-text-muted p-5 bg-body rounded-4 shadow-sm border" style={{ borderColor: 'var(--bs-border-color-translucent)' }}>
                        <span style={{ fontSize: '3rem' }}>🏪</span>
                        <h5 className="mt-3 wolt-text-heading">You don't have any restaurants yet.</h5>
                        <p>Click the button above to create your first restaurant.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {myRestaurants.map(restaurant => (
                            <div key={restaurant.id} className="col-12 col-md-6">
                                <RestaurantCard 
                                    restaurant={restaurant} 
                                    ownerMode={true} 
                                    onDelete={fetchMyRestaurants} 
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboardScreen;
