/**
 * Order Controller
 * Handles all HTTP requests for orders.
 */
const OrderModel = require('../models/orderModel');
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');
const TcpService = require('../services/tcpService');

const getOrdersHistory = (req, res) => {
    // Get the data from the request (make sure its authenticate)
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

    // Get all the restaurant's products utilizing the correct filtering endpoint from the model
    const restaurantProducts = ProductModel.getProductsByRestaurantId(restaurantId) || [];

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

        // Search for the item in the restaurantProducts matching identifiers as string primitives safely
        const catalogProduct = restaurantProducts.find(p => String(p.id) === String(productId));
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

    // Get only product's id's, and add each one by quantity to update cpp server
    const productIds = [];
    validatedItems.forEach(item => {
        const quantity = item.quantity || 1;
        for (let i = 0; i < quantity; i++) {
            productIds.push(item.productId);
        }
    });

    // Send the parameters to update the CPP server
    TcpService.sendPatchCommand(userId, productIds);

    // Set the location header properly on the response object
    res.setHeader('Location', order.path || `/api/orders/${order.id}`);
    
    // Return 201 with an entirely empty payload
    return res.status(201).end();
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

    // Enforce strict authorization checks to secure access scopes
    const currentUserId = req.authenticatedUser.id;
    if (String(order.userId) !== String(currentUserId)) {
        return res.status(403).json({ error: "Access denied: You are not authorized to view this order" });
    }

    // Return wanted response
    return res.status(200).json(order);
};

const updateOrderDetails = (req, res) => {
    // Get the variables
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
    if (String(order.userId) !== String(currentUserId)) {
        return res.status(403).json({ error: "Access denied: You are not authorized to edit this order" });
    }

    if (order.status === "ON_ITS_WAY" || order.status === "DELIVERED") {
        return res.status(400).json({ error: "Cannot update an order that is already on its way or delivered" });
    }

    // Get the old products id's ,and calculate each one's quantity to makr sure update the cpp server in the wanted way
    const oldProductIds = [];
    (order.items || []).forEach(item => {
        const quantity = item.quantity || 1;
        for (let i = 0; i < quantity; i++) {
            oldProductIds.push(item.productId || item);
        }
    });

    // Call the model's func
    const updatedOrder = OrderModel.updateOrderById(id, updates);

    // Get the new products id's ,and calculate each one's quantity to makr sure update the cpp server in the wanted way
    const newProductIds = [];
    (updatedOrder.items || []).forEach(item => {
        const quantity = item.quantity || 1;
        for (let i = 0; i < quantity; i++) {
            newProductIds.push(item.productId || item);
        }
    });

    // If the change is including products
    if (JSON.stringify(oldProductIds) !== JSON.stringify(newProductIds)) {
        // Delete old products from history
        TcpService.sendDeleteCommand(currentUserId, oldProductIds);
        // Send the parameters to update the CPP server 
        TcpService.sendPatchCommand(currentUserId, newProductIds);
    }

    return res.status(204).end();
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
    if (String(order.userId) !== String(currentUserId)) {
        return res.status(403).json({ error: "Access denied: You are not authorized to delete this order" });
    }

    if (order.status === "ON_ITS_WAY" || order.status === "DELIVERED" || order.status === "PREPARING") {
    return res.status(400).json({ error: "Cannot update an order that is already on preparation, on its way or delivered" });
    }

    // Get all the product id's fro, the order we want to delete
    const items = order.items;
    const productsToDelete = items.map(item => item.productId);

    // Call the model's func
    OrderModel.deleteOrderById(id);

    // Send the parameters to update the CPP server 
    TcpService.sendDeleteCommand(currentUserId ,productsToDelete);

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