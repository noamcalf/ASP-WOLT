import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiClient } from '../utils/apiClient';
import { useAuth } from '../context/authContext';
import { calculateDistance, estimateDeliveryTime } from '../utils/geolocationUtils';
import { restaurantMenuStyles as styles } from '../styles/RestaurantMenuScreen.styles';
import { woltTheme } from '../styles/woltTheme';

import RestaurantHeaderCard from '../components/RestaurantHeaderCard';
import MenuSection from '../components/MenuSection';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useCart } from '../context/CartContext';

// This screen shows the details of a specific restaurant and its full menu
const RestaurantMenuScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Extract parameters from React Navigation instead of react-router-dom
    const { id, highlightProductId } = route.params || {};
    
    const { user } = useAuth();

    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const { addToCart } = useCart();

    // Fetch the restaurant details and its products when the screen opens
    useEffect(() => {
        if (!id) return;

        const fetchRestaurantData = async () => {
            try {
                // Fetch restaurant metadata and products concurrently for speed
                const [restaurantRes, productsRes] = await Promise.all([
                    apiClient(`/api/restaurants/${id}`),
                    apiClient(`/api/restaurants/${id}/products`)
                ]);

                if (!restaurantRes.response.ok) throw new Error(restaurantRes.data?.error || 'Failed to load restaurant');
                if (!productsRes.response.ok) throw new Error(productsRes.data?.error || 'Failed to load menu');

                let fetchedRestaurant = restaurantRes.data;
                let distanceKm = null;
                let deliveryTimeMins = fetchedRestaurant.baseDeliveryTime;

                // If user has location, calculate dynamic distance to this specific restaurant
                if (user?.geolocation?.latitude && user?.geolocation?.longitude && fetchedRestaurant?.geolocation?.latitude && fetchedRestaurant?.geolocation?.longitude) {
                    distanceKm = calculateDistance(
                        user.geolocation.latitude, 
                        user.geolocation.longitude,
                        fetchedRestaurant.geolocation.latitude,
                        fetchedRestaurant.geolocation.longitude
                    );
                    deliveryTimeMins = estimateDeliveryTime(distanceKm);
                }

                setRestaurant({
                    ...fetchedRestaurant,
                    distanceKm,
                    deliveryTimeMins
                });
                setProducts(productsRes.data);

                // Auto-Open Feature: If the user navigated here by clicking a product from Search,
                // we automatically find it and open the product popup!
                if (highlightProductId) {
                    const productToHighlight = productsRes.data.find(p => p.id === highlightProductId);
                    if (productToHighlight) {
                        setSelectedProduct(productToHighlight);
                    }
                }

            } catch (err) {
                setError(err.message || 'Network error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id, highlightProductId]); // Re-run if ID or highlight target changes

    // Handles adding the product to the global cart context
    const handleAddToOrder = (product) => {
        const result = addToCart(product);
        if (!result.success) {
            alert(result.error);
        }
    };

    // Show a loading spinner while fetching
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={woltTheme.colors.primary} />
            </View>
        );
    }

    // Show error or fallback if restaurant doesn't exist
    if (error || !restaurant) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>⚠️ {error || 'Restaurant not found'}</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.buttonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Convert flat product array to categorized sections for the FlatList
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    const menuSections = Object.entries(groupedProducts).map(([categoryName, items]) => ({
        id: categoryName,
        title: categoryName,
        data: items
    }));

    // Render the Restaurant header (Image, Name, Rating) above the menu
    const renderHeader = () => (
        <View style={styles.headerWrapper}>
            <RestaurantHeaderCard restaurant={restaurant} />
            {menuSections.length === 0 && (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>No items found in this menu.</Text>
                </View>
            )}
        </View>
    );

    // Render each category (e.g. "Starters", "Mains")
    const renderSection = ({ item }) => (
        <MenuSection 
            title={item.title} 
            products={item.data} 
            onProductClick={setSelectedProduct} 
        />
    );

    return (
        <View style={styles.container}>
            {/* 
              We use FlatList here to handle rendering the menu categories efficiently.
              This guarantees smooth scrolling even for restaurants with massive menus.
            */}
            <FlatList
                data={menuSections}
                keyExtractor={(item) => item.id}
                renderItem={renderSection}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Modal is rendered conditionally and uses Native React Native Modal inside ProductDetailsModal */}
            {selectedProduct && (
                <ProductDetailsModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                    onAddToOrder={handleAddToOrder}
                />
            )}
        </View>
    );
};

export default RestaurantMenuScreen;
