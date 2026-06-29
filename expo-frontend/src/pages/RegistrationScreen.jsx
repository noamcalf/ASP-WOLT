import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useFormValidation } from '../hooks/useFormValidation';
import woltBg from '../assets/wolt-bg.png';
import WoltInput from '../components/WoltInput';
import MainButton from '../components/MainButton';
import { registrationStylesFactory } from '../styles/registrationScreenStyles';
import { useThemeStyles } from '../hooks/useThemeStyles';

// The sign-up page where new users can create an account.
// Refactored to React Native layout with Native Camera integration.
const RegistrationScreen = () => {
    const { styles, colors } = useThemeStyles(registrationStylesFactory);
    const navigation = useNavigation();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validationRules = {
        name: (val) => val.trim().length >= 2,
        username: (val) => /^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,}$/.test(val),
        phone: (val) => /^0\d{9}$/.test(val),
        password: (val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val),
        confirmPassword: (val, allData) => val === allData.password && val.length >= 8,
        city: (val, allData) => allData.role === 'owner' ? true : /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        street: (val, allData) => allData.role === 'owner' ? true : /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        streetNumber: (val, allData) => allData.role === 'owner' ? true : /^\d+$/.test(val.trim()),
        latitude: (val, allData) => {
            if (allData.role === 'owner') return true;
            const lat = parseFloat(val);
            return !isNaN(lat) && lat >= -90 && lat <= 90;
        },
        longitude: (val, allData) => {
            if (allData.role === 'owner') return true;
            const lng = parseFloat(val);
            return !isNaN(lng) && lng >= -180 && lng <= 180;
        },
        image: (val) => val !== null
    };

    const {
        formData,
        validations,
        hasSubmitted,
        refs,
        handleChange,
        handleFileChange,
        validateAll
    } = useFormValidation({
        name: '',
        username: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        city: '',
        street: '',
        streetNumber: '',
        latitude: '',
        longitude: '',
        image: null
    }, validationRules);

    // Function to handle the Native Camera
    const pickImage = async () => {
        // Request camera permissions explicitly from the mobile OS
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        
        if (permissionResult.granted === false) {
            setError("Camera permissions are required to take a profile picture!");
            return;
        }

        // Open the native camera interface
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1], // Square image for profile
            quality: 0.5,
        });

        if (!result.canceled) {
            // Pass the native image object to our hook
            handleFileChange('image', result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        setError('');

        if (!validateAll()) {
            setError('Please fill in all fields correctly to continue.');
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
            
            const dataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData.image) {
                    // React Native specific format for sending files via FormData
                    dataToSubmit.append('image', {
                        uri: formData.image.uri,
                        name: formData.image.fileName || 'profile.jpg',
                        type: formData.image.mimeType || 'image/jpeg'
                    });
                } else {
                    dataToSubmit.append(key, formData[key]);
                }
            });

            const response = await fetch(`${apiUrl}/api/users/`, {
                method: 'POST',
                headers: {
                    // Let the browser/fetch automatically set the multipart/form-data boundary
                    'Accept': 'application/json',
                },
                body: dataToSubmit,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Registration failed.');
            }

            navigation.navigate('Login');

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
                <View style={styles.overlay} />

                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        
                        <Text style={styles.heading}>Join WOLT! 🍔</Text>
                        <Text style={styles.subheading}>Create an account to start ordering</Text>

                        {error ? (
                            <View style={styles.errorAlert}>
                                <Text style={styles.errorAlertText}>⚠️ {error}</Text>
                            </View>
                        ) : null}
                        
                        {/* Role Selection (Native Implementation) */}
                        <View style={styles.roleContainer}>
                            <Text style={styles.sectionLabel}>I am a...</Text>
                            <View style={styles.roleButtonsRow}>
                                <TouchableOpacity 
                                    style={[styles.roleButton, formData.role === 'customer' && styles.roleButtonActive]}
                                    onPress={() => handleChange('role', 'customer')}
                                >
                                    <Text style={[styles.roleButtonText, formData.role === 'customer' && styles.roleButtonTextActive]}>
                                        Customer 🧑‍💼
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.roleButton, formData.role === 'owner' && styles.roleButtonActive]}
                                    onPress={() => handleChange('role', 'owner')}
                                >
                                    <Text style={[styles.roleButtonText, formData.role === 'owner' && styles.roleButtonTextActive]}>
                                        Owner 👨‍🍳
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <WoltInput ref={refs.name} label="Full Name 🏷️" name="name" value={formData.name} onChange={handleChange} isValid={hasSubmitted ? validations.name : null} errorMessage="Must be at least 2 characters long" disabled={isLoading} />

                        <View style={styles.row}>
                            <WoltInput ref={refs.username} containerStyle={styles.halfWidth} label="Username 👤" name="username" placeholder="Min 3 chars" value={formData.username} onChange={handleChange} isValid={hasSubmitted ? validations.username : null} errorMessage="Min 3 chars, letters/numbers" disabled={isLoading} />
                            <WoltInput ref={refs.phone} containerStyle={styles.halfWidth} label="Phone 📱" name="phone" type="phone" placeholder="050..." value={formData.phone} onChange={handleChange} isValid={hasSubmitted ? validations.phone : null} errorMessage="10-digit number" disabled={isLoading} />
                        </View>

                        <View style={styles.row}>
                            <WoltInput ref={refs.password} containerStyle={styles.halfWidth} label="Password 🔒" name="password" type="password" placeholder="Min 8 chars" value={formData.password} onChange={handleChange} isValid={hasSubmitted ? validations.password : null} errorMessage="Min 8 chars, 1 letter, 1 number" disabled={isLoading} />
                            <WoltInput ref={refs.confirmPassword} containerStyle={styles.halfWidth} label="Confirm 🔑" name="confirmPassword" type="password" placeholder="Repeat" value={formData.confirmPassword} onChange={handleChange} isValid={hasSubmitted ? validations.confirmPassword : null} errorMessage="Passwords do not match" disabled={isLoading} />
                        </View>

                        {formData.role === 'customer' && (
                            <View>
                                <View style={styles.divider} />
                                <Text style={styles.sectionLabel}>Address Details 📍</Text>
                                <View style={styles.row}>
                                    <WoltInput ref={refs.city} containerStyle={{ flex: 2 }} name="city" placeholder="City" value={formData.city} onChange={handleChange} isValid={hasSubmitted ? validations.city : null} errorMessage="Invalid" disabled={isLoading} />
                                    <WoltInput ref={refs.street} containerStyle={{ flex: 2 }} name="street" placeholder="Street" value={formData.street} onChange={handleChange} isValid={hasSubmitted ? validations.street : null} errorMessage="Invalid" disabled={isLoading} />
                                    <WoltInput ref={refs.streetNumber} containerStyle={{ flex: 1 }} name="streetNumber" placeholder="No." value={formData.streetNumber} onChange={handleChange} isValid={hasSubmitted ? validations.streetNumber : null} errorMessage="Digits" disabled={isLoading} />
                                </View>

                                <Text style={styles.sectionLabel}>Geolocation 🌍</Text>
                                <View style={styles.row}>
                                    <WoltInput ref={refs.latitude} containerStyle={styles.halfWidth} name="latitude" placeholder="Lat (X)" value={formData.latitude} onChange={handleChange} isValid={hasSubmitted ? validations.latitude : null} errorMessage="Invalid" disabled={isLoading} />
                                    <WoltInput ref={refs.longitude} containerStyle={styles.halfWidth} name="longitude" placeholder="Lng (Y)" value={formData.longitude} onChange={handleChange} isValid={hasSubmitted ? validations.longitude : null} errorMessage="Invalid" disabled={isLoading} />
                                </View>
                            </View>
                        )}

                        <View style={styles.divider} />

                        {/* Native Camera Button */}
                        <Text style={styles.sectionLabel}>Profile Picture 📸</Text>
                        <TouchableOpacity 
                            style={[styles.imageButton, validations.image === false && styles.imageButtonError]} 
                            onPress={pickImage}
                            disabled={isLoading}
                        >
                            {formData.image ? (
                                <Image source={{ uri: formData.image.uri }} style={styles.imagePreview} />
                            ) : (
                                <Text style={{ fontSize: 40 }}>📷</Text>
                            )}
                            <Text style={styles.imageButtonText}>
                                {formData.image ? 'Retake Photo' : 'Snap a Profile Picture'}
                            </Text>
                        </TouchableOpacity>

                        <MainButton text="Sign Up" onClick={handleSubmit} isLoading={isLoading} />
                        
                        <TouchableOpacity 
                            style={styles.linkContainer}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.linkText}>Already have an account? Login here.</Text>
                        </TouchableOpacity>
                        
                    </View>
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default RegistrationScreen;
