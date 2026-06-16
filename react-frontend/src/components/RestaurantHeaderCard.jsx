import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantHeaderCard = ({ restaurant }) => {
    const navigate = useNavigate();
    
    if (!restaurant) return null;

    // Use a high-quality placeholder for the restaurant cover banner
    const coverImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'; 

    return (
        <div className="wolt-restaurant-header shadow-sm bg-body overflow-hidden rounded-bottom-4">
            <div 
                className="w-100 position-relative" 
                style={{ 
                    height: '280px', 
                    backgroundImage: `url(${coverImage})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            >
                {/* Floating Back Button */}
                <div className="position-absolute" style={{ top: '20px', left: '20px' }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="rounded-circle shadow-sm d-flex justify-content-center align-items-center bg-body" 
                        style={{ width: '45px', height: '45px', opacity: 0.9, border: 'none' }}
                    >
                        <span className="fs-4 wolt-text-heading">←</span>
                    </button>
                </div>
            </div>
            
            <div className="container py-4 position-relative bg-body">
                <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3">
                    <div>
                        <h1 className="display-5 fw-bold mb-1 wolt-text-heading">{restaurant.name}</h1>
                        <p className="text-muted fs-5 mb-2">{restaurant.cuisine}</p>
                        
                        <div className="d-flex align-items-center wolt-text-muted small">
                            <span className="me-4 fs-6">
                                📍 {restaurant.address.street} {restaurant.address.houseNumber}, {restaurant.address.city}
                            </span>
                            <span className="fs-6">
                                ⏱️ {restaurant.deliveryTime || '25-35 min'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="d-flex align-items-center bg-body-tertiary rounded-pill px-4 py-2 border shadow-sm">
                        <span className="fs-4 fw-bold" style={{ color: '#009de0' }}>{restaurant.rating.toFixed(1)}</span>
                        <span className="fs-5 ms-2">⭐</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantHeaderCard;
