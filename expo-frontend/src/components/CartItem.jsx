import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { woltTheme } from '../styles/woltTheme';
import { getImageUrl } from '../utils/imageUtils';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CartItem = ({
    item, updateQuantity, removeFromCart }) => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
    const imageSrc = getImageUrl(item.product.image, fallbackImage);

    return (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Image source={{ uri: imageSrc }} style={styles.itemImage} />
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                    <Text style={styles.itemPrice}>₪{(item.product.price * item.quantity).toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => updateQuantity(item.product.id, -1)}>
                    <Text style={styles.actionButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.product.id, 1)}>
                    <Text style={styles.actionButton}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.removeButton}>
                    <Text style={styles.removeText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    cartItem: {
        marginBottom: woltTheme.spacing.large,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 15,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: colors.border,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemName: {
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    itemPrice: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    actionButton: {
        fontSize: 20,
        padding: 5,
        backgroundColor: colors.cardBackground,
        borderRadius: 5,
        overflow: 'hidden',
        color: colors.text,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    removeButton: {
        marginLeft: 'auto',
    },
    removeText: {
        fontSize: 16,
    },
});

export default CartItem;
