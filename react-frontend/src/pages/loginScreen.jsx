import React, { useState } from 'react';
// Authorization function
import { useAuth } from '../context/authContext'; 
// Import background photo
import woltBg from '../assets/wolt-bg.jpg';

const LoginScreen = () => {
    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth(); // Login func

    const handleSubmit = async (e) => {
        // Prevent fro, the page to refresh like the default, to maintain the state's memory
        e.preventDefault();
        // We cuurently do not have error logging in
        setError('');
        // Activate loading state
        setIsLoading(true);

        try {
        // Get the server's port from .env
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // Send request for the nodejs server by the token's route
        const response = await fetch(`${apiUrl}/api/tokens/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: username, 
                password: password 
            }),
        });

        // Get the response from the nodejs server
        const data = await response.json();

        // We have an error as response
        if (!response.ok) {
            throw new Error(data.message || 'Login failed. Invalid credentials.');
        }

        // Activate login function with the currect token
        login(data.token); 
        
        // Implement later : navigate to the main screen
        //navigate('/dashboard'); 

    } catch (err) {
        // Handle connection errors
        setError(err.message || 'Connection error. Please try again.');
    } finally {
        // No metter what happend - change IsLoading state back to false
        setIsLoading(false);
    }
    };

    return (
        /* Full screen container with Wolt background image */
        <div className="container-fluid min-vh-100 p-0 m-0 position-relative wolt-custom-bg"
             style={{ backgroundImage: `url(${woltBg})` }}>
            
            {/* Soft dark overlay above the background image */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', zIndex: 0 }}></div>

            {/* Central white card for the login form */}
            <div className="card p-5 bg-white shadow-lg wolt-centered-card" 
                 style={{ 
                     width: '90%', 
                     maxWidth: '460px', 
                     borderRadius: '24px', 
                     border: 'none',
                     zIndex: 1
                 }}>
                
                {/* Form main header */}
                <h2 className="text-center mb-4 fw-bold" style={{ color: '#202125', fontSize: '2.2rem', letterSpacing: '-0.8px' }}>
                    Let's Login to WOLT!
                </h2>

                {/* Error message alert container */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 p-3 mb-4 wolt-error-alert" role="alert" style={{ borderRadius: '14px', fontSize: '0.9rem' }}>
                        <span className="me-2">⚠️</span>
                        <div className="fw-semibold">{error}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="w-100">
                    
                    {/* Input field: Username */}
                    <div className="mb-4 text-start w-100">
                        <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                            Username 👤
                        </label>
                        <input 
                            type="text" 
                            className="form-control px-4 py-3 text-dark wolt-input w-100"
                            placeholder="Enter your username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            disabled={isLoading}
                            required 
                        />
                    </div>

                    {/* Input field: Password */}
                    <div className="mb-4 text-start w-100">
                        <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                            Password 🔒
                        </label>
                        {/* Flex container wrapping password input and visibility controls */}
                        <div className="d-flex align-items-center justify-content-between w-100 position-relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control px-4 py-3 text-dark wolt-input"
                                style={{ flex: '1' }} 
                                placeholder="Enter your password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={isLoading}
                                required 
                            />
                            {/* Toggle visibility container (button + dynamic label) */}
                            <div className="d-flex align-items-center ms-2" style={{ whiteSpace: 'nowrap' }}>
                                <button 
                                    type="button"
                                    className="bg-transparent border-0 p-1 d-flex align-items-center justify-content-center wolt-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ 
                                        cursor: 'pointer',
                                        outline: 'none',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                                
                                <span className="text-muted ms-1 wolt-dynamic-text" style={{ fontSize: '0.75rem', maxWidth: '110px', display: 'inline-block' }}>
                                    {showPassword ? "Hide password" : "Show password"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form submit and loading state button */}
                    <button 
                        type="submit" 
                        className="btn py-3 text-white fw-bold w-100 mt-2 d-block wolt-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center gap-2">
                                <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                                <span>Loading... ⏳</span>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>

            {/* Custom CSS stylings */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                
                /* Fits background image beautifully across the entire viewport */
                .wolt-custom-bg {
                    font-family: 'Inter', sans-serif;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed;
                }

                /* Absolute center alignment for the card overlay */
                .wolt-centered-card {
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2) !important;
                }

                /* Input field styling adjustments */
                .wolt-input {
                    width: 100% !important;
                    box-sizing: border-box !important;
                    borderRadius: 14px !important;
                    border: 1.5px solid #e2e8f0 !important;
                    background-color: #ffffff !important;
                    color: #202125 !important; 
                    font-size: 1rem !important;
                    transition: all 0.25s ease-in-out !important;
                }

                /* Wolt custom signature blue focus glow */
                .wolt-input:focus {
                    border-color: #009de0 !important;
                    box-shadow: 0 0 0 4px rgba(0, 157, 224, 0.12) !important;
                }

                /* Input placeholders color theme */
                .wolt-input::placeholder {
                    color: #94a3b8 !important;
                    font-size: 0.95rem;
                }

                /* Custom Wolt main action button design */
                .wolt-btn {
                    background-color: #009de0 !important;
                    border-radius: 14px !important;
                    font-size: 1rem !important;
                    border: none !important;
                    transition: all 0.2s ease !important;
                }

                /* Hover effect adjustments for the submit button */
                .wolt-btn:hover:not(:disabled) {
                    background-color: #007cb2 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 157, 224, 0.2) !important;
                }

                /* Disabled styling layout for when the form is loading */
                .wolt-btn:disabled {
                    background-color: #a0dbf5 !important;
                    cursor: not-allowed;
                }

                /* Slight pulse scaling on eye interactive button hover */
                .wolt-eye-btn:hover {
                    transform: scale(1.1);
                    transition: transform 0.1s ease;
                }

                /* Text constraints configuration for the dynamic context text */
                .wolt-dynamic-text {
                    line-height: 1.1;
                    color: #64748b !important;
                }

                /* Error notification card positioning slide animation */
                .wolt-error-alert {
                    background-color: #f8d7da !important;
                    color: #721c24 !important;
                    border: 1px solid #f5c6cb !important;
                    animation: alertSlideIn 0.3s ease-out forwards;
                }

                @keyframes alertSlideIn {
                    from { opacity: 0; transform: translate3d(0, -10px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default LoginScreen;