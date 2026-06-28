import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { woltTheme } from '../styles/woltTheme';

const CartDrawer = () => {
    const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, toggleCart } = useCart();
    const navigation = useNavigation();

    const handleCheckout = () => {
        // In Drawer Navigator, closing the drawer is done by navigation.closeDrawer()
        navigation.closeDrawer();
        navigation.navigate('Checkout');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Cart ({totalItems})</Text>
                <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartItems}>
                {cart.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={styles.emptyText}>Your cart is empty.</Text>
                    </View>
                ) : (
                    cart.map((item, index) => (
                        <View key={index} style={styles.cartItem}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>₪{(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                            <View style={styles.itemActions}>
                                <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity - 1)}>
                                    <Text style={styles.actionButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity + 1)}>
                                    <Text style={styles.actionButton}>+</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeFromCart(item.productId)} style={styles.removeButton}>
                                    <Text style={styles.removeText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {cart.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.totalText}>Total: ₪{totalPrice.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutText}>Go to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woltTheme.colors.background,
        paddingTop: 50, // Safe area top
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: woltTheme.spacing.large,
        borderBottomWidth: 1,
        borderBottomColor: woltTheme.colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
    },
    closeButton: {
        fontSize: 20,
        color: woltTheme.colors.textMuted,
    },
    cartItems: {
        flex: 1,
        padding: woltTheme.spacing.large,
    },
    emptyCart: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: woltTheme.colors.textMuted,
        fontSize: 16,
    },
    cartItem: {
        marginBottom: woltTheme.spacing.large,
        borderBottomWidth: 1,
        borderBottomColor: woltTheme.colors.border,
        paddingBottom: 15,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemName: {
        fontWeight: 'bold',
        flex: 1,
        color: woltTheme.colors.text,
    },
    itemPrice: {
        fontWeight: 'bold',
        color: woltTheme.colors.primary,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    actionButton: {
        fontSize: 20,
        padding: 5,
        backgroundColor: woltTheme.colors.cardBackground,
        borderRadius: 5,
        overflow: 'hidden',
        color: woltTheme.colors.text,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
    },
    removeButton: {
        marginLeft: 'auto',
    },
    removeText: {
        fontSize: 16,
    },
    footer: {
        padding: woltTheme.spacing.large,
        borderTopWidth: 1,
        borderTopColor: woltTheme.colors.border,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: woltTheme.colors.text,
    },
    checkoutButton: {
        backgroundColor: woltTheme.colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default CartDrawer;
