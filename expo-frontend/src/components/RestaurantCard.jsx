import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DeleteButton from './DeleteButton';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

const RestaurantCard = ({
    restaurant, ownerMode = false, onDelete }) => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    // If the restaurant doesn't have an image, we use a placeholder that fits the Wolt theme.
    const imageSrc = getImageUrl(restaurant.image, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80');

    const navigation = useNavigation();

    const handleCardPress = () => {
        if (ownerMode) {
            navigation.navigate('OwnerRestaurantDetails', { id: restaurant.id });
        } else {
            navigation.navigate('RestaurantMenu', { id: restaurant.id });
        }
    };

    const handleManageMenuClick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        navigation.navigate('OwnerRestaurantDetails', { id: restaurant.id });
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity 
                activeOpacity={0.9} 
                style={styles.touchableArea} 
                onPress={handleCardPress}
            >
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageSrc }} style={styles.image} />
                </View>
                
                {/* Content Section */}
                <View style={styles.contentContainer}>
                    <Text style={styles.title} numberOfLines={1}>{restaurant.name}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {restaurant.cuisine} {ownerMode && restaurant.address?.city ? `• ${restaurant.address.city}` : ''}
                    </Text>
                </View>
            </TouchableOpacity>
            
            <View style={styles.footerContainer}>
                <View style={styles.footerInner}>
                    {ownerMode ? (
                        <View style={styles.ownerActions}>
                            <TouchableOpacity style={styles.manageButton} onPress={handleManageMenuClick}>
                                <Text style={styles.manageButtonText}>Manage Menu</Text>
                            </TouchableOpacity>
                            <DeleteButton 
                                endpoint={`/api/restaurants/${restaurant.id}`}
                                confirmationMessage="Are you absolutely sure you want to delete this ENTIRE restaurant? This action cannot be undone!"
                                onSuccess={onDelete} 
                                style={styles.deleteButton}
                            />
                        </View>
                    ) : (
                        <>
                            <View style={styles.ratingPill}>
                                <Text style={styles.ratingValue}>
                                    {restaurant.rating === 0 ? "New" : restaurant.rating.toFixed(1)}
                                </Text>
                                <Text style={styles.ratingIcon}>⭐</Text>
                            </View>
                            
                            <View style={styles.deliveryInfo}>
                                <Text style={styles.deliveryText}>
                                    {restaurant.deliveryTimeMins || restaurant.baseDeliveryTime}
                                </Text>
                                {restaurant.distanceKm && (
                                    <>
                                        <Text style={styles.deliveryBullet}>•</Text>
                                        <Text style={styles.deliveryText}>{restaurant.distanceKm.toFixed(1)} km</Text>
                                    </>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'column',
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
    touchableArea: {
    },
    imageContainer: {
        height: 160,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: woltTheme.spacing.medium,
        paddingBottom: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
    },
    footerContainer: {
        padding: woltTheme.spacing.medium,
        paddingTop: woltTheme.spacing.small,
    },
    footerInner: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: woltTheme.spacing.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingPill: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    ratingValue: {
        fontWeight: 'bold',
        color: colors.primary,
        fontSize: 14,
    },
    ratingIcon: {
        fontSize: 12,
        marginLeft: 4,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryText: {
        color: colors.textMuted,
        fontWeight: '600',
        fontSize: 13,
    },
    deliveryBullet: {
        color: colors.textMuted,
        marginHorizontal: 4,
    },
    ownerActions: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        gap: 8,
    },
    manageButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
    },
    manageButtonText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    deleteButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
    }
});

export default RestaurantCard;
