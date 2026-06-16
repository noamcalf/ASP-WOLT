import React from 'react';

const OrderCard = ({ order }) => {
    // Format date string beautifully (English format)
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="card shadow-sm border-0 mb-3 h-100 rounded-4">
            <div className="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 wolt-text-primary">
                    Restaurant #{order.restaurantId}
                </h5>
                <span className="badge bg-secondary rounded-pill px-3 py-2">{order.status}</span>
            </div>
            
            <div className="card-body">
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
                
                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <span className="fw-bold wolt-text-heading">Total:</span>
                    <span className="fw-bold fs-5 wolt-text-heading">₪{order.totalPrice?.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
