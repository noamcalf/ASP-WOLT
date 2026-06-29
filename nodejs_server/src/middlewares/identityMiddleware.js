/**
 * Identity Extraction Middleware
 * Intercepts incoming requests, extracts user identity from JWT tokens,
 * fetches full profile data from the database, and exposes it downstream.
 */
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // Import user model to fetch fresh database profile records

// Use async because we call the data base
const identityMiddleware = async (req, res, next) => {
    // Get the token from the user
    const authHeader = req.headers['authorization'];

    // Make sure we have this Heaser and the it's starting with the word 'Bearer ' that points that the wanted user is the one
    // that holds the token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'Authentication failed: Missing or malformed authorization token' 
        });
    }

    // Get only the token
    const token = authHeader.split(' ')[1];

    // Get the secret key
    const secretKey = process.env.JWT_SECRET;

    // Make sure we got the secret key
    if (!secretKey) {
        console.error('Error: JWT_SECRET is not defined in the environment variables!');
        return res.status(500).json({ error: 'Internal server configuration error' });
    }

    try {
        // use JWT verification method to ensure our token + secret key are valid
        const decodedPayload = jwt.verify(token, secretKey);

        // Fetch the full up-to-date user profile object from the data store using the verified identifier
        const user = await UserModel.findById(decodedPayload.userId);

        // Make sure we find the user
        if (!user) {
            return res.status(401).json({ 
                error: 'Authentication failed: User with this identity no longer exists' 
            });
        }

        // Copy the wanted data into the authenticated part - sign the user is authenticated 
        req.authenticatedUser = {
            id: user.id,                  
            phoneNumber: user.phoneNumber,
            username: user.username,
            address: user.address,
            role: user.role
        };

        // The middleware job is finished
        next();
        
    } catch (error) {
        // If verify() did not work
        return res.status(401).json({ 
            error: 'Authentication failed: Invalid, tampered, or expired token' 
        });
    }
};

module.exports = identityMiddleware;
