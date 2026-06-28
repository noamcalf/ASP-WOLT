import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DeleteButton from './DeleteButton';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';

const MenuItemRow = ({ product, onClick, ownerMode = false, deleteEndpoint, onDeleteSuccess, onEdit }) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    const imageSrc = getImageUrl(product.image, fallbackImage);

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={!ownerMode ? () => onClick(product) : undefined}
            activeOpacity={ownerMode ? 1 : 0.7}
        >
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {product.description || product.category}
                </Text>
                
                <View style={styles.footerRow}>
                    <Text style={styles.price}>
                        ₪{parseFloat(product.price).toFixed(2)}
                    </Text>
                    {ownerMode && (
                        <View style={styles.ownerActions}>
                            {onEdit && (
                                <TouchableOpacity 
                                    style={styles.editButton}
                                    onPress={(e) => {
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
                                    style={styles.deleteButton}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
            
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageSrc }} style={styles.image} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: woltTheme.spacing.medium,
        marginBottom: woltTheme.spacing.medium,
        backgroundColor: woltTheme.colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        marginHorizontal: woltTheme.spacing.small,
        ...woltTheme.shadows.light,
    },
    content: {
        flex: 1,
        paddingRight: woltTheme.spacing.medium,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: woltTheme.colors.textMuted,
        marginBottom: 8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: woltTheme.colors.primary,
    },
    ownerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
    },
    editButtonText: {
        fontSize: 12,
        color: woltTheme.colors.text,
    },
    deleteButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    imageContainer: {
        width: 110,
        height: 110,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'cover',
    }
});

export default MenuItemRow;
