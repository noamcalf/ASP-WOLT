/**
 * Restaurant Controller
 * Handles all logic for restaurant-related HTTP requests.
 */
const dataStore = require('../models/DataStore');

// Import Node.js built-in crypto module for UUID generation
const crypto = require('crypto');

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

    // Construct the new restaurant object with a unique ID.
    const newRestaurant = {
        id: crypto.randomUUID(),
        name: name.trim(),
        cuisine: cuisine.trim(),
        address: {
            city: city.trim(),
            street: street.trim(),
            houseNumber
        }
    };

    // Save to memory store
    dataStore.restaurants.push(newRestaurant);
    
    // Set the Location header pointing to the new resource URI
    res.location(`/api/restaurants/${newRestaurant.id}`);

    // Respond with 201 Created and an empty payload body as instructed
    res.status(201).end();
};

const getRestaurantById = (req, res, next) => {
        // Get id from the URL
        const { id } = req.params;

        // Search the id in the restaurants array
        const restaurant = dataStore.restaurants.find(r => r.id === id);

        // We have not find it
        if (!restaurant) {
            // Set error message and call the error handler Middleware
            const error = new Error(`Resource Error: Restaurant with ID '${id}' was not found`);
            error.statusCode = 404;
            return next(error); 
        }

        // Return response as Json
        res.status(200).json(restaurant);
    };

const updateRestaurant = (req, res, next) => {
    // Get id from the URL
    const { id } = req.params;
    // Get the wanted data
    const updates = req.body;

    // Search the id in the restaurants array
    const restaurant = dataStore.restaurants.find(r => r.id === id);

    // We have not find it
        if (!restaurant) {
            // Set error message and call the error handler Middleware
            const error = new Error(`Resource Error: Restaurant with ID '${id}' was not found`);
            error.statusCode = 404;
            return next(error); 
        }

    // Find() returns pointer to the restaurant int tha array
    // Replace the pls data with updates in thr array
    Object.assign(restaurant, req.body);
    // Return response as Json 
    res.status(204).end();   
}

const deleteRestaurant = (req, res, next) => {
    // Get id from the URL
    const { id } = req.params;

    // Search the id in the restaurants array
    const restaurant = dataStore.restaurants.find(r => r.id === id);

    // We have not find it
        if (!restaurant) {
            // Set error message and call the error handler Middleware
            const error = new Error(`Resource Error: Restaurant with ID '${id}' was not found`);
            error.statusCode = 404;
            return next(error); 
        }
    // From the restaurants array: save only restaurants with other id
    dataStore.restaurants = dataStore.restaurants.filter(r => r.id !== id);
    
    // Return response as Json 
    res.status(204).end();    
}


module.exports = {
    getRestaurants,
    createRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};