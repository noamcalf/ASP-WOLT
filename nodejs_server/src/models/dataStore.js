/**
 * Global In-Memory Data Store
 * Acts as the single source of truth for all entities in the application.
 */
const crypto = require('crypto');

const rest1Id = '11111111-1111-1111-1111-111111111111';
const rest2Id = '22222222-2222-2222-2222-222222222222';
const rest3Id = '33333333-3333-3333-3333-333333333333';

const dataStore = {
    restaurants: [
        { 
            id: rest1Id, 
            name: "Burger King", 
            cuisine: "Fast Food",
            address: { city: "Tel Aviv", street: "Dizengoff", houseNumber: 50 },
            geolocation: { latitude: 32.0772, longitude: 34.7738 },
            baseDeliveryTime: "30-40 min",
            rating: 4.5 
        },
        { 
            id: rest2Id, 
            name: "Tony Vespa Pizza", 
            cuisine: "Italian",
            address: { city: "Tel Aviv", street: "Rothschild", houseNumber: 140 },
            geolocation: { latitude: 32.0621, longitude: 34.7760 },
            baseDeliveryTime: "35-45 min",
            rating: 4.8 
        },
        { 
            id: rest3Id, 
            name: "Dominos Pizza", 
            cuisine: "Fast Food",
            address: { city: "Tel Aviv", street: "Ibn Gabirol", houseNumber: 10 },
            geolocation: { latitude: 32.0763, longitude: 34.7816 },
            baseDeliveryTime: "25-35 min",
            rating: 4.2 
        }
    ],
    products: [
        { id: crypto.randomUUID(), restaurantId: rest1Id, category: "Mains", name: "Whopper Meal", price: 45, description: "Classic burger with fries and a drink", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
        { id: crypto.randomUUID(), restaurantId: rest1Id, category: "Sides", name: "Chicken Nuggets", price: 30, description: "9 pieces of crispy chicken with dips", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80" },
        { id: crypto.randomUUID(), restaurantId: rest2Id, category: "Slices", name: "Pepperoni Slice", price: 20, description: "Spicy pepperoni slice, baked to perfection", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80" },
        { id: crypto.randomUUID(), restaurantId: rest2Id, category: "Slices", name: "Margherita Slice", price: 18, description: "Classic cheese and tomato slice", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80" },
        { id: crypto.randomUUID(), restaurantId: rest3Id, category: "Pizzas", name: "Family Pizza", price: 80, description: "Large 100% mozzarella pizza with two toppings", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80" }
    ],
    users: [
        {
            id: 'mock-user-1234',
            username: 'bk26',
            password: 'p12345678',
            name: 'Ben Kolman',
            phoneNumber: '0501234567',
            role: 'customer',
            image: null,
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 1 }
        }
    ],
    orders: []
};

module.exports = dataStore;