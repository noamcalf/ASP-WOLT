import { StyleSheet } from 'react-native';

export const ownerDashboardStylesFactory = (colors, theme) => StyleSheet.create({
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: theme.spacing.medium,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButton: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.textHeading,
    },
    errorContainer: {
        backgroundColor: colors.dangerBackground,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.card,
        marginBottom: theme.spacing.large,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontWeight: 'bold',
    },
    formContainer: {
        backgroundColor: colors.cardBackground,
        padding: theme.spacing.large,
        borderRadius: theme.borderRadius.card,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...theme.shadows.light,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: theme.spacing.large,
    },
    loadingContainer: {
        paddingVertical: theme.spacing.xl * 2,
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        backgroundColor: colors.cardBackground,
        borderRadius: theme.borderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: theme.spacing.large,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: theme.spacing.medium,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: theme.spacing.small,
    },
    emptyDesc: {
        color: colors.textMuted,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: theme.spacing.xl * 2,
    }
});
