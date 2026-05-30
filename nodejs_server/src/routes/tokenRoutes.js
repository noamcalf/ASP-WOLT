/**
 * Token Router
 * Maps token generation (authentication) endpoints to the appropriate controller.
 */
const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Bind POST requests for user authentication (token generation)
router.route('/')
    .post(tokenController.generateToken);

module.exports = router;