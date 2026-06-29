import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { woltTheme } from '../styles/woltTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

const MainButton = ({
    const { styles, colors } = useThemeStyles(stylesFactory); text, loadingText = "Loading... ⏳", isLoading, type = "submit", onClick, disabled }) => {
    return (
        // Native version for the button tag
        <TouchableOpacity 
            style={[
                styles.button,
                (isLoading || disabled) && styles.buttonDisabled
            ]}
            onPress={onClick}
            disabled={isLoading || disabled}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.loadingText}>{loadingText}</Text>
                </View>
            ) : (
                <Text style={styles.text}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    button: {
        ...woltTheme.components.button,
        marginTop: woltTheme.spacing.small,
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: '#a0dbf5',
    },
    text: {
        ...woltTheme.components.buttonText,
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    }
});

export default MainButton;
