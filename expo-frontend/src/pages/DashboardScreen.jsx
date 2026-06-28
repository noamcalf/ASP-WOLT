import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { apiClient } from '../utils/apiClient';
import CategoryCarousel from '../components/CategoryCarousel';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/authContext';
import { calculateDistance, estimateDeliveryTime } from '../utils/geolocationUtils';
import { dashboardStyles as styles } from '../styles/DashboardScreen.styles';

// A generic sorting utility to prevent code duplication for custom carousels
// Sorts by a specific key (e.g. distance, rating), in asc or desc order, and returns up to 'limit' elements
const getTopRestaurants = (restaurants, sortKey, order = 'asc', limit = 5) => {
    return [...restaurants]
        // Filter out restaurants that don't have the key we want to sort by
        .filter(r => r[sortKey] !== undefined && r[sortKey] !== null)
        .sort((a, b) => {
            if (order === 'asc') return a[sortKey] - b[sortKey];
            return b[sortKey] - a[sortKey];
        })
        .slice(0, limit);
};

const DashboardScreen = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

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

    // Enrich restaurants with dynamic distance and delivery time
    const enrichedRestaurants = useMemo(() => {
        return restaurants.map(restaurant => {
            let distanceKm = null;
            let deliveryTimeMins = restaurant.baseDeliveryTime;

            if (user?.geolocation?.latitude && user?.geolocation?.longitude && restaurant?.geolocation?.latitude && restaurant?.geolocation?.longitude) {
                distanceKm = calculateDistance(
                    user.geolocation.latitude, 
                    user.geolocation.longitude,
                    restaurant.geolocation.latitude,
                    restaurant.geolocation.longitude
                );
                deliveryTimeMins = estimateDeliveryTime(distanceKm);
            }

            return {
                ...restaurant,
                distanceKm,
                deliveryTimeMins
            };
        });
    }, [restaurants, user]);

    // 1. Extract Promoted (Highest Rating)
    const promotedRestaurants = useMemo(() => {
        return getTopRestaurants(enrichedRestaurants, 'rating', 'desc', 5);
    }, [enrichedRestaurants]);

    // 2. Extract Nearby (Closest Distance)
    const nearbyRestaurants = useMemo(() => {
        return getTopRestaurants(enrichedRestaurants, 'distanceKm', 'asc', 5);
    }, [enrichedRestaurants]);

    // 3. Group remaining restaurants by cuisine
    const groupedRestaurants = enrichedRestaurants.reduce((acc, restaurant) => {
        const cuisine = restaurant.cuisine || 'Other';
        if (!acc[cuisine]) acc[cuisine] = [];
        acc[cuisine].push(restaurant);
        return acc;
    }, {});

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    Discovery
                </Text>
                <Text style={styles.headerSubtitle}>Find the best food in town, delivered fast.</Text>

                {/* Search Bar */}
                <View style={{ marginTop: 16 }}>
                    <SearchBar />
                </View>
            </View>

            {/* Error State */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ Error: {error}</Text>
                </View>
            )}

            {/* Content Rendering: Loading Skeletons OR Dynamic Carousels */}
            {isLoading ? (
                <>
                    <CategoryCarousel title="Loading Best Matches 🌟" isLoading={true} restaurants={[]} />
                    <CategoryCarousel title="Trending Near You 🔥" isLoading={true} restaurants={[]} />
                </>
            ) : (
                <>
                    {/* Custom Row 1: Promoted Restaurants */}
                    {promotedRestaurants.length > 0 && (
                        <CategoryCarousel 
                            title="Promoted Restaurants 🌟" 
                            restaurants={promotedRestaurants} 
                            isLoading={false} 
                        />
                    )}

                    {/* Custom Row 2: Nearby Restaurants */}
                    {nearbyRestaurants.length > 0 && (
                        <CategoryCarousel 
                            title="Nearby Restaurants 📍" 
                            restaurants={nearbyRestaurants} 
                            isLoading={false} 
                        />
                    )}

                    {/* Dynamic Rows: Grouped by Cuisine */}
                    {Object.entries(groupedRestaurants).map(([cuisine, rests]) => (
                        <CategoryCarousel 
                            key={cuisine} 
                            title={cuisine} 
                            restaurants={rests} 
                            isLoading={false} 
                        />
                    ))}
                </>
            )}
        </ScrollView>
    );
};

export default DashboardScreen;
