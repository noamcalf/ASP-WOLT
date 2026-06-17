import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const CartDrawer = () => {
    const { isCartOpen, toggleCart, cartItems, totalPrice, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // If the cart is totally closed, we don't render the backdrop to allow clicking the underlying page
    if (!isCartOpen && cartItems.length === 0) {
        // Optimization: if it's closed and empty, don't even mount the heavy DOM elements
        // Actually, for animation, it's better to keep it mounted but translated off-screen.
        // We'll control visibility purely via CSS.
    }

    return (
        <>
            {/* Dark Overlay (Backdrop) */}
            {/* It fades in/out based on isCartOpen. Pointer events disabled when closed. */}
            <div 
                className={`position-fixed top-0 start-0 w-100 h-100 wolt-overlay-dark ${!isCartOpen ? 'opacity-0' : ''}`}
                style={{ 
                    pointerEvents: isCartOpen ? 'auto' : 'none'
                }}
                onClick={toggleCart} // Clicking outside closes the drawer
            ></div>

            {/* The Drawer Panel */}
            <div 
                className={`position-fixed top-0 end-0 h-100 bg-body shadow-lg d-flex flex-column wolt-side-drawer ${isCartOpen ? 'wolt-side-drawer-open' : ''}`}
            >
                {/* Drawer Header */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-body">
                    <h4 className="m-0 fw-bold wolt-text-heading">Your Order</h4>
                    <button 
                        className="btn btn-light wolt-icon-btn"
                        onClick={toggleCart}
                    >
                        ✕
                    </button>
                </div>

                {/* Drawer Body (Scrollable Cart Items) */}
                <div className="flex-grow-1 overflow-auto p-4 bg-body">
                    {cartItems.length === 0 ? (
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted">
                            <div style={{ fontSize: '4rem' }}>🛒</div>
                            <h5 className="mt-3 wolt-text-heading fw-bold">Your cart is empty</h5>
                            <p>Add some delicious food to get started!</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column">
                            {/* Clear Cart Button */}
                            <div className="d-flex justify-content-end mb-3">
                                <button 
                                    className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>
                            </div>
                            
                            {/* Render each item */}
                            {cartItems.map(item => (
                                <CartItem key={item.product.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Drawer Footer (Checkout) */}
                {cartItems.length > 0 && (
                    <div className="p-4 border-top bg-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fs-5 text-muted fw-semibold">Total</span>
                            <span className="fs-4 fw-bold wolt-text-heading">₪{totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                            className="wolt-btn w-100 py-3 text-white fw-bold fs-5 shadow-sm"
                            onClick={() => {
                                toggleCart(); // Close the drawer first
                                if (isAuthenticated) {
                                    // User is logged in - take them to the actual checkout screen
                                    navigate('/checkout');
                                } else {
                                    // User is a guest - force them to log in before checking out
                                    navigate('/login');
                                }
                            }}
                        >
                            Go to checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
