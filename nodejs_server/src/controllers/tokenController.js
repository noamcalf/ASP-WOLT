/**
 * Token Controller
 * Handles authentication and the generation of access tokens.
 */
require('dotenv').config();
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Authenticates user credentials and generates an access token upon success
const generateToken = (req, res) => {
    // Defensive parsing for incoming login credentials
    const { username, password } = req.body || {};

    // Validate payload presence strictly enforcing the primary phone number identifier
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Attempt to locate the user in the data store using the provided phone number
    const user = UserModel.getUserByUsername(username);

    // Verify identity: Check if user exists and if the provided password matches
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Define payload for jwt.sign()
    const tokenPayload = {
        userId: user.id
    };

    // Get the key from .env
    const secretKey = process.env.JWT_SECRET;

    // In case the secretKey was not found
    if (!secretKey) {
        console.error('Error: token was nor created');
        return res.status(500).json({ error: 'Internal server configuration error' });
    }

    // Create the token by using JWT
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '7d' });
    
    // Assign default structural identity roles as required by the system design
    const roles = ['user']; 

    // Output the generated token and roles with a 200 OK status
    return res.status(200).json({
        token,
        roles
    });
};

module.exports = {
    generateToken
};