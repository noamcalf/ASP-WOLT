import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiClient } from '../utils/apiClient';
import MenuItemForm from '../components/MenuItemForm';
import MenuItemRow from '../components/MenuItemRow';
import DeleteButton from '../components/DeleteButton';
import RestaurantForm from '../components/RestaurantForm';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { ownerMenuManagerStylesFactory } from '../styles/OwnerMenuManagerStyles';

// The page where a restaurant owner manages a specific restaurant's menu.
const OwnerMenuManagerScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { restaurantId } = route.params || {};
    
    const { styles, colors } = useThemeStyles(ownerMenuManagerStylesFactory);
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditRestaurantForm, setShowEditRestaurantForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { response: restRes, data: restData } = await apiClient(`/api/restaurants/${restaurantId}`);
            if (!restRes.ok) throw new Error(restData?.error || 'Failed to fetch restaurant');
            setRestaurant(restData);

            const { response: itemsRes, data: itemsData } = await apiClient(`/api/restaurants/${restaurantId}/products`);
            if (!itemsRes.ok) throw new Error(itemsData?.error || 'Failed to fetch menu items');
            setMenuItems(itemsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (restaurantId) {
            fetchData();
        }
    }, [restaurantId]);

    const handleItemCreated = () => {
        setShowCreateForm(false);
        fetchData();
    };

    const handleItemEdited = () => {
        setEditingItem(null);
        fetchData();
    };

    const handleRestaurantEdited = () => {
        setShowEditRestaurantForm(false);
        fetchData();
    };

    const renderHeader = () => (
        <View>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerRow}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{restaurant?.name} - Menu</Text>
                    <Text style={styles.subtitle}>Manage your dishes and catalog items</Text>
                </View>
                <View style={styles.headerButtonsContainer}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity 
                            style={styles.editRestaurantButton}
                            onPress={() => setShowEditRestaurantForm(!showEditRestaurantForm)}
                        >
                            <Text style={styles.editRestaurantButtonText}>
                                {showEditRestaurantForm ? 'Cancel' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                        
                        <DeleteButton 
                            endpoint={`/api/restaurants/${restaurantId}`}
                            confirmationMessage="Are you absolutely sure you want to delete this ENTIRE restaurant? This action cannot be undone!"
                            onSuccess={() => navigation.goBack()}
                            style={styles.deleteRestaurantButton}
                        >
                            <Text style={styles.deleteRestaurantButtonText}>Delete</Text>
                        </DeleteButton>
                    </View>

                    <TouchableOpacity 
                        style={[styles.addItemButton, showCreateForm && styles.cancelButton]}
                        onPress={() => setShowCreateForm(!showCreateForm)}
                    >
                        <Text style={[styles.addItemButtonText, showCreateForm && styles.cancelButtonText]}>
                            {showCreateForm ? 'Cancel' : '+ Add Item'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showEditRestaurantForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Edit Restaurant Details</Text>
                    <RestaurantForm initialData={restaurant} onSuccess={handleRestaurantEdited} />
                </View>
            )}

            {showCreateForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Create New Item</Text>
                    <MenuItemForm restaurantId={restaurantId} onSuccess={handleItemCreated} />
                </View>
            )}

            {editingItem && (
                <View style={styles.formContainer}>
                    <TouchableOpacity 
                        style={styles.closeFormButton} 
                        onPress={() => setEditingItem(null)}
                    >
                        <Text style={styles.closeFormText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.formTitle}>Edit Menu Item</Text>
                    <MenuItemForm restaurantId={restaurantId} initialData={editingItem} onSuccess={handleItemEdited} />
                </View>
            )}

            <Text style={styles.sectionTitle}>Current Menu</Text>
        </View>
    );

    const renderEmpty = () => {
        if (isLoading && !restaurant) return null; // Handled in main render
        
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🍔</Text>
                <Text style={styles.emptyTitle}>Your menu is empty.</Text>
                <Text style={styles.emptyDesc}>Click the button above to add your first dish!</Text>
            </View>
        );
    };

    if (isLoading && !restaurant) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (error && !restaurant) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ Error: {error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList
                    data={menuItems}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmpty}
                    renderItem={({ item }) => (
                        <MenuItemRow 
                            product={item} 
                            ownerMode={true} 
                            deleteEndpoint={`/api/restaurants/${restaurantId}/products/${item.id}`}
                            onDeleteSuccess={fetchData} 
                            onEdit={setEditingItem}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default OwnerMenuManagerScreen;
