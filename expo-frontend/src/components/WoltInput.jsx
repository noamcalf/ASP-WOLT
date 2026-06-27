import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { woltTheme } from '../styles/woltTheme';

// A reusable input field (like a text box) styled specifically for the Wolt theme.
// It handles labels, error messages, and even a "show password" toggle button automatically.
const WoltInput = forwardRef(({ 
    label, 
    type = "text", 
    name, 
    value, 
    onChange, 
    placeholder, 
    isValid, 
    errorMessage, 
    disabled, 
    containerStyle // Replaces colClass for React Native
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPasswordType = type === "password";
    const secureTextEntry = isPasswordType && !showPassword;

    // We pass both name and text to onChange to support our unified useFormValidation hook
    const handleChangeText = (text) => {
        if (onChange) {
            onChange(name, text);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={styles.label}>
                    {label.toUpperCase()}
                </Text>
            )}
            <View style={styles.inputContainer}>
                <TextInput 
                    ref={ref}
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused,
                        isValid === true && styles.inputValid,
                        isValid === false && styles.inputInvalid,
                        isPasswordType && styles.inputWithIcon,
                        disabled && styles.inputDisabled
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={woltTheme.colors.textMuted}
                    value={value} 
                    onChangeText={handleChangeText} 
                    secureTextEntry={secureTextEntry}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    // Translate common HTML types to Native keyboards
                    keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
                    autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'sentences'}
                />
                
                {/* If this is a password field, show a toggle button to reveal/hide the password */}
                {isPasswordType && (
                    <TouchableOpacity 
                        style={styles.eyeIcon} 
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={{ fontSize: 16 }}>{showPassword ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {isValid === false && errorMessage ? (
                <Text style={styles.errorText}>
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginBottom: woltTheme.spacing.medium,
        width: '100%',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: woltTheme.spacing.small,
        color: woltTheme.colors.textLabel,
        fontSize: 12,
        letterSpacing: 1,
        paddingHorizontal: 4,
    },
    inputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        ...woltTheme.components.input,
        width: '100%',
    },
    inputWithIcon: {
        paddingRight: 45, // Make room for eye icon
    },
    inputFocused: {
        borderColor: woltTheme.colors.primary,
        ...woltTheme.shadows.focus,
    },
    inputValid: {
        borderColor: woltTheme.colors.success,
        backgroundColor: woltTheme.colors.successBackground,
    },
    inputInvalid: {
        borderColor: woltTheme.colors.danger,
        backgroundColor: woltTheme.colors.dangerBackground,
    },
    inputDisabled: {
        opacity: 0.7,
        backgroundColor: woltTheme.colors.border,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        padding: 5,
        zIndex: 5,
    },
    errorText: {
        color: woltTheme.colors.danger,
        marginTop: 4,
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
    }
});

export default WoltInput;
