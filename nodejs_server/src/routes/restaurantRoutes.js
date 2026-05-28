/**
 * Restaurant Routes
 * Maps HTTP methods and endpoints to the appropriate controller functions.
 */
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Bind GET requests on the root path to the getRestaurants controller
router.get('/', restaurantController.getRestaurants);

// Bind POST requests to the createRestaurant controller
router.post('/', restaurantController.createRestaurant);

module.exports = router;