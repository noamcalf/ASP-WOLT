import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { woltTheme } from '../styles/woltTheme';
import CartItem from './CartItem';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useAuth } from '../context/authContext';

const CartDrawer = () => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const { cartItems, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();
    const { isAuthenticated } = useAuth(); // Import useAuth to check auth status
    const navigation = useNavigation();

    const handleCheckout = () => {
        navigation.dispatch(DrawerActions.closeDrawer());
        if (isAuthenticated) {
            navigation.navigate('Checkout');
        } else {
            // Redirect guests to the Login screen if they try to checkout
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Cart ({totalItems})</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartItems}>
                {cartItems.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={styles.emptyText}>Your cart is empty.</Text>
                    </View>
                ) : (
                    cartItems.map((item, index) => (
                        <CartItem 
                            key={index} 
                            item={item} 
                            updateQuantity={updateQuantity} 
                            removeFromCart={removeFromCart} 
                        />
                    ))
                )}
            </ScrollView>

            {cartItems.length > 0 && (
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

const stylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 50, // Safe area top
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: woltTheme.spacing.large,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeButton: {
        fontSize: 20,
        color: colors.textMuted,
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
        color: colors.textMuted,
        fontSize: 16,
    },
    footer: {
        padding: woltTheme.spacing.large,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: colors.text,
    },
    checkoutButton: {
        backgroundColor: colors.primary,
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
