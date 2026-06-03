/**
 * TCP Service Layer
 * Acts as the bridge between the Node.js REST API and the C++ Recommendation Engine.
 * Handles command formatting, ID mapping, and network communication.
 */
const tcpClient = require('../utils/tcpClient');
const net = require('net');

// === MAPPING LAYER (UUID <-> INT) ===
// The Node.js application uses UUIDs (strings) for user and product identification.
// However, the C++ backend strictly expects 32-bit integers.
// This layer maintains an in-memory dictionary to translate UUIDs to integers
// before sending data to C++, and translates integers back to UUIDs upon receiving recommendations.
const uuidToIntMap = new Map();
const intToUuidMap = new Map();
let currentIntId = 1;

/**
 * Converts a UUID string to a unique integer ID.
 * @param {string} uuid - The UUID string to convert.
 * @returns {number} The corresponding integer ID.
 */
const getNumericId = (uuid) => {
    if (!uuid) return 0;
    const strId = String(uuid);
    
    if (!uuidToIntMap.has(strId)) {
        uuidToIntMap.set(strId, currentIntId);
        intToUuidMap.set(String(currentIntId), strId);
        currentIntId++;
    }
    return uuidToIntMap.get(strId);
};

/**
 * Converts an integer ID back to its original UUID string.
 * @param {number|string} numId - The integer ID to convert.
 * @returns {string} The original UUID string, or the input itself if not found.
 */
const getUuidFromNumeric = (numId) => {
    return intToUuidMap.get(String(numId)) || String(numId);
};
// ====================================

/**
 * Sends a GET command to the C++ server for telemetry tracking (Views).
 * @param {string} userId - The UUID of the user.
 * @param {string} productId - The UUID of the product viewed.
 */
const sendGetCommand = (userId, productId) => {
    const command = `GET ${getNumericId(userId)} ${getNumericId(productId)}`;
    tcpClient.sendTelemetry(command);
};

/**
 * Sends a POST command to initialize a user's history in the C++ server.
 * @param {string} userId - The UUID of the user.
 * @param {Array<string>} productsIdArray - Array of product UUIDs (usually empty on registration).
 */
const sendPostCommand = (userId, productsIdArray = []) => {
    // Map valid products (if any are provided) to their numeric IDs
    const validProducts = (productsIdArray || []).filter(id => id);
    const mappedProducts = validProducts.map(getNumericId);
    
    // Prepend a dummy product '0' to ensure the C++ server allocates memory for the user.
    // We concatenate this with any actual product IDs passed so they are also saved.
    const productsToSend = ['0', ...mappedProducts].join(' ');
    
    const command = `POST ${getNumericId(userId)} ${productsToSend}`;
    tcpClient.sendTelemetry(command);
};

/**
 * Sends a PATCH command to update a user's purchase history.
 * @param {string} userId - The UUID of the user.
 * @param {Array<string>} productsIdArray - Array of purchased product UUIDs.
 */
const sendPatchCommand = (userId, productsIdArray) => {
    const validProducts = productsIdArray.filter(id => id);
    if (validProducts.length === 0) return;
    
    const mappedProducts = validProducts.map(getNumericId);
    const command = `PATCH ${getNumericId(userId)} ${mappedProducts.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

/**
 * Sends a DELETE command to remove products from a user's history (e.g., on order cancellation).
 * @param {string} userId - The UUID of the user.
 * @param {Array<string>} productsIdArray - Array of product UUIDs to remove.
 */
const sendDeleteCommand = (userId, productsIdArray) => {
    const validProducts = productsIdArray.filter(id => id);
    if (validProducts.length === 0) return;
    
    const mappedProducts = validProducts.map(getNumericId);
    const command = `DELETE ${getNumericId(userId)} ${mappedProducts.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

/**
 * Fetches product recommendations for a specific user from the C++ server.
 * Uses a direct Request-Response connection (unlike Fire & Forget telemetry).
 * @param {string} userId - The UUID of the requesting user.
 * @param {string} productId - The UUID of the reference product.
 * @returns {Promise<Array<string>>} A promise resolving to an array of recommended product UUIDs.
 */
const fetchRecommendations = (userId, productId) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        // Extract host and port from environment variable if in Docker, else use defaults
        let host = '127.0.0.1';
        let port = process.argv[2] ? parseInt(process.argv[2], 10) : 6060;

        if (process.env.CPP_BACKEND_URL) {
            const urlParts = process.env.CPP_BACKEND_URL.replace('http://', '').split(':');
            host = urlParts[0];
            port = parseInt(urlParts[1], 10);
        }

        // Prevent hanging connections; drop after 2 seconds
        client.setTimeout(2000);
        
        client.connect(port, host, () => {
            // Send the recommendation request using mapped integer IDs
            const command = `GET ${getNumericId(userId)} ${getNumericId(productId)}\n`;
            client.write(command);
        });

        client.on('data', (data) => {
            const response = data.toString();
            
            // The C++ server returns recommendations in the format: "200 Ok\n\n<id1> <id2>\n"
            const parts = response.split('\n\n');
            
            if (parts.length > 1) {
                // Extract the raw integer IDs, clean up whitespaces, and translate back to UUIDs
                const recommendedIds = parts[1].trim().split(' ').filter(id => id !== '');
                // Filter out the dummy product '0' so the user never sees it
                const cleanIds = recommendedIds.filter(id => id !== '0');
                const translatedUuids = cleanIds.map(getUuidFromNumeric);
                resolve(translatedUuids);
            } else {
                // Return an empty array if no recommendations were provided by the algorithm
                resolve([]); 
            }
            
            // Close the socket immediately after receiving the response
            client.destroy(); 
        });

        client.on('error', (err) => {
            console.error(`[TCP Service] Recommendation fetch failed: ${err.message}`);
            client.destroy();
            reject(err);
        });

        client.on('timeout', () => {
            console.error(`[TCP Service] Recommendation fetch timed out.`);
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