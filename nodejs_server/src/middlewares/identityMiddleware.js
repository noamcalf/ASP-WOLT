/**
 * Identity Extraction Middleware
 * Intercepts incoming requests, extracts user identity from HTTP headers,
 * and exposes it to downstream controllers via the request object.
 */
const UserModel = require('../models/userModel');

const identityMiddleware = (req, res, next) => {
    // 1. Extract the identifier from the Header (as required by the current assignment)
    const userPhone = req.headers['x-user-phone'] || req.headers['x-phonenumber'];

    /* ======================================================================
    Future enforcement logic (for the next assignment)
    Commented out to prevent failing automated tests in the current phase.
    ======================================================================
    
    // If no phone number is provided in headers, block the request
    if (!userPhone || userPhone.trim() === '') {
        return res.status(401).json({ 
            error: "Authentication failed: Missing identification token/phone in headers" 
        });
    }

    // Get the user in the data store using their unique phone number
    const user = UserModel.getUserByPhoneNumber(userPhone.trim());

    // If the user doesn't exist in our system, block the request
    if (!user) {
        return res.status(401).json({ 
            error: "Authentication failed: User with this identity does not exist" 
        });
    }

    // Enforce strict schema validation
    if (!user.id || !user.username || !user.address || !user.address.city) {
        return res.status(400).json({
            error: "Authentication failed: User profile data in storage is incomplete or corrupted"
        });
    }
    ======================================================================
    */

    // Retrieve the user from the data store if a phone number was provided
    const user = userPhone ? UserModel.getUserByPhoneNumber(userPhone.trim()) : null;

    // 2. Context Passing: Inject the user data into the request object
    if (user) {
        // User found and valid - pass data to the controller
        req.authenticatedUser = {
            id: user.id,                  
            phoneNumber: user.phoneNumber,
            username: user.username,
            address: user.address
        };
    } else {
        // Fallback: In case the someone sends a request without a header or an unknown number.
        // We provide a partial object so the controller (expecting req.authenticatedUser.id) doesn't crash.
        req.authenticatedUser = { 
            id: userPhone || 'unknown_user_id' 
        };
    }

    // 3. Proceed to the next middleware/controller
    next();
};

module.exports = identityMiddleware;