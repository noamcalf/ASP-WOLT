import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../context/authContext';
import { apiClient } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

// A small card representing a single recommended product.
const RecommendationCard = ({ product, onAddToOrder }) => {
    const { styles } = useThemeStyles(stylesFactory);
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    const imageSrc = getImageUrl(product.image, fallbackImage);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageSrc }} style={styles.image} />
            </View>
            <View style={styles.cardContent}>
                <View>
                    <Text style={styles.cardTitle} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.cardPrice}>₪{product.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => onAddToOrder(product)}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// A component that fetches and displays a horizontal list of recommended products.
// It uses collaborative filtering ("People also bought") from the backend.
const RecommendationCarousel = ({
    productId, onAddToOrder }) => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch recommendations when the component loads or when the productId changes
    useEffect(() => {
        // Only fetch if user is logged in
        if (!user || !user.id || user.role === 'owner') {
            setIsLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const { data, response } = await apiClient(`/api/users/${user.id}/recommendations/${productId}`);
                if (response.ok && Array.isArray(data)) {
                    setRecommendations(data);
                }
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [user, productId]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>People also bought</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            </View>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>People also bought</Text>
            
            {/* 
              FlatList with snapToInterval creates the native "snapping" carousel effect 
              where cards slide smoothly and snap exactly to the edge.
            */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={recommendations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RecommendationCard 
                        product={item} 
                        onAddToOrder={onAddToOrder} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                // snapToInterval = width of card (180) + marginRight (16)
                snapToInterval={196}
                decelerationRate="fast"
                snapToAlignment="start"
            />
        </View>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        marginTop: woltTheme.spacing.large,
        marginBottom: woltTheme.spacing.medium,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: woltTheme.spacing.medium,
        paddingHorizontal: woltTheme.spacing.medium,
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: woltTheme.spacing.medium,
        paddingBottom: woltTheme.spacing.medium, // For shadow
    },
    cardContainer: {
        width: 180,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        marginRight: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }
        }),
    },
    imageContainer: {
        height: 120,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        padding: woltTheme.spacing.medium,
        flex: 1,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
    },
    addButton: {
        marginTop: woltTheme.spacing.medium,
        backgroundColor: colors.primaryLight,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default RecommendationCarousel;
