import { StyleSheet } from 'react-native';

export const ownerMenuManagerStylesFactory = (colors, theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.backgroundAlt,
    },
    container: {
        flex: 1,
        padding: theme.spacing.medium,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: colors.dangerBackground,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.card,
        borderWidth: 1,
        borderColor: colors.danger,
        margin: theme.spacing.medium,
    },
    errorText: {
        color: colors.danger,
        fontWeight: 'bold',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: theme.spacing.medium,
        ...theme.shadows.light,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textHeading,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xl,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: theme.spacing.medium,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
    },
    headerButtonsContainer: {
        alignItems: 'flex-end',
        gap: theme.spacing.small,
        minWidth: 120,
    },
    editRestaurantButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.backgroundHover,
    },
    editRestaurantButtonText: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    deleteRestaurantButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.danger,
        backgroundColor: 'transparent',
    },
    deleteRestaurantButtonText: {
        fontWeight: 'bold',
        color: colors.danger,
    },
    addItemButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
    },
    addItemButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.textHeading,
    },
    formContainer: {
        backgroundColor: colors.cardBackground,
        padding: theme.spacing.large,
        borderRadius: theme.borderRadius.card,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
        ...theme.shadows.light,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: theme.spacing.large,
    },
    closeFormButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 4,
    },
    closeFormText: {
        fontSize: 18,
        color: colors.textMuted,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textHeading,
        marginBottom: theme.spacing.medium,
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
