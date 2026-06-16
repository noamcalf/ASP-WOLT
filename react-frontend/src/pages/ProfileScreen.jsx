import React from 'react';
import OrderHistory from '../components/OrderHistory';

const ProfileScreen = () => {
    return (
        <div className="container-fluid min-vh-100 bg-light py-5">
            <div className="container">
                
                <div className="mb-5 d-flex align-items-center gap-4">
                    <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center wolt-profile-avatar">
                        👤
                    </div>
                    <div>
                        <h1 className="fw-bold mb-1 wolt-text-heading" style={{ letterSpacing: '-0.5px' }}>My Profile</h1>
                        <p className="wolt-text-muted mb-0 fs-5">Welcome back! Here you can view all your personal information.</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="row">
                    <div className="col-12">
                        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border-0">
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
