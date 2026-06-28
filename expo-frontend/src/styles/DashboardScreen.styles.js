import { StyleSheet } from 'react-native';
import { woltTheme } from './woltTheme';

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: woltTheme.colors.background,
    },
    scrollContent: {
        paddingTop: woltTheme.spacing.extraLarge * 1.2,
        paddingBottom: woltTheme.spacing.large,
    },
    headerContainer: {
        paddingHorizontal: woltTheme.spacing.large,
        marginBottom: woltTheme.spacing.extraLarge,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: woltTheme.colors.text,
        letterSpacing: -1,
        marginBottom: woltTheme.spacing.small,
    },
    headerSubtitle: {
        fontSize: 18,
        color: woltTheme.colors.textMuted,
    },
    errorContainer: {
        marginHorizontal: woltTheme.spacing.large,
        marginBottom: woltTheme.spacing.large,
        padding: woltTheme.spacing.medium,
        backgroundColor: '#f8d7da',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: '#721c24',
        fontWeight: 'bold',
    }
});
