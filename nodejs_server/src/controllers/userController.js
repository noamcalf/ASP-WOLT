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
    const { username, phoneNumber, password, address, geolocation, role = 'customer' } = req.body || {};
    let { name } = req.body || {};
    const image  = req.file ? req.file.path : null;

    // Validate mandatory top-level properties
    if (!username || username.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'username' is required" });
    }

    // Validate role
    if (role !== 'customer' && role !== 'owner') {
        return res.status(400).json({ error: "Validation failed: 'role' must be either 'customer' or 'owner'" });
    }

    // Validate password existence
    if (!password) {
        return res.status(400).json({ error: "Validation failed: 'password' is required" });
    }

    // Validate password type: string
    if (typeof password !== 'string') {
        return res.status(400).json({ error: "Validation failed: 'password' must be a string" });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: "Validation failed: 'password' must be at least 8 characters" });
    }

    // Validate that the password contains both nubmers and letters
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
        return res.status(400).json({ error: "Validation failed: 'password' must contain both letters and numbers" });
    }

    // Validate phoneNumber existence and type
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({ error: "Validation failed: 'phoneNumber' must be a string" });
    }

    // Validate phoneNumber contains only digits
    if (!/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({ error: "Validation failed: 'phoneNumber' must contain only digits" });
    }

    // Validate nested address fields explicitly (Only required for customers)
    if (role === 'customer') {
        if (!address || typeof address !== 'object') {
            return res.status(400).json({ error: "Validation failed: 'address' object is required for customers" });
        }
        const { city, street, houseNumber } = address;
        if (!city || city.trim() === '') {
            return res.status(400).json({ error: "Validation failed: 'city' is required" });
        }
    }

    // If the user did not type his name for the display, we will use his username
    if (!name) {
        name = username;
    }

    // Validate geolocation existence and structure
    if (role === 'customer') {
        if (!geolocation || typeof geolocation !== 'object') {
            return res.status(400).json({ error: "Validation failed: 'geolocation' object is required for customers" });
        }
        if (typeof geolocation.latitude !== 'number' || typeof geolocation.longitude !== 'number') {
            return res.status(400).json({ error: "Validation failed: 'latitude' and 'longitude' must be numbers" });
        }
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
        role,
        address: role === 'customer' ? address : null,
        image,
        name,
        geolocation
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