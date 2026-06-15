import React from 'react';
import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';
import woltBg from '../assets/wolt-bg.jpg';

const DashboardScreen = () => {
    const { logout, isAuthenticated } = useAuth();
    
    return (
        <div 
            className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center wolt-custom-bg position-relative"
            style={{ backgroundImage: `url(${woltBg})` }}
        >
            {/* Overlay to make the text more readable against the busy background */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', zIndex: 0 }}></div>
            
            <div style={{ zIndex: 1 }} className="d-flex flex-column align-items-center w-100">
                <h1 className="fw-bold mb-3" style={{ color: '#009de0', fontSize: '3rem' }}>Wolt Dashboard</h1>
                <p className="lead text-dark mb-5 text-center fw-semibold">
                    Welcome to the main dashboard!<br/>
                    Browse our amazing restaurants below.
                </p>
                
                <div className="d-flex gap-4 mb-5">
                    <Link to="/restaurant/1" className="wolt-btn text-white px-5 py-3 text-decoration-none fw-bold shadow-sm" style={{ fontSize: '1.1rem' }}>
                        🍔 View Restaurant #1
                    </Link>
                    <Link to="/restaurant/2" className="wolt-btn text-white px-5 py-3 text-decoration-none fw-bold shadow-sm" style={{ fontSize: '1.1rem' }}>
                        🍕 View Restaurant #2
                    </Link>
                </div>

                <div className="mt-4 p-4 bg-white rounded-4 shadow-sm text-center" style={{ minWidth: '300px' }}>
                    {isAuthenticated ? (
                        <>
                            <p className="text-dark fw-bold mb-3">You are logged in!</p>
                            <button onClick={logout} className="wolt-btn text-white px-4 py-2 w-100" style={{ backgroundColor: '#ef4444' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="text-muted">
                            <p className="mb-3">You are browsing as a guest.</p>
                            <Link to="/login" className="wolt-btn text-white px-4 py-2 text-decoration-none d-block w-100">
                                Login / Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
