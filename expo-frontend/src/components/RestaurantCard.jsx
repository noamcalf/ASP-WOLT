import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DeleteButton from './DeleteButton';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';

// A component that displays a summary of a restaurant (image, name, cuisine, rating).
// Customers see rating and delivery time, while owners see "Manage Menu" and "Delete" buttons.
// This component encapsulates its own styles to allow reuse across different screens.
const RestaurantCard = ({ restaurant, ownerMode = false, onDelete }) => {
    // If the restaurant doesn't have an image, we use a placeholder that fits the Wolt theme.
    const imageSrc = getImageUrl(restaurant.image, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80');

    const navigation = useNavigation();

    // Determines where to navigate based on the user's role (Customer vs Owner)
    const handlePress = () => {
        if (ownerMode) {
            navigation.navigate('OwnerMenuManager', { id: restaurant.id });
        } else {
            navigation.navigate('RestaurantMenu', { id: restaurant.id });
        }
    };

    return (
        <TouchableOpacity 
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={handlePress}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: imageSrc }} 
                    style={styles.image}
                />
            </View>
            
            {/* Content Section */}
            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {restaurant.name}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {restaurant.cuisine} {ownerMode && restaurant.address?.city ? `• ${restaurant.address.city}` : ''}
                </Text>
                
                {/* Footer Data (Rating/Time for Customers, Management actions for Owners) */}
                <View style={styles.footerContainer}>
                    {ownerMode ? (
                        <View style={styles.ownerButtonsContainer}>
                            <TouchableOpacity style={styles.manageButton} onPress={handlePress}>
                                <Text style={styles.manageButtonText}>Manage Menu</Text>
                            </TouchableOpacity>
                            <DeleteButton 
                                endpoint={`/api/restaurants/${restaurant.id}`}
                                confirmationMessage="Are you absolutely sure you want to delete this ENTIRE restaurant? This action cannot be undone!"
                                onSuccess={onDelete} 
                                style={{ borderRadius: 20 }}
                            />
                        </View>
                    ) : (
                        <>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>
                                    {restaurant.rating === 0 ? "New" : restaurant.rating.toFixed(1)}
                                </Text>
                                <Text style={{ fontSize: 12 }}>⭐</Text>
                            </View>
                            
                            <View style={styles.metaDataContainer}>
                                <Text style={styles.metaDataText}>
                                    {restaurant.deliveryTimeMins || restaurant.baseDeliveryTime}
                                </Text>
                                {restaurant.distanceKm && (
                                    <>
                                        <Text style={styles.metaDataDot}>•</Text>
                                        <Text style={styles.metaDataText}>
                                            {restaurant.distanceKm.toFixed(1)} km
                                        </Text>
                                    </>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: woltTheme.colors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: woltTheme.spacing.medium,
        marginBottom: woltTheme.spacing.large,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }
        }),
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
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: woltTheme.colors.textMuted,
        marginBottom: woltTheme.spacing.medium,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: woltTheme.colors.border,
        paddingTop: woltTheme.spacing.medium,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: woltTheme.colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: woltTheme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 4,
    },
    metaDataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaDataText: {
        fontSize: 13,
        color: woltTheme.colors.textMuted,
        fontWeight: '600',
    },
    metaDataDot: {
        marginHorizontal: 6,
        color: woltTheme.colors.textMuted,
    },
    ownerButtonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    manageButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: woltTheme.colors.primary,
        borderRadius: 20,
        paddingVertical: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    manageButtonText: {
        color: woltTheme.colors.primary,
        fontWeight: 'bold',
    }
});

export default RestaurantCard;
