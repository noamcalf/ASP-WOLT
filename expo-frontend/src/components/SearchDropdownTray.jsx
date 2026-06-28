import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { woltTheme } from '../styles/woltTheme';

// SearchDropdownTray is an absolute-positioned overlay that displays live search results.
// It renders lists of matching restaurants and menu items below the SearchBar.
const SearchDropdownTray = ({ results, isLoading, isOpen, searchQuery, onClose }) => {
    const navigation = useNavigation();

    if (!isOpen || !searchQuery.trim()) return null;

    const hasRestaurants = results?.restaurants?.length > 0;
    const hasProducts = results?.products?.length > 0;
    const hasResults = hasRestaurants || hasProducts;

    const handleRestaurantPress = (id) => {
        onClose();
        navigation.navigate('RestaurantMenu', { id });
    };

    const handleProductPress = (product) => {
        onClose();
        navigation.navigate('RestaurantMenu', { id: product.restaurantId, highlightProductId: product.id });
    };

    const handleSeeAll = () => {
        onClose();
        navigation.navigate('Search', { query: searchQuery });
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="small" color={woltTheme.colors.primary} />
                    <Text style={styles.mutedText}>Searching...</Text>
                </View>
            ) : !hasResults ? (
                <View style={styles.centerContent}>
                    <Text style={styles.mutedText}>No results found for "{searchQuery}"</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                    {hasRestaurants && (
                        <View style={styles.section}>
                            <Text style={styles.headerText}>RESTAURANTS</Text>
                            {results.restaurants.map(restaurant => (
                                <TouchableOpacity 
                                    key={`rest-${restaurant.id}`} 
                                    style={styles.row}
                                    onPress={() => handleRestaurantPress(restaurant.id)}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: woltTheme.colors.primary }]}>
                                        <Text style={styles.emoji}>🍽️</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.titleText}>{restaurant.name}</Text>
                                        <Text style={styles.subtitleText}>Restaurant</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {hasProducts && (
                        <View style={styles.section}>
                            <Text style={styles.headerText}>MENU ITEMS</Text>
                            {results.products.map(product => (
                                <TouchableOpacity 
                                    key={`prod-${product.id}`} 
                                    style={styles.row}
                                    onPress={() => handleProductPress(product)}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: woltTheme.colors.success }]}>
                                        <Text style={styles.emoji}>🍔</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.titleText}>{product.name}</Text>
                                        <Text style={styles.subtitleText}>₪{product.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity style={styles.viewAllRow} onPress={handleSeeAll}>
                        <Text style={styles.viewAllText}>See all results for "{searchQuery}"</Text>
                        <Text style={styles.viewAllText}>→</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        maxHeight: 400,
        ...woltTheme.shadows.medium,
        elevation: 5,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        zIndex: 1050,
        overflow: 'hidden',
    },
    scrollView: {
        paddingVertical: 8,
    },
    centerContent: {
        padding: 24,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    mutedText: {
        color: woltTheme.colors.textMuted,
        fontSize: 14,
    },
    section: {
        marginBottom: 8,
    },
    headerText: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 12,
        fontWeight: 'bold',
        color: woltTheme.colors.textMuted,
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emoji: {
        fontSize: 18,
    },
    titleText: {
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        fontSize: 15,
        marginBottom: 2,
    },
    subtitleText: {
        color: woltTheme.colors.textMuted,
        fontSize: 13,
    },
    viewAllRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: woltTheme.colors.border,
        marginTop: 4,
    },
    viewAllText: {
        color: woltTheme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default SearchDropdownTray;
