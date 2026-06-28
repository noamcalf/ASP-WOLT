import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuItemRow from './MenuItemRow';
import { woltTheme } from '../styles/woltTheme';

// A section component that groups menu items by category (e.g., "Starters", "Mains").
// It handles rendering the title and a responsive grid of MenuItemRows.
const MenuSection = ({ title, products, onProductClick }) => {
    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.productsGrid}>
                {products.map(product => (
                    <MenuItemRow 
                        key={product.id} 
                        product={product} 
                        onClick={onProductClick} 
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: woltTheme.spacing.large,
        paddingHorizontal: woltTheme.spacing.large,
    },
    productsGrid: {
        paddingHorizontal: woltTheme.spacing.medium,
    }
});

export default MenuSection;
