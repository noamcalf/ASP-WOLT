import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import DeleteButton from './DeleteButton';

const OrderCard = ({ order, onOrderCancelled, onEditOrder }) => {
    // Format date string beautifully (English format)
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const [restaurantName, setRestaurantName] = useState(`Restaurant #${order.restaurantId.slice(0, 8)}`);

    // Effect to fetch the actual restaurant name instead of showing its UUID
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                // Fetch the restaurant details by its ID
                const { response, data } = await apiClient(`/api/restaurants/${order.restaurantId}`);
                if (response.ok && data?.name) {
                    setRestaurantName(data.name); // Replace the UUID with the real name
                }
            } catch (err) {
                // Ignore gracefully, keep fallback name if network fails or restaurant was deleted
            }
        };
        fetchRestaurant();
    }, [order.restaurantId]);

    return (
        <div className="card shadow-sm border-0 mb-3 h-100 rounded-4">
            <div className="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 wolt-text-primary">
                    {restaurantName}
                </h5>
                <span className="badge bg-secondary rounded-pill px-3 py-2">{order.status}</span>
            </div>
            
            <div className="card-body d-flex flex-column">
                <p className="wolt-text-muted small mb-3">📅 {orderDate}</p>
                
                <div className="mb-3">
                    <strong className="d-block mb-2 wolt-text-heading">Items:</strong>
                    <ul className="list-group list-group-flush">
                        {order.items && order.items.map((item, index) => (
                            <li key={index} className="list-group-item px-0 py-2 border-0 d-flex justify-content-between wolt-text-muted bg-transparent">
                                <span><span className="fw-bold wolt-text-heading">{item.quantity}x</span> {item.name}</span>
                                <span className="wolt-text-heading">₪{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mb-3">
                        <span className="fw-bold wolt-text-heading">Total:</span>
                        <span className="fw-bold fs-5 wolt-text-heading">₪{order.totalPrice?.toFixed(2)}</span>
                    </div>
                
                {order.status === 'PENDING' && (
                    <div className="d-flex gap-2">
                        {onEditOrder && (
                            <button 
                                className="btn btn-outline-primary flex-grow-1 rounded-pill py-2 fw-bold"
                                onClick={onEditOrder}
                            >
                                Edit Order
                            </button>
                        )}
                        {onOrderCancelled && (
                            <DeleteButton 
                                endpoint={`/api/orders/${order.id}`}
                                confirmationMessage="Are you sure you want to cancel this order?"
                                onSuccess={onOrderCancelled}
                                className="btn-outline-danger flex-grow-1 rounded-pill py-2 fw-bold"
                            >
                                Cancel Order
                            </DeleteButton>
                        )}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
