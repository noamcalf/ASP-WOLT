import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageUtils';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useAuth } from '../context/authContext';
import { formatPrice, formatStatus } from '../utils/formatters';
import { woltTheme } from '../styles/woltTheme';
import BaseModal from './BaseModal';
const EditOrderModal = ({ order, onClose, onSaveSuccess }) => {
    const { user } = useAuth();
    const isOwner = user?.role === 'owner';
    const { styles, colors } = useThemeStyles(editOrderStylesFactory);
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    
    // Map of productId -> quantity
    const [itemQuantities, setItemQuantities] = useState({});

    // Effect to fetch fresh order data and restaurant menu when the modal opens
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch the freshest order details from the server
                const { response: orderRes, data: orderData } = await apiClient(`/api/orders/${order.id}`);
                if (!orderRes.ok) throw new Error(orderData?.error || 'Failed to fetch fresh order details');
                
                // If the order moved to PREPARING or beyond, block editing (unless owner)
                if (orderData.status !== 'PENDING' && !isOwner) {
                    throw new Error('This order is no longer pending and cannot be edited.');
                }

                // 2. Initialize the local item quantities state from the FRESH order data
                const initialQuantities = {};
                if (orderData && orderData.items) {
                    orderData.items.forEach(item => {
                        initialQuantities[item.productId || item.id] = item.quantity;
                    });
                }
                setItemQuantities(initialQuantities);

                // 3. Fetch the full restaurant menu so we can get product images
                const { response: menuRes, data: menuData } = await apiClient(`/api/restaurants/${order.restaurantId}/products`);
                if (!menuRes.ok) throw new Error(menuData?.error || 'Failed to fetch menu');

                if (isOwner) {
                    // For owner, only show products that are actually in the order, attaching images from the menu
                    const productsList = orderData.items.map(item => {
                        const menuProduct = menuData.find(p => String(p.id) === String(item.productId || item.id));
                        return { 
                            id: item.productId || item.id, 
                            name: item.name, 
                            price: item.price, 
                            image: menuProduct ? menuProduct.image : null 
                        };
                    });
                    setProducts(productsList);
                } else {
                    setProducts(menuData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [order]);

    // Function to handle clicking + or - on a product
    const handleUpdateQuantity = (productId, delta) => {
        setItemQuantities(prev => {
            const currentQuantity = prev[productId] || 0;
            const newQuantity = currentQuantity + delta;
            
            // If quantity drops to 0 or below, remove the item entirely from the order payload
            if (newQuantity <= 0) {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            }
            
            return { ...prev, [productId]: newQuantity };
        });
    };

    // Function to submit the patched order to the server
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        // Construct items array format expected by the backend
        const updatedItems = Object.entries(itemQuantities).map(([productId, quantity]) => ({
            productId,
            quantity
        }));

        if (updatedItems.length === 0) {
            setError("Your order must have at least one item. If you want to cancel, use the Cancel button.");
            setIsSaving(false);
            return;
        }

        const payload = { items: updatedItems };
        if (isOwner) {
            payload.status = selectedStatus;
        }

        try {
            const { response, data } = await apiClient(`/api/orders/${order.id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(data?.error || 'Failed to update order');
            
            onSaveSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate new total
    const newTotal = products.reduce((acc, product) => {
        const qty = itemQuantities[product.id] || 0;
        return acc + (product.price * qty);
    }, 0);

    return (
        <BaseModal visible={true} onClose={onClose}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Edit Order</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>
            
            {/* Content */}
                    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>⚠️ Error: {error}</Text>
                            </View>
                        )}

                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : (
                            <>
                                {isOwner && (
                                    <View style={styles.statusSection}>
                                        <Text style={styles.statusLabel}>Update Status:</Text>
                                        <View style={styles.statusButtonsContainer}>
                                            {['PENDING', 'PREPARING', 'READY', 'ON_ITS_WAY', 'DELIVERED', 'CANCELLED'].map((s) => {
                                                return (
                                                <TouchableOpacity
                                                    key={s}
                                                    style={[
                                                        styles.statusOptionButton,
                                                        selectedStatus === s && styles.statusOptionButtonActive
                                                    ]}
                                                    onPress={() => setSelectedStatus(s)}
                                                >
                                                    <Text style={[
                                                        styles.statusOptionText,
                                                        selectedStatus === s && styles.statusOptionTextActive
                                                    ]}>{formatStatus(s)}</Text>
                                                </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                )}
                                <View style={styles.productList}>
                                {products.map(product => {
                                    const quantity = itemQuantities[product.id] || 0;
                                    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
                                    const imageSrc = getImageUrl(product.image, fallbackImage);

                                    return (
                                        <View key={product.id} style={styles.productCard}>
                                            <View style={styles.productInfo}>
                                                <Image source={{ uri: imageSrc }} style={styles.productImage} />
                                                <View style={styles.productTextContainer}>
                                                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                                                    <Text style={styles.productPrice}>₪{formatPrice(product.price)}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.quantityControls}>
                                                {!isOwner && (
                                                    <TouchableOpacity 
                                                        style={[styles.quantityButton, quantity === 0 && styles.quantityButtonDisabled]}
                                                        onPress={() => handleUpdateQuantity(product.id, -1)}
                                                        disabled={quantity === 0}
                                                    >
                                                        <Text style={[styles.quantityButtonText, quantity === 0 && styles.quantityButtonTextDisabled]}>-</Text>
                                                    </TouchableOpacity>
                                                )}
                                                
                                                <Text style={styles.quantityText}>{quantity}</Text>
                                                
                                                {!isOwner && (
                                                    <TouchableOpacity 
                                                        style={styles.quantityButton}
                                                        onPress={() => handleUpdateQuantity(product.id, 1)}
                                                    >
                                                        <Text style={styles.quantityButtonText}>+</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                            </>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, woltTheme.spacing.large) }]}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>New Total</Text>
                            <Text style={styles.totalAmount}>₪{formatPrice(newTotal)}</Text>
                        </View>
                        <View style={styles.footerButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.saveButton, (isSaving || isLoading) && styles.saveButtonDisabled]} 
                                onPress={handleSave}
                                disabled={isSaving || isLoading}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
        </BaseModal>
    );
};

const editOrderStylesFactory = (colors, theme) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: woltTheme.spacing.large,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 20,
        color: colors.textMuted,
        fontWeight: 'bold',
    },
    scrollContent: {
        flex: 1,
        backgroundColor: colors.backgroundAlt,
    },
    scrollContentContainer: {
        padding: woltTheme.spacing.medium,
    },
    errorContainer: {
        backgroundColor: colors.dangerBackground,
        padding: woltTheme.spacing.medium,
        borderRadius: woltTheme.borderRadius.card,
        marginBottom: woltTheme.spacing.medium,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontWeight: 'bold',
    },
    loadingContainer: {
        paddingVertical: woltTheme.spacing.xl * 2,
        alignItems: 'center',
    },
    productList: {
        gap: woltTheme.spacing.medium,
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        padding: woltTheme.spacing.medium,
        borderRadius: woltTheme.borderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
        ...woltTheme.shadows.light,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: woltTheme.spacing.medium,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: woltTheme.spacing.medium,
    },
    productTextContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundAlt,
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        ...woltTheme.shadows.light,
    },
    quantityButtonDisabled: {
        backgroundColor: colors.backgroundAlt,
        elevation: 0,
        shadowOpacity: 0,
    },
    quantityButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: -2, // Center alignment adjustment
    },
    quantityButtonTextDisabled: {
        color: colors.textMuted,
    },
    quantityText: {
        minWidth: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.textHeading,
    },
    footer: {
        padding: woltTheme.spacing.large,
        backgroundColor: colors.cardBackground,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: colors.textMuted,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    footerButtons: {
        flexDirection: 'row',
        gap: woltTheme.spacing.medium,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        justifyContent: 'center',
        minWidth: 120,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    statusSection: {
        marginBottom: woltTheme.spacing.large,
        backgroundColor: colors.backgroundAlt,
        padding: woltTheme.spacing.medium,
        borderRadius: woltTheme.borderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statusLabel: {
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: woltTheme.spacing.medium,
    },
    statusButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: woltTheme.spacing.small,
    },
    statusOptionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    statusOptionButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    statusOptionText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textMuted,
    },
    statusOptionTextActive: {
        color: '#fff',
    }
});

export default EditOrderModal;
