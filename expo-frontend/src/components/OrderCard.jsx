import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { apiClient } from '../utils/apiClient';
import DeleteButton from './DeleteButton';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { woltTheme } from '../styles/woltTheme';

const OrderCard = ({ order, onOrderCancelled, onEditOrder }) => {
    const { styles, colors } = useThemeStyles(orderCardStylesFactory);
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const [restaurantName, setRestaurantName] = useState(`Restaurant #${order.restaurantId.slice(0, 8)}`);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const { response, data } = await apiClient(`/api/restaurants/${order.restaurantId}`);
                if (response.ok && data?.name) {
                    setRestaurantName(data.name);
                }
            } catch (err) {
                // Ignore gracefully
            }
        };
        fetchRestaurant();
    }, [order.restaurantId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#6c757d';
            case 'PREPARING': return '#f59f00';
            case 'READY': return '#10b981';
            case 'DELIVERED': return '#009de0';
            case 'CANCELLED': return '#ef4444';
            default: return '#6c757d';
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.restaurantName} numberOfLines={1}>{restaurantName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>
            
            <View style={styles.body}>
                <Text style={styles.dateText}>📅 {orderDate}</Text>
                
                <View style={styles.itemsSection}>
                    <Text style={styles.itemsHeader}>Items:</Text>
                    {order.items && order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>
                                <Text style={styles.itemQuantity}>{item.quantity}x </Text> 
                                {item.name}
                            </Text>
                            <Text style={styles.itemPrice}>₪{(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>
                
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalPrice}>₪{order.totalPrice?.toFixed(2)}</Text>
                    </View>
                
                {order.status === 'PENDING' && (
                    <View style={styles.actionButtonsRow}>
                        {onEditOrder && (
                            <TouchableOpacity 
                                style={styles.editButton}
                                onPress={onEditOrder}
                            >
                                <Text style={styles.editButtonText}>Edit Order</Text>
                            </TouchableOpacity>
                        )}
                        {onOrderCancelled && (
                            <DeleteButton 
                                endpoint={`/api/orders/${order.id}`}
                                confirmationMessage="Are you sure you want to cancel this order?"
                                onSuccess={onOrderCancelled}
                                style={styles.deleteButtonContainer}
                            >
                                Cancel Order
                            </DeleteButton>
                        )}
                    </View>
                )}
                </View>
            </View>
        </View>
    );
};

const orderCardStylesFactory = (colors, theme) => StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: woltTheme.borderRadius.card,
        marginBottom: woltTheme.spacing.medium,
        ...woltTheme.shadows.light,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: woltTheme.spacing.medium,
        paddingBottom: woltTheme.spacing.small,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    body: {
        padding: woltTheme.spacing.medium,
        paddingTop: 0,
        flexDirection: 'column',
    },
    dateText: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: woltTheme.spacing.medium,
    },
    itemsSection: {
        marginBottom: woltTheme.spacing.medium,
    },
    itemsHeader: {
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: woltTheme.spacing.small,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    itemName: {
        color: colors.textMuted,
        flex: 1,
    },
    itemQuantity: {
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    itemPrice: {
        color: colors.textHeading,
        fontWeight: '500',
    },
    footer: {
        marginTop: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: woltTheme.spacing.medium,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginBottom: woltTheme.spacing.medium,
    },
    totalLabel: {
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: woltTheme.spacing.small,
    },
    editButton: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: 20,
        paddingVertical: woltTheme.spacing.small,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    deleteButtonContainer: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: colors.danger,
        borderRadius: 20,
        paddingVertical: woltTheme.spacing.small,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    }
});

export default OrderCard;
