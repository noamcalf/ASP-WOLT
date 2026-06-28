import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { ThemeContext } from '../context/themeContext';
import { useNavigation } from '@react-navigation/native';
import { woltTheme } from '../styles/woltTheme';

const NativeHeader = (props) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsProfileMenuOpen(false);
        logout();
    };

    const handleProfileClick = () => {
        setIsProfileMenuOpen(false);
        navigation.navigate('Profile');
    };

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                {/* Logo Section */}
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.brand}>WOLT-ASP</Text>
                </TouchableOpacity>

                {/* Right Side Actions */}
                <View style={styles.rightSection}>
                    {/* Dark Mode Toggle */}
                    <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
                        <Text style={styles.iconText}>{theme === 'light' ? '🌙' : '☀️'}</Text>
                    </TouchableOpacity>

                    {/* Cart Toggle Button - Hidden for Restaurant Owners */}
                    {user?.role !== 'owner' && (
                        <TouchableOpacity 
                            style={styles.iconButton} 
                            onPress={() => {
                                setIsProfileMenuOpen(false);
                                navigation.toggleDrawer();
                            }}
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
                            <TouchableOpacity 
                                style={styles.iconButton} 
                                onPress={() => setIsProfileMenuOpen(true)}
                            >
                                <Text style={styles.iconText}>👤</Text>
                            </TouchableOpacity>

                            {/* Dropdown Menu Modal */}
                            <Modal visible={isProfileMenuOpen} transparent={true} animationType="fade">
                                <TouchableOpacity 
                                    style={styles.modalOverlay} 
                                    activeOpacity={1} 
                                    onPress={() => setIsProfileMenuOpen(false)}
                                >
                                    <View style={[styles.dropdownMenu, { top: insets.top + 55 }]}>
                                        <TouchableOpacity style={styles.dropdownItem} onPress={handleProfileClick}>
                                            <Text style={styles.dropdownText}>Profile</Text>
                                        </TouchableOpacity>
                                        <View style={styles.divider} />
                                        <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                                            <Text style={[styles.dropdownText, { color: woltTheme.colors.danger }]}>Sign Out</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Modal>
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
        zIndex: 999, // Ensure dropdown stays on top of content
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: woltTheme.spacing.large,
        paddingVertical: 12,
        zIndex: 999,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brand: {
        fontSize: 22,
        fontWeight: '900',
        color: woltTheme.colors.primary, 
        letterSpacing: -0.5,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        borderRadius: 12,
        position: 'relative',
        backgroundColor: woltTheme.colors.backgroundAlt,
    },
    iconText: {
        fontSize: 16,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: woltTheme.colors.danger,
        borderRadius: 12,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: woltTheme.colors.background,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 4,
    },
    loginButton: {
        backgroundColor: woltTheme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    dropdownMenu: {
        position: 'absolute',
        right: woltTheme.spacing.large,
        backgroundColor: woltTheme.colors.background,
        borderRadius: 12,
        padding: 8,
        width: 140,
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: woltTheme.colors.border,
        marginVertical: 4,
    }
});

export default NativeHeader;
