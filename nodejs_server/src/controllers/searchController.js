/**
 * Search Controller
 * Handles global text-based searches across multiple data entities.
 */
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');

// Helper function to neutralize regex special characters from user input
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const searchGlobal = (req, res) => {
    // Extract the raw search query from the URL parameter
    const rawQuery = req.params.query;

    // Handle edge case: If the query is empty or just white spaces, return empty arrays immediately
    if (!rawQuery || rawQuery.trim() === '') {
        return res.status(200).json({ restaurants: [], products: [] });
    }

    // 1. Sanitize the input to prevent Regex injection
    const safeQuery = escapeRegex(rawQuery.trim());
    
    // 2. Create a case-insensitive regular expression (the 'i' flag)
    const searchRegex = new RegExp(safeQuery, 'i');

    // 3. Fetch all active records from the data models
    const allRestaurants = RestaurantModel.getAllRestaurants() || [];
    const allProducts = ProductModel.getAllProducts() || [];

    // 4. Scan and filter the datasets
    // The `r.name &&` ensures we don't crash if a record is corrupted and missing a name
    const matchedRestaurants = allRestaurants.filter(r => r.name && searchRegex.test(r.name));
    const matchedProducts = allProducts.filter(p => p.name && searchRegex.test(p.name));

    // 5. Structure and return the unified aggregation JSON (WOLT-151)
    return res.status(200).json({
        restaurants: matchedRestaurants,
        products: matchedProducts
    });
};

module.exports = {
    searchGlobal
};