import { StyleSheet } from 'react-native';
import { woltTheme } from './woltTheme';

export const restaurantMenuStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woltTheme.colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: woltTheme.colors.background,
        padding: woltTheme.spacing.large,
    },
    errorText: {
        fontSize: 18,
        color: woltTheme.colors.danger,
        marginBottom: woltTheme.spacing.large,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: woltTheme.colors.primary,
        paddingHorizontal: woltTheme.spacing.large,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 100, // Allows user to scroll past the bottom content
    },
    headerWrapper: {
        marginBottom: woltTheme.spacing.large,
    },
    emptyStateContainer: {
        alignItems: 'center',
        padding: woltTheme.spacing.extraLarge,
        backgroundColor: woltTheme.colors.cardBackground,
        margin: woltTheme.spacing.medium,
        borderRadius: 16,
    },
    emptyStateText: {
        fontSize: 16,
        color: woltTheme.colors.textMuted,
        fontWeight: '500',
    }
});
