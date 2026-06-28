import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiClient } from '../utils/apiClient';
import { useAuth } from '../context/authContext';
import { calculateDistance, estimateDeliveryTime } from '../utils/geolocationUtils';

import RestaurantHeaderCard from '../components/RestaurantHeaderCard';
import MenuSection from '../components/MenuSection';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useCart } from '../context/CartContext';
import { restaurantMenuStyles as styles } from '../styles/RestaurantMenuScreen.styles';
import { woltTheme } from '../styles/woltTheme';

const RestaurantMenuScreen = () => {
    // In React Native Navigation, we extract params from useRoute() instead of useParams()
    const route = useRoute();
    const id = route.params?.id;
    const highlightProductId = route.params?.highlightProductId;
    const navigation = useNavigation();
    
    const { user } = useAuth();

    // State management for our component:
    // 'restaurant' holds the restaurant metadata (name, image, etc.)
    // 'products' holds the array of all menu items.
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State to control the Product Details Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Connect to the global Cart Context
    const { addToCart } = useCart();

    // useEffect runs when the component mounts, or when the 'id' variable changes.
    useEffect(() => {
        if (!id) return;
        
        const fetchRestaurantData = async () => {
            try {
                // Promise.all is a super powerful JavaScript feature!
                // Instead of fetching the restaurant, WAITING, and then fetching the products,
                // Promise.all fires BOTH requests to the server at the exact same time (concurrently),
                // cutting the loading time in half!
                const [restaurantRes, productsRes] = await Promise.all([
                    apiClient(`/api/restaurants/${id}`),
                    apiClient(`/api/restaurants/${id}/products`)
                ]);

                if (!restaurantRes.response.ok) throw new Error(restaurantRes.data?.error || 'Failed to load restaurant');
                if (!productsRes.response.ok) throw new Error(productsRes.data?.error || 'Failed to load menu');

                let fetchedRestaurant = restaurantRes.data;
                let distanceKm = null;
                let deliveryTimeMins = fetchedRestaurant.baseDeliveryTime;

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

                // If a specific product was requested via search, open its modal automatically!
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
    }, [id, highlightProductId, user]);

    // Handle adding a product to the basket
    const handleAddToOrder = (product) => {
        const result = addToCart(product);
        if (!result.success) {
            // Blocked by cross-restaurant logic
            alert(result.error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={woltTheme.colors.primary} />
            </View>
        );
    }

    if (error || !restaurant) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>⚠️ {error || 'Restaurant not found'}</Text>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Dashboard')}
                >
                    <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Data Transformation: Grouping Products
    // We receive a flat array of products: [{name: "Pizza", category: "Mains"}, {name: "Cola", category: "Drinks"}]
    // We want to group them into an object so we can render sections: 
    // { "Mains": [Pizza, ...], "Drinks": [Cola, ...] }
    // The 'reduce' function iterates over the array and builds this object dynamically.
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* 1. The Main Billboard Header */}
                <RestaurantHeaderCard restaurant={restaurant} />

                {/* 2. Menu Content Layout */}
                <View style={styles.menuContent}>
                    {Object.entries(groupedProducts).length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No items found in this menu.</Text>
                        </View>
                    ) : (
                        // Render a MenuSection for each category group
                        Object.entries(groupedProducts).map(([categoryName, items]) => (
                            <MenuSection 
                                key={categoryName} 
                                title={categoryName} 
                                products={items} 
                                onProductClick={setSelectedProduct} // Opens the modal
                            />
                        ))
                    )}
                </View>

            </ScrollView>

            {/* 3. The Dynamic Modal Pop-up */}
            {/* If selectedProduct has a value, render the modal on top of the screen */}
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
