import { StyleSheet } from 'react-native';

export const profileStylesFactory = (colors, theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.backgroundAlt,
    },
    container: {
        flex: 1,
        padding: theme.spacing.medium,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.small,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...theme.shadows.light,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarFallback: {
        fontSize: 48,
    },
    infoContainer: {
        marginLeft: theme.spacing.medium,
        flex: 1,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: 4,
    },
    phoneText: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: colors.textMuted,
    },
    mainContent: {
        flex: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.medium,
        borderWidth: 1,
        borderColor: colors.border,
        ...theme.shadows.medium,
        overflow: 'hidden',
    }
});
