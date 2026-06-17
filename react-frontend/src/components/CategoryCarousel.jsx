import React from 'react';
import RestaurantCard from './RestaurantCard';
import CardSkeletonLoader from './CardSkeletonLoader';

const CategoryCarousel = ({ title, restaurants, isLoading }) => {
    return (
        <div className="mb-5">
            <h3 className="fw-bold mb-3 wolt-text-heading px-1">{title}</h3>
            
            <div className="wolt-carousel-track px-1">
                {isLoading ? (
                    /* Render 4 skeletons if loading */
                    <>
                        <CardSkeletonLoader />
                        <CardSkeletonLoader />
                        <CardSkeletonLoader />
                        <CardSkeletonLoader />
                    </>
                ) : (
                    /* Map restaurants to cards */
                    restaurants.map(restaurant => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))
                )}
                
                {/* Fallback if loaded but empty */}
                {!isLoading && restaurants.length === 0 && (
                    <div className="text-muted fst-italic p-3">No restaurants available in this category.</div>
                )}
            </div>
        </div>
    );
};

export default CategoryCarousel;
