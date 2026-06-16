import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SearchResultsView = () => {
    const { query } = useParams();
    const [results, setResults] = useState({ restaurants: [], products: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/search/${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const hasRestaurants = results.restaurants?.length > 0;
    const hasProducts = results.products?.length > 0;
    const hasAnyResults = hasRestaurants || hasProducts;

    return (
        <div className="container py-5 min-vh-100">
            <h2 className="mb-4 fw-bold wolt-text-heading">
                Search results for: <span className="text-primary">"{query}"</span>
            </h2>

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : !hasAnyResults ? (
                <div className="text-center py-5 text-muted">
                    <h3 className="wolt-text-muted">No exact matches found</h3>
                    <p>Try checking your spelling or using less specific keywords.</p>
                </div>
            ) : (
                <>
                    {/* Restaurants Grid */}
                    {hasRestaurants && (
                        <div className="mb-5">
                            <h4 className="fw-bold mb-4 wolt-text-heading">Restaurants</h4>
                            <div className="row g-4">
                                {results.restaurants.map((restaurant) => (
                                    <div key={`rest-${restaurant.id}`} className="col-12 col-md-6 col-lg-4">
                                        <Link to={`/restaurant/${restaurant.id}`} className="text-decoration-none">
                                            <div className="card h-100 wolt-result-card border-0 shadow-sm rounded-4 overflow-hidden">
                                                {/* Placeholder for restaurant image */}
                                                <div className="wolt-card-img-top bg-light d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                                                    <span style={{ fontSize: '3rem' }}>🏪</span>
                                                </div>
                                                <div className="card-body bg-white d-flex flex-column">
                                                    <h5 className="card-title fw-bold text-dark mb-1">{restaurant.name}</h5>
                                                    <p className="card-text text-muted small">Restaurant</p>
                                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                                        <span className="badge bg-primary rounded-pill px-3 py-2">Open</span>
                                                        
                                                        {/* Display Rating or "New!" if rating is 0 */}
                                                        {restaurant.rating === 0 ? (
                                                            <span className="badge bg-success rounded-pill px-2 py-1">New! 🌟</span>
                                                        ) : restaurant.rating > 0 ? (
                                                            <span className="badge border px-2 py-1 wolt-rating-badge">⭐ {restaurant.rating}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products/Menu Items Grid */}
                    {hasProducts && (
                        <div>
                            <h4 className="fw-bold mb-4 wolt-text-heading">Menu Items</h4>
                            <div className="row g-4">
                                {results.products.map((product) => (
                                    <div key={`prod-${product.id}`} className="col-12 col-md-6 col-lg-4">
                                        <Link to={`/restaurant/${product.restaurantId}`} className="text-decoration-none">
                                            <div className="card h-100 wolt-result-card border-0 shadow-sm rounded-4 overflow-hidden">
                                                {/* Placeholder for product image */}
                                                <div className="wolt-card-img-top bg-light d-flex justify-content-center align-items-center" style={{ height: '140px' }}>
                                                    <span style={{ fontSize: '3rem' }}>🍔</span>
                                                </div>
                                                <div className="card-body bg-white d-flex flex-column">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h5 className="card-title fw-bold text-dark mb-0 pe-2">{product.name}</h5>
                                                        <span className="fw-bold text-primary">₪{product.price}</span>
                                                    </div>
                                                    {product.description && (
                                                        <p className="card-text text-muted small mb-0 wolt-line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResultsView;
