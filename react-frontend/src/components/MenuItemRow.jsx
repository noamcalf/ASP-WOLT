import React from 'react';
import DeleteButton from './DeleteButton';

const MenuItemRow = ({ product, onClick, ownerMode = false, deleteEndpoint, onDeleteSuccess }) => {
    // If no image is provided from the backend, use a generic tasty food fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    const imageSrc = product.image || fallbackImage;

    return (
        <div 
            className="wolt-menu-item p-3 mb-3 d-flex justify-content-between align-items-center shadow-sm position-relative"
            onClick={!ownerMode ? () => onClick(product) : undefined}
            style={ownerMode ? { cursor: 'default' } : {}}
        >
            <div className="pe-3 flex-grow-1">
                <h5 className="fw-bold mb-1 wolt-text-heading">{product.name}</h5>
                <p className="wolt-text-muted small mb-2 wolt-line-clamp-2">
                    {product.description || product.category}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="fw-bold text-dark" style={{ color: '#009de0' }}>
                        ${parseFloat(product.price).toFixed(2)}
                    </div>
                    {ownerMode && deleteEndpoint && (
                        <DeleteButton 
                            endpoint={deleteEndpoint}
                            confirmationMessage="Are you sure you want to delete this menu item?"
                            onSuccess={onDeleteSuccess}
                            className="btn-sm rounded-pill"
                        />
                    )}
                </div>
            </div>
            
            <div className="flex-shrink-0" style={{ width: '110px', height: '110px' }}>
                <img 
                    src={imageSrc.startsWith('http') ? imageSrc : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${imageSrc.replace(/\\/g, '/')}`} 
                    alt={product.name} 
                    className="w-100 h-100 rounded-3 object-fit-cover shadow-sm"
                />
            </div>
        </div>
    );
};

export default MenuItemRow;
