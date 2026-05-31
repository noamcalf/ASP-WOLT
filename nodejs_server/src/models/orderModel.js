/**
 * Order Model
 * Manages order entities inside the global dataStore as a flat resource.
 */
const crypto = require('crypto');
const dataStore = require('./dataStore');

// Const status ENUM
const OrderStatus = Object.freeze({
    PENDING: 'PENDING',
    PREPARING: 'PREPARING',
    ON_ITS_WAY: 'ON_ITS_WAY',
    DELIVERED: 'DELIVERED'
});

const getOrdersHistoryByUserId = (userId) => {
    // Search for all the orders that have the same userId
    const orders = dataStore.orders.filter(o => o.userId === userId);
    return orders;
};

const createOrderInstance = (orderData) => {
    // Create unique orderId
    const orderId = crypto.randomUUID();

    // Create the order object
    const newOrder = {
        id: orderId,
        ...orderData,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        path: `/api/orders/${orderId}`
    }

    // Save it in dataStore
    dataStore.orders.push(newOrder);

    return newOrder;
}

const getOrderDetailsById = (id) => {
    // Search the order in the order array
    const order = dataStore.orders.find(o => o.id === id);
    return order;
};

const updateOrderById = (id, updates) => {
    // Search the order in the order array
    const order = dataStore.orders.find(o => o.id === id);

    // Safely update specified fields if they are provided in the payload
    if (updates.status !== undefined) order.status = updates.status;
    if (updates.restaurantId !== undefined) order.restaurantId = updates.restaurantId;
    if (updates.customerName !== undefined) order.customerName = updates.customerName;
    if (updates.customerPhone !== undefined) order.customerPhone = updates.customerPhone;
    if (updates.shippingAddress !== undefined) order.shippingAddress = updates.shippingAddress;

    // Items changed, total price should be re-calculated
    if (updates.items !== undefined) {
        // Make sure new products are from the same restaurant
        const restaurantProducts = dataStore.products.filter(p => p.restaurantId === order.restaurantId);
        const validItems = [];
        // Sum the new price
        let newTotalPrice = 0;
        // Iterate all the new items
        for (const item of updates.items) {
            // Make sure we find the new product by id from the same restaurant
            const catalogProduct = restaurantProducts.find(p => p.id === item.productId);
            if (catalogProduct) {
                item.name = catalogProduct.name;
                item.price = catalogProduct.price;
                newTotalPrice += catalogProduct.price * item.quantity;
                validItems.push(item);
            }
        }
        order.items = validItems;
        order.totalPrice = newTotalPrice;
    }

    return order;
};

const deleteOrderById = (id) => {
    // Search the order in the order array and save the index
    const index = dataStore.orders.findIndex(o => o.id === id);
    if (index !== -1) {
        // Remove one instance of the order from the order array
        dataStore.orders.splice(index, 1);
        return true;
    }
    return false;
};



module.exports = {
    getOrdersHistoryByUserId,
    createOrderInstance,
    getOrderDetailsById,
    updateOrderById,
    deleteOrderById,
    OrderStatus
};