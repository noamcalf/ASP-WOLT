import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RestaurantCard from './RestaurantCard';
import CardSkeletonLoader from './CardSkeletonLoader';
import { woltTheme } from '../styles/woltTheme';

const CategoryCarousel = ({ title, restaurants, isLoading }) => {
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

const styles = StyleSheet.create({
    container: {
        marginBottom: woltTheme.spacing.extraLarge,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: woltTheme.spacing.medium,
        paddingHorizontal: woltTheme.spacing.medium,
    },
    scrollContent: {
        paddingHorizontal: woltTheme.spacing.medium,
        gap: woltTheme.spacing.medium,
    },
    cardWrapper: {
        width: 300, // Fixed width so they look like horizontal cards
        marginRight: woltTheme.spacing.medium,
    },
    emptyText: {
        color: woltTheme.colors.textMuted,
        fontStyle: 'italic',
        padding: woltTheme.spacing.medium,
    }
});

export default CategoryCarousel;
