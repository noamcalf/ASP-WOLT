/**
 * Restaurant Routes
 * Maps HTTP methods and endpoints to the appropriate controller functions.
 */
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Bind GET and POST requests on the root path to their respective controllers
router.route('/')
    .get(restaurantController.getRestaurants)
    .post(restaurantController.createRestaurant);

// Bind GET, PATCH, and DELETE requests with id as parameter to their respective controllers
router.route('/:id')
    .get(restaurantController.getRestaurantById)
    .patch(restaurantController.updateRestaurant)
    .delete(restaurantController.deleteRestaurant);

module.exports = router;