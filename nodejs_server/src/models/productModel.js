/**
 * Product Model
 * Manages product entities inside the global dataStore as a flat resource.
 */
const crypto = require('crypto');
const dataStore = require('./dataStore');

// Retrieves all products
const getAllProducts = () => {
    return dataStore.products;
};

// Retrieves all products assigned to a specific restaurant ID
const getProductsByRestaurantId = (restaurantId) => {
    return dataStore.products.filter(product => product.restaurantId === restaurantId);
};

// Generates a unique ID, constructs a new product, and saves it to the flat array
const createProductInRestaurant = (restaurantId, productData) => {
    const newProduct = {
        id: crypto.randomUUID(),
        restaurantId: restaurantId,
        category: productData.category || 'Other',
        name: productData.name,
        price: productData.price,
        description: productData.description || '',
        image: productData.image || null
    };

    dataStore.products.push(newProduct);
    return newProduct;
};

// Retrieves a specific single product from a designated restaurant menu
const getProductFromRestaurant = (restaurantId, productId) => {
    // Find the product and verify it belongs to the correct restaurant
    const product = dataStore.products.find(p => p.id === productId && p.restaurantId === restaurantId);
    
    return product ? product : null;
};

// Mutates dynamic contextual subsets of properties on a targeted product record
const updateProductFromRestaurant = (restaurantId, productId, updates) => {
    // Locate the specific product inside the data store
    const product = dataStore.products.find(p => p.id === productId && p.restaurantId === restaurantId);
    if (!product) {
        return false;
    }

    // Safely update specified fields if they are provided in the payload
    if (updates.name !== undefined) product.name = updates.name;
    if (updates.price !== undefined) product.price = updates.price;

    return true;
};

// Excises a specific targeted product descriptor from the global array
const deleteProductFromRestaurant = (restaurantId, productId) => {
    // Find the exact index of the product matching both identifiers
    const index = dataStore.products.findIndex(p => p.id === productId && p.restaurantId === restaurantId);
    if (index === -1) {
        return false;
    }

    // Remove the product item from the array store
    dataStore.products.splice(index, 1);
    return true;
};

const clearAll = () => {
    dataStore.products = [];
};

module.exports = {
    getAllProducts,
    getProductsByRestaurantId,
    createProductInRestaurant,
    getProductFromRestaurant,
    updateProductFromRestaurant,
    deleteProductFromRestaurant,
    clearAll
};