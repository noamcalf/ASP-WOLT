/**
 * Main application entry point.
 * Configures the Express server and global middleware.
 */
const express = require('express');
const { notFoundMiddleware, globalErrorMiddleware } = require('./middlewares/errorMiddleware');
const app = express();

// Set the port from environment variables, fallback to 3000
const PORT = process.env.PORT || 3000;

// 1. Initial Middlewares (Global parsing)
app.use(express.json());

/**
 * Basic health-check endpoint to verify the server is running.
 */
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Wolt Web Server is running perfectly!' });
});

// 2. Logical routes
const restaurantRouter = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRouter);


// 3. Error & Safety Middlewares 
app.use(notFoundMiddleware);      // Catches 404s (Only fires if no route matched above)
app.use(globalErrorMiddleware);   // Catches 500s/400s (Our emergency ambulance)


/**
 * Start listening for incoming HTTP requests (Protected from Jest environment).
 */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Web Server is listening on port ${PORT}`);
    });
}

// Export to any file that require it
module.exports = app;