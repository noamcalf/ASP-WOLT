import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import RestaurantCard from '../components/RestaurantCard';
import MenuItemRow from '../components/MenuItemRow';
import { woltTheme } from '../styles/woltTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

// The page that shows search results when a user types into the search bar and hits enter.
// It groups results into matching Restaurants and matching Menu Items.
const SearchResultsView = () => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const route = useRoute();
    const navigation = useNavigation();
    
    // In React Native, parameters are passed via the route object instead of URL params
    const query = route.params?.query || '';
    
    const [results, setResults] = useState({ restaurants: [], products: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/search/${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const hasRestaurants = results.restaurants?.length > 0;
    const hasProducts = results.products?.length > 0;
    const hasAnyResults = hasRestaurants || hasProducts;

    const handleProductPress = (product) => {
        navigation.navigate('RestaurantMenu', { id: product.restaurantId, highlightProductId: product.id });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.pageTitle}>
                Search results for: <Text style={styles.highlightText}>"{query}"</Text>
            </Text>

            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : !hasAnyResults ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.noResultsTitle}>No exact matches found</Text>
                    <Text style={styles.noResultsSubtitle}>Try checking your spelling or using less specific keywords.</Text>
                </View>
            ) : (
                <View>
                    {/* Restaurants Horizontal Scroll */}
                    {hasRestaurants && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Restaurants</Text>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalScrollContent}
                            >
                                {results.restaurants.map((restaurant) => (
                                    <View key={`rest-${restaurant.id}`} style={styles.cardWrapper}>
                                        <RestaurantCard restaurant={restaurant} />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Products/Menu Items Horizontal Scroll */}
                    {hasProducts && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Menu Items</Text>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalScrollContent}
                            >
                                {results.products.map((product) => (
                                    <View key={`prod-${product.id}`} style={styles.cardWrapper}>
                                        <MenuItemRow 
                                            product={product} 
                                            onClick={handleProductPress} 
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        padding: woltTheme.spacing.large,
        paddingBottom: 100, // Extra padding for bottom navigation if any
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: woltTheme.spacing.large,
    },
    highlightText: {
        color: colors.primary,
    },
    centerContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        padding: woltTheme.spacing.medium,
        backgroundColor: colors.dangerBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
    },
    noResultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textMuted,
        marginBottom: 8,
    },
    noResultsSubtitle: {
        fontSize: 15,
        color: colors.textMuted,
        textAlign: 'center',
    },
    section: {
        marginBottom: woltTheme.spacing.extraLarge,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: woltTheme.spacing.medium,
    },
    horizontalScrollContent: {
        paddingRight: woltTheme.spacing.large,
        gap: woltTheme.spacing.medium,
        paddingBottom: woltTheme.spacing.medium, // Extra space for shadows
    },
    cardWrapper: {
        width: 340, // Increased width for better text wrapping
        marginRight: woltTheme.spacing.medium,
    }
});

export default SearchResultsView;
