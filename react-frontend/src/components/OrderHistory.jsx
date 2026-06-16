import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import OrderCard from './OrderCard';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Using the Global Interceptor! It adds the token automatically
                const { response, data } = await apiClient('/api/orders');

                if (!response.ok) {
                    throw new Error(data.message || 'Error fetching orders from server');
                }

                // Sort orders by newest first
                const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (err) {
                setError(err.message || 'Network error while fetching order history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border wolt-text-primary" role="status"></div>
                <p className="mt-3 wolt-text-muted fw-bold">Loading order history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger shadow-sm border-0 rounded-4">
                <span className="fw-bold">⚠️ Error: </span> {error}
            </div>
        );
    }

    return (
        <div className="order-history-container">
            <h3 className="fw-bold mb-4 pb-3 border-bottom wolt-text-heading">
                Past Orders ({orders.length})
            </h3>
            
            {orders.length === 0 ? (
                <div className="text-center p-5 wolt-role-box rounded-4 mt-4">
                    <span className="display-1">🛍️</span>
                    <h4 className="mt-3 fw-bold wolt-text-muted">You haven't placed any orders yet!</h4>
                    <p className="wolt-text-muted fs-5 mt-2">Now is the time to go back to the main screen and order something delicious.</p>
                </div>
            ) : (
                <div className="row mt-4">
                    {orders.map(order => (
                        <div key={order.id} className="col-12 col-xl-6 mb-4">
                            <OrderCard order={order} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
