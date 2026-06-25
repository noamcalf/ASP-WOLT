import React, { useState } from 'react';
import { apiClient } from '../utils/apiClient';
import { useFormValidation } from '../hooks/useFormValidation';
import WoltInput from './WoltInput';

// A form used by restaurant owners to either add a new item or edit an existing one.
const MenuItemForm = ({ restaurantId, onSuccess, initialData = null }) => {
    // Determine if we are creating a new item or editing an existing one
    const isEdit = !!initialData;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validation rules for each field
    // When editing, the image is optional (if left empty, backend keeps the old one)
    const validationRules = {
        name: (val) => val.trim().length >= 2,
        category: (val) => val.trim().length > 0,
        price: (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        },
        description: (val) => true, // optional
        image: (val) => isEdit ? true : val !== null
    };

    const {
        formData,
        validations,
        hasSubmitted,
        refs,
        handleChange,
        handleFileChange,
        validateAll
    } = useFormValidation({
        name: initialData?.name || '',
        category: initialData?.category || '',
        price: initialData?.price?.toString() || '',
        description: initialData?.description || '',
        image: null
    }, validationRules);

    // This function runs when the user clicks the submit button.
    // It checks if all fields are valid before sending the data to the server.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateAll()) {
            setError('Please fill in all fields correctly to continue.');
            return;
        }

        setIsLoading(true);

        try {
            // We use FormData instead of standard JSON because we might be uploading an image file.
            // FormData is the standard way to send files over the internet.
            const payload = new FormData();
            
            payload.append('name', formData.name);
            payload.append('category', formData.category);
            payload.append('price', formData.price);
            payload.append('description', formData.description);

            // Only append the image if a new one was selected
            if (formData.image) {
                payload.append('image', formData.image);
            }

            // Route dynamically depending on whether it's POST (create) or PATCH (edit)
            const endpoint = isEdit ? `/api/restaurants/${restaurantId}/products/${initialData.id}` : `/api/restaurants/${restaurantId}/products`;
            const method = isEdit ? 'PATCH' : 'POST';

            const { response, data } = await apiClient(endpoint, {
                method: method,
                body: payload
            });

            if (!response.ok) {
                throw new Error(data?.error || data?.message || 'Failed to create menu item');
            }

            if (onSuccess) onSuccess();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {error && (
                <div className="alert alert-danger border-0 p-3 mb-4 wolt-error-alert" role="alert" style={{ borderRadius: '14px', fontSize: '0.9rem' }}>
                    <div className="fw-bold"><span className="me-2">⚠️</span>{error}</div>
                </div>
            )}
            
            <div className="row">
                <WoltInput 
                    ref={refs.name} 
                    label="Item Name *" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    isValid={hasSubmitted ? validations.name : null} 
                    errorMessage="Must be at least 2 characters" 
                    disabled={isLoading} 
                    colClass="col-md-6 mb-3" 
                />

                <div className="col-md-6 mb-3" ref={refs.category}>
                    <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1 wolt-text-label" style={{ fontSize: '0.8rem' }}>
                        Category *
                    </label>
                    <select 
                        className={`form-select px-4 py-3 text-dark wolt-input ${hasSubmitted && validations.category === false ? 'wolt-input-invalid' : hasSubmitted && validations.category === true ? 'wolt-input-valid' : ''}`}
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select a category...</option>
                        <option value="Appetizers">Appetizers</option>
                        <option value="Mains">Mains</option>
                        <option value="Sides">Sides</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Drinks">Drinks</option>
                    </select>
                    {hasSubmitted && validations.category === false && (
                        <div className="text-danger mt-1 ms-1" style={{ fontSize: '0.78rem', fontWeight: '600' }}>
                            Please select a category
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                <WoltInput 
                    ref={refs.price} 
                    label="Price ($) *" 
                    name="price" 
                    type="number"
                    placeholder="e.g. 15.50"
                    value={formData.price} 
                    onChange={handleChange} 
                    isValid={hasSubmitted ? validations.price : null} 
                    errorMessage="Must be a valid positive number" 
                    disabled={isLoading} 
                    colClass="col-md-6 mb-3" 
                />

                <WoltInput 
                    ref={refs.description} 
                    label="Description (Optional)" 
                    name="description" 
                    placeholder="Describe the item..."
                    value={formData.description} 
                    onChange={handleChange} 
                    isValid={hasSubmitted && formData.description ? true : null} 
                    disabled={isLoading} 
                    colClass="col-md-6 mb-3" 
                />
            </div>

            <div className="row">
                <div className="col-12 mb-3" ref={refs.image}>
                    <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1 wolt-text-label" style={{ fontSize: '0.8rem' }}>
                        Item Image *
                    </label>
                    <input 
                        type="file" 
                        accept="image/*"
                        className={`form-control px-4 py-3 text-dark wolt-input ${hasSubmitted && validations.image === false ? 'wolt-input-invalid' : hasSubmitted && validations.image === true ? 'wolt-input-valid' : ''}`}
                        onChange={(e) => handleFileChange(e, 'image')}
                        disabled={isLoading}
                    />
                    {hasSubmitted && validations.image === false && (
                        <div className="text-danger mt-1 ms-1" style={{ fontSize: '0.78rem', fontWeight: '600' }}>
                            An image is required
                        </div>
                    )}
                </div>
            </div>
            
            <div className="row">
                <div className="col-12 mt-4 text-end">
                    <button type="submit" className="wolt-btn text-white px-5 py-3 fw-bold rounded-pill" disabled={isLoading}>
                        {isLoading ? (
                            <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...</span>
                        ) : isEdit ? 'Save Changes' : 'Add Menu Item'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default MenuItemForm;
