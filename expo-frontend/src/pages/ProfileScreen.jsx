import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderHistory from '../components/OrderHistory';
import { useAuth } from '../context/authContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { profileStylesFactory } from '../styles/ProfileScreenStyles';

const ProfileScreen = () => {
    const { user } = useAuth();
    const { styles, colors } = useThemeStyles(profileStylesFactory);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Profile Header section */}
                <View style={styles.headerRow}>
                    <View style={styles.avatarContainer}>
                        {user?.image ? (
                            <Image 
                                source={{ uri: `${apiUrl}/${user.image.replace(/\\/g, '/')}` }} 
                                style={styles.avatarImage} 
                            />
                        ) : (
                            <Text style={styles.avatarFallback}>👤</Text>
                        )}
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.nameText}>
                            {user ? user.name || user.username : 'My Profile'}
                        </Text>
                        <Text style={styles.phoneText}>
                            {user ? `📞 ${user.phoneNumber}` : 'Welcome back!'}
                        </Text>
                        {user?.address && (
                            <Text style={styles.addressText}>
                                📍 {user.address.street} {user.address.houseNumber}, {user.address.city}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Main Content Area */}
                <View style={styles.mainContent}>
                    {/* Mount the Order History component */}
                    <OrderHistory />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;
