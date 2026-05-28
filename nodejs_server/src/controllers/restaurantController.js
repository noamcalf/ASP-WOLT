/**
 * Restaurant Controller
 * Handles all logic for restaurant-related HTTP requests.
 */
const dataStore = require('../models/DataStore');

// Retrieves all active restaurants and returns them as a JSON array
const getRestaurants = (req, res) => {
    const restaurants = dataStore.restaurants;
    res.status(200).json(restaurants);
};

module.exports = {
    getRestaurants
};