import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import { getImageUrl } from '../utils/imageUtils';

// A component that displays a summary of a restaurant (image, name, cuisine, rating).
// Customers see rating and delivery time, while owners see "Manage Menu" and "Delete" buttons.
const RestaurantCard = ({ restaurant, ownerMode = false, onDelete }) => {
    // If the restaurant doesn't have an image, we use a placeholder that fits the Wolt theme.
    const imageSrc = getImageUrl(restaurant.image, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80');

    const linkTarget = ownerMode ? `/owner/restaurant/${restaurant.id}` : `/restaurant/${restaurant.id}`;
    const navigate = useNavigate();

    const handleManageMenuClick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        navigate(`/owner/restaurant/${restaurant.id}`);
    };

    return (
        <div className="wolt-restaurant-card border-0 shadow-sm d-flex flex-column h-100">
            <Link to={linkTarget} className="text-decoration-none d-block flex-grow-1">
                {/* Image Section */}
                <div className="position-relative" style={{ height: '160px' }}>
                    <img 
                        src={imageSrc} 
                        alt={restaurant.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                
                {/* Content Section */}
                <div className="p-3 pb-0 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-1 wolt-text-heading text-truncate">{restaurant.name}</h5>
                    <p className="text-muted small mb-0 text-truncate">
                        {restaurant.cuisine} {ownerMode && restaurant.address?.city ? `• ${restaurant.address.city}` : ''}
                    </p>
                </div>
            </Link>
            
            <div className="p-3 pt-2 mt-auto d-flex flex-column">
                <div className="border-top pt-2 d-flex justify-content-between align-items-center">
                        {ownerMode ? (
                            <div className="d-flex w-100 gap-2">
                                <button className="btn btn-outline-primary w-100 fw-bold rounded-pill btn-sm" onClick={handleManageMenuClick}>
                                    Manage Menu
                                </button>
                                <DeleteButton 
                                    endpoint={`/api/restaurants/${restaurant.id}`}
                                    confirmationMessage="Are you absolutely sure you want to delete this ENTIRE restaurant? This action cannot be undone!"
                                    onSuccess={onDelete} 
                                    className="btn-sm rounded-pill px-3"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="bg-light rounded-pill px-2 py-1 d-flex align-items-center shadow-sm border">
                                    <span className="fw-bold" style={{ color: '#009de0', fontSize: '0.9rem' }}>
                                        {restaurant.rating === 0 ? "New" : restaurant.rating.toFixed(1)}
                                    </span>
                                    <span className="ms-1" style={{ fontSize: '0.8rem' }}>⭐</span>
                                </div>
                                
                                <div className="text-muted fw-semibold d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                                    <span>{restaurant.deliveryTimeMins || restaurant.baseDeliveryTime}</span>
                                    {restaurant.distanceKm && (
                                        <>
                                            <span className="mx-1">•</span>
                                            <span>{restaurant.distanceKm.toFixed(1)} km</span>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
