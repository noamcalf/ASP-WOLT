/**
 * Restaurant Controller
 * Handles all HTTP requests for restaurants and delegates data logic to the Model.
 */
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');

// Retrieves all active restaurants and returns them as a JSON array
const getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await RestaurantModel.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        next(error);
    }
};

// Validates incoming payload and creates a new restaurant entity
const createRestaurant = async (req, res, next) => {
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

    // Set default value
    const baseDeliveryTime = "25-35 min";

    // Construct validated payload
    const restaurantData = {
        name: name.trim(),
        cuisine: cuisine.trim(),
        address: { city: city.trim(), street: street.trim(), houseNumber },
        geolocation,
        image,
        ownerId,
        baseDeliveryTime,
        rating: 0 // Automatically set rating to 0 (new) for new restaurants
    };

    try {
        // Delegate to model
        const newRestaurant = await RestaurantModel.create(restaurantData);
        
        // Set Location header and return empty body (201 Created)
        res.location(`/api/restaurants/${newRestaurant.id}`);
        return res.status(201).end();
    } catch (error) {
        next(error);
    }
};

// Retrieves a specific restaurant by its ID
const getRestaurantById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const restaurant = await RestaurantModel.findById(id);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        next(error);
    }
};

// Updates a specific restaurant
const updateRestaurant = async (req, res, next) => {
    // Get the variabels
    const { id } = req.params;
    let updates = req.body || {};

    // If an image was uploaded via multipart/form-data, grab its path
    if (req.file) {
        updates.image = req.file.path;
    }

    // Because multipart/form-data sends everything as strings, we must parse the JSON stringified objects
    if (typeof updates.address === 'string') {
        try { updates.address = JSON.parse(updates.address); } catch(e) {}
    }
    if (typeof updates.geolocation === 'string') {
        try { updates.geolocation = JSON.parse(updates.geolocation); } catch(e) {}
    }

    try {
        // Call the model's func
        const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedRestaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Return empty body (204 No Content)
        return res.status(204).end();   
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        next(error);
    }
};

// Deletes a specific restaurant by its ID
const deleteRestaurant = async (req, res, next) => {
    // Get the variabels
    const { id } = req.params;

    try {
        // Call the model's func
        const isDeleted = await RestaurantModel.findByIdAndDelete(id);

        if (!isDeleted) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        
        // Delete all products associated with this restaurant
        await ProductModel.deleteMany({ restaurantId: id });
        
        // Return empty body (204 No Content)
        return res.status(204).end();    
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        next(error);
    }
};

module.exports = {
    getRestaurants,
    createRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};