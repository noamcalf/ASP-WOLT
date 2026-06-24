const mongoose = require('mongoose');

// Create the product's schema based on it's fields
const productSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        // Ref let mongooes know this field's type: we can later get the whole type by populate() command
        ref: 'Restaurant',
        required: true
    },
    category: {
        type: String,
        default: 'Other'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
// Export the schema
module.exports = Product;