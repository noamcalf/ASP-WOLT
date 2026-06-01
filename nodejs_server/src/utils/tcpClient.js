/**
 * TCP Client Utility
 * Manages the persistent socket connection to the C++ Server 2.
 */
const net = require('net');

// State variables for the connection
let clientSocket = null;
let isReconnecting = false;

// Configuration: Read the target port from the command line arguments as required by tests
// If no argument is provided, fallback to standard 6060
const HOST = '127.0.0.1'; 
const PORT = process.argv[2] ? parseInt(process.argv[2], 10) : 6060;

/**
 * Initializes the TCP socket connection to the C++ server.
 * Implements error boundaries and automatic reconnection loops.
 */
const connectToCppServer = () => {
    // Prevent multiple simultaneous connection attempts
    if (clientSocket && !clientSocket.destroyed) {
        return; 
    }

    clientSocket = new net.Socket();

    // Attempt to establish the connection
    clientSocket.connect(PORT, HOST, () => {
        console.log(`[TCP Client] Connected successfully to C++ Server at ${HOST}:${PORT}`);
        isReconnecting = false;
    });

    // Error Boundary: Catch network errors silently to prevent the Express server from crashing
    clientSocket.on('error', (err) => {
        console.error(`[TCP Client] Network Error: ${err.message}`);
        // Note: The 'close' event will automatically fire after an error, triggering the retry loop
    });

    // Reconnection Loop: Spin up retry mechanisms immediately when links disconnect
    clientSocket.on('close', () => {
        console.log('[TCP Client] Connection dropped. Attempting to reconnect in 5 seconds...');
        
        // Ensure socket isn't already null before destroying
        if (clientSocket) {
            clientSocket.destroy();
            clientSocket = null;
        }

        if (!isReconnecting) {
            isReconnecting = true;
            setTimeout(() => {
                isReconnecting = false;
                connectToCppServer();
            }, 5000); // Wait 5 seconds before retrying
        }
    });
};

/**
 * Encapsulated utility handler to dispatch cross-server event notifications.
 * @param {string} command - The raw telemetry string (e.g., 'GET user123 prod456')
 */
const sendTelemetry = (command) => {
    // Only attempt to write if the socket is actively connected
    if (clientSocket && !clientSocket.destroyed) {
        // Ensure the command ends with a newline character (\n) as expected by the C++ parser
        const formattedCommand = command.endsWith('\n') ? command : `${command}\n`;
        clientSocket.write(formattedCommand);
    } else {
        // Silently drop the telemetry if the C++ server is offline, ensuring the Node server keeps running
        console.warn(`[TCP Client] Cannot dispatch telemetry, server offline. Dropped: ${command}`);
    }
};

/**
 * Cleanly terminates the socket and locks the retry loop.
 * Crucial for preventing memory leaks in testing environments.
 */
const closeConnection = () => {
    isReconnecting = true; // Lock the retry loop
    if (clientSocket && !clientSocket.destroyed) {
        clientSocket.destroy();
        clientSocket = null;
    }
};

module.exports = {
    connectToCppServer,
    sendTelemetry,
    closeConnection
};