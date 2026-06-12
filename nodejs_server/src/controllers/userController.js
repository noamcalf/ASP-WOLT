/**
 * User Controller
 * Handles all HTTP requests related to user registration and profile management.
 */
const UserModel = require('../models/userModel');
const TcpService = require('../services/tcpService');
const ProductModel = require('../models/productModel');

// Registers a new user after validating the payload schema
const registerUser = (req, res) => {
    // Defensive parsing: default to an empty object to prevent destructuring crashes
    const { username, phoneNumber, password, address } = req.body || {};
    let { name } = req.body || {};
    const image  = req.file ? req.file.path : null;

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

    // If the user did not type his name for the display, we will use his username
    if (!name) {
        name = username;
    }

    // Verify username uniqueness using the correct payload property to ensure schema consistency
    const isUserExist = username ? UserModel.getUserByUsername(username.trim()) : null;
    if (isUserExist) {
         return res.status(409).json({ error: "User with the same username already exists" });
    }

    // Delegate creation to the model
    const newUser = UserModel.createUser({
        username: username.trim(),
        phoneNumber,
        password,
        address,
        image,
        name
    });

    // Strip the password from the response payload for security
    const { password: _, ...userWithoutPassword } = newUser;

    // Create an empty history profile for the new user in the C++ server
    TcpService.sendPostCommand(newUser.id, []);

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

// Retrieves product recommendations from the C++ recommandion system
const getRecommendations = async (req, res, next) => {
    const { id, productId } = req.params;

    // Security measure: Ensure the user is requesting their own recommendations
    if (String(req.authenticatedUser.id) !== String(id)) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        // Fetch raw recommended product IDs from C++ server
        const recommendedIds = await TcpService.fetchRecommendations(id, productId);
        
        // Map the IDs to actual product objects from our database
        const allProducts = ProductModel.getAllProducts() || [];
        const recommendedProducts = recommendedIds.map(recId => {
            return allProducts.find(p => String(p.id) === String(recId));
        }).filter(p => p !== undefined); // Remove any nulls if a product was deleted

        return res.status(200).json(recommendedProducts);
        
    } catch (error) {
        error.statusCode = 500;
        error.message = "Recommendation engine is currently unavailable";
        next(error);
    }
};

module.exports = {
    registerUser,
    getUserProfile,
    getRecommendations
};