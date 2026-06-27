import React, { useContext } from 'react';
import { Switch, View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/themeContext';
import { woltTheme } from '../styles/woltTheme';

// ThemeToggle is an interactive component that allows users to switch between light and dark modes.
// It uses React Native's native Switch component for a cross-platform toggle experience.
const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    const isDark = theme === 'dark';

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{isDark ? '🌙' : '☀️'}</Text>
            <Switch
                trackColor={{ false: woltTheme.colors.border, true: woltTheme.colors.primary }}
                thumbColor={isDark ? '#ffffff' : '#ffffff'}
                ios_backgroundColor={woltTheme.colors.border}
                onValueChange={toggleTheme}
                value={isDark}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        backgroundColor: woltTheme.colors.backgroundAlt,
        ...woltTheme.shadows.light,
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    }
});

export default ThemeToggle;
