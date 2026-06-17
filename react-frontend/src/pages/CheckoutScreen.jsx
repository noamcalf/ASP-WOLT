import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import { apiClient } from '../utils/apiClient';

const CheckoutScreen = () => {
    const { cartItems, totalPrice, activeRestaurantId } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [restaurantName, setRestaurantName] = useState('Loading restaurant...');
    const [isLoading, setIsLoading] = useState(true);

    // If the user manually navigated to /checkout but the cart is empty, send them back
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/');
        }
    }, [cartItems, navigate]);

    // Fetch the restaurant name so we can display it nicely on the receipt
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!activeRestaurantId) return;
            try {
                const { response, data } = await apiClient(`/api/restaurants/${activeRestaurantId}`);
                if (response.ok) {
                    setRestaurantName(data.name);
                } else {
                    setRestaurantName('Unknown Restaurant');
                }
            } catch (err) {
                setRestaurantName('Unknown Restaurant');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurant();
    }, [activeRestaurantId]);

    const handlePlaceOrder = () => {
        // We will implement the actual backend communication in the next task
        alert(`Order placed successfully!\nTotal: ₪${totalPrice.toFixed(2)}\nDelivery to: ${user.address?.street} ${user.address?.houseNumber}, ${user.address?.city}`);
    };

    if (isLoading || cartItems.length === 0) {
        return (
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-body">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                
                <h1 className="fw-bold wolt-text-heading mb-4">Checkout</h1>

                <div className="row g-4">
                    {/* Left Pane: Delivery Details */}
                    <div className="col-12 col-md-7">
                        <div className="bg-body p-4 rounded-4 shadow-sm border border-light">
                            <h4 className="fw-bold mb-4 wolt-text-heading">Delivery Details</h4>
                            
                            <div className="mb-3">
                                <label className="text-muted small fw-bold text-uppercase mb-1">Delivering to</label>
                                <div className="d-flex align-items-start">
                                    <span className="fs-4 me-2">📍</span>
                                    <div>
                                        <div className="fw-bold fs-5">{user.address?.street} {user.address?.houseNumber}</div>
                                        <div className="text-muted">{user.address?.city}</div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4 text-muted" />

                            <div className="mb-3">
                                <label className="text-muted small fw-bold text-uppercase mb-1">Contact Info</label>
                                <div className="d-flex align-items-start">
                                    <span className="fs-4 me-2">📞</span>
                                    <div>
                                        <div className="fw-bold fs-5">{user.name || user.username}</div>
                                        <div className="text-muted">{user.phoneNumber}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Pane: Order Summary */}
                    <div className="col-12 col-md-5">
                        <div className="bg-body p-4 rounded-4 shadow-sm border border-light sticky-top" style={{ top: '100px' }}>
                            <h4 className="fw-bold mb-2 wolt-text-heading">Your Order</h4>
                            <p className="text-muted mb-4">From <strong className="text-dark">{restaurantName}</strong></p>

                            <ul className="list-unstyled mb-4">
                                {cartItems.map(item => (
                                    <li key={item.product.id} className="d-flex justify-content-between mb-3">
                                        <div>
                                            <span className="fw-bold me-2">{item.quantity}x</span>
                                            <span className="text-dark">{item.product.name}</span>
                                        </div>
                                        <span className="fw-semibold">₪{(item.product.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>

                            <hr className="my-4 text-muted" />

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fs-5 fw-bold text-muted">Total</span>
                                <span className="fs-3 fw-bold wolt-text-heading">₪{totalPrice.toFixed(2)}</span>
                            </div>

                            <button 
                                className="wolt-btn w-100 py-3 text-white fw-bold fs-5 shadow-sm"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutScreen;
