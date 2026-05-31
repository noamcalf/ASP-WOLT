/**
 * User Model
 * Manages user entities inside the global dataStore.
 */
const crypto = require('crypto');
const dataStore = require('./dataStore');

// Creates a new user and saves it to the global store
const createUser = (userData) => {
    const newUser = {
        id: crypto.randomUUID(),
        ...userData
    };
    dataStore.users.push(newUser);
    return newUser;
};

// Retrieves a single user by their unique ID
const getUserById = (id) => {
    const user = dataStore.users.find(u => u.id === id);
    return user ? user : null;
};

// Retrieves a single user by their username (crucial for login authentication)
const getUserByUsername = (username) => {
    const user = dataStore.users.find(u => u.username === username);
    return user ? user : null;
};

// Clears all users (used for testing isolation)
const clearAll = () => {
    dataStore.users = [];
};

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    clearAll
};