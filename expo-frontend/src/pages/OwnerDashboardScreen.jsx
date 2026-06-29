import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../utils/apiClient';
import { useAuth } from '../context/authContext';
import RestaurantForm from '../components/RestaurantForm';
import RestaurantCard from '../components/RestaurantCard';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { ownerDashboardStylesFactory } from '../styles/OwnerDashboardStyles';

// The main dashboard for restaurant owners.
// It shows a list of all their restaurants and allows them to create new ones.
const OwnerDashboardScreen = () => {
    const { user } = useAuth();
    const { styles, colors } = useThemeStyles(ownerDashboardStylesFactory);
    const [myRestaurants, setMyRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchMyRestaurants = async () => {
        setIsLoading(true);
        try {
            const { response, data } = await apiClient('/api/restaurants');
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to fetch restaurants');
            }
            
            // Filter only restaurants owned by the connected owner
            const owned = data.filter(r => r.ownerId === user.id);
            setMyRestaurants(owned);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchMyRestaurants();
        }
    }, [user]);

    const handleRestaurantCreated = () => {
        setShowCreateForm(false);
        fetchMyRestaurants(); // Refresh the list
    };

    const renderHeader = () => (
        <View>
            <View style={styles.headerRow}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>My Restaurants</Text>
                    <Text style={styles.subtitle}>Manage your restaurants and menus</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.addButton, showCreateForm && styles.cancelButton]}
                    onPress={() => setShowCreateForm(!showCreateForm)}
                >
                    <Text style={[styles.addButtonText, showCreateForm && styles.cancelButtonText]}>
                        {showCreateForm ? 'Cancel' : '+ Add New'}
                    </Text>
                </TouchableOpacity>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ Error: {error}</Text>
                </View>
            )}

            {showCreateForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Create New Restaurant</Text>
                    <RestaurantForm onSuccess={handleRestaurantCreated} />
                </View>
            )}
        </View>
    );

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🏪</Text>
                <Text style={styles.emptyTitle}>No restaurants yet</Text>
                <Text style={styles.emptyDesc}>Click the button above to create your first restaurant.</Text>
            </View>
        );
    };

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList
                    data={myRestaurants}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmpty}
                    renderItem={({ item }) => (
                        <RestaurantCard 
                            restaurant={item} 
                            ownerMode={true} 
                            onDelete={fetchMyRestaurants} 
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default OwnerDashboardScreen;
