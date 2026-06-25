import { useState, useRef, createRef } from 'react';

/**
 * Custom React Hook: useFormValidation
 * 
 * This hook abstracts all the boilerplate logic for handling forms in React, including:
 * 1. Managing form state (formData)
 * 2. Managing validation errors (validations)
 * 3. Creating DOM refs for each field to enable "shaking" animations on error
 * 4. Handling standard text/select inputs as well as file inputs
 * 
 * @param {Object} initialState - The starting state object with keys for each field (e.g. { username: '' })
 * @param {Object} validationRules - An object mapping field names to validation functions (e.g. { username: (val) => val.length > 3 })
 */
export const useFormValidation = (initialState, validationRules) => {
    // 1. Core State
    const [formData, setFormData] = useState(initialState);
    
    // 2. Validation State (Tracks whether a field passed validation: true = valid, false = invalid, null = untouched)
    const [validations, setValidations] = useState(
        Object.keys(initialState).reduce((acc, key) => ({ ...acc, [key]: null }), {})
    );
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // 3. DOM References (Created once per field)
    // We use createRef so we can attach them to HTML inputs and trigger CSS animations manually
    const refs = useRef(
        Object.keys(initialState).reduce((acc, key) => {
            acc[key] = createRef();
            return acc;
        }, {})
    );

    // Core Validation Function - Checks a specific field against its rule
    const validateField = (name, value, allData) => {
        if (!validationRules[name]) return true; // No rule defined = valid by default
        return validationRules[name](value, allData);
    };

    // Generic input handler for texts, numbers, selects, etc.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        // 1. Update the form data state
        const newFormData = { ...formData, [name]: newValue };
        setFormData(newFormData);
        
        // 2. Validate the new value immediately
        const isValid = validateField(name, newValue, newFormData);
        
        // Special Case: If the user changes the password, we MUST re-validate the 'confirmPassword' field
        // because its validity depends on the main password.
        if (name === 'password' && validationRules['confirmPassword'] && newFormData.confirmPassword) {
            const isConfirmValid = validateField('confirmPassword', newFormData.confirmPassword, newFormData);
            setValidations(prev => ({ 
                ...prev, 
                [name]: isValid,
                confirmPassword: isConfirmValid
            }));
        } else {
            setValidations(prev => ({ ...prev, [name]: isValid }));
        }
    };

    // Specialized handler for file inputs (images)
    const handleFileChange = (e, name) => {
        const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
        const newFormData = { ...formData, [name]: file };
        setFormData(newFormData);
        
        const isValid = validateField(name, file, newFormData);
        setValidations(prev => ({ ...prev, [name]: isValid }));
    };

    // UX Function: Forces a DOM element to restart its CSS 'shake' animation
    const triggerShake = (fieldName) => {
        const ref = refs.current[fieldName];
        if (ref && ref.current) {
            ref.current.style.animation = 'none';
            void ref.current.offsetWidth; // Magic trick: forces the browser to redraw, resetting the animation
            ref.current.style.animation = 'shake 0.4s ease-in-out';
        }
    };

    // Validates the ENTIRE form at once (used during submit)
    const validateAll = () => {
        setHasSubmitted(true);
        let hasInvalidFields = false;
        let updatedValidations = { ...validations };

        Object.keys(validationRules).forEach(key => {
            // Only validate if the key is part of our tracked state
            if (formData[key] !== undefined) {
                const isValid = validateField(key, formData[key], formData);
                updatedValidations[key] = isValid;

                if (!isValid) {
                    hasInvalidFields = true;
                    triggerShake(key);
                }
            }
        });

        setValidations(updatedValidations);
        return !hasInvalidFields; // Returns true if form is perfectly valid
    };

    return {
        formData,
        setFormData,
        validations,
        hasSubmitted,
        refs: refs.current,
        handleChange,
        handleFileChange,
        validateAll
    };
};
