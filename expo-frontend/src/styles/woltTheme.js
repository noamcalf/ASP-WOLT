export const woltTheme = {
    colors: {
        primary: '#009de0',
        primaryHover: '#007cb2',
        success: '#10b981',
        successBackground: '#f0fdf4',
        danger: '#ef4444',
        dangerHover: '#dc2626',
        dangerBackground: '#fef2f2',
        border: '#e2e8f0',
        background: '#ffffff',
        backgroundAlt: '#f8fafc',
        backgroundHover: '#f8f9fa',
        textHeading: '#202125',
        text: '#202125',
        textMuted: '#6c757d',
        textLabel: '#3a3c42',
        cardBackground: '#ffffff',
        white: '#ffffff',
        black: '#000000',
        dark: {
            background: '#212529',
            backgroundAlt: '#343a40',
            backgroundHover: '#343a40',
            cardBackground: '#2b3035',
            border: '#495057',
            textHeading: '#f8f9fa',
            text: '#f8f9fa',
            textMuted: '#adb5bd',
            textLabel: '#f8f9fa',
            searchBackground: '#2b3035',
            searchFocus: '#1a1d20',
            successBackground: '#064e3b',
            dangerBackground: '#450a0a'
        }
    },
    spacing: {
        xs: 4,
        small: 8,
        medium: 16,
        large: 24,
        xl: 32
    },
    borderRadius: {
        input: 14,
        button: 14,
        card: 12,
        circle: 9999
    },
    shadows: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3 // Android shadow
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 5
        },
        heavy: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.2,
            shadowRadius: 50,
            elevation: 10
        },
        focus: {
            shadowColor: '#009de0',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 2
        }
    },
    // Common component styles translated from CSS classes
    components: {
        input: {
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
            backgroundColor: '#ffffff',
            borderRadius: 14,
            fontSize: 16,
            padding: 15,
            color: '#202125'
        },
        button: {
            backgroundColor: '#009de0',
            borderRadius: 14,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center'
        },
        buttonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600'
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 5
        },
        centeredContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
};

export const getColors = (theme) => {
    if (theme === 'dark') {
        return {
            ...woltTheme.colors,
            ...woltTheme.colors.dark,
        };
    }
    return woltTheme.colors;
};
