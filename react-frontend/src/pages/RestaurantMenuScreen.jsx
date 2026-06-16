import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

import RestaurantHeaderCard from '../components/RestaurantHeaderCard';
import MenuSection from '../components/MenuSection';
import ProductDetailsModal from '../components/ProductDetailsModal';

const RestaurantMenuScreen = () => {
    // Extract the dynamic 'id' parameter from the URL (/restaurant/:id)
    const { id } = useParams();

    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State to control the Product Details Modal
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                // Fetch restaurant details and its menu products concurrently
                const [restaurantRes, productsRes] = await Promise.all([
                    apiClient(`/api/restaurants/${id}`),
                    apiClient(`/api/restaurants/${id}/products`)
                ]);

                if (!restaurantRes.response.ok) throw new Error(restaurantRes.data?.error || 'Failed to load restaurant');
                if (!productsRes.response.ok) throw new Error(productsRes.data?.error || 'Failed to load menu');

                setRestaurant(restaurantRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                setError(err.message || 'Network error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id]);

    // Handle adding a product to the basket (for now, just a placeholder log)
    const handleAddToOrder = (product) => {
        console.log("Added to order:", product.name, product.price);
        // Future implementation: Dispatch to Redux or Context API cart state
    };

    if (isLoading) {
        return (
            <div className="container-fluid min-vh-100 py-5 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="container-fluid min-vh-100 py-5 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
                <h3 className="text-danger mb-4">⚠️ {error || 'Restaurant not found'}</h3>
                <Link to="/" className="wolt-btn text-white px-4 py-2 text-decoration-none">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    // Group products by their category (e.g. "Mains", "Starters")
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <div className="container-fluid min-vh-100 py-4" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                
                {/* 1. The Main Billboard Header */}
                <RestaurantHeaderCard restaurant={restaurant} />

                {/* 2. Menu Content Layout */}
                <div className="row mt-5">
                    
                    {/* Left Sidebar: Quick Navigation (Optional extra for Premium UI, but we'll leave space or use full width) */}
                    {/* In a real app we'd have anchor links here, but we'll use full width for simplicity */}
                    <div className="col-12">
                        {Object.entries(groupedProducts).length === 0 ? (
                            <div className="text-center text-muted p-5 bg-light rounded-4">
                                <h5>No items found in this menu.</h5>
                            </div>
                        ) : (
                            // Render a MenuSection for each category group
                            Object.entries(groupedProducts).map(([categoryName, items]) => (
                                <MenuSection 
                                    key={categoryName} 
                                    title={categoryName} 
                                    products={items} 
                                    onProductClick={setSelectedProduct} // Opens the modal
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* 3. The Dynamic Modal Pop-up */}
            {/* If selectedProduct has a value, render the modal on top of the screen */}
            {selectedProduct && (
                <ProductDetailsModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                    onAddToOrder={handleAddToOrder}
                />
            )}
        </div>
    );
};

export default RestaurantMenuScreen;
