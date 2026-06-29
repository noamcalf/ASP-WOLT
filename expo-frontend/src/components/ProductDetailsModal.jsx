import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useAuth } from '../context/authContext';
import { getImageUrl } from '../utils/imageUtils';
import RecommendationCarousel from './RecommendationCarousel';
import { woltTheme } from '../styles/woltTheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { formatPrice } from '../utils/formatters';
import BaseModal from './BaseModal';

const ProductDetailsModal = ({
    product, onClose, onAddToOrder }) => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    
    if (!product) return null;

    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';
    const imageSrc = getImageUrl(product.image, fallbackImage);

    return (
        <BaseModal visible={true} onClose={onClose}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <ScrollView bounces={false} style={styles.scrollContent}>
                <Image source={{ uri: imageSrc }} style={styles.image} />
                
                <View style={styles.content}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                    
                    <RecommendationCarousel productId={product.id} onAddToOrder={onAddToOrder} />
                </View>
            </ScrollView>

            {user?.role !== 'owner' && (
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => {
                            onAddToOrder(product);
                            onClose();
                        }}
                    >
                        <Text style={styles.addButtonText}>Add to order</Text>
                        <Text style={styles.addButtonPrice}>₪{formatPrice(product.price)}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </BaseModal>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        ...woltTheme.shadows.small,
    },
    closeButtonText: {
        fontSize: 20,
        color: colors.text,
    },
    scrollContent: {
        width: '100%',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    content: {
        padding: woltTheme.spacing.large,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: 20,
        lineHeight: 24,
    },
    footer: {
        padding: woltTheme.spacing.large,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    addButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButtonPrice: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default ProductDetailsModal;
