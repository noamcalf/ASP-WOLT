import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 
import woltBg from '../assets/wolt-bg.png';
import WoltInput from '../components/WoltInput';
import MainButton from '../components/MainButton';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [validations, setValidations] = useState({
        username: null,
        password: null
    });

    const refs = {
        username: useRef(null),
        password: useRef(null)
    };

    const { login } = useAuth(); 

    const validateField = (name, value) => {
        return value.trim().length > 0; // Basic validation for login (not empty)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        
        setValidations(prev => ({ ...prev, [name]: validateField(name, value) }));
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

        ['username', 'password'].forEach(key => {
            const value = key === 'username' ? username : password;
            const isValid = validateField(key, value);
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
            const response = await fetch(`${apiUrl}/api/tokens/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Invalid credentials.');
            }

            login(data.token); 
            // navigate('/dashboard'); 

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
                
                <form onSubmit={handleSubmit} className="w-100">
                    
                    <WoltInput 
                        ref={refs.username} 
                        label="Username 👤" 
                        name="username" 
                        placeholder="Enter your username" 
                        value={username} 
                        onChange={handleChange} 
                        isValid={validations.username} 
                        disabled={isLoading} 
                    />

                    <WoltInput 
                        ref={refs.password} 
                        label="Password 🔒" 
                        name="password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={handleChange} 
                        isValid={validations.password} 
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