import { StyleSheet } from 'react-native';
import { woltTheme } from './woltTheme';

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woltTheme.colors.background,
    },
    listContent: {
        paddingVertical: woltTheme.spacing.large,
        paddingBottom: 100, // Provides space at the bottom for scrolling past navigation bars
    },
    headerContainer: {
        paddingHorizontal: woltTheme.spacing.large,
        marginBottom: woltTheme.spacing.extraLarge,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        letterSpacing: -1,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 18,
        color: woltTheme.colors.textMuted,
    },
    errorContainer: {
        marginTop: woltTheme.spacing.medium,
        padding: woltTheme.spacing.medium,
        backgroundColor: woltTheme.colors.dangerBackground,
        borderRadius: 16,
    },
    errorText: {
        color: woltTheme.colors.danger,
        fontWeight: 'bold',
    }
});
