import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import OrderCard from './OrderCard';
import EditOrderModal from './EditOrderModal';
import { useAuth } from '../context/authContext';

// A component that displays a list of past orders.
// For customers, it shows what they've bought. For restaurant owners, it shows incoming orders.
const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

    const isOwner = user?.role === 'owner';
    const titleText = isOwner ? 'Incoming Orders' : 'Past Orders';
    const emptyIcon = isOwner ? '🏪' : '🛍️';
    const emptyTitle = isOwner ? "No orders for your restaurants yet!" : "You haven't placed any orders yet!";
    const emptyDesc = isOwner ? "Orders placed by customers at your restaurants will appear here." : "Now is the time to go back to the main screen and order something delicious.";

    // Fetches the list of orders from the server.
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { response, data } = await apiClient('/api/orders');

            if (!response.ok) {
                throw new Error(data.message || 'Error fetching orders from server');
            }

            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            setError(err.message || 'Network error while fetching order history');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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
                {titleText} ({orders.length})
            </h3>
            
            {orders.length === 0 ? (
                <div className="text-center p-5 wolt-role-box rounded-4 mt-4">
                    <span className="display-1">{emptyIcon}</span>
                    <h4 className="mt-3 fw-bold wolt-text-muted">{emptyTitle}</h4>
                    <p className="wolt-text-muted fs-5 mt-2">{emptyDesc}</p>
                </div>
            ) : (
                <div className="row mt-4">
                    {/* Loop through all orders and display a card for each one */}
                    {orders.map(order => (
                        <div key={order.id} className="col-12 col-xl-6 mb-4">
                            <OrderCard 
                                order={order} 
                                onOrderCancelled={fetchOrders} 
                                onEditOrder={() => setEditingOrder(order)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {editingOrder && (
                <EditOrderModal 
                    order={editingOrder} 
                    onClose={() => setEditingOrder(null)} 
                    onSaveSuccess={() => {
                        setEditingOrder(null);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
};

export default OrderHistory;
