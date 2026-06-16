import React from 'react';
import { Link } from 'react-router-dom';

const SearchDropdownTray = ({ results, isLoading, isOpen, searchQuery }) => {
    if (!isOpen || !searchQuery.trim()) return null;

    const hasRestaurants = results?.restaurants?.length > 0;
    const hasProducts = results?.products?.length > 0;
    const hasResults = hasRestaurants || hasProducts;

    return (
        <div 
            className="position-absolute bg-white shadow-lg rounded-4 overflow-hidden mt-2 w-100" 
            style={{ 
                top: '100%', 
                left: 0, 
                zIndex: 1050, 
                maxHeight: '400px', 
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                display: 'block'
            }}
        >
            {isLoading ? (
                <div className="p-4 text-center text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Searching...
                </div>
            ) : !hasResults ? (
                <div className="p-4 text-center text-muted">
                    No results found for "{searchQuery}"
                </div>
            ) : (
                <div className="py-2">
                    {/* Restaurants Section */}
                    {hasRestaurants && (
                        <div className="mb-2">
                            <h6 className="px-3 py-2 m-0 text-muted small fw-bold text-uppercase tracking-wider bg-light">
                                Restaurants
                            </h6>
                            {results.restaurants.map(restaurant => (
                                <Link 
                                    key={`rest-${restaurant.id}`} 
                                    to={`/restaurant/${restaurant.id}`}
                                    className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
                                >
                                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                        🍽️
                                    </div>
                                    <div>
                                        <div className="fw-bold">{restaurant.name}</div>
                                        <div className="text-muted small">Restaurant</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Products Section */}
                    {hasProducts && (
                        <div>
                            <h6 className="px-3 py-2 m-0 text-muted small fw-bold text-uppercase tracking-wider bg-light">
                                Menu Items
                            </h6>
                            {results.products.map(product => (
                                <Link 
                                    key={`prod-${product.id}`} 
                                    to={`/restaurant/${product.restaurantId}`} // Link to the restaurant that has this product
                                    className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
                                >
                                    <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                        🍔
                                    </div>
                                    <div>
                                        <div className="fw-bold">{product.name}</div>
                                        <div className="text-muted small">₪{product.price}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropdownTray;
