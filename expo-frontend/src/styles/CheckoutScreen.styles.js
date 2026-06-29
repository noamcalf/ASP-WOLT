import { StyleSheet, Platform } from 'react-native';
import { woltTheme } from './woltTheme';

export const checkoutStylesFactory = (colors, theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: woltTheme.spacing.large,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    sectionContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }
        }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    fieldGroup: {
        marginBottom: 0,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textMuted,
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    fieldContentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconText: {
        fontSize: 20,
        marginRight: 12,
    },
    fieldValueContainer: {
        flex: 1,
    },
    fieldValuePrimary: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 2,
    },
    fieldValueSecondary: {
        fontSize: 13,
        color: colors.textMuted,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 12,
    },
    orderSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 16,
    },
    restaurantName: {
        fontWeight: 'bold',
        color: colors.text,
    },
    orderItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: woltTheme.spacing.medium,
    },
    orderItemLeft: {
        flexDirection: 'row',
        flex: 1,
        paddingRight: woltTheme.spacing.medium,
    },
    orderItemQty: {
        fontWeight: 'bold',
        marginRight: woltTheme.spacing.small,
        color: colors.text,
    },
    orderItemName: {
        color: colors.text,
    },
    orderItemPrice: {
        fontWeight: '600',
        color: colors.text,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMuted,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    placeOrderButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    placeOrderButtonDisabled: {
        backgroundColor: colors.primaryLight,
    },
    placeOrderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});
