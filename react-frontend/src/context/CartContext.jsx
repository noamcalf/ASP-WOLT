import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Stores array of objects: { product, quantity }
    const [cartItems, setCartItems] = useState([]);
    // Tracks the restaurant we are currently ordering from
    const [activeRestaurantId, setActiveRestaurantId] = useState(null);
    // Controls the visibility of the side drawer
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Derived state for quick access
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const addToCart = (product) => {
        // Validate cross-restaurant ordering
        if (cartItems.length === 0) {
            // First item added -> lock the restaurant ID
            setActiveRestaurantId(product.restaurantId);
        } else if (activeRestaurantId !== product.restaurantId) {
            // Trying to add from a different restaurant -> Reject
            return { success: false, error: 'You can only order from one restaurant at a time. Please clear your cart first.' };
        }

        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
            if (existingItemIndex >= 0) {
                // Product exists, increment quantity
                const newItems = [...prev];
                newItems[existingItemIndex].quantity += 1;
                return newItems;
            } else {
                // New product
                return [...prev, { product, quantity: 1 }];
            }
        });

        // Auto-open cart to show user their addition
        setIsCartOpen(true);
        return { success: true };
    };

    const updateQuantity = (productId, delta) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    return { ...item, quantity: item.quantity + delta };
                }
                return item;
            }).filter(item => item.quantity > 0); // Automatically remove items with 0 quantity
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
        setActiveRestaurantId(null);
    };

    // Listen for cart emptying to release the restaurant lock
    // A clean approach: If cartItems becomes empty after any operation, clear activeRestaurantId
    React.useEffect(() => {
        if (cartItems.length === 0) {
            setActiveRestaurantId(null);
        }
    }, [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            activeRestaurantId,
            isCartOpen,
            totalItems,
            totalPrice,
            toggleCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
