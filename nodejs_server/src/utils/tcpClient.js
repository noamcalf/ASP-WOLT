/**
 * TCP Client Utility (Fire & Forget Architecture)
 * Manages short-lived socket connections to the C++ Server.
 * This prevents blocking the single-threaded C++ server, allowing it to handle
 * both telemetry (PATCH/DELETE) and recommendation requests (GET) seamlessly.
 */
const net = require('net');

// Configuration Defaults
let HOST = '127.0.0.1';
let PORT = process.argv[2] ? parseInt(process.argv[2], 10) : 6060;

// Dynamic Configuration from Docker environment variables
if (process.env.CPP_BACKEND_URL) {
    const urlParts = process.env.CPP_BACKEND_URL.replace('http://', '').split(':');
    HOST = urlParts[0];
    PORT = parseInt(urlParts[1], 10);
}

/**
 * Initializes the TCP client configuration.
 * In this Fire & Forget architecture, we don't hold a persistent connection,
 * so this simply logs the target C++ server address upon startup.
 */
const connectToCppServer = () => {
    console.log(`[TCP Client] Configured to communicate with C++ Server at ${HOST}:${PORT} (Fire & Forget Mode)`);
};

/**
 * Encapsulated utility handler to dispatch cross-server event notifications.
 * Opens a brief connection, sends the data, and closes it gracefully ONLY AFTER
 * the data has been fully flushed to the network to prevent race conditions.
 * @param {string} command - The raw telemetry string (e.g., 'PATCH user123 prod456')
 */
const sendTelemetry = (command) => {
    const client = new net.Socket();

    client.connect(PORT, HOST, () => {
        // Ensure the command ends with a newline character (\n) as expected by the C++ parser
        const formattedCommand = command.endsWith('\n') ? command : `${command}\n`;
        
        // Write the data and use the callback to ensure it's completely sent before closing
        client.write(formattedCommand, () => {
            console.log(`[TCP Client] Successfully dispatched: ${command.trim()}`);
            // Safely end the connection after the payload is delivered
            client.end(); 
        });
    });

    // Error Boundary: Silently drop the telemetry if the C++ server is offline or busy
    client.on('error', (err) => {
        console.warn(`[TCP Client] Cannot dispatch telemetry, server offline or busy. Dropped: ${command.trim()}`);
        client.destroy();
    });
};

/**
 * Cleanly terminates any mock states.
 * Kept strictly for backward compatibility with app.js and testing suites.
 */
const closeConnection = () => {
    // No persistent connection to close in Fire & Forget mode
};

/**
 * Resets the reconnect flag.
 * Kept strictly for backward compatibility.
 */
const resetReconnectFlag = () => {
    // Not applicable in Fire & Forget mode
};

module.exports = {
    connectToCppServer,
    sendTelemetry,
    closeConnection,
    resetReconnectFlag
};