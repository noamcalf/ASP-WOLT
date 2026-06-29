import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStyles } from '../hooks/useThemeStyles';

/**
 * BaseModal
 * A reusable component that provides a consistent bottom-sheet modal 
 * experience across the app with a dark backdrop, rounded corners, and safe area insets.
 * 
 * @param {boolean} visible - Whether the modal is visible
 * @param {function} onClose - Callback when the modal requests to close (backdrop tap, back button)
 * @param {React.ReactNode} children - The content inside the modal container
 */
const BaseModal = ({ visible = true, onClose, children }) => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const insets = useSafeAreaInsets();

    return (
        <Modal 
            visible={visible} 
            transparent={true} 
            animationType="slide" 
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdropTouchable} />
                </TouchableWithoutFeedback>
                
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom || 20 }]}>
                    {children}
                </View>
            </View>
        </Modal>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    backdropTouchable: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        backgroundColor: colors.background || colors.cardBackground,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        minHeight: '50%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    }
});

export default BaseModal;
