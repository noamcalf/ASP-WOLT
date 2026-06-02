// Import server's implement
const tcpClient = require('../utils/tcpClient');
const net = require('net');

// Helper to ensure undefined users are marked as unknown for the C++ parser
const getSafeUserId = (userId) => userId || 'unknown_user_id';

// Write format for each command we want to send to the CPP server
const sendGetCommand = (userId, productId) => {
    const command = `GET ${userId} ${productId}`;
    tcpClient.sendTelemetry(command);
};

const sendPostCommand = (userId, productsIdArray) => {
    const validProducts = productsIdArray.filter(id => id);
    if (validProducts.length === 0) return;
    const command = `POST ${getSafeUserId(userId)} ${validProducts.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

const sendPatchCommand = (userId, productsIdArray) => {
    const validProducts = productsIdArray.filter(id => id);
    if (validProducts.length === 0) return;
    const command = `PATCH ${getSafeUserId(userId)} ${validProducts.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

const sendDeleteCommand = (userId, productsIdArray) => {
    const validProducts = productsIdArray.filter(id => id);
    if (validProducts.length === 0) return;
    const command = `DELETE ${getSafeUserId(userId)} ${validProducts.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

// Helper function to fetch recommendations specifically (Request-Response mode)
const fetchRecommendations = (userId, productId) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        // Assuming the standard port configured in your environment
        const PORT = process.argv[2] ? parseInt(process.argv[2], 10) : 6060;

        // Prevent hanging promises in testing mode
        client.setTimeout(2000);
        
        client.connect(PORT, '127.0.0.1', () => {
            const command = `GET ${getSafeUserId(userId)} ${productId}\n`;
            client.write(command);
        });

        client.on('data', (data) => {
            const response = data.toString();
            // The C++ server returns "200 Ok\n\n<id1> <id2>\n"
            const parts = response.split('\n\n');
            
            if (parts.length > 1) {
                // Extract the IDs, split by space, clean up newlines, and filter empty strings
                const recommendedIds = parts[1].trim().split(' ').filter(id => id !== '');
                resolve(recommendedIds);
            } else {
                resolve([]); // No recommendations found
            }
            client.destroy(); // Close the socket after getting the answer
        });

        client.on('error', (err) => {
            console.error(`[TCP Service] Recommendation fetch failed: ${err.message}`);
            client.destroy();
            reject(err);
        });

        client.on('timeout', () => {
            client.destroy();
            reject(new Error('TCP connection timed out'));
        });
    });
};

module.exports = {
    sendGetCommand,
    sendPostCommand,
    sendPatchCommand,
    sendDeleteCommand,
    fetchRecommendations
};