import React from 'react';
import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';
import woltBg from '../assets/wolt-bg.png';
import MainButton from '../components/MainButton';

const DashboardScreen = () => {
    const { logout, isAuthenticated } = useAuth();
    
    return (
        <div 
            className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center wolt-custom-bg position-relative"
        >
            {/* The background is handled by the wolt-custom-bg class combined with inline background Image via standard practice, 
                or we can set background-image directly in the CSS. Since the image path requires webpack/vite resolution, we use standard style tag for the imported image */}
            <div className="position-absolute top-0 start-0 w-100 h-100 wolt-custom-bg" style={{ backgroundImage: `url(${woltBg})` }}></div>
            
            {/* Overlay to make the text more readable against the busy background */}
            <div className="position-absolute top-0 start-0 w-100 h-100 wolt-overlay-light"></div>
            
            <div className="d-flex flex-column align-items-center w-100 wolt-content-layer">
                <h1 className="fw-bold mb-3 wolt-heading-xl">Wolt Dashboard</h1>
                <p className="lead text-dark mb-5 text-center fw-semibold">
                    Welcome to the main dashboard!<br/>
                    Browse our amazing restaurants below.
                </p>
                
                <div className="d-flex gap-4 mb-5">
                    <Link to="/restaurant/1" className="wolt-btn text-white px-5 py-3 text-decoration-none fw-bold shadow-sm fs-5">
                        🍔 View Restaurant #1
                    </Link>
                    <Link to="/restaurant/2" className="wolt-btn text-white px-5 py-3 text-decoration-none fw-bold shadow-sm fs-5">
                        🍕 View Restaurant #2
                    </Link>
                </div>

                <div className="mt-4 p-4 bg-white rounded-4 shadow-sm text-center min-vw-25">
                    {isAuthenticated ? (
                        <>
                            <p className="text-dark fw-bold mb-3">You are logged in!</p>
                            <MainButton 
                                text="Logout" 
                                onClick={logout} 
                                // We can pass a wrapper class if needed, or MainButton handles it. 
                                // We'll just wrap the button inside MainButton with our logout specific class via standard means
                            />
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
