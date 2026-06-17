import React from 'react';
import { useAuth } from '../context/authContext';

const ProductDetailsModal = ({ product, onClose, onAddToOrder }) => {
    const { user } = useAuth();
    
    if (!product) return null;

    // Use a high-res image
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';
    const imageSrc = product.image || fallbackImage;

    return (
        /* 
          1. The Dark Overlay (Backdrop)
          'position-fixed top-0 start-0 w-100 h-100' stretches this div over the entire screen.
          'zIndex: 1050' ensures it sits above everything else (like the Navbar).
          We attach 'onClick={onClose}' here so clicking anywhere outside the white modal closes it!
        */
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, padding: '20px' }}
            onClick={onClose} 
        >
            {/* 
              2. The Modal Container
              'onClick={e => e.stopPropagation()}' is CRITICAL here!
              Without it, clicking inside the white box would "bubble up" to the dark overlay 
              and trigger the 'onClose' function, closing the modal by mistake!
            */}
            <div 
                className="bg-body rounded-4 overflow-hidden shadow-lg position-relative d-flex flex-column"
                style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()} // Prevent clicks inside the white modal from bubbling up and closing it
            >
                {/* Floating Close Button */}
                <button 
                    className="btn btn-light position-absolute rounded-circle shadow-sm d-flex justify-content-center align-items-center"
                    style={{ top: '15px', right: '15px', zIndex: 10, width: '40px', height: '40px' }}
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Hero Image */}
                <div style={{ height: '250px' }}>
                    <img src={imageSrc} alt={product.name} className="w-100 h-100 object-fit-cover" />
                </div>

                {/* 
                  3. Content Details
                  'overflow-auto' allows this specific section to scroll if the description/ingredients 
                  are very long, preventing the modal from growing larger than the screen!
                  'flex-grow-1' pushes the footer down to the bottom.
                */}
                <div className="p-4 overflow-auto flex-grow-1 bg-body">
                    <h2 className="fw-bold wolt-text-heading mb-2">{product.name}</h2>
                    <p className="wolt-text-muted fs-5 mb-4">{product.description}</p>
                    
                    {/* Mock Ingredients & Allergens (To fulfill assignment "extended dish ingredients") */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-uppercase text-muted small mb-2">Ingredients & Allergens</h6>
                        <ul className="list-unstyled wolt-text-label small">
                            <li className="mb-1">✅ Freshly sourced local ingredients</li>
                            <li className="mb-1">⚠️ Contains: Gluten, Dairy, Soy</li>
                            <li className="mb-1">🌱 Vegetarian Option Available</li>
                        </ul>
                    </div>
                </div>

                {/* Footer Action (Sticky at the bottom) - Hidden for owners */}
                {user?.role !== 'owner' && (
                    <div className="p-3 border-top bg-body">
                        <button 
                            className="wolt-btn w-100 py-3 text-white fw-bold d-flex justify-content-between align-items-center fs-5"
                            onClick={() => {
                                onAddToOrder(product);
                                onClose();
                            }}
                        >
                            <span>Add to order</span>
                            <span>₪{product.price.toFixed(2)}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsModal;
