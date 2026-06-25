import React, { useState } from 'react';
import { apiClient } from '../utils/apiClient';

// A reusable, red "Delete" button that asks for confirmation before actually deleting something.
const DeleteButton = ({ endpoint, confirmationMessage, onSuccess, className, children }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();

        const defaultMessage = 'Are you sure you want to delete this? This action cannot be undone.';
        if (!window.confirm(confirmationMessage || defaultMessage)) {
            return;
        }

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
            alert('Error during deletion: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button 
            className={`btn btn-outline-danger fw-bold ${className || ''}`}
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
                children || 'Delete'
            )}
        </button>
    );
};

export default DeleteButton;
