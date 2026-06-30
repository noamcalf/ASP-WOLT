import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { apiClient } from '../utils/apiClient';
import { useFormValidation } from '../hooks/useFormValidation';
import WoltInput from './WoltInput';
import MainButton from './MainButton';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { woltTheme } from '../styles/woltTheme';

const CATEGORIES = ['Appetizers', 'Mains', 'Sides', 'Desserts', 'Drinks'];

const MenuItemForm = ({ restaurantId, onSuccess, initialData = null }) => {
    const isEdit = !!initialData;
    const { styles, colors } = useThemeStyles(menuItemFormStylesFactory);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validationRules = {
        name: (val) => val.trim().length >= 2,
        category: (val) => val.trim().length > 0,
        price: (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        },
        description: (val) => true,
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
        category: initialData?.category || '',
        price: initialData?.price?.toString() || '',
        description: initialData?.description || '',
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
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const file = {
                uri: asset.uri,
                type: 'image/jpeg',
                name: 'menu_item.jpg'
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
            payload.append('category', formData.category);
            payload.append('price', formData.price);
            payload.append('description', formData.description);

            if (formData.image) {
                if (Platform.OS === 'web') {
                    const res = await fetch(formData.image.uri);
                    const blob = await res.blob();
                    payload.append('image', blob, formData.image.name || 'menu_item.jpg');
                } else {
                    payload.append('image', formData.image);
                }
            }

            const endpoint = isEdit ? `/api/restaurants/${restaurantId}/products/${initialData.id}` : `/api/restaurants/${restaurantId}/products`;
            const method = isEdit ? 'PATCH' : 'POST';

            const { response, data } = await apiClient(endpoint, {
                method: method,
                body: payload
            });

            if (!response.ok) {
                throw new Error(data?.error || data?.message || 'Failed to save menu item');
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
            
            <View style={styles.row}>
                <View style={styles.flex2}>
                    <WoltInput 
                        ref={refs.name} 
                        label="Item Name *" 
                        name="name" 
                        value={formData.name} 
                        onChange={(name, text) => handleChange(name, text)} 
                        isValid={hasSubmitted ? validations.name : null} 
                        errorMessage="Must be at least 2 characters" 
                        editable={!isLoading} 
                    />
                </View>
                <View style={styles.flex1}>
                    <WoltInput 
                        ref={refs.price} 
                        label="Price (₪) *" 
                        name="price" 
                        placeholder="e.g. 15.50"
                        value={formData.price} 
                        onChange={(name, text) => handleChange(name, text)} 
                        isValid={hasSubmitted ? validations.price : null} 
                        errorMessage="Positive number" 
                        editable={!isLoading} 
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.section} ref={refs.category}>
                <Text style={styles.sectionLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.chip,
                                formData.category === category && styles.chipActive,
                                hasSubmitted && validations.category === false && styles.chipError
                            ]}
                            onPress={() => handleChange('category', category)}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.chipText,
                                formData.category === category && styles.chipTextActive
                            ]}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {hasSubmitted && validations.category === false && (
                    <Text style={styles.errorLabel}>Please select a category</Text>
                )}
            </View>

            <View style={styles.section}>
                <WoltInput 
                    ref={refs.description} 
                    label="Description (Optional)" 
                    name="description" 
                    placeholder="Describe the item..."
                    value={formData.description} 
                    onChange={(name, text) => handleChange(name, text)} 
                    isValid={hasSubmitted && formData.description ? true : null} 
                    editable={!isLoading} 
                    multiline={true}
                    numberOfLines={3}
                />
            </View>

            <View style={styles.section} ref={refs.image}>
                <Text style={styles.sectionLabel}>Item Image *</Text>
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
                text={isEdit ? 'Save Changes' : 'Add Menu Item'} 
                onClick={handleSubmit} 
                isLoading={isLoading} 
                style={styles.submitButton}
            />
        </View>
    );
};

const menuItemFormStylesFactory = (colors, theme) => StyleSheet.create({
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
        marginBottom: theme.spacing.medium,
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
        marginBottom: theme.spacing.small,
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
        height: 120,
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
        marginTop: theme.spacing.small,
    }
});

export default MenuItemForm;
