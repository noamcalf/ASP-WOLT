/**
 * Restaurant and Product Router
 * Maps HTTP methods and nested endpoints to the appropriate controller functions.
 */
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const productController = require('../controllers/productController');
const identityMiddleware = require('../middleware/identityMiddleware');

// Bind GET and POST requests on the root path to their respective controllers
router.route('/')
    .get(restaurantController.getRestaurants)
    .post(restaurantController.createRestaurant);

// Bind GET, PATCH, and DELETE requests with id as parameter to their respective controllers
router.route('/:id')
    .get(restaurantController.getRestaurantById)
    .patch(restaurantController.updateRestaurant)
    .delete(restaurantController.deleteRestaurant);

// Bind GET and POST requests for products catalog under a specific restaurant
router.route('/:id/products')
    .get(productController.getProducts)
    .post(productController.createProduct);

// Bind GET, PATCH, and DELETE requests for a specific nested product by its unique ID
router.route('/:id/products/:pId') 
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;