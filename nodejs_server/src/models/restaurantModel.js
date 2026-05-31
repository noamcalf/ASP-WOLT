/**
 * Restaurant Model
 * Manages restaurant entities inside the global dataStore.
 */
const crypto = require('crypto');
const dataStore = require('./dataStore');

// Retrieves all restaurants with their attached products
const getAllRestaurants = () => {
    return dataStore.restaurants;
};

// Retrieves a single restaurant by its unique ID with its attached products
const getRestaurant = (id) => {
    // Search for the restaurant
    const restaurant = dataStore.restaurants.find(r => r.id === id);
    if (!restaurant) return null;

    // Return it
    return restaurant;
};

// Creates a new restaurant and saves it to the global store
const createRestaurant = (restaurantData) => {
    const newRestaurant = {
        id: crypto.randomUUID(),
        ...restaurantData
    };
    dataStore.restaurants.push(newRestaurant);
    return newRestaurant;
};

// Updates a specific restaurant
const updateRestaurant = (id, updates) => {
    const restaurant = dataStore.restaurants.find(r => r.id === id);
    if (!restaurant) return null;

    Object.assign(restaurant, updates);
    return restaurant;
};

// Deletes a specific restaurant
const deleteRestaurant = (id) => {
    const index = dataStore.restaurants.findIndex(r => r.id === id);
    if (index === -1) return false;

    dataStore.restaurants.splice(index, 1);
    // Delete all the restaurant's products by restaurant's id
    dataStore.products = dataStore.products.filter(p => p.restaurantId !== id);
    
    return true;
};

const clearAll = () => {
    dataStore.restaurants = [];
};

module.exports = {
    getAllRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    clearAll
};