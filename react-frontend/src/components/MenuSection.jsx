import React from 'react';
import MenuItemRow from './MenuItemRow';

const MenuSection = ({ title, products, onProductClick }) => {
    // Hide the section entirely if there are no products in this category
    if (!products || products.length === 0) return null;

    return (
        <div className="mb-5">
            {/* The category title (e.g., "Starters", "Mains") */}
            <h3 className="fw-bold mb-4 wolt-text-heading">{title}</h3>
            
            {/* A responsive grid: 1 column on small screens, 2 columns on medium+ screens */}
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-12 col-lg-6 px-3">
                        <MenuItemRow product={product} onClick={onProductClick} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuSection;
