import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuItemRow from './MenuItemRow';
import { woltTheme } from '../styles/woltTheme';

// A section component that groups menu items by category (e.g., "Starters", "Mains").
// It handles rendering the title and a responsive grid of MenuItemRows.
const MenuSection = ({ title, products, onProductClick }) => {
    // Hide the section entirely if there are no products in this category
    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            {/* The category title */}
            <Text style={styles.title}>{title}</Text>
            
            {/* 
              A flexbox grid container to layout items. 
              flexWrap allows us to wrap items to the next row if needed.
            */}
            <View style={styles.gridContainer}>
                {products.map(product => (
                    <View key={product.id} style={styles.itemWrapper}>
                        <MenuItemRow product={product} onClick={onProductClick} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: woltTheme.spacing.extraLarge,
        paddingHorizontal: woltTheme.spacing.medium,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: woltTheme.spacing.medium,
        marginLeft: woltTheme.spacing.small,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    itemWrapper: {
        width: '100%', // On mobile, each row takes 100% width
        marginBottom: woltTheme.spacing.medium,
    }
});

export default MenuSection;
