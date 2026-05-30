/**
 * Restaurant Model
 * Manages the in-memory data array for restaurants and handles all direct data operations (CRUD).
 */
const crypto = require('crypto');

// The in-memory array for this specific resource
let restaurants = [];

// Retrieves all restaurants from the memory store
const getAllRestaurants = () => restaurants;

// Retrieves a single restaurant by its unique ID
const getRestaurant = (id) => restaurants.find(r => r.id === id);

// Creates a new restaurant with a generated UUID and saves it to memory
const createRestaurant = (restaurantData) => {
    const newRestaurant = {
        id: crypto.randomUUID(),
        products: [],
        ...restaurantData
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
};

// Updates specific fields of an existing restaurant safely
const updateRestaurant = (id, updates) => {
    const restaurant = getRestaurant(id);
    if (restaurant) {
        // Securely update only allowed fields (prevents mass assignment of id)
        if (updates.name) restaurant.name = updates.name.trim();
        if (updates.cuisine) restaurant.cuisine = updates.cuisine.trim();
        if (updates.address) restaurant.address = updates.address;
    }
    return restaurant;
};

// Removes a restaurant from the memory store by its ID
const deleteRestaurant = (id) => {
    const initialLength = restaurants.length;
    
    // Filter out the restaurant with the matching ID
    restaurants = restaurants.filter(r => r.id !== id);
    
    // If the length changed, the deletion was successful
    return restaurants.length !== initialLength; 
};

// Adds a new product to a specific restaurant's menu with a unique sub-identifier
const addProductToRestaurant = (restaurantId, productData) => {
    // Attempt to retrieve the parent restaurant by its ID
    const restaurant = getRestaurant(restaurantId);

    // If the parent restaurant does not exist, abort the operation and return null
    if (!restaurant) return null;

    // Construct the new product object, ensuring it has a unique ID and a reference to its parent
    const newProduct = {
        // Generate a unique identifier specifically for this product
        id: crypto.randomUUID(),
        // Link the product to its parent restaurant for easy lookup
        restaurantId: restaurantId,
        // Spread the validated product data (name, price) sent from the controller
        ...productData
    };
    
    // Append the newly created product to the restaurant's internal products array
    restaurant.products.push(newProduct);
    
    // Return the created product object so the controller can use its ID for the 201 Location header
    return newProduct;
};

// Teardown function for TDD - clears the array completely
const clearAll = () => {
    restaurants = [];
};

module.exports = {
    getAllRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    addProductToRestaurant,
    clearAll
};