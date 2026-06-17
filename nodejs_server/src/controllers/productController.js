/**
 * Product Controller
 * Handles all HTTP requests for products nested under specific restaurants.
 */
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');
const TcpService = require('../services/tcpService');

// Retrieves all products for a specific restaurant
const getProducts = (req, res) => {
    const { id } = req.params;
    const restaurant = RestaurantModel.getRestaurant(id);

    // Confirm target restaurant records are active
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    // Get all products for the wanted restaurant
    const restaurantProducts = ProductModel.getProductsByRestaurantId(id);

    // Return wanted output
    return res.status(200).json(restaurantProducts);
};

// Validates payload and adds a new product to the requested restaurant
const createProduct = (req, res) => {
    const { id } = req.params;
    // Destructure payload properties
    let { name, price, category, description } = req.body || {};
    const image = req.file ? req.file.path : null;

    // Parse price if sent as string from FormData
    if (typeof price === 'string') {
        price = parseFloat(price);
    }

    // Confirm parent restaurant entities are registered
    const restaurant = RestaurantModel.getRestaurant(id);
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    // Catch formatting missing properties
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'name' is required" });
    }
    if (price === undefined || typeof price !== 'number') {
        return res.status(400).json({ error: "Validation failed: 'price' is required and must be a number" });
    }

    // Create the product via the model
    const newProduct = ProductModel.createProductInRestaurant(id, { 
        name: name.trim(), 
        price, 
        category: category?.trim(), 
        description: description?.trim(), 
        image 
    });

    // Configure 201 status response with specific product Location header
    res.location(`/api/restaurants/${id}/products/${newProduct.id}`);
    return res.status(201).end();
};

// Retrieves a specific product from a restaurant's menu by its unique ID
const getProduct = (req, res, next) => {
    const { id, pId } = req.params;
   
    // Make sure the restaurant is available
    const restaurant = RestaurantModel.getRestaurant(id);
    if (!restaurant) {
       return res.status(404).json({ error: "Restaurant not found" }); 
    }

    // Make sure We find the product in the restaurant
    const product = ProductModel.getProductFromRestaurant(id, pId);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    // Get the user's authenticated id
    const userId = req.authenticatedUser?.id

    // Swnd the command for CPP server's update
    if (userId) {
        TcpService.sendPatchCommand(userId, [pId]);
    }
    
    // Return wanted output
    return res.status(200).json(product);
};

// Updates specific fields of a designated product within a restaurant's menu
const updateProduct = (req, res, next) => {
    const { id, pId } = req.params;
    let updates = req.body || {};

    if (req.file) {
        updates.image = req.file.path;
    }
    
    if (typeof updates.price === 'string') {
        updates.price = parseFloat(updates.price);
    }

    // Make sure the restaurant is available
    const restaurant = RestaurantModel.getRestaurant(id);
    if (!restaurant) {
       return res.status(404).json({ error: "Restaurant not found" }); 
    }

    // Make sure we find the product, and update its details
    const isUpdated = ProductModel.updateProductFromRestaurant(id, pId, updates);
    
    if (!isUpdated) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    // Return wanted output
    return res.status(204).end();
};

// Removes a specific product from a restaurant's menu by its unique ID
const deleteProduct = (req, res, next) => {
    const { id, pId } = req.params;

    // Make sure the restaurant is available
    const restaurant = RestaurantModel.getRestaurant(id);
    if (!restaurant) {
       return res.status(404).json({ error: "Restaurant not found" }); 
    }

    // Make sure we find the product, and delete him
    const isDeleted = ProductModel.deleteProductFromRestaurant(id, pId);
    
    if (!isDeleted) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    // Return wanted output
    return res.status(204).end();
};

module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
};