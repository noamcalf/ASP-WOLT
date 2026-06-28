import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import { apiClient } from '../utils/apiClient';
import { placeOrder } from '../services/orderService';
import { checkoutStyles as styles } from '../styles/CheckoutScreen.styles';
import { woltTheme } from '../styles/woltTheme';

const CheckoutScreen = () => {
    // 1. Pull necessary data from our global contexts (Cart and Auth)
    const { cartItems, totalPrice, activeRestaurantId, clearCart } = useCart();
    const { user } = useAuth();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // 2. Local State for UI updates
    const [restaurantName, setRestaurantName] = useState('Loading restaurant...');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Security & Flow check: 
    // If the user manually navigated to Checkout but the cart is empty, send them back to Dashboard
    useEffect(() => {
        if (cartItems.length === 0) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
        }
    }, [cartItems, navigation]);

    // 4. Fetch the restaurant name from the backend so we can display it nicely on the receipt
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!activeRestaurantId) return;
            try {
                const { response, data } = await apiClient(`/api/restaurants/${activeRestaurantId}`);
                if (response.ok) {
                    setRestaurantName(data.name);
                } else {
                    setRestaurantName('Unknown Restaurant');
                }
            } catch (err) {
                setRestaurantName('Unknown Restaurant');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurant();
    }, [activeRestaurantId]);

    // 5. Submit Order Function
    // This connects to our secure orderService which automatically attaches the JWT token
    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        try {
            // Build the payload expected by the backend
            const payload = {
                restaurantId: activeRestaurantId,
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            };

            await placeOrder(payload);
            
            // On success, clear the cart memory
            clearCart();
            
            // Navigate back to home screen and clear the navigation stack history
            // This prevents the user from being able to "swipe back" to the checkout screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
            
            if (Platform.OS === 'web') {
                window.alert('Order placed successfully!');
            } else {
                Alert.alert('Success', 'Order placed successfully!');
            }

        } catch (error) {
            if (Platform.OS === 'web') {
                window.alert(error.message || "Something went wrong while placing the order.");
            } else {
                Alert.alert('Error', error.message || "Something went wrong while placing the order.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 6. Loading Screen
    if (isLoading || cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={woltTheme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // 7. Main Native UI Render
    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                
                <Text style={styles.pageTitle}>Checkout</Text>

                {/* Left Pane / Top Pane: Delivery Details */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Delivery Details</Text>
                    
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Delivering to</Text>
                        <View style={styles.fieldContentRow}>
                            <Text style={styles.iconText}>📍</Text>
                            <View style={styles.fieldValueContainer}>
                                <Text style={styles.fieldValuePrimary}>{user.address?.street} {user.address?.houseNumber}</Text>
                                <Text style={styles.fieldValueSecondary}>{user.address?.city}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Contact Info</Text>
                        <View style={styles.fieldContentRow}>
                            <Text style={styles.iconText}>📞</Text>
                            <View style={styles.fieldValueContainer}>
                                <Text style={styles.fieldValuePrimary}>{user.name || user.username}</Text>
                                <Text style={styles.fieldValueSecondary}>{user.phoneNumber}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Right Pane / Bottom Pane: Order Summary */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Your Order</Text>
                    <Text style={styles.orderSubtitle}>
                        From <Text style={styles.restaurantName}>{restaurantName}</Text>
                    </Text>

                    <View style={{ marginBottom: woltTheme.spacing.large }}>
                        {cartItems.map(item => (
                            <View key={item.product.id} style={styles.orderItemRow}>
                                <View style={styles.orderItemLeft}>
                                    <Text style={styles.orderItemQty}>{item.quantity}x</Text>
                                    <Text style={styles.orderItemName} numberOfLines={1}>{item.product.name}</Text>
                                </View>
                                <Text style={styles.orderItemPrice}>₪{(item.product.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>₪{totalPrice.toFixed(2)}</Text>
                    </View>

                    {/* Place Order Button with Loading State */}
                    <TouchableOpacity 
                        style={[styles.placeOrderButton, isSubmitting && styles.placeOrderButtonDisabled]}
                        onPress={handlePlaceOrder}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.placeOrderText}>Processing...</Text>
                            </>
                        ) : (
                            <Text style={styles.placeOrderText}>Place Order</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default CheckoutScreen;
