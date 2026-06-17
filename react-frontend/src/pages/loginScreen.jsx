import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 
import { useFormValidation } from '../hooks/useFormValidation';
import woltBg from '../assets/wolt-bg.png';
import WoltInput from '../components/WoltInput';
import MainButton from '../components/MainButton';

const LoginScreen = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    
    // We extracted all the complicated validation logic into useFormValidation!
    // Now this component only cares about its specific rules and what to do on submit.
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validationRules = {
        username: (val) => val.trim().length > 0,
        password: (val) => val.trim().length > 0
    };

    const {
        formData,
        validations,
        hasSubmitted,
        refs,
        handleChange,
        validateAll
    } = useFormValidation({ username: '', password: '' }, validationRules);

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
            const response = await fetch(`${apiUrl}/api/tokens/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: formData.username, 
                    password: formData.password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Login failed. Invalid credentials.');
            }

            login(data.token); 
            navigate('/'); 

        } catch (err) {
            setError(err.message || 'Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 p-0 m-0 position-relative wolt-custom-bg"
             style={{ backgroundImage: `url(${woltBg})` }}>
            
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', zIndex: 0 }}></div>

            <div className="card p-5 bg-white shadow-lg wolt-centered-card" 
                 style={{ 
                     width: '90%', 
                     maxWidth: '460px', 
                     borderRadius: '24px', 
                     border: 'none',
                     zIndex: 1
                 }}>
                
                <h2 className="text-center mb-4 fw-bold wolt-text-heading" style={{ fontSize: '2.2rem', letterSpacing: '-0.8px' }}>
                    Let's Login to WOLT!
                </h2>

                {error && (
                    <div className="alert alert-danger border-0 p-3 mb-4 wolt-error-alert" role="alert" style={{ borderRadius: '14px', fontSize: '0.9rem' }}>
                        <div className="fw-bold"><span className="me-2">⚠️</span>{error}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="w-100" noValidate>
                    
                    <WoltInput 
                        ref={refs.username} 
                        label="Username 👤" 
                        name="username" 
                        placeholder="Enter your username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        isValid={hasSubmitted ? validations.username : null} 
                        disabled={isLoading} 
                    />

                    <WoltInput 
                        ref={refs.password} 
                        label="Password 🔒" 
                        name="password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        isValid={hasSubmitted ? validations.password : null} 
                        disabled={isLoading} 
                    />

                    <MainButton text="Login" isLoading={isLoading} />
                    
                    <div className="text-center mt-3">
                        <Link to="/register" className="text-decoration-none" style={{ color: '#009de0', fontWeight: '600' }}>
                            New user? Sign up here!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;