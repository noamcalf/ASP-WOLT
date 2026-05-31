const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const identityMiddleware = require('../middleware/identityMiddleware');

// Bind POST and GET requests 
router.route('/')
    .post(identityMiddleware, orderController.createOrder)
    .get(identityMiddleware, orderController.getOrdersHistory);

// Bind GET requests for spesific order
router.route('/:id')
    .get(identityMiddleware, orderController.getOrderDetails)
    .patch(identityMiddleware, orderController.updateOrderDetails)
    .delete(identityMiddleware, orderController.deleteOrder);    

module.exports = router;