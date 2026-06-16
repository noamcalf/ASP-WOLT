import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    // If the restaurant doesn't have an image, we use a placeholder that fits the Wolt theme.
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const imageSrc = restaurant.image 
        ? `${apiUrl}/${restaurant.image.replace(/\\/g, '/')}` 
        : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'; // generic food placeholder

    return (
        <Link to={`/restaurant/${restaurant.id}`} className="text-decoration-none d-block h-100">
            <div className="wolt-restaurant-card border-0 shadow-sm d-flex flex-column h-100">
                {/* Image Section */}
                <div className="position-relative" style={{ height: '160px' }}>
                    <img 
                        src={imageSrc} 
                        alt={restaurant.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                
                {/* Content Section */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold mb-1 wolt-text-heading text-truncate">{restaurant.name}</h5>
                    <p className="text-muted small mb-3 text-truncate">{restaurant.cuisine}</p>
                    
                    <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                        <div className="bg-light rounded-pill px-2 py-1 d-flex align-items-center shadow-sm border">
                            <span className="fw-bold" style={{ color: '#009de0', fontSize: '0.9rem' }}>{restaurant.rating.toFixed(1)}</span>
                            <span className="ms-1" style={{ fontSize: '0.8rem' }}>⭐</span>
                        </div>
                        
                        <div className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>
                            {Math.floor(Math.random() * 30 + 15)} min
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
