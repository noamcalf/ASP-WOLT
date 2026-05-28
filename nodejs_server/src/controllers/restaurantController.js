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

// Validates incoming payload and creates a new restaurant entity
const createRestaurant = (req, res) => {
    const { name, cuisine, address } = req.body;

    // Validate top-level fields
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'name' is required" });
    }
    if (!cuisine || cuisine.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'cuisine' is required" });
    }
    if (!address || typeof address !== 'object') {
        return res.status(400).json({ error: "Validation failed: 'address' object is required" });
    }

    // Validate nested address fields
    const { city, street, houseNumber } = address;
    if (!city || city.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'city' is required" });
    }
    if (!street || street.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'street' is required" });
    }
    if (!houseNumber) {
        return res.status(400).json({ error: "Validation failed: 'houseNumber' is required" });
    }

    // Construct the validated restaurant object
    const newRestaurant = {
        name: name.trim(),
        cuisine: cuisine.trim(),
        address: {
            city: city.trim(),
            street: street.trim(),
            houseNumber
        }
    };

    // Save to memory store and respond with 201 Created
    dataStore.restaurants.push(newRestaurant);
    res.status(201).json(newRestaurant);
};

module.exports = {
    getRestaurants,
    createRestaurant
};