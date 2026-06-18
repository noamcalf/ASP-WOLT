import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import woltBg from '../assets/wolt-bg.png';
import WoltInput from '../components/WoltInput';
import MainButton from '../components/MainButton';

// The sign-up page where new users can create an account.
// Users can choose to register as a regular "customer" or a "restaurant owner".
const RegistrationScreen = () => {
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // These rules check if what the user typed is valid (e.g. phone number has 10 digits).
    // The rules change depending on whether the user is a customer or an owner.
    const validationRules = {
        name: (val) => val.trim().length >= 2,
        username: (val) => /^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,}$/.test(val),
        phone: (val) => /^0\d{9}$/.test(val),
        password: (val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val),
        confirmPassword: (val, allData) => val === allData.password && val.length >= 8,
        city: (val, allData) => allData.role === 'owner' ? true : /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        street: (val, allData) => allData.role === 'owner' ? true : /^[\u0590-\u05FFa-zA-Z\s\-]{2,}$/.test(val.trim()),
        streetNumber: (val, allData) => allData.role === 'owner' ? true : /^\d+$/.test(val.trim()),
        latitude: (val, allData) => {
            if (allData.role === 'owner') return true;
            const lat = parseFloat(val);
            return !isNaN(lat) && lat >= -90 && lat <= 90;
        },
        longitude: (val, allData) => {
            if (allData.role === 'owner') return true;
            const lng = parseFloat(val);
            return !isNaN(lng) && lng >= -180 && lng <= 180;
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
        username: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        city: '',
        street: '',
        streetNumber: '',
        latitude: '',
        longitude: '',
        image: null
    }, validationRules);

    // This runs when the user hits "Sign Up". It checks for errors and sends the data to the server.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateAll()) {
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

            const response = await fetch(`${apiUrl}/api/users/`, {
                method: 'POST',
                body: dataToSubmit,
            });

            const data = await response.json();

            if (!response.ok) {
                // The backend returns errors under 'error', not 'message'
                throw new Error(data.error || data.message || 'Registration failed.');
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
                
                <h2 className="text-center mb-1 fw-bold wolt-text-heading" style={{ fontSize: '2.2rem', letterSpacing: '-0.8px' }}>
                    Join WOLT! 🍔
                </h2>
                <p className="text-center mb-4 wolt-text-muted">Create an account to start ordering</p>

                {error && (
                    <div className="alert alert-danger border-0 p-3 mb-4 wolt-error-alert" role="alert" style={{ borderRadius: '14px', fontSize: '0.9rem' }}>
                        <div className="fw-bold"><span className="me-2">⚠️</span>{error}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="w-100" noValidate>
                    
                    {/* Role Selection */}
                    <div className="mb-4 text-start w-100 p-3 wolt-role-box" style={{ borderRadius: '14px', border: '1px solid var(--bs-border-color)' }}>
                        <label className="form-label fw-bold mb-3 small text-uppercase tracking-wider d-block px-1 wolt-text-label" style={{ fontSize: '0.8rem' }}>
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
                        <WoltInput ref={refs.name} label="Full Name 🏷️" name="name" value={formData.name} onChange={handleChange} isValid={hasSubmitted ? validations.name : null} errorMessage="Must be at least 2 characters long" disabled={isLoading} colClass="col-md-12 mb-3" />
                    </div>

                    <div className="row">
                        <WoltInput ref={refs.username} label="Username 👤" name="username" placeholder="Min 3 chars" value={formData.username} onChange={handleChange} isValid={hasSubmitted ? validations.username : null} errorMessage="Min 3 chars, letters and numbers only (no spaces)" disabled={isLoading} colClass="col-md-6 mb-3" />
                        <WoltInput ref={refs.phone} label="Phone Number 📱" name="phone" type="tel" placeholder="050..." value={formData.phone} onChange={handleChange} isValid={hasSubmitted ? validations.phone : null} errorMessage="Valid 10-digit Israeli number required" disabled={isLoading} colClass="col-md-6 mb-3" />
                    </div>

                    <div className="row">
                        <WoltInput ref={refs.password} label="Password 🔒" name="password" type="password" placeholder="Min 8 chars, 1 letter, 1 number" value={formData.password} onChange={handleChange} isValid={hasSubmitted ? validations.password : null} errorMessage="Min 8 chars, 1 letter, 1 number" disabled={isLoading} colClass="col-md-6 mb-3" />
                        <WoltInput ref={refs.confirmPassword} label="Confirm Password 🔑" name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} isValid={hasSubmitted ? validations.confirmPassword : null} errorMessage="Passwords do not match" disabled={isLoading} colClass="col-md-6 mb-3" />
                    </div>

                    {formData.role === 'customer' && (
                        <>
                            <hr className="my-4 text-muted" />
                            <h6 className="fw-bold mb-3 text-muted text-uppercase tracking-wider">Address Details 📍</h6>
                            <div className="row">
                                <WoltInput ref={refs.city} name="city" placeholder="City" value={formData.city} onChange={handleChange} isValid={hasSubmitted ? validations.city : null} errorMessage="Invalid city name" disabled={isLoading} colClass="col-md-5 mb-3" />
                                <WoltInput ref={refs.street} name="street" placeholder="Street" value={formData.street} onChange={handleChange} isValid={hasSubmitted ? validations.street : null} errorMessage="Invalid street name" disabled={isLoading} colClass="col-md-5 mb-3" />
                                <WoltInput ref={refs.streetNumber} name="streetNumber" placeholder="No." value={formData.streetNumber} onChange={handleChange} isValid={hasSubmitted ? validations.streetNumber : null} errorMessage="Digits only" disabled={isLoading} colClass="col-md-2 mb-3" />
                            </div>

                            <h6 className="fw-bold mb-3 mt-2 text-muted text-uppercase tracking-wider">Geolocation 🌍</h6>
                            <div className="row">
                                <WoltInput ref={refs.latitude} name="latitude" placeholder="Lat (X)" value={formData.latitude} onChange={handleChange} isValid={hasSubmitted ? validations.latitude : null} errorMessage="Invalid latitude" disabled={isLoading} colClass="col-md-6 mb-3" />
                                <WoltInput ref={refs.longitude} name="longitude" placeholder="Lng (Y)" value={formData.longitude} onChange={handleChange} isValid={hasSubmitted ? validations.longitude : null} errorMessage="Invalid longitude" disabled={isLoading} colClass="col-md-6 mb-3" />
                            </div>
                        </>
                    )}

                    <hr className="my-4 text-muted" />

                    {/* Image Selection */}
                    <div className="mb-4 text-start w-100" ref={refs.image}>
                        <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1 wolt-text-label" style={{ fontSize: '0.8rem' }}>
                            Profile Picture 📸
                        </label>
                        <input 
                            type="file" 
                            accept="image/*"
                            className={`form-control px-4 py-2 text-dark wolt-input w-100 ${validations.image === true ? 'wolt-input-valid' : validations.image === false ? 'wolt-input-invalid' : ''}`}
                            onChange={(e) => handleFileChange(e, 'image')} 
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
