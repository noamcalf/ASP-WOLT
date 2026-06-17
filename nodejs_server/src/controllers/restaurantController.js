/**
 * Restaurant Controller
 * Handles all HTTP requests for restaurants and delegates data logic to the Model.
 */
const RestaurantModel = require('../models/restaurantModel');

// Retrieves all active restaurants and returns them as a JSON array
const getRestaurants = (req, res, next) => {
    const restaurants = RestaurantModel.getAllRestaurants();
    return res.status(200).json(restaurants);
};

// Validates incoming payload and creates a new restaurant entity
const createRestaurant = (req, res, next) => {
    let { name, cuisine, address, geolocation } = req.body || {};
    const image = req.file ? req.file.path : null;
    const ownerId = req.authenticatedUser ? req.authenticatedUser.id : null;

    // Parse JSON strings if data was sent via multipart/form-data
    if (typeof address === 'string') {
        try { address = JSON.parse(address); } catch(e) {}
    }
    if (typeof geolocation === 'string') {
        try { geolocation = JSON.parse(geolocation); } catch(e) {}
    }

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

    // Validate geolocation existence and structure
    if (!geolocation || typeof geolocation !== 'object') {
        return res.status(400).json({ error: "Validation failed: 'geolocation' object is required" });
    }
    if (typeof geolocation.latitude !== 'number' || typeof geolocation.longitude !== 'number') {
        return res.status(400).json({ error: "Validation failed: 'latitude' and 'longitude' must be numbers" });
    }

    // Construct validated payload
    const restaurantData = {
        name: name.trim(),
        cuisine: cuisine.trim(),
        address: { city: city.trim(), street: street.trim(), houseNumber },
        geolocation,
        image,
        ownerId,
        rating: 0 // Automatically set rating to 0 (new) for new restaurants
    };

    // Delegate to model
    const newRestaurant = RestaurantModel.createRestaurant(restaurantData);
    
    // Set Location header and return empty body (201 Created)
    res.location(`/api/restaurants/${newRestaurant.id}`);
    return res.status(201).end();
};

// Retrieves a specific restaurant by its ID
const getRestaurantById = (req, res, next) => {
    const { id } = req.params;
    const restaurant = RestaurantModel.getRestaurant(id);

    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
};

// Updates a specific restaurant
const updateRestaurant = (req, res, next) => {
    // Get the variabels
    const { id } = req.params;
    const updates = req.body || {};

    // Call the model's func
    const updatedRestaurant = RestaurantModel.updateRestaurant(id, updates);

    if (!updatedRestaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    // Return empty body (204 No Content)
    return res.status(204).end();   
};

// Deletes a specific restaurant by its ID
const deleteRestaurant = (req, res, next) => {
    // Get the variabels
    const { id } = req.params;

    // Call the model's func
    const isDeleted = RestaurantModel.deleteRestaurant(id);

    if (!isDeleted) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    // Return empty body (204 No Content)
    return res.status(204).end();    
};

module.exports = {
    getRestaurants,
    createRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};