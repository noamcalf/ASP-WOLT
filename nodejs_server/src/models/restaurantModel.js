const mongoose = require('mongoose');

// Create the restaurant's schema based on it's fields
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        // Ref let mongooes know this field's type: we can later get the whole type by populate() command
        ref: 'User'
    },
    baseDeliveryTime: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    address: {
        city: { type: String },
        street: { type: String },
        houseNumber: { type: String }
    },
    geolocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
// Export the schema
module.exports = Restaurant;