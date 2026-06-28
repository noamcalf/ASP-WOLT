import { StyleSheet } from 'react-native';
import { woltTheme } from './woltTheme';

// Styles specific to the Login Screen.
// Centralizing these styles here keeps the main component file clean and readable.
export const loginStyles = StyleSheet.create({
    // Main container wrapping the entire screen
    container: {
        flex: 1,
    },
    // The background image that covers the full screen
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    // A dark transparent overlay to make the white card pop out more
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    // Allows the content to be centered while remaining scrollable if the keyboard is open
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // The main white box containing the login form
    card: {
        width: '100%',
        maxWidth: 460,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    // The main title "Let's Login to WOLT!"
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: woltTheme.colors.textDark,
        letterSpacing: -0.5,
    },
    // Container for displaying login errors
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
    // The link at the bottom to navigate to the registration screen
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
