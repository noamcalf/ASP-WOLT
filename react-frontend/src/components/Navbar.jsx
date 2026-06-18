import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';

// Navbar is the main global navigation header of the application.
// It persists across all screens and manages navigation, live search, and theme toggling.
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItems, toggleCart } = useCart();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Handle user logout and redirect to the login screen
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg px-4 py-3 shadow-sm bg-body position-sticky top-0 w-100 z-3" style={{ borderBottom: '1px solid var(--bs-border-color-translucent)' }}>
            <div className="container-fluid d-flex align-items-center justify-content-between">
                
                {/* Logo Section */}
                <div className="d-flex align-items-center gap-3">
                    <span className="navbar-brand fw-bold m-0 p-0 text-primary" style={{ fontSize: '2rem', letterSpacing: '-1px' }}>
                        WOLT-ASP
                    </span>
                    <Link to="/" className="btn btn-light shadow-sm border wolt-nav-btn text-decoration-none" title="Home">
                        <span style={{ fontSize: '1.1rem' }}>🏠</span>
                    </Link>
                </div>

                {/* Center Search Bar */}
                <div className="d-none d-md-flex justify-content-center flex-grow-1 mx-4">
                    <SearchBar />
                </div>

                {/* Right Side Actions */}
                <div className="d-flex align-items-center gap-3">
                    {/* Cart Toggle Button - Hidden for Restaurant Owners */}
                    {user?.role !== 'owner' && (
                        <button 
                            className="btn btn-light shadow-sm border position-relative wolt-nav-btn" 
                            onClick={toggleCart}
                            title="View Cart"
                        >
                            <span style={{ fontSize: '1.2rem' }}>🛒</span>
                            {totalItems > 0 && (
                                <span 
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: '0.7rem' }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    )}

                    {/* If the user is logged in, show their profile picture and a dropdown menu */}
                    {isAuthenticated ? (
                        <div className="d-flex align-items-center gap-2 dropdown">
                            <ThemeToggle />
                            {user && (
                                <span className="d-none d-md-inline fw-semibold wolt-text-heading me-1" style={{ fontSize: '0.95rem' }}>
                                    Hello, {(user.name || user.username).split(' ')[0]}!
                                </span>
                            )}
                            <button className="btn btn-light shadow-sm border overflow-hidden wolt-nav-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {user?.image ? (
                                    <img src={`${apiUrl}/${user.image.replace(/\\/g, '/')}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '1.2rem' }}>👤</span>
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                                <li><Link className="dropdown-item fw-medium" to="/profile">Profile</Link></li>
                                {user?.role === 'owner' && (
                                    <li><Link className="dropdown-item fw-bold text-primary" to="/owner/dashboard">My Restaurants</Link></li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>Log Out</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary fw-bold px-4 rounded-pill">
                            Log in
                        </Link>
                    )}
                </div>
            </div>
            
            {/* Mobile Search Bar (visible only on small screens) */}
            <div className="container-fluid d-md-none mt-3">
                <SearchBar />
            </div>
        </nav>
    );
};

export default Navbar;
