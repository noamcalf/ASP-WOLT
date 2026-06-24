/**
 * Main application entry point.
 * Configures the Express server and global middleware.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFoundMiddleware, globalErrorMiddleware } = require('./middlewares/errorMiddlewares');
const { connectToCppServer } = require('./utils/tcpClient'); // Inject TCP Client utility
const connectDB = require('./config/db'); // Database connection utility
const seedDatabase = require('./utils/seed'); // Seeding utility

const app = express();

// Set the port from environment variables, fallback to 3000
const PORT = process.env.PORT || 3000;

// Set premission to the origin URL (frontend react server port) to communicate with this server using cors
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));


// 1. Initial Middlewares (Global parsing)
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically
app.use('/images', express.static(path.join(__dirname, '../../images'))); // Serve seed images
app.use(express.static('public')); // Serve static production build files natively



// 2. Logical routes
const restaurantRouter = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRouter);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const tokenRoutes = require('./routes/tokenRoutes'); 
app.use('/api/tokens', tokenRoutes);   

const orderRoutes = require('./routes/orderRoutes'); 
app.use('/api/orders', orderRoutes);  

const searchRoutes = require('./routes/searchRoutes'); 
app.use('/api/search', searchRoutes);                  


// Catch-all route to serve the React SPA for any non-API requests (Express 5 compatible)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
        next();
    }
});

// 3. Error & Safety Middlewares 
// app.use(notFoundMiddleware);      // We removed notFoundMiddleware because the React app handles 404s on the client side
app.use(globalErrorMiddleware);   // Our emergency Middleware

// 4. External Integrations
if (process.env.NODE_ENV !== 'test') {
    // Establish the TCP socket connection to Server 2 automatically on boot
    connectToCppServer();

    // Connect to MongoDB, then start listening for incoming HTTP requests
    connectDB().then(async () => {
        // Seed database if empty
        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`Web Server is listening on port ${PORT}`);
        });
    });
}

// Export to any file that require it
module.exports = app;