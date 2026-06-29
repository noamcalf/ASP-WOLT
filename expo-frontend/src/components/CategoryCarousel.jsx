import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RestaurantCard from './RestaurantCard';
import CardSkeletonLoader from './CardSkeletonLoader';
import { woltTheme } from '../styles/woltTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CategoryCarousel = ({
    const { styles, colors } = useThemeStyles(stylesFactory); title, restaurants, isLoading }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {isLoading ? (
                    /* Render 4 skeletons if loading */
                    <>
                        <View style={styles.cardWrapper}><CardSkeletonLoader /></View>
                        <View style={styles.cardWrapper}><CardSkeletonLoader /></View>
                        <View style={styles.cardWrapper}><CardSkeletonLoader /></View>
                        <View style={styles.cardWrapper}><CardSkeletonLoader /></View>
                    </>
                ) : (
                    /* Map restaurants to cards */
                    restaurants.map(restaurant => (
                        <View key={restaurant.id} style={styles.cardWrapper}>
                            <RestaurantCard restaurant={restaurant} />
                        </View>
                    ))
                )}
                
                {/* Fallback if loaded but empty */}
                {!isLoading && restaurants.length === 0 && (
                    <Text style={styles.emptyText}>No restaurants available in this category.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        marginBottom: woltTheme.spacing.extraLarge,
        marginTop: woltTheme.spacing.medium,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: colors.text,
        marginBottom: woltTheme.spacing.large,
        paddingHorizontal: woltTheme.spacing.large,
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: woltTheme.spacing.large,
        gap: woltTheme.spacing.large,
    },
    cardWrapper: {
        width: 300, // Fixed width so they look like horizontal cards
        marginRight: woltTheme.spacing.medium,
    },
    emptyText: {
        color: colors.textMuted,
        fontStyle: 'italic',
        padding: woltTheme.spacing.medium,
    }
});

export default CategoryCarousel;
