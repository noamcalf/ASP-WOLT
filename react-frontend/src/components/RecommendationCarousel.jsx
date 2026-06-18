import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { apiClient } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageUtils';

const RecommendationCard = ({ product, onAddToOrder }) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    const imageSrc = getImageUrl(product.image, fallbackImage);

    return (
        <div 
            className="wolt-restaurant-card bg-body overflow-hidden border shadow-sm d-flex flex-column" 
            style={{ width: '180px', minWidth: '180px', borderRadius: '12px', marginRight: '16px' }}
        >
            <div style={{ height: '120px' }}>
                <img src={imageSrc} alt={product.name} className="w-100 h-100 object-fit-cover" />
            </div>
            <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                <div>
                    <h6 className="fw-bold mb-1 text-truncate wolt-text-heading" title={product.name}>{product.name}</h6>
                    <span className="wolt-text-muted small fw-semibold">₪{product.price.toFixed(2)}</span>
                </div>
                <button 
                    className="wolt-btn py-1 w-100 mt-3 text-white fw-bold d-flex justify-content-center align-items-center"
                    style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                    onClick={() => onAddToOrder(product)}
                >
                    + Add
                </button>
            </div>
        </div>
    );
};

const RecommendationCarousel = ({ productId, onAddToOrder }) => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Only fetch if user is logged in
        if (!user || !user.id || user.role === 'owner') {
            setIsLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const { data, response } = await apiClient(`/api/users/${user.id}/recommendations/${productId}`);
                if (response.ok && Array.isArray(data)) {
                    setRecommendations(data);
                }
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [user, productId]);

    if (isLoading) {
        return (
            <div className="mt-4 mb-2">
                <h6 className="fw-bold mb-3 wolt-text-heading px-1">People also bought</h6>
                <div className="d-flex overflow-hidden px-1">
                    <div className="spinner-border text-primary spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 mb-2">
            <h6 className="fw-bold mb-3 wolt-text-heading px-1">People also bought</h6>
            
            {/* 
              We use 'wolt-carousel-track' to inherit the same nice horizontal scrollbar 
              and layout logic as the category carousel.
            */}
            <div className="wolt-carousel-track px-1 pb-3">
                {recommendations.map(product => (
                    <RecommendationCard 
                        key={product.id} 
                        product={product} 
                        onAddToOrder={onAddToOrder} 
                    />
                ))}
            </div>
        </div>
    );
};

export default RecommendationCarousel;
