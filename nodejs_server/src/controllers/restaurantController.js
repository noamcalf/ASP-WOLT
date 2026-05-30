/**
 * Restaurant Controller
 * Handles all HTTP requests for restaurants and delegates data logic to the Model.
 */
const RestaurantModel = require('../models/restaurantModel');

// Retrieves all active restaurants and returns them as a JSON array
const getRestaurants = (req, res) => {
    const restaurants = RestaurantModel.getAllRestaurants();
    res.status(200).json(restaurants);
};

// Validates incoming payload and creates a new restaurant entity
const createRestaurant = (req, res) => {
    const { name, cuisine, address } = req.body || {};

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

    // Construct validated payload
    const restaurantData = {
        name: name.trim(),
        cuisine: cuisine.trim(),
        address: { city: city.trim(), street: street.trim(), houseNumber }
    };

    // Delegate to model
    const newRestaurant = RestaurantModel.createRestaurant(restaurantData);
    
    // Set Location header and return empty body (201 Created)
    res.location(`/api/restaurants/${newRestaurant.id}`);
    res.status(201).end();
};

// Retrieves a specific restaurant by its ID
const getRestaurantById = (req, res, next) => {
    // Get id from the URL
    const { id } = req.params;
    const restaurant = RestaurantModel.getRestaurant(id);

    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
};

// Retrieves all products for a specific restaurant
const getProducts = (req, res) => {
    const { id } = req.params;
    const restaurant = RestaurantModel.getRestaurant(id);

    // Confirm target restaurant records are active before pulling sub-properties
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    // Return targeted catalog array subsets attached to Status 200 codes
    res.status(200).json(restaurant.products);
};

// Validates payload and adds a new product to the requested restaurant
const createProduct = (req, res) => {
    const { id } = req.params;
    // Destructure payload properties, defaulting to an empty object to prevent crashes if req.body is undefined
    const { name, price } = req.body || {};

    // Confirm parent restaurant entities are registered
    const restaurant = RestaurantModel.getRestaurant(id);
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    // Catch formatting anomalies (missing properties)
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'name' is required" });
    }
    if (price === undefined || typeof price !== 'number') {
        return res.status(400).json({ error: "Validation failed: 'price' is required and must be a number" });
    }

    // Create the product via the model
    const newProduct = RestaurantModel.addProductToRestaurant(id, { name: name.trim(), price });

    // Configure 201 status response with specific product Location header
    res.location(`/api/restaurants/${id}/products/${newProduct.id}`);
    res.status(201).end();
};

// Updates a specific restaurant
const updateRestaurant = (req, res, next) => {
    // Get id from the URL
    const { id } = req.params;
    // Get the wanted data
    const updates = req.body;

    const updatedRestaurant = RestaurantModel.updateRestaurant(id, updates);

    if (!updatedRestaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    // Return empty body (204 No Content)
    res.status(204).end();   
};

const deleteRestaurant = (req, res, next) => {
    // Get id from the URL
    const { id } = req.params;

    const isDeleted = RestaurantModel.deleteRestaurant(id);

    if (!isDeleted) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    // Return empty body (204 No Content)
    res.status(204).end();    
};


module.exports = {
    getRestaurants,
    createRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getProducts,
    createProduct
};