/**
 * Main application entry point.
 * Configures the Express server and global middleware.
 */
const express = require('express');
const app = express();

// Set the port from environment variables, fallback to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads in the request body
app.use(express.json());

// --- Routes setup will go here ---

/**
 * Basic health-check endpoint to verify the server is running.
 */
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Wolt Web Server is running perfectly!' });
});

/**
 * Start listening for incoming HTTP requests.
 */
app.listen(PORT, () => {
    console.log(`Web Server is listening on port ${PORT}`);
});