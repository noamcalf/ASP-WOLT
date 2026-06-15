import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import woltBg from '../assets/wolt-bg.jpg';
import WoltInput from '../components/WoltInput';
import MainButton from '../components/MainButton';

const RegistrationScreen = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        city: '',
        street: '',
        streetNumber: '',
        latitude: '',
        longitude: ''
    });
    const [profileImage, setProfileImage] = useState(null);

    const [validations, setValidations] = useState({
        username: null,
        phone: null,
        password: null,
        confirmPassword: null,
        city: null,
        street: null,
        streetNumber: null,
        latitude: null,
        longitude: null,
        image: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const refs = {
        username: useRef(null),
        phone: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null),
        city: useRef(null),
        street: useRef(null),
        streetNumber: useRef(null),
        latitude: useRef(null),
        longitude: useRef(null),
        image: useRef(null)
    };

    const validateField = (name, value, allData = formData) => {
        switch (name) {
            case 'username':
                return /^[a-zA-Z0-9]{3,}$/.test(value);
            case 'phone':
                return /^0\d{9}$/.test(value);
            case 'password':
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
            case 'confirmPassword':
                return value === allData.password && value.length >= 8;
            case 'city':
            case 'street':
                return allData.role === 'owner' ? true : value.trim().length >= 2;
            case 'streetNumber':
                return allData.role === 'owner' ? true : value.trim().length >= 1;
            case 'latitude':
                if (allData.role === 'owner') return true;
                const lat = parseFloat(value);
                return !isNaN(lat) && lat >= -90 && lat <= 90;
            case 'longitude':
                if (allData.role === 'owner') return true;
                const lng = parseFloat(value);
                return !isNaN(lng) && lng >= -180 && lng <= 180;
            default:
                return true;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        
        const isValid = validateField(name, value, newFormData);
        
        if (name === 'password' && newFormData.confirmPassword) {
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setValidations(prev => ({ ...prev, image: true }));
        } else {
            setProfileImage(null);
            setValidations(prev => ({ ...prev, image: false }));
        }
    };

    const triggerShake = (fieldName) => {
        const ref = refs[fieldName];
        if (ref && ref.current) {
            ref.current.style.animation = 'none';
            void ref.current.offsetWidth;
            ref.current.style.animation = 'shake 0.4s ease-in-out';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let hasInvalidFields = false;
        let updatedValidations = { ...validations };

        Object.keys(refs).forEach(key => {
            let isValid = false;
            if (key === 'image') {
                isValid = profileImage !== null;
            } else {
                isValid = validateField(key, formData[key]);
            }

            updatedValidations[key] = isValid;

            if (!isValid) {
                hasInvalidFields = true;
                triggerShake(key);
            }
        });

        setValidations(updatedValidations);

        if (hasInvalidFields) {
            setError('Please fill in all fields correctly to continue.');
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            const dataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                dataToSubmit.append(key, formData[key]);
            });
            dataToSubmit.append('profileImage', profileImage);

            const response = await fetch(`${apiUrl}/api/users/`, {
                method: 'POST',
                body: dataToSubmit,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            navigate('/login');

        } catch (err) {
            setError(err.message || 'Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 p-0 m-0 position-relative wolt-custom-bg"
             style={{ backgroundImage: `url(${woltBg})` }}>
            
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 0 }}></div>

            <div className="card p-5 bg-white shadow-lg wolt-centered-card" 
                 style={{ 
                     width: '90%', 
                     maxWidth: '650px', 
                     borderRadius: '24px', 
                     border: 'none',
                     zIndex: 1,
                     maxHeight: '95vh',
                     overflowY: 'auto'
                 }}>
                
                <h2 className="text-center mb-1 fw-bold" style={{ color: '#202125', fontSize: '2.2rem', letterSpacing: '-0.8px' }}>
                    Join WOLT! 🍔
                </h2>
                <p className="text-center mb-4 text-muted">Create an account to start ordering</p>

                {error && (
                    <div className="alert alert-danger border-0 p-3 mb-4 wolt-error-alert" role="alert" style={{ borderRadius: '14px', fontSize: '0.9rem' }}>
                        <div className="fw-bold"><span className="me-2">⚠️</span>{error}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="w-100">
                    
                    {/* Role Selection */}
                    <div className="mb-4 text-start w-100 p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <label className="form-label fw-bold mb-3 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                            I am a...
                        </label>
                        <div className="d-flex gap-4">
                            <div className="form-check">
                                <input className="form-check-input wolt-radio" type="radio" name="role" id="roleCustomer" value="customer" checked={formData.role === 'customer'} onChange={handleChange} />
                                <label className="form-check-label fw-semibold" htmlFor="roleCustomer">
                                    Customer 🧑‍💼
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input wolt-radio" type="radio" name="role" id="roleOwner" value="owner" checked={formData.role === 'owner'} onChange={handleChange} />
                                <label className="form-check-label fw-semibold" htmlFor="roleOwner">
                                    Restaurant Owner 👨‍🍳
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <WoltInput ref={refs.username} label="Username 👤" name="username" placeholder="Min 3 chars" value={formData.username} onChange={handleChange} isValid={validations.username} disabled={isLoading} colClass="col-md-6 mb-3" />
                        <WoltInput ref={refs.phone} label="Phone Number 📱" name="phone" type="tel" placeholder="0501234567" value={formData.phone} onChange={handleChange} isValid={validations.phone} disabled={isLoading} colClass="col-md-6 mb-3" />
                    </div>

                    <div className="row">
                        <WoltInput ref={refs.password} label="Password 🔒" name="password" type="password" placeholder="Min 8 chars, 1 letter, 1 number" value={formData.password} onChange={handleChange} isValid={validations.password} disabled={isLoading} colClass="col-md-6 mb-3" />
                        <WoltInput ref={refs.confirmPassword} label="Confirm Password 🔑" name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} isValid={validations.confirmPassword} disabled={isLoading} colClass="col-md-6 mb-3" />
                    </div>

                    {formData.role === 'customer' && (
                        <>
                            <hr className="my-4 text-muted" />
                            <h6 className="fw-bold mb-3 text-muted text-uppercase tracking-wider">Address Details 📍</h6>
                            <div className="row">
                                <WoltInput ref={refs.city} name="city" placeholder="City" value={formData.city} onChange={handleChange} isValid={validations.city} disabled={isLoading} colClass="col-md-5 mb-3" />
                                <WoltInput ref={refs.street} name="street" placeholder="Street" value={formData.street} onChange={handleChange} isValid={validations.street} disabled={isLoading} colClass="col-md-5 mb-3" />
                                <WoltInput ref={refs.streetNumber} name="streetNumber" placeholder="No." value={formData.streetNumber} onChange={handleChange} isValid={validations.streetNumber} disabled={isLoading} colClass="col-md-2 mb-3" />
                            </div>

                            <h6 className="fw-bold mb-3 mt-2 text-muted text-uppercase tracking-wider">Geolocation 🌍</h6>
                            <div className="row">
                                <WoltInput ref={refs.latitude} name="latitude" placeholder="Lat (X)" value={formData.latitude} onChange={handleChange} isValid={validations.latitude} disabled={isLoading} colClass="col-md-6 mb-3" />
                                <WoltInput ref={refs.longitude} name="longitude" placeholder="Lng (Y)" value={formData.longitude} onChange={handleChange} isValid={validations.longitude} disabled={isLoading} colClass="col-md-6 mb-3" />
                            </div>
                        </>
                    )}

                    <hr className="my-4 text-muted" />

                    {/* Image Selection */}
                    <div className="mb-4 text-start w-100" ref={refs.image}>
                        <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                            Profile Picture 📸
                        </label>
                        <input 
                            type="file" 
                            accept="image/*"
                            className={`form-control px-4 py-2 text-dark wolt-input w-100 ${validations.image === true ? 'wolt-input-valid' : validations.image === false ? 'wolt-input-invalid' : ''}`}
                            onChange={handleImageChange} 
                            disabled={isLoading}
                        />
                    </div>

                    <MainButton text="Sign Up" isLoading={isLoading} />
                    
                    <div className="text-center mt-3 mb-2">
                        <Link to="/login" className="text-decoration-none" style={{ color: '#009de0', fontWeight: '600' }}>
                            Already have an account? Login here.
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationScreen;
