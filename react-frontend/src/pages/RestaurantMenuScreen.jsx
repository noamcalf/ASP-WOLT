import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { useAuth } from '../context/authContext';
import { calculateDistance, estimateDeliveryTime } from '../utils/geolocationUtils';

import RestaurantHeaderCard from '../components/RestaurantHeaderCard';
import MenuSection from '../components/MenuSection';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useCart } from '../context/CartContext';

const RestaurantMenuScreen = () => {
    // useParams() is a React Router hook that extracts the dynamic parts of the URL.
    // For example, if the URL is '/restaurant/123', 'id' will be '123'.
    const { id } = useParams();
    const { user } = useAuth();

    // State management for our component:
    // 'restaurant' holds the restaurant metadata (name, image, etc.)
    // 'products' holds the array of all menu items.
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State to control the Product Details Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Connect to the global Cart Context
    const { addToCart } = useCart();

    // useEffect runs when the component mounts, or when the 'id' variable changes.
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                // Promise.all is a super powerful JavaScript feature!
                // Instead of fetching the restaurant, WAITING, and then fetching the products,
                // Promise.all fires BOTH requests to the server at the exact same time (concurrently),
                // cutting the loading time in half!
                const [restaurantRes, productsRes] = await Promise.all([
                    apiClient(`/api/restaurants/${id}`),
                    apiClient(`/api/restaurants/${id}/products`)
                ]);

                if (!restaurantRes.response.ok) throw new Error(restaurantRes.data?.error || 'Failed to load restaurant');
                if (!productsRes.response.ok) throw new Error(productsRes.data?.error || 'Failed to load menu');

                let fetchedRestaurant = restaurantRes.data;
                let distanceKm = null;
                let deliveryTimeMins = fetchedRestaurant.baseDeliveryTime;

                if (user?.geolocation?.latitude && user?.geolocation?.longitude && fetchedRestaurant?.geolocation?.latitude && fetchedRestaurant?.geolocation?.longitude) {
                    distanceKm = calculateDistance(
                        user.geolocation.latitude, 
                        user.geolocation.longitude,
                        fetchedRestaurant.geolocation.latitude,
                        fetchedRestaurant.geolocation.longitude
                    );
                    deliveryTimeMins = estimateDeliveryTime(distanceKm);
                }

                setRestaurant({
                    ...fetchedRestaurant,
                    distanceKm,
                    deliveryTimeMins
                });
                setProducts(productsRes.data);
            } catch (err) {
                setError(err.message || 'Network error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id]);

    // Handle adding a product to the basket
    const handleAddToOrder = (product) => {
        const result = addToCart(product);
        if (!result.success) {
            // Blocked by cross-restaurant logic
            alert(result.error);
        }
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

    // Data Transformation: Grouping Products
    // We receive a flat array of products: [{name: "Pizza", category: "Mains"}, {name: "Cola", category: "Drinks"}]
    // We want to group them into an object so we can render sections: 
    // { "Mains": [Pizza, ...], "Drinks": [Cola, ...] }
    // The 'reduce' function iterates over the array and builds this object dynamically.
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
