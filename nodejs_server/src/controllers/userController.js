/**
 * User Controller
 * Handles all HTTP requests related to user registration and profile management.
 */
const UserModel = require('../models/userModel');

// Registers a new user after validating the payload schema
const registerUser = (req, res) => {
    // Defensive parsing: default to an empty object to prevent destructuring crashes
    const { username, phoneNumber, password, address } = req.body || {};

    // Validate mandatory top-level properties
    if (!username || username.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'username' is required" });
    }
    
    // Validate nested address fields explicitly (The Consistent Way)
    if (!address || typeof address !== 'object') {
        return res.status(400).json({ error: "Validation failed: 'address' object is required" });
    }
    const { city, street, houseNumber } = address;
    if (!city || city.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'city' is required" });
    }

    // Delegate creation to the model
    const newUser = UserModel.createUser({
        username: username.trim(),
        phoneNumber,
        password,
        address
    });

    // Strip the password from the response payload for security
    const { password: _, ...userWithoutPassword } = newUser;

    // Return the successful 201 Created status along with the safe user object
    return res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
    });
};

// Retrieves a user profile by their ID, ensuring sensitive data is strictly filtered out
const getUserProfile = (req, res) => {
    const { id } = req.params;

    // Fetch the user from the model using the provided ID parameter
    const user = UserModel.getUserById(id);

    // If the user does not exist, return a standard 404 Not Found error
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Security: Strip the password before returning the profile using destructuring
    const { password: _, ...safeUserProfile } = user;

    // Return the profile data with a 200 OK status
    return res.status(200).json(safeUserProfile);
};

module.exports = {
    registerUser,
    getUserProfile
};