const mongoose = require('mongoose');

// Set mongoose object - order status
const OrderStatus = Object.freeze({
    PENDING: 'PENDING',
    PREPARING: 'PREPARING',
    ON_ITS_WAY: 'ON_ITS_WAY',
    DELIVERED: 'DELIVERED'
});

// Create the product's schema based on it's fields
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // Ref let mongooes know this field's type: we can later get the whole type by populate() command
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        // Ref let mongooes know this field's type: we can later get the whole type by populate() command
        ref: 'Restaurant',
        required: true
    },
    customerName: {
        type: String
    },
    customerPhone: {
        type: String
    },
    shippingAddress: {
        city: { type: String },
        street: { type: String },
        houseNumber: { type: String }
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            // Ref let mongooes know this field's type: we can later get the whole type by populate() command
            ref: 'Product',
            required: true
        },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Order = mongoose.model('Order', orderSchema);
// Export the schema and the status's object
module.exports = {
    Order,
    OrderStatus
};