import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext'; 
import { useFormValidation } from '../hooks/useFormValidation';
import { apiClient } from '../utils/apiClient';
import woltBg from '../assets/wolt-bg.png';
import WoltInput from '../components/WoltInput';
import MainButton from '../components/MainButton';
import { loginStylesFactory } from '../styles/loginScreenStyles';
import { useThemeStyles } from '../hooks/useThemeStyles';

// The page where users log into their accounts.
// Refactored to React Native layout.
const LoginScreen = () => {
    const { styles, colors } = useThemeStyles(loginStylesFactory);
    const navigation = useNavigation();
    const { login } = useAuth(); 
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validationRules = {
        username: (val) => val.trim().length > 0,
        password: (val) => val.trim().length > 0
    };

    const {
        formData,
        validations,
        hasSubmitted,
        refs,
        handleChange,
        validateAll
    } = useFormValidation({ username: '', password: '' }, validationRules);

    // This function handles the login process when the user submits the form.
    const handleSubmit = async () => {
        setError('');

        if (!validateAll()) {
            setError('Please fill in all fields correctly to continue.');
            return;
        }

        setIsLoading(true);

        try {
            const { response, data } = await apiClient('/api/tokens/', {
                method: 'POST',
                body: { 
                    username: formData.username, 
                    password: formData.password 
                },
            });

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Login failed. Invalid credentials.');
            }

            login(data.token); 
            // Navigate to Dashboard upon successful login
            navigation.replace('Dashboard');

        } catch (err) {
            setError(err.message || 'Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground source={woltBg} style={styles.backgroundImage}>
                {/* Dark overlay for better readability */}
                <View style={styles.overlay} />

                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        
                        <Text style={styles.heading}>Let's Login to WOLT!</Text>

                        {error ? (
                            <View style={styles.errorAlert}>
                                <Text style={styles.errorAlertText}>⚠️ {error}</Text>
                            </View>
                        ) : null}
                        
                        <WoltInput 
                            ref={refs.username} 
                            label="Username 👤" 
                            name="username" 
                            placeholder="Enter your username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            isValid={hasSubmitted ? validations.username : null} 
                            disabled={isLoading} 
                        />

                        <WoltInput 
                            ref={refs.password} 
                            label="Password 🔒" 
                            name="password" 
                            type="password" 
                            placeholder="Enter your password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            isValid={hasSubmitted ? validations.password : null} 
                            disabled={isLoading} 
                        />

                        <MainButton 
                            text="Login" 
                            onClick={handleSubmit} 
                            isLoading={isLoading} 
                        />
                        
                        <TouchableOpacity 
                            style={styles.linkContainer}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.linkText}>New user? Sign up here!</Text>
                        </TouchableOpacity>
                        
                    </View>
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;