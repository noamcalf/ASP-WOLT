import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { apiClient } from '../utils/apiClient';
import OrderCard from './OrderCard';
import EditOrderModal from './EditOrderModal';
import { useAuth } from '../context/authContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { woltTheme } from '../styles/woltTheme';

// A component that displays a list of past orders.
// For customers, it shows what they've bought. For restaurant owners, it shows incoming orders.
const OrderHistory = () => {
    const { user } = useAuth();
    const { styles, colors } = useThemeStyles(orderHistoryStylesFactory);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

    const isOwner = user?.role === 'owner';
    const titleText = isOwner ? 'Incoming Orders' : 'Past Orders';
    const emptyIcon = isOwner ? '🏪' : '🛍️';
    const emptyTitle = isOwner ? "No orders for your restaurants yet!" : "You haven't placed any orders yet!";
    const emptyDesc = isOwner ? "Orders placed by customers at your restaurants will appear here." : "Now is the time to go back to the main screen and order something delicious.";

    // Fetches the list of orders from the server.
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { response, data } = await apiClient('/api/orders');

            if (!response.ok) {
                throw new Error(data.message || 'Error fetching orders from server');
            }

            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            setError(err.message || 'Network error while fetching order history');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{emptyIcon}</Text>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyDesc}>{emptyDesc}</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
                {titleText} ({orders.length})
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading order history...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                renderItem={({ item }) => (
                    <OrderCard 
                        order={item} 
                        onOrderCancelled={fetchOrders} 
                        onEditOrder={() => setEditingOrder(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {editingOrder && (
                <EditOrderModal 
                    order={editingOrder} 
                    onClose={() => setEditingOrder(null)} 
                    onSaveSuccess={() => {
                        setEditingOrder(null);
                        fetchOrders();
                    }}
                />
            )}
        </View>
    );
};

const orderHistoryStylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cardBackground,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: woltTheme.spacing.xl,
    },
    headerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: woltTheme.spacing.medium,
        marginBottom: woltTheme.spacing.medium,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: woltTheme.spacing.xl,
    },
    loadingText: {
        marginTop: woltTheme.spacing.medium,
        color: colors.textMuted,
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: colors.dangerBackground,
        padding: woltTheme.spacing.medium,
        borderRadius: woltTheme.borderRadius.card,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: woltTheme.spacing.xl,
        backgroundColor: colors.backgroundAlt,
        borderRadius: woltTheme.borderRadius.card,
        marginTop: woltTheme.spacing.medium,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: woltTheme.spacing.medium,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: woltTheme.spacing.small,
    },
    emptyDesc: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    }
});

export default OrderHistory;
