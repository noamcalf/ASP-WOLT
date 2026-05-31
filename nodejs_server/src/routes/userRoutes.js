/**
 * User Router
 * Maps user-related endpoints to the appropriate controller functions.
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const identityMiddleware = require('../middleware/identityMiddleware');

// Bind POST requests for user registration
router.route('/')
    .post(userController.registerUser);

// Bind GET requests for profile retrieval by ID
router.route('/:id')
    .get(identityMiddleware, userController.getUserProfile);

module.exports = router;