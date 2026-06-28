import React from 'react';
import OrderHistory from '../components/OrderHistory';
import { useAuth } from '../context/authContext';

const ProfileScreen = () => {
    const { user } = useAuth();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    return (
        <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container">
                
                <div className="mb-5 d-flex align-items-center gap-4">
                    <div className="bg-body rounded-circle shadow-sm d-flex justify-content-center align-items-center overflow-hidden border" style={{ width: '90px', height: '90px' }}>
                        {user?.image ? (
                            <img src={`${apiUrl}/${user.image.replace(/\\/g, '/')}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '3rem' }}>👤</span>
                        )}
                    </div>
                    <div>
                        <h1 className="fw-bold mb-1 wolt-text-heading" style={{ letterSpacing: '-0.5px' }}>
                            {user ? user.name || user.username : 'My Profile'}
                        </h1>
                        <p className="wolt-text-muted mb-1 fs-5">
                            {user ? `📞 ${user.phoneNumber}` : 'Welcome back!'}
                        </p>
                        {user?.address && (
                            <p className="text-muted small mb-0 fw-medium">
                                📍 {user.address.street} {user.address.houseNumber}, {user.address.city}
                            </p>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="row">
                    <div className="col-12">
                        <div className="bg-body p-4 p-md-5 rounded-4 shadow-sm border" style={{ borderColor: 'var(--bs-border-color-translucent)' }}>
                            {/* Mount the Order History component */}
                            <OrderHistory />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileScreen;
