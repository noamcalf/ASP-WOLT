const User = require('../models/userModel');
const Order = require('../models/orderModel').Order;
const tcpService = require('../services/tcpService');

/**
 * Synchronizes the MongoDB data with the C++ recommendation server.
 * This is meant to be run on server startup to reconstruct the C++ server's 
 * in-memory graph and the Node.js UUID-to-Integer mapping.
 */
const syncDatabaseWithCppServer = async () => {
    try {
        console.log('[Sync] Starting MongoDB to C++ Server synchronization...');
        
        // 1. Fetch all users
        const users = await User.find({});
        if (users.length === 0) {
            console.log('[Sync] No users found. Synchronization skipped.');
            return;
        }

        // 2. Re-register all users in the C++ server
        // This rebuilds the uuidToIntMap and creates user nodes in the graph
        for (const user of users) {
            tcpService.sendPostCommand(user._id);
        }
        console.log(`[Sync] Dispatched POST commands for ${users.length} users.`);

        // 3. Fetch all orders that have products
        const orders = await Order.find({ items: { $exists: true, $not: { $size: 0 } } });

        // 4. Send PATCH commands to rebuild the recommendation history
        let patchCount = 0;
        for (const order of orders) {
            const productIds = order.items.map(item => item.productId || item.id);
            if (productIds.length > 0) {
                tcpService.sendPatchCommand(order.userId, productIds);
                patchCount++;
            }
        }
        
        console.log(`[Sync] Dispatched PATCH commands for ${patchCount} orders.`);
        console.log('[Sync] Synchronization complete!');

    } catch (error) {
        console.error('[Sync] Error during synchronization:', error);
    }
};

module.exports = syncDatabaseWithCppServer;
