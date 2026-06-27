import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { apiClient } from '../utils/apiClient';
import { woltTheme } from '../styles/woltTheme';

// A reusable, red "Delete" button that asks for confirmation before actually deleting something.
const DeleteButton = ({ endpoint, confirmationMessage, onSuccess, style, children }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const performDelete = async () => {
        // Change the state's value
        setIsDeleting(true);
        try {
            const { response, data } = await apiClient(endpoint, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to delete');
            }
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            Alert.alert('Error', 'Error during deletion: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDelete = (e) => {
        // Prevent default navigation if wrapped in a link (mostly for web)
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();

        const defaultMessage = 'Are you sure you want to delete this? This action cannot be undone.';
        
        // This unified Alert works on Mobile, and automatically translates to window.confirm on Web
        Alert.alert(
            'Confirm Deletion',
            confirmationMessage || defaultMessage,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: performDelete,
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <TouchableOpacity 
            style={[styles.button, style]}
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.7}
        >
            {isDeleting ? (
                <ActivityIndicator size="small" color={woltTheme.colors.danger} />
            ) : (
                <Text style={styles.text}>
                    {children || 'Delete'}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 1.5,
        borderColor: woltTheme.colors.danger,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        color: woltTheme.colors.danger,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default DeleteButton;
