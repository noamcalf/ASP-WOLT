import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { apiClient } from '../utils/apiClient';
import { useFormValidation } from '../hooks/useFormValidation';
import WoltInput from './WoltInput';
import MainButton from './MainButton';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { woltTheme } from '../styles/woltTheme';

const CUISINES = ['Italian', 'Asian', 'Fast Food', 'Vegan', 'Desserts', 'Mexican', 'Middle Eastern', 'Other'];

const RestaurantForm = ({ onSuccess, initialData = null }) => {
    const isEdit = !!initialData;
    const { styles, colors } = useThemeStyles(restaurantFormStylesFactory);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validationRules = {
        name: (val) => val.trim().length >= 2,
        cuisine: (val) => val.trim().length > 0,
        city: (val) => /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        street: (val) => /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        houseNumber: (val) => /^\d+$/.test(val.trim()),
        latitude: (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= -90 && num <= 90;
        },
        longitude: (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= -180 && num <= 180;
        },
        image: (val) => isEdit ? true : val !== null
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
        name: initialData?.name || '',
        cuisine: initialData?.cuisine || '',
        city: initialData?.address?.city || '',
        street: initialData?.address?.street || '',
        houseNumber: initialData?.address?.houseNumber?.toString() || '',
        latitude: initialData?.geolocation?.latitude?.toString() || '',
        longitude: initialData?.geolocation?.longitude?.toString() || '',
        image: null
    }, validationRules);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const file = {
                uri: asset.uri,
                type: 'image/jpeg',
                name: 'restaurant_cover.jpg'
            };
            handleFileChange('image', file);
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
            const payload = new FormData();
            
            payload.append('name', formData.name);
            payload.append('cuisine', formData.cuisine);
            
            const address = {
                city: formData.city,
                street: formData.street,
                houseNumber: formData.houseNumber
            };
            payload.append('address', JSON.stringify(address));

            const geolocation = {
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };
            payload.append('geolocation', JSON.stringify(geolocation));

            if (formData.image) {
                payload.append('image', formData.image);
            }

            const endpoint = isEdit ? `/api/restaurants/${initialData.id}` : '/api/restaurants';
            const method = isEdit ? 'PATCH' : 'POST';

            const { response, data } = await apiClient(endpoint, {
                method: method,
                body: payload
            });

            if (!response.ok) {
                throw new Error(data?.error || data?.message || 'Failed to create restaurant');
            }

            if (onSuccess) onSuccess();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            ) : null}
            
            <WoltInput 
                ref={refs.name} 
                label="Restaurant Name *" 
                name="name" 
                value={formData.name} 
                onChange={(name, text) => handleChange(name, text)} 
                isValid={hasSubmitted ? validations.name : null} 
                errorMessage="Must be at least 2 characters" 
                editable={!isLoading} 
            />

            <View style={styles.section} ref={refs.cuisine}>
                <Text style={styles.sectionLabel}>Cuisine Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                    {CUISINES.map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            style={[
                                styles.chip,
                                formData.cuisine === cuisine && styles.chipActive,
                                hasSubmitted && validations.cuisine === false && styles.chipError
                            ]}
                            onPress={() => handleChange('cuisine', cuisine)}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.chipText,
                                formData.cuisine === cuisine && styles.chipTextActive
                            ]}>{cuisine}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {hasSubmitted && validations.cuisine === false && (
                    <Text style={styles.errorLabel}>Please select a cuisine</Text>
                )}
            </View>

            <View style={styles.row}>
                <View style={styles.flex2}><WoltInput ref={refs.city} label="City *" name="city" value={formData.city} onChange={(name, text) => handleChange(name, text)} isValid={hasSubmitted ? validations.city : null} errorMessage="Invalid city" editable={!isLoading} /></View>
                <View style={styles.flex2}><WoltInput ref={refs.street} label="Street *" name="street" value={formData.street} onChange={(name, text) => handleChange(name, text)} isValid={hasSubmitted ? validations.street : null} errorMessage="Invalid street" editable={!isLoading} /></View>
                <View style={styles.flex1}><WoltInput ref={refs.houseNumber} label="No. *" name="houseNumber" value={formData.houseNumber} onChange={(name, text) => handleChange(name, text)} isValid={hasSubmitted ? validations.houseNumber : null} errorMessage="Digits" editable={!isLoading} keyboardType="numeric" /></View>
            </View>

            <View style={styles.row}>
                <View style={styles.flex1}><WoltInput ref={refs.latitude} label="Latitude *" name="latitude" placeholder="32.0853" value={formData.latitude} onChange={(name, text) => handleChange(name, text)} isValid={hasSubmitted ? validations.latitude : null} errorMessage="Between -90 and 90" editable={!isLoading} keyboardType="numeric" /></View>
                <View style={styles.flex1}><WoltInput ref={refs.longitude} label="Longitude *" name="longitude" placeholder="34.7818" value={formData.longitude} onChange={(name, text) => handleChange(name, text)} isValid={hasSubmitted ? validations.longitude : null} errorMessage="Between -180 and 180" editable={!isLoading} keyboardType="numeric" /></View>
            </View>

            <View style={styles.section} ref={refs.image}>
                <Text style={styles.sectionLabel}>Cover Image *</Text>
                <TouchableOpacity 
                    style={[styles.imageButton, hasSubmitted && validations.image === false && styles.imageButtonError]} 
                    onPress={pickImage}
                    disabled={isLoading}
                >
                    {formData.image ? (
                        <Image source={{ uri: formData.image.uri }} style={styles.imagePreview} />
                    ) : isEdit && initialData?.image ? (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>📸 Current image saved</Text>
                            <Text style={styles.imageSubText}>Tap to change</Text>
                        </View>
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>📸 Tap to choose image</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {hasSubmitted && validations.image === false && (
                    <Text style={styles.errorLabel}>An image is required</Text>
                )}
            </View>
            
            <MainButton 
                text={isEdit ? 'Save Changes' : 'Save Restaurant'} 
                onClick={handleSubmit} 
                isLoading={isLoading} 
                style={styles.submitButton}
            />
        </View>
    );
};

const restaurantFormStylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        width: '100%',
    },
    errorContainer: {
        backgroundColor: colors.dangerBackground,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.input,
        marginBottom: theme.spacing.medium,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: theme.spacing.large,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textMuted,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    errorLabel: {
        color: colors.danger,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.small,
    },
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    chipsContainer: {
        flexDirection: 'row',
        paddingBottom: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: colors.backgroundAlt,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipError: {
        borderColor: colors.danger,
        borderWidth: 1.5,
    },
    chipText: {
        color: colors.textHeading,
        fontWeight: 'bold',
    },
    chipTextActive: {
        color: '#ffffff',
    },
    imageButton: {
        height: 150,
        borderRadius: theme.borderRadius.input,
        backgroundColor: colors.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageButtonError: {
        borderColor: colors.danger,
        borderWidth: 1.5,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageSubText: {
        color: colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    submitButton: {
        marginTop: theme.spacing.medium,
    }
});

export default RestaurantForm;
