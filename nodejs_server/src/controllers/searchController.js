/**
 * Search Controller
 * Handles global text-based searches across multiple data entities.
 */
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');
const TcpService = require('../services/tcpService');

// Helper function to neutralize regex special characters from user input
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const searchGlobal = async (req, res, next) => {
    try {
        // Extract the raw search query from the URL parameter
        const rawQuery = req.params.query;

        // Handle edge case: If the query is empty or just white spaces, return empty arrays immediately
        if (!rawQuery || rawQuery.trim() === '') {
            return res.status(200).json({ restaurants: [], products: [] });
        }

        // Sanitize the input to prevent Regex injection
        const safeQuery = escapeRegex(rawQuery.trim());
        
        // Create a case-insensitive regular expression (the 'i' flag)
        const searchRegex = new RegExp(safeQuery, 'i');

        // Scan and filter the datasets via MongoDB
        const matchedRestaurants = await RestaurantModel.find({ name: { $regex: searchRegex } });
        const matchedProducts = await ProductModel.find({ name: { $regex: searchRegex } });

        // Structure and return the unified aggregation JSON (WOLT-151)
        return res.status(200).json({
            restaurants: matchedRestaurants,
            products: matchedProducts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchGlobal
};