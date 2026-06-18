import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageUtils';

const EditOrderModal = ({ order, onClose, onSaveSuccess }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Map of productId -> quantity
    const [itemQuantities, setItemQuantities] = useState({});

    // Effect to fetch fresh order data and restaurant menu when the modal opens
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch the freshest order details from the server
                // This guarantees the order is still PENDING and hasn't been advanced by the restaurant
                const { response: orderRes, data: orderData } = await apiClient(`/api/orders/${order.id}`);
                if (!orderRes.ok) throw new Error(orderData?.error || 'Failed to fetch fresh order details');
                
                // If the order moved to PREPARING or beyond, block editing
                if (orderData.status !== 'PENDING') {
                    throw new Error('This order is no longer pending and cannot be edited.');
                }

                // 2. Initialize the local item quantities state from the FRESH order data
                // We map it to an object like: { [productId]: quantity } for easy O(1) lookups
                const initialQuantities = {};
                if (orderData && orderData.items) {
                    orderData.items.forEach(item => {
                        initialQuantities[item.productId || item.id] = item.quantity;
                    });
                }
                setItemQuantities(initialQuantities);

                // 3. Fetch the full restaurant menu so the user can add new items to the order
                const { response: menuRes, data: menuData } = await apiClient(`/api/restaurants/${order.restaurantId}/products`);
                if (!menuRes.ok) throw new Error(menuData?.error || 'Failed to fetch menu');
                setProducts(menuData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [order]);

    // Function to handle clicking + or - on a product
    const handleUpdateQuantity = (productId, delta) => {
        setItemQuantities(prev => {
            const currentQuantity = prev[productId] || 0;
            const newQuantity = currentQuantity + delta;
            
            // If quantity drops to 0 or below, remove the item entirely from the order payload
            if (newQuantity <= 0) {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            }
            
            return { ...prev, [productId]: newQuantity };
        });
    };

    // Function to submit the patched order to the server
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        // Construct items array format expected by the backend
        const updatedItems = Object.entries(itemQuantities).map(([productId, quantity]) => ({
            productId,
            quantity
        }));

        if (updatedItems.length === 0) {
            setError("Your order must have at least one item. If you want to cancel, use the Cancel button.");
            setIsSaving(false);
            return;
        }

        try {
            const { response, data } = await apiClient(`/api/orders/${order.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ items: updatedItems })
            });

            if (!response.ok) throw new Error(data?.error || 'Failed to update order');
            
            onSaveSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate new total
    const newTotal = products.reduce((acc, product) => {
        const qty = itemQuantities[product.id] || 0;
        return acc + (product.price * qty);
    }, 0);

    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, padding: '20px' }}
            onClick={onClose}
        >
            <div 
                className="bg-body rounded-4 shadow-lg position-relative d-flex flex-column"
                style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold mb-0 wolt-text-heading">Edit Order</h4>
                    <button 
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-auto flex-grow-1 bg-body-tertiary">
                    {error && (
                        <div className="alert alert-danger shadow-sm border-0 rounded-3 mb-4">
                            <span className="fw-bold">⚠️ Error:</span> {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border wolt-text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {products.map(product => {
                                const quantity = itemQuantities[product.id] || 0;
                                const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
                                const imageSrc = getImageUrl(product.image, fallbackImage);

                                return (
                                    <div key={product.id} className="bg-body p-3 rounded-4 shadow-sm border d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--bs-border-color-translucent)' }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{ width: '60px', height: '60px' }}>
                                                <img src={imageSrc} alt={product.name} className="w-100 h-100 object-fit-cover rounded-3" />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-1 wolt-text-heading">{product.name}</h6>
                                                <div className="wolt-text-primary fw-bold">₪{product.price.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center bg-body-secondary rounded-pill p-1 border">
                                            <button 
                                                className="btn btn-sm rounded-circle d-flex justify-content-center align-items-center bg-body shadow-sm"
                                                style={{ width: '32px', height: '32px', color: 'var(--bs-primary)' }}
                                                onClick={() => handleUpdateQuantity(product.id, -1)}
                                                disabled={quantity === 0}
                                            >
                                                <span className="fw-bold fs-5">-</span>
                                            </button>
                                            
                                            <span className="fw-bold mx-3 fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>
                                                {quantity}
                                            </span>
                                            
                                            <button 
                                                className="btn btn-sm rounded-circle d-flex justify-content-center align-items-center bg-body shadow-sm"
                                                style={{ width: '32px', height: '32px', color: 'var(--bs-primary)' }}
                                                onClick={() => handleUpdateQuantity(product.id, 1)}
                                            >
                                                <span className="fw-bold fs-5">+</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-top bg-body d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-muted small d-block">New Total</span>
                        <span className="fs-4 fw-bold wolt-text-heading">₪{newTotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-light px-4 py-2 fw-bold border rounded-pill" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            className="wolt-btn text-white px-4 py-2" 
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOrderModal;
