/**
 * Order Model
 * Manages order entities inside the global dataStore as a flat resource.
 */
const crypto = require('crypto');
const dataStore = require('./dataStore');

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
        status: "PENDING",
        createdAt: new Date(),
        path: `/api/orders/${orderId}`
    }

    // Save it in dataStore
    dataStore.orders.push(newOrder);

    return newOrder;
}