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
            rating: 4.5 
        },
        { 
            id: rest2Id, 
            name: "Tony Vespa Pizza", 
            cuisine: "Italian",
            address: { city: "Tel Aviv", street: "Rothschild", houseNumber: 140 },
            geolocation: { latitude: 32.0621, longitude: 34.7760 },
            rating: 4.8 
        },
        { 
            id: rest3Id, 
            name: "Dominos Pizza", 
            cuisine: "Fast Food",
            address: { city: "Tel Aviv", street: "Ibn Gabirol", houseNumber: 10 },
            geolocation: { latitude: 32.0763, longitude: 34.7816 },
            rating: 4.2 
        }
    ],
    products: [
        { id: crypto.randomUUID(), restaurantId: rest1Id, name: "Whopper Meal", price: 45, description: "Classic burger with fries and a drink" },
        { id: crypto.randomUUID(), restaurantId: rest1Id, name: "Chicken Nuggets", price: 30, description: "9 pieces of crispy chicken with dips" },
        { id: crypto.randomUUID(), restaurantId: rest2Id, name: "Pepperoni Slice", price: 20, description: "Spicy pepperoni slice, baked to perfection" },
        { id: crypto.randomUUID(), restaurantId: rest2Id, name: "Margherita Slice", price: 18, description: "Classic cheese and tomato slice" },
        { id: crypto.randomUUID(), restaurantId: rest3Id, name: "Family Pizza", price: 80, description: "Large 100% mozzarella pizza with two toppings" }
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