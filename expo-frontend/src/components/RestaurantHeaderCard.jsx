import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

const RestaurantHeaderCard = ({
    restaurant }) => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const navigation = useNavigation();
    
    if (!restaurant) return null;

    const coverImage = getImageUrl(restaurant.image, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80');

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={{ uri: coverImage }} 
                style={styles.coverImage}
            >
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
            </ImageBackground>
            
            <View style={styles.contentContainer}>
                <View style={styles.textSection}>
                    <Text style={styles.title}>{restaurant.name}</Text>
                    <Text style={styles.subtitle}>{restaurant.cuisine}</Text>
                    
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsText}>
                            📍 {restaurant.address.street} {restaurant.address.houseNumber}, {restaurant.address.city}
                        </Text>
                        <Text style={styles.detailsText}>
                            ⏱️ {restaurant.deliveryTimeMins || restaurant.baseDeliveryTime}
                            {restaurant.distanceKm && ` • ${restaurant.distanceKm.toFixed(1)} km`}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.ratingPill}>
                    <Text style={styles.ratingValue}>{restaurant.rating.toFixed(1)}</Text>
                    <Text style={styles.ratingIcon}>⭐</Text>
                </View>
            </View>
        </View>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        ...woltTheme.shadows.light,
    },
    coverImage: {
        height: 280,
        width: '100%',
        justifyContent: 'flex-start',
    },
    backButton: {
        width: 45,
        height: 45,
        backgroundColor: colors.background,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        opacity: 0.9,
    },
    backButtonText: {
        fontSize: 24,
        color: colors.text,
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: woltTheme.spacing.large,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textSection: {
        flex: 1,
        marginRight: woltTheme.spacing.medium,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textMuted,
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'column',
        gap: 4,
    },
    detailsText: {
        fontSize: 14,
        color: colors.textMuted,
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundAlt,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    ratingIcon: {
        fontSize: 16,
        marginLeft: 4,
    }
});

export default RestaurantHeaderCard;
