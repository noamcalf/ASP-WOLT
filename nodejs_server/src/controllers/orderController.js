/**
 * Order Controller
 * Handles all HTTP requests for orders.
 */
const OrderModel = require('../models/orderModel');
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');
const { OrderStatus } = OrderModel;


const getOrdersHistory = (req, res) => {
    // Get the data from the request
    const userId = req.authenticatedUser.id;

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

    const restaurant = RestaurantModel.getRestaurant(restaurantId);

    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
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

const getOrderDetails = (req, res) => {
    // Get orderId from URL
    const { id } = req.params;

    // Search for the order via model
    const order = OrderModel.getOrderDetailsById(id);

    // If order doesn't exist, return 404
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    // Make sure that only the user is trying to get his order
    const currentUserId = req.authenticatedUser.id;
    if (order.userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied: You are not authorized to view this order" });
    }

    // Return wanted response
    return res.status(200).json(order);
};

const updateOrderDetails = (req, res) => {
    // Get the variabels
    const { id } = req.params;
    const updates = req.body || {};

    // Search for the order via model
    const order = OrderModel.getOrderDetailsById(id);

    // If order doesn't exist, return 404
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    // Make sure only the user can update his order
    const currentUserId = req.authenticatedUser.id;
    if (order.userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied: You are not authorized to edit this order" });
    }

    if (order.status === "ON_ITS_WAY" || order.status === "DELIVERED") {
    return res.status(400).json({ error: "Cannot update an order that is already on its way or delivered" });
}

    // Call the model's func
    const updatedOrder = OrderModel.updateOrderById(id, updates);

    return res.status(200).json(updatedOrder);
}; 

const deleteOrder = (req, res) => {
    // Get orderId from URL
    const { id } = req.params;

    // Search for the order via model
    const order = OrderModel.getOrderDetailsById(id);

    // If order doesn't exist, return 404
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    // Make sure that only the user is trying to delete his order
    const currentUserId = req.authenticatedUser.id;
    if (order.userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied: You are not authorized to delete this order" });
    }

    if (order.status === "ON_ITS_WAY" || order.status === "DELIVERED" || order.status === "PREPARING") {
    return res.status(400).json({ error: "Cannot update an order that is already on preparation, on its way or delivered" });
    }

    // Call the model's func
    OrderModel.deleteOrderById(id);

    // Return wanted response
    return res.status(204).end();
};

module.exports = {
    createOrder,
    getOrdersHistory,
    getOrderDetails,
    updateOrderDetails,
    deleteOrder
};