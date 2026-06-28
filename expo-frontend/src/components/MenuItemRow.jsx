import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DeleteButton from './DeleteButton';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';

// A component that displays a single food item in a list format (with an image on the side).
// It behaves differently if the user is a customer (clickable to order) or an owner (shows edit/delete buttons).
const MenuItemRow = ({ product, onClick, ownerMode = false, deleteEndpoint, onDeleteSuccess, onEdit }) => {
    // If no image is provided from the backend, use a generic tasty food fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    const imageSrc = getImageUrl(product.image, fallbackImage);

    // If we're an owner, clicking the row shouldn't open the "Add to Cart" modal.
    const Component = ownerMode ? View : TouchableOpacity;
    const clickProps = ownerMode ? {} : { onPress: () => onClick(product), activeOpacity: 0.7 };

    return (
        <Component 
            style={styles.container}
            {...clickProps}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {product.name}
                </Text>
                
                <Text style={styles.description} numberOfLines={2}>
                    {product.description || product.category}
                </Text>
                
                <View style={styles.footerRow}>
                    <Text style={styles.priceText}>
                        ₪{parseFloat(product.price).toFixed(2)}
                    </Text>
                    
                    {ownerMode && (
                        <View style={styles.ownerActions}>
                            {onEdit && (
                                <TouchableOpacity 
                                    style={styles.editButton}
                                    onPress={(e) => {
                                        // Stop propagation so clicking edit doesn't trigger the row
                                        if(e && e.stopPropagation) e.stopPropagation();
                                        onEdit(product);
                                    }}
                                >
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                            )}
                            {deleteEndpoint && (
                                <DeleteButton 
                                    endpoint={deleteEndpoint}
                                    confirmationMessage="Are you sure you want to delete this menu item?"
                                    onSuccess={onDeleteSuccess}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
            
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: imageSrc }} 
                    style={styles.image} 
                />
            </View>
        </Component>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: woltTheme.spacing.medium,
        marginBottom: woltTheme.spacing.medium,
        backgroundColor: woltTheme.colors.cardBackground,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }
        }),
    },
    contentContainer: {
        flex: 1,
        paddingRight: woltTheme.spacing.medium,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: woltTheme.colors.textMuted,
        marginBottom: woltTheme.spacing.small,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: woltTheme.colors.primary,
    },
    ownerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    editButtonText: {
        color: woltTheme.colors.text,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: 110,
        height: 110,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});

export default MenuItemRow;
