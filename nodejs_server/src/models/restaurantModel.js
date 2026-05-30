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
    clearAll
};