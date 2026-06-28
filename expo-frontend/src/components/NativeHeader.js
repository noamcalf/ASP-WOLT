import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { woltTheme } from '../styles/woltTheme';

const NativeHeader = (props) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigation = useNavigation();

    // Call logout function we already created in authContext
    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Logo Section */}
                <View style={styles.leftSection}>
                    <Text style={styles.brand}>WOLT-ASP</Text>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Dashboard')}>
                        <Text style={styles.iconText}>🏠</Text>
                    </TouchableOpacity>
                </View>

                {/* Right Side Actions */}
                <View style={styles.rightSection}>
                    {/* Cart Toggle Button - Hidden for Restaurant Owners */}
                    {user?.role !== 'owner' && (
                        <TouchableOpacity 
                            style={styles.iconButton} 
                            onPress={() => navigation.toggleDrawer()}
                        >
                            <Text style={styles.iconText}>🛒</Text>
                            {totalItems > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{totalItems}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    {isAuthenticated ? (
                        <>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Profile')}>
                                <Text style={styles.iconText}>👤</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Log in</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: woltTheme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: woltTheme.colors.border,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brand: {
        fontSize: 20,
        fontWeight: 'bold',
        color: woltTheme.colors.primary, 
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        borderRadius: 8,
        position: 'relative',
    },
    iconText: {
        fontSize: 16,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: woltTheme.colors.error,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: woltTheme.colors.primary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        paddingHorizontal: 10,
    },
    logoutText: {
        color: woltTheme.colors.error,
        fontWeight: 'bold',
    }
});

export default NativeHeader;
