// Get mongoose
const mongoose = require('mongoose');

// Create the user schema based on it's fields (both costumer and restaurant owner)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'owner'],
        default: 'customer'
    },
    name: {
        type: String
    },
    image: {
        type: String,
        required: true
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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
// Export the schema
module.exports = User;