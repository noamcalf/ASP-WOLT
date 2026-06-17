import React from 'react';

const MenuItemRow = ({ product, onClick }) => {
    // If no image is provided from the backend, use a generic tasty food fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    const imageSrc = product.image || fallbackImage;

    return (
        <div 
            className="wolt-menu-item p-3 mb-3 d-flex justify-content-between align-items-center shadow-sm"
            onClick={() => onClick(product)}
        >
            <div className="pe-3 flex-grow-1">
                <h5 className="fw-bold mb-1 wolt-text-heading">{product.name}</h5>
                <p className="wolt-text-muted small mb-2 wolt-line-clamp-2">
                    {product.description}
                </p>
                <div className="fw-bold text-dark" style={{ color: '#009de0' }}>
                    ₪{product.price.toFixed(2)}
                </div>
            </div>
            
            <div className="flex-shrink-0" style={{ width: '110px', height: '110px' }}>
                <img 
                    src={imageSrc} 
                    alt={product.name} 
                    className="w-100 h-100 rounded-3 object-fit-cover shadow-sm"
                />
            </div>
        </div>
    );
};

export default MenuItemRow;
