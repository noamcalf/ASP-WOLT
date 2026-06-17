import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import CategoryCarousel from '../components/CategoryCarousel';

const DashboardScreen = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch restaurants on mount
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Add a small artificial delay so the user can see our beautiful Skeleton Loader in action
                await new Promise(resolve => setTimeout(resolve, 450));

                const { response, data } = await apiClient('/api/restaurants');
                
                if (!response.ok) {
                    throw new Error(data?.message || 'Failed to load restaurants');
                }
                
                setRestaurants(data);
            } catch (err) {
                setError(err.message || 'Network error while fetching restaurants');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Group restaurants by cuisine to create dynamic carousels
    // Output: { "Fast Food": [rest1, rest3], "Italian": [rest2] }
    const groupedRestaurants = restaurants.reduce((acc, restaurant) => {
        // If a restaurant doesn't have a cuisine, we group it under "Other"
        const cuisine = restaurant.cuisine || 'Other';
        
        if (!acc[cuisine]) {
            acc[cuisine] = [];
        }
        acc[cuisine].push(restaurant);
        
        return acc;
    }, {});

    return (
        <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container">
                {/* Header Section */}
                <div className="mb-5">
                    <h1 className="display-4 fw-bold wolt-text-heading" style={{ letterSpacing: '-1px' }}>
                        Discovery
                    </h1>
                    <p className="fs-5 text-muted">Find the best food in town, delivered fast.</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="alert alert-danger shadow-sm border-0 rounded-4">
                        <span className="fw-bold">⚠️ Error: </span> {error}
                    </div>
                )}

                {/* Content Rendering: Loading Skeletons OR Dynamic Carousels */}
                {isLoading ? (
                    <>
                        <CategoryCarousel title="Loading Best Matches 🌟" isLoading={true} restaurants={[]} />
                        <CategoryCarousel title="Trending Near You 🔥" isLoading={true} restaurants={[]} />
                    </>
                ) : (
                    // Convert the grouped object into an array and map over it to render a carousel per cuisine
                    Object.entries(groupedRestaurants).map(([cuisine, rests]) => (
                        <CategoryCarousel 
                            key={cuisine} 
                            title={cuisine} 
                            restaurants={rests} 
                            isLoading={false} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardScreen;
