import React, { useState } from 'react';
import { apiClient } from '../utils/apiClient';
import { useFormValidation } from '../hooks/useFormValidation';
import WoltInput from './WoltInput';

const CreateRestaurantForm = ({ onSuccess }) => {
    // We no longer manage formData and validation state manually!
    // All the heavy lifting is outsourced to our custom 'useFormValidation' hook.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validationRules = {
        name: (val) => val.trim().length >= 2,
        cuisine: (val) => val.trim().length > 0,
        city: (val) => /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        street: (val) => /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        houseNumber: (val) => /^\d+$/.test(val.trim()),
        latitude: (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= -90 && num <= 90;
        },
        longitude: (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= -180 && num <= 180;
        },
        image: (val) => val !== null
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
        name: '',
        cuisine: '',
        city: '',
        street: '',
        houseNumber: '',
        latitude: '',
        longitude: '',
        image: null
    }, validationRules);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateAll()) {
            setError('Please fill in all fields correctly to continue.');
            return;
        }

        setIsLoading(true);

        try {
            const payload = new FormData();
            
            payload.append('name', formData.name);
            payload.append('cuisine', formData.cuisine);
            
            const address = {
                city: formData.city,
                street: formData.street,
                houseNumber: formData.houseNumber
            };
            payload.append('address', JSON.stringify(address));

            const geolocation = {
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };
            payload.append('geolocation', JSON.stringify(geolocation));

            if (formData.image) {
                payload.append('image', formData.image);
            }

            const { response, data } = await apiClient('/api/restaurants', {
                method: 'POST',
                body: payload
            });

            if (!response.ok) {
                throw new Error(data?.error || data?.message || 'Failed to create restaurant');
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
                    label="Restaurant Name *" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    isValid={hasSubmitted ? validations.name : null} 
                    errorMessage="Must be at least 2 characters" 
                    disabled={isLoading} 
                    colClass="col-md-6 mb-3" 
                />

                <div className="col-md-6 mb-3" ref={refs.cuisine}>
                    <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1 wolt-text-label" style={{ fontSize: '0.8rem' }}>
                        Cuisine Category *
                    </label>
                    <select 
                        className={`form-select px-4 py-3 text-dark wolt-input ${hasSubmitted && validations.cuisine === false ? 'wolt-input-invalid' : hasSubmitted && validations.cuisine === true ? 'wolt-input-valid' : ''}`}
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select a category...</option>
                        <option value="Italian">Italian</option>
                        <option value="Asian">Asian</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Middle Eastern">Middle Eastern</option>
                        <option value="Other">Other</option>
                    </select>
                    {hasSubmitted && validations.cuisine === false && (
                        <div className="text-danger mt-1 ms-1" style={{ fontSize: '0.78rem', fontWeight: '600' }}>
                            Please select a cuisine
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                <WoltInput ref={refs.city} label="City *" name="city" value={formData.city} onChange={handleChange} isValid={hasSubmitted ? validations.city : null} errorMessage="Invalid city name" disabled={isLoading} colClass="col-md-5 mb-3" />
                <WoltInput ref={refs.street} label="Street *" name="street" value={formData.street} onChange={handleChange} isValid={hasSubmitted ? validations.street : null} errorMessage="Invalid street name" disabled={isLoading} colClass="col-md-5 mb-3" />
                <WoltInput ref={refs.houseNumber} label="No. *" name="houseNumber" value={formData.houseNumber} onChange={handleChange} isValid={hasSubmitted ? validations.houseNumber : null} errorMessage="Digits only" disabled={isLoading} colClass="col-md-2 mb-3" />
            </div>

            <div className="row">
                <WoltInput ref={refs.latitude} label="Latitude *" name="latitude" placeholder="e.g. 32.0853" value={formData.latitude} onChange={handleChange} isValid={hasSubmitted ? validations.latitude : null} errorMessage="Must be between -90 and 90" disabled={isLoading} colClass="col-md-6 mb-3" />
                <WoltInput ref={refs.longitude} label="Longitude *" name="longitude" placeholder="e.g. 34.7818" value={formData.longitude} onChange={handleChange} isValid={hasSubmitted ? validations.longitude : null} errorMessage="Must be between -180 and 180" disabled={isLoading} colClass="col-md-6 mb-3" />
            </div>

            <div className="row">
                <div className="col-12 mb-3" ref={refs.image}>
                    <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1 wolt-text-label" style={{ fontSize: '0.8rem' }}>
                        Cover Image *
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
                        ) : 'Save Restaurant'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CreateRestaurantForm;
