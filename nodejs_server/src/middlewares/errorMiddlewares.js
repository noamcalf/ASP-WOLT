// Handle 404 code
const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
};

// Handle any any other error
const globalErrorMiddleware = (err, req, res, next) => {
    // If it's a Mongoose validation error, convert it to 400 Bad Request
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
    }

    // Get status code or default
    const status = err.statusCode || 500;
    // Get error message or default
    const message = status === 500 ? 'Internal Server Error' : err.message; 
    res.status(status).json({ error: message });
};

// Make those functions accessible
module.exports = {
    notFoundMiddleware,
    globalErrorMiddleware
};

