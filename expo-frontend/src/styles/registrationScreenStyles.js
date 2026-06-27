import { StyleSheet } from 'react-native';
import { woltTheme } from './woltTheme';

// Styles specific to the Registration Screen.
// This handles the layout for the complex registration form, including role selection and camera input.
export const registrationStyles = StyleSheet.create({
    // Main container wrapping the entire screen
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    // Darker overlay so the form is easy to read against the background
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // The main white card. Wider than the login card to accommodate side-by-side inputs
    card: {
        width: '100%',
        maxWidth: 650,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: woltTheme.colors.textDark,
        letterSpacing: -0.5,
    },
    subheading: {
        textAlign: 'center',
        color: woltTheme.colors.textMuted,
        marginBottom: 24,
        fontSize: 15,
    },
    // Validation error banner
    errorAlert: {
        backgroundColor: '#ffebee',
        borderRadius: 14,
        padding: 15,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorAlertText: {
        color: '#c62828',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Small uppercase titles above form sections (e.g. "I AM A...", "ADDRESS DETAILS")
    sectionLabel: {
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
        color: woltTheme.colors.textLabel,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    // --- Role Selection Buttons (Customer vs Owner) ---
    roleContainer: {
        borderWidth: 1,
        borderColor: woltTheme.colors.border,
        borderRadius: 14,
        padding: 15,
        marginBottom: 20,
    },
    roleButtonsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1.5,
        borderColor: woltTheme.colors.border,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: woltTheme.colors.backgroundAlt,
    },
    roleButtonActive: {
        borderColor: woltTheme.colors.primary,
        backgroundColor: '#e6f5fb',
    },
    roleButtonText: {
        fontWeight: '600',
        color: woltTheme.colors.textMuted,
    },
    roleButtonTextActive: {
        color: woltTheme.colors.primary,
    },
    // Horizontal separator line between form sections
    divider: {
        height: 1,
        backgroundColor: woltTheme.colors.border,
        marginVertical: 20,
    },
    // Places two inputs side-by-side
    row: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    halfWidth: {
        flex: 1,
    },
    // --- Camera & Profile Picture ---
    imageButton: {
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    imageButtonError: {
        borderColor: woltTheme.colors.danger,
        backgroundColor: woltTheme.colors.dangerBackground,
    },
    imageButtonText: {
        color: woltTheme.colors.primary,
        fontWeight: '600',
        fontSize: 16,
        marginTop: 8,
    },
    // The small circular preview of the captured photo
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    // Navigation link to Login Screen
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: woltTheme.colors.primary,
        fontWeight: '600',
        fontSize: 15,
    }
});
