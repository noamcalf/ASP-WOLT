/**
 * Identity Extraction Middleware
 * Intercepts incoming requests, extracts user identity from HTTP headers,
 * and exposes it to downstream controllers via the request object.
 */
const identityMiddleware = (req, res, next) => {
    // Get the unique phone number from the headers
    const userPhone = req.headers['x-user-phone'] || req.headers['x-phonenumber'];

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

    // Create new field that shows that this user is authenticated
    req.authenticatedUser = {
        id: user.id,                  
        phoneNumber: user.phoneNumber,
        username: user.username,
        address: user.address
    };

    // Proceed to the controller
    next();
};


module.exports = identityMiddleware;