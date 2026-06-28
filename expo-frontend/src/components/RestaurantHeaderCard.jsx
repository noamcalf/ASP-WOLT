import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';

// The large banner at the top of a restaurant's menu page.
// It displays the cover image, name, address, and rating.
const RestaurantHeaderCard = ({ restaurant }) => {
    const navigation = useNavigation();
    
    if (!restaurant) return null;

    // Use the restaurant's image as the cover if available, otherwise a high-quality placeholder
    const coverImage = getImageUrl(restaurant.image, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80');

    return (
        <View style={styles.container}>
            
            {/* 
              1. The Cover Image Area
              Using React Native's ImageBackground ensures the image fills the space 
              perfectly, acting as a container for absolutely positioned children.
            */}
            <ImageBackground 
                source={{ uri: coverImage }} 
                style={styles.coverImage}
                resizeMode="cover"
            >
                {/* 
                  2. Floating Back Button
                  Pinned to the top-left corner of the image.
                  'navigation.goBack()' tells React Navigation to return to the previous screen.
                */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
            </ImageBackground>
            
            {/* Detailed Info Overlay below the image */}
            <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={2}>
                            {restaurant.name}
                        </Text>
                        <Text style={styles.cuisine}>
                            {restaurant.cuisine}
                        </Text>
                    </View>
                    
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                            {restaurant.rating.toFixed(1)}
                        </Text>
                        <Text style={{ fontSize: 16 }}>⭐</Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        📍 {restaurant.address.street} {restaurant.address.houseNumber}, {restaurant.address.city}
                    </Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        ⏱️ {restaurant.deliveryTimeMins || restaurant.baseDeliveryTime}
                    </Text>
                    {restaurant.distanceKm && (
                        <>
                            <Text style={styles.infoDot}>•</Text>
                            <Text style={styles.infoText}>
                                {restaurant.distanceKm.toFixed(1)} km
                            </Text>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: woltTheme.colors.background,
        overflow: 'hidden',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: woltTheme.spacing.medium,
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
    coverImage: {
        width: '100%',
        height: 280,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 40, // Padding for notch/status bar area
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: woltTheme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            }
        }),
    },
    backButtonText: {
        fontSize: 24,
        color: woltTheme.colors.text,
        fontWeight: 'bold',
        lineHeight: 28,
        marginLeft: -2, // Optical alignment for the arrow
    },
    contentContainer: {
        padding: woltTheme.spacing.large,
        backgroundColor: woltTheme.colors.background,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: woltTheme.spacing.small,
    },
    titleContainer: {
        flex: 1,
        paddingRight: woltTheme.spacing.medium,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: 4,
    },
    cuisine: {
        fontSize: 18,
        color: woltTheme.colors.textMuted,
        marginBottom: woltTheme.spacing.medium,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: woltTheme.colors.cardBackground,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
    },
    ratingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: woltTheme.colors.primary,
        marginRight: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: woltTheme.spacing.small,
    },
    infoText: {
        fontSize: 15,
        color: woltTheme.colors.textMuted,
        fontWeight: '500',
    },
    infoDot: {
        marginHorizontal: 8,
        color: woltTheme.colors.textMuted,
    }
});

export default RestaurantHeaderCard;
