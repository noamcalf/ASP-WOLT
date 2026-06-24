/**
 * Product Controller
 * Handles all HTTP requests for products nested under specific restaurants.
 */
const RestaurantModel = require('../models/restaurantModel');
const ProductModel = require('../models/productModel');
const TcpService = require('../services/tcpService');

// Retrieves all products for a specific restaurant
const getProducts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const restaurant = await RestaurantModel.findById(id);

        // Confirm target restaurant records are active
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Get all products for the wanted restaurant
        const restaurantProducts = await ProductModel.find({ restaurantId: id });

        // Return wanted output
        return res.status(200).json(restaurantProducts);
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        next(error);
    }
};

// Validates payload and adds a new product to the requested restaurant
const createProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Destructure payload properties
        let { name, price, category, description } = req.body || {};
        const image = req.file ? req.file.path : null;

        // Parse price if sent as string from FormData
        if (typeof price === 'string') {
            price = parseFloat(price);
        }

        // Confirm parent restaurant entities are registered
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Catch formatting missing properties
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: "Validation failed: 'name' is required" });
        }
        if (price === undefined || typeof price !== 'number' || isNaN(price)) {
            return res.status(400).json({ error: "Validation failed: 'price' is required and must be a valid number" });
        }

        // Create the product via the model
        const newProduct = await ProductModel.create({ 
            restaurantId: id,
            name: name.trim(), 
            price, 
            category: category?.trim() || 'Other', 
            description: description?.trim() || '', 
            image 
        });

        // Configure 201 status response with specific product Location header
        res.location(`/api/restaurants/${id}/products/${newProduct.id}`);
        return res.status(201).end();
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        next(error);
    }
};

// Retrieves a specific product from a restaurant's menu by its unique ID
const getProduct = async (req, res, next) => {
    try {
        const { id, pId } = req.params;
       
        // Make sure the restaurant is available
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
           return res.status(404).json({ error: "Restaurant not found" }); 
        }

        // Make sure We find the product in the restaurant
        const product = await ProductModel.findOne({ _id: pId, restaurantId: id });
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
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Not found" });
        }
        next(error);
    }
};

// Updates specific fields of a designated product within a restaurant's menu
const updateProduct = async (req, res, next) => {
    try {
        const { id, pId } = req.params;
        let updates = req.body || {};

        if (req.file) {
            updates.image = req.file.path;
        }
        
        if (typeof updates.price === 'string') {
            updates.price = parseFloat(updates.price);
        }

        // Make sure the restaurant is available
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
           return res.status(404).json({ error: "Restaurant not found" }); 
        }

        // Make sure we find the product, and update its details
        const updatedProduct = await ProductModel.findOneAndUpdate(
            { _id: pId, restaurantId: id }, 
            updates, 
            { new: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Return wanted output
        return res.status(204).end();
    } catch (error) {
        // If the id is not even in the mongoose format for object id
        if (error.name === 'CastError') {
            return res.status(404).json({ error: "Not found" });
        }
        next(error);
    }
};

// Removes a specific product from a restaurant's menu by its unique ID
const deleteProduct = async (req, res, next) => {
    try {
        const { id, pId } = req.params;

        // Make sure the restaurant is available
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
           return res.status(404).json({ error: "Restaurant not found" }); 
        }

        // Make sure we find the product, and delete him
        const deletedProduct = await ProductModel.findOneAndDelete({ _id: pId, restaurantId: id });
        
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Return wanted output
        return res.status(204).end();
    } catch (error) {
        if (error.name === 'CastError') {
            // If the id is not even in the mongoose format for object id
            return res.status(404).json({ error: "Not found" });
        }
        next(error);
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
};