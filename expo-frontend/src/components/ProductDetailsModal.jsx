import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../context/authContext';
import { getImageUrl } from '../utils/imageUtils';
import { woltTheme } from '../styles/woltTheme';
// import RecommendationCarousel from './RecommendationCarousel'; // TODO: Enable in WOLT-248

// A pop-up window (modal) that displays the full details of a specific product.
// It allows customers to read the description and add the item to their cart.
const ProductDetailsModal = ({ product, onClose, onAddToOrder }) => {
    const { user } = useAuth();
    
    if (!product) return null;

    // Use a high-res image
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';
    const imageSrc = getImageUrl(product.image, fallbackImage);

    return (
        /* 
          1. React Native's Native <Modal>
          We use animationType="slide" so it glides smoothly up from the bottom of the screen.
          transparent={true} allows the dark overlay to show through behind the modal.
        */
        <Modal
            animationType="slide"
            transparent={true}
            visible={!!product}
            onRequestClose={onClose}
        >
            {/* The Dark Overlay (Backdrop) */}
            <TouchableOpacity 
                style={styles.overlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                {/* 
                  2. The Modal Container 
                  Using activeOpacity={1} and a TouchableOpacity here acts exactly like
                  e.stopPropagation() in the web DOM, preventing touches inside the white
                  box from closing the modal!
                */}
                <TouchableOpacity 
                    activeOpacity={1} 
                    style={styles.modalContainer}
                >
                    {/* Floating Close Button */}
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    {/* Hero Image */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageSrc }} style={styles.image} />
                    </View>

                    {/* 
                      3. Content Details
                      ScrollView handles long descriptions so the modal doesn't overflow the screen.
                    */}
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.title}>{product.name}</Text>
                        <Text style={styles.description}>{product.description}</Text>
                        
                        {/* 
                          TODO: RecommendationCarousel will be converted to Native in WOLT-248 
                          <RecommendationCarousel productId={product.id} onAddToOrder={onAddToOrder} />
                        */}
                    </ScrollView>

                    {/* Footer Action (Sticky at the bottom) - Hidden for owners */}
                    {user?.role !== 'owner' && (
                        <SafeAreaView style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.addButton}
                                onPress={() => {
                                    onAddToOrder(product);
                                    onClose();
                                }}
                            >
                                <Text style={styles.addButtonText}>Add to order</Text>
                                <Text style={styles.priceText}>₪{product.price.toFixed(2)}</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end', // Aligns modal to the bottom like Wolt
    },
    modalContainer: {
        backgroundColor: woltTheme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        maxHeight: '90%', // Don't cover the entire screen
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            }
        })
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            }
        })
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
    },
    imageContainer: {
        height: 250,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    scrollContent: {
        padding: woltTheme.spacing.large,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        marginBottom: woltTheme.spacing.small,
    },
    description: {
        fontSize: 16,
        color: woltTheme.colors.textMuted,
        lineHeight: 24,
        marginBottom: woltTheme.spacing.large,
    },
    footer: {
        padding: woltTheme.spacing.large,
        borderTopWidth: 1,
        borderTopColor: woltTheme.colors.border,
        backgroundColor: woltTheme.colors.background,
    },
    addButton: {
        backgroundColor: woltTheme.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: woltTheme.spacing.large,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    priceText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default ProductDetailsModal;
