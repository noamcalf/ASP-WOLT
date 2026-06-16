import React from 'react';

const CardSkeletonLoader = () => {
    return (
        <div className="wolt-restaurant-card border-0 shadow-sm d-flex flex-column h-100">
            {/* Image Placeholder */}
            <div className="wolt-shimmer w-100" style={{ height: '160px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}></div>
            
            {/* Content Placeholder */}
            <div className="p-3 d-flex flex-column flex-grow-1">
                {/* Title Line */}
                <div className="wolt-shimmer rounded mb-2" style={{ height: '24px', width: '70%' }}></div>
                
                {/* Subtitle Line (Cuisine) */}
                <div className="wolt-shimmer rounded mb-3" style={{ height: '16px', width: '40%' }}></div>
                
                <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    {/* Rating Pill */}
                    <div className="wolt-shimmer rounded-pill" style={{ height: '24px', width: '50px' }}></div>
                    {/* Delivery Time / Distance */}
                    <div className="wolt-shimmer rounded" style={{ height: '16px', width: '60px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default CardSkeletonLoader;
