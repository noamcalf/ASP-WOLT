const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const identityMiddleware = require('../middlewares/identityMiddleware');

// Bind POST and GET requests 
router.route('/')
    .post(identityMiddleware, orderController.createOrder) // Activates POST in CPP server : POST <userId> <orderId> <productId1> <productId2>...
    .get(identityMiddleware, orderController.getOrdersHistory);

// Bind GET requests for spesific order
router.route('/:id')
    .get(identityMiddleware, orderController.getOrderDetails)
    .patch(identityMiddleware, orderController.updateOrderDetails) // Activates PATCH in CPP server : PATCH <userId> <orderId> <productId1> <productId2>...
    .delete(identityMiddleware, orderController.deleteOrder); // Activates DELETE in CPP server : DELETE <userId> <orderId>    

module.exports = router;