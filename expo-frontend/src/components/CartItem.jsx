import React from 'react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';

// A component that displays a single product inside the shopping cart.
// It includes buttons to increase or decrease the quantity of the item.
const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const { product, quantity } = item;

    // Provide a fallback image just in case
    const imageSrc = getImageUrl(product.image);

    return (
        <div className="d-flex align-items-center py-3 border-bottom position-relative">
            {/* Image Thumbnail */}
            <div 
                className="rounded-3 overflow-hidden me-3 flex-shrink-0" 
                style={{ width: '60px', height: '60px' }}
            >
                <img src={imageSrc} alt={product.name} className="w-100 h-100 object-fit-cover" />
            </div>

            {/* Product Details */}
            <div className="flex-grow-1">
                <h6 className="mb-1 wolt-text-heading fw-bold">{product.name}</h6>
                <div className="text-muted small">₪{product.price.toFixed(2)}</div>
                
                <div className="fw-bold mt-1" style={{ color: 'var(--bs-primary)' }}>
                    ₪{(product.price * quantity).toFixed(2)}
                </div>
            </div>

            {/* Controls */}
            <div className="d-flex flex-column align-items-end justify-content-between h-100 ms-2">
                {/* Remove Item Button */}
                <button 
                    className="btn btn-link text-danger p-0 text-decoration-none mb-2" 
                    title="Remove item"
                    onClick={() => removeFromCart(product.id)}
                    style={{ fontSize: '1.2rem' }}
                >
                    🗑️
                </button>

                {/* Quantity Controls */}
                <div className="d-flex align-items-center bg-body-secondary rounded-pill px-2 py-1 border shadow-sm">
                    <button 
                        className="btn btn-sm text-primary fw-bold p-0 d-flex justify-content-center align-items-center" 
                        style={{ width: '24px', height: '24px', fontSize: '1.2rem' }}
                        onClick={() => updateQuantity(product.id, -1)}
                    >
                        -
                    </button>
                    <span className="mx-2 fw-bold wolt-text-heading" style={{ minWidth: '16px', textAlign: 'center' }}>
                        {quantity}
                    </span>
                    <button 
                        className="btn btn-sm text-primary fw-bold p-0 d-flex justify-content-center align-items-center" 
                        style={{ width: '24px', height: '24px', fontSize: '1.2rem' }}
                        onClick={() => updateQuantity(product.id, 1)}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
