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
            name: "Burger Boss", 
            cuisine: "Fast Food",
            address: { city: "Tel Aviv", street: "Allenby", houseNumber: 100 },
            geolocation: { latitude: 32.0645, longitude: 34.7710 },
            baseDeliveryTime: "25-35 min",
            rating: 4.9,
            ownerId: 'mock-owner-5678',
            image: 'images/burger-resturant.jpg'
        },
        { 
            id: rest2Id, 
            name: "Luigi's Crust", 
            cuisine: "Italian",
            address: { city: "Tel Aviv", street: "Rothschild", houseNumber: 140 },
            geolocation: { latitude: 32.0621, longitude: 34.7760 },
            baseDeliveryTime: "30-40 min",
            rating: 4.8,
            ownerId: 'mock-owner-5678',
            image: 'images/pizza-resturant.jpg'
        },
        { 
            id: rest3Id, 
            name: "Frosty Scoops", 
            cuisine: "Desserts",
            address: { city: "Tel Aviv", street: "Dizengoff", houseNumber: 50 },
            geolocation: { latitude: 32.0772, longitude: 34.7738 },
            baseDeliveryTime: "15-25 min",
            rating: 4.7,
            ownerId: 'mock-owner-5678',
            image: 'images/ice-cream-resturant.jpg'
        }
    ],
    products: [
        // Burger Boss
        { id: crypto.randomUUID(), restaurantId: rest1Id, category: "Mains", name: "The Double Smash Boss", price: 65, description: "Two juicy beef patties, cheddar cheese, lettuce, tomato, and our secret house sauce.", image: "images/double-burger.jpg" },
        { id: crypto.randomUUID(), restaurantId: rest1Id, category: "Mains", name: "Crispy Chicken Supreme", price: 58, description: "Crispy fried chicken breast, brioche bun, coleslaw, and garlic aioli.", image: "images/chicken-burger.jpg" },
        { id: crypto.randomUUID(), restaurantId: rest1Id, category: "Sides", name: "Golden French Fries", price: 22, description: "Classic and crispy golden french fries.", image: "images/French-fries.jpg" },
        { id: crypto.randomUUID(), restaurantId: rest1Id, category: "Drinks", name: "Glass bottle of Cola", price: 12, description: "A refreshing glass bottle of Coca-Cola.", image: "images/coke.jpg" },

        // Luigi's Crust
        { id: crypto.randomUUID(), restaurantId: rest2Id, category: "Mains", name: "Classic Margherita Pizza", price: 55, description: "Classic Neapolitan pizza with tomato sauce, fresh mozzarella, and basil leaves.", image: "images/pizza1.jpg" },
        { id: crypto.randomUUID(), restaurantId: rest2Id, category: "Mains", name: "Chef's Special Pizza", price: 72, description: "Our Chef's special pizza with daily changing premium toppings.", image: "images/pizza2.jpg" },

        // Frosty Scoops
        { id: crypto.randomUUID(), restaurantId: rest3Id, category: "Desserts", name: "Cookies & Cream Scoop", price: 18, description: "Rich and creamy vanilla ice cream with delicious cookie chunks.", image: "images/vanila-flavor.jpg" },
        { id: crypto.randomUUID(), restaurantId: rest3Id, category: "Desserts", name: "Ice Cream Cone", price: 5, description: "A classic crispy waffle cone.", image: "images/cone.jpg" }
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
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 1 },
            geolocation: { latitude: 32.0800, longitude: 34.7800 }
        },
        {
            id: 'mock-owner-5678',
            username: 'bigboss',
            password: 'password123',
            name: 'Big Boss',
            phoneNumber: '0509999999',
            role: 'owner',
            image: null,
            address: null
        }
    ],
    orders: []
};

module.exports = dataStore;