import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import MenuItemRow from '../components/MenuItemRow';

// The page that shows search results when a user types into the search bar.
// It groups results into matching Restaurants and matching Menu Items.
const SearchResultsView = () => {
    const { query } = useParams();
    const [results, setResults] = useState({ restaurants: [], products: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Whenever the search query changes in the URL, this function fetches new results from the server.
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
                                        <RestaurantCard restaurant={restaurant} />
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
                                    <div key={`prod-${product.id}`} className="col-12 col-md-6 col-lg-6">
                                        <Link to={`/restaurant/${product.restaurantId}`} className="text-decoration-none d-block h-100">
                                            <MenuItemRow product={product} onClick={() => {}} />
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
