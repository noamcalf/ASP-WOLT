import { StyleSheet } from 'react-native';
import { woltTheme } from './woltTheme';

export const restaurantMenuStylesFactory = (colors, theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: woltTheme.spacing.large,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.error,
        marginBottom: woltTheme.spacing.large,
    },
    backButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        margin: woltTheme.spacing.large,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: 'bold',
    },
    menuContent: {
        paddingTop: woltTheme.spacing.extraLarge,
    }
});
