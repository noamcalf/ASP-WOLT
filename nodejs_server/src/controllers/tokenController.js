/**
 * Token Controller
 * Handles authentication and the generation of access tokens.
 */
const UserModel = require('../models/userModel');
const crypto = require('crypto');

// Authenticates user credentials and generates an access token upon success
const generateToken = (req, res) => {
    // Defensive parsing for incoming login credentials
    const { phoneNumber, password } = req.body || {};

    // Validate payload presence strictly enforcing the primary phone number identifier
    if (!phoneNumber || !password) {
        return res.status(400).json({ error: 'Phone number and password are required' });
    }

    // Attempt to locate the user in the data store using the provided phone number
    const user = UserModel.getUserByPhoneNumber(phoneNumber);

    // Verify identity: Check if user exists and if the provided password matches
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Authorization: Generate a random string to serve as the access token
    const token = crypto.randomUUID();
    
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