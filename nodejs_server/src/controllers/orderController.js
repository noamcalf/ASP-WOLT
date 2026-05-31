/**
 * Order Controller
 * Handles all HTTP requests for orders.
 */
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');


const getOrdersHistory = (req, res) => {
    // Get the data from the request
    const { userId } = req.authenticatedUser.id || {};

    // Search for orders via model
    const orders = OrderModel.getOrdersHistoryByUserId(userId);
    
    // Return wanted response
    return res.status(200).json(orders);
}

const createOrder = (req, res) => {
    // Get the data from the request
    const { restaurantId, items } = req.body || {};

    // Make sure we have restaurant and items to order
    if (!restaurantId) {
        return res.status(400).json({ error: "Validation failed: 'restaurantId' is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Validation failed: 'items' array cannot be empty" });
    }

    // Get all the restaurant's products
    const restaurantProducts = ProductModel.getProductFromRestaurant(restaurantId);

    // Vars for calculations
    const validatedItems = [];
    let totalPrice = 0;

    // Make sure all items are from the right restaurant
    for (const item of items) {
        // Get item's data
        const { productId, quantity } = item;

        // Check the item's data are valid
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ error: "Validation failed: Each item must have a valid productId and quantity greater than 0" });
        }

        // Search for the item in the restaurantProducts
        const catalogProduct = restaurantProducts.find(p => p.id === productId);
        // Handle the case we did not find it
        if (!catalogProduct) {
            return res.status(400).json({ error: `Validation failed: Product ID ${productId} does not exist in this restaurant's catalog` });
        }

        // Sum to order's total price
        totalPrice += catalogProduct.price * quantity;

        // The item is valid, add it to the array we created
        validatedItems.push({
            productId: catalogProduct.id,
            name: catalogProduct.name,
            price: catalogProduct.price,
            quantity: quantity
        });
    }

    // The order is valid
    // Get the authenticated user data
    const { id: userId, username, phoneNumber, address } = req.authenticatedUser;

    // Create the order via model func
    const order = OrderModel.createOrderInstance({
        userId,                           
        restaurantId,
        customerName: username,
        customerPhone: phoneNumber,
        shippingAddress: address,
        items: validatedItems,            
        totalPrice: totalPrice            
    });

    // Return the wanted response
    return res.status(201).json({
        message: "Order placed successfully",
        path: order.path,
        order: order
    });

};

module.exports = {
    createOrder,
    getOrdersHistory,
    getOrderDetails,
    updateOrderDetails,
    deleteOrder
};