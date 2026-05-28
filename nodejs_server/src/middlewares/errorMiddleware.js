// Handle 404 code
const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
};

// Handle 500 code
const globalErrorMiddleware = (err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });
};

// Make those functions accessible
module.exports = {
    notFoundMiddleware,
    globalErrorMiddleware
};

