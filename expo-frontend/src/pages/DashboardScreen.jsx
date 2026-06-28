import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { apiClient } from '../utils/apiClient';
import CategoryCarousel from '../components/CategoryCarousel';
import { useAuth } from '../context/authContext';
import { calculateDistance, estimateDeliveryTime } from '../utils/geolocationUtils';
import { dashboardStyles as styles } from '../styles/DashboardScreen.styles';

// A generic sorting utility to prevent code duplication for custom carousels.
// It sorts an array of restaurants by a specific key (e.g. distance, rating), 
// in ascending or descending order, and returns up to 'limit' elements.
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

// The main discovery screen for the app. Shows carousels of restaurants.
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

    // Enrich restaurants with dynamic distance and delivery time based on the user's location
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

            return { ...restaurant, distanceKm, deliveryTimeMins };
        });
    }, [restaurants, user]);

    // Construct the data array for our FlatList. 
    // This allows us to scroll through all the vertical carousels efficiently.
    const sectionsData = useMemo(() => {
        if (isLoading) {
            // Provide fake sections for the Skeleton Loaders while data is fetching
            return [
                { id: 'loading-1', title: 'Loading Best Matches 🌟', data: [], isLoading: true },
                { id: 'loading-2', title: 'Trending Near You 🔥', data: [], isLoading: true }
            ];
        }

        const sections = [];
        
        // 1. Extract Promoted (Highest Rating) - using 'rating' key, descending order
        const promoted = getTopRestaurants(enrichedRestaurants, 'rating', 'desc', 5);
        if (promoted.length > 0) {
            sections.push({ id: 'promoted', title: 'Promoted Restaurants 🌟', data: promoted, isLoading: false });
        }

        // 2. Extract Nearby (Closest Distance) - using 'distanceKm' key, ascending order
        const nearby = getTopRestaurants(enrichedRestaurants, 'distanceKm', 'asc', 5);
        if (nearby.length > 0) {
            sections.push({ id: 'nearby', title: 'Nearby Restaurants 📍', data: nearby, isLoading: false });
        }

        // 3. Group remaining restaurants by cuisine category
        const grouped = enrichedRestaurants.reduce((acc, restaurant) => {
            const cuisine = restaurant.cuisine || 'Other';
            if (!acc[cuisine]) acc[cuisine] = [];
            acc[cuisine].push(restaurant);
            return acc;
        }, {});

        Object.entries(grouped).forEach(([cuisine, rests]) => {
            sections.push({ id: `cuisine-${cuisine}`, title: cuisine, data: rests, isLoading: false });
        });

        return sections;
    }, [enrichedRestaurants, isLoading]);

    // Render the header component (Title & Subtitle) inside the FlatList
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Discovery</Text>
            <Text style={styles.headerSubtitle}>Find the best food in town, delivered fast.</Text>
            
            {/* Show error banner if network fails */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ Error: {error}</Text>
                </View>
            )}
        </View>
    );

    // Render an individual section (A horizontal CategoryCarousel)
    const renderSection = ({ item }) => (
        <CategoryCarousel 
            title={item.title} 
            restaurants={item.data} 
            isLoading={item.isLoading} 
        />
    );

    return (
        <View style={styles.container}>
            {/* 
              We use FlatList here instead of a regular ScrollView for Memory Optimization. 
              FlatList only renders the carousels that are currently visible on screen.
            */}
            <FlatList
                data={sectionsData}
                keyExtractor={(item) => item.id}
                renderItem={renderSection}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default DashboardScreen;
