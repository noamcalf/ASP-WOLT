const mongoose = require('mongoose');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel');

const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments();
        const restaurantCount = await Restaurant.countDocuments();
        const productCount = await Product.countDocuments();

        // Check if all collections are empty
        if (userCount === 0 && restaurantCount === 0 && productCount === 0) {
            console.log('Collections are empty. Seeding database with initial data...');

            // Seed Users
            await User.insertMany([
                {
                    username: 'bk26',
                    password: 'p12345678', // Plain text as per current system design
                    name: 'Ben Kolman',
                    phoneNumber: '0501234567',
                    role: 'customer',
                    image: 'images/default-user.jpg',
                    address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 1 },
                    geolocation: { latitude: 32.0800, longitude: 34.7800 }
                },
                {
                    username: 'bigboss',
                    password: 'password123',
                    name: 'Big Boss',
                    phoneNumber: '0509999999',
                    role: 'owner',
                    image: 'images/default-owner.jpg',
                    address: null
                }
            ]);
            console.log('Users seeded successfully.');

            // Generate fixed ObjectIds for restaurants to map products
            const rest1Id = new mongoose.Types.ObjectId();
            const rest2Id = new mongoose.Types.ObjectId();
            const rest3Id = new mongoose.Types.ObjectId();

            // Seed Restaurants
            await Restaurant.insertMany([
                { 
                    _id: rest1Id,
                    name: "Burger Boss", 
                    cuisine: "Fast Food",
                    address: { city: "Tel Aviv", street: "Allenby", houseNumber: 100 },
                    geolocation: { latitude: 32.0645, longitude: 34.7710 },
                    baseDeliveryTime: "25-35 min",
                    rating: 4.9,
                    // Note: We leave ownerId out for now, or we could fetch 'bigboss' user and set it.
                    // Let's fetch the owner user.
                },
                { 
                    _id: rest2Id,
                    name: "Luigi's Crust", 
                    cuisine: "Italian",
                    address: { city: "Tel Aviv", street: "Rothschild", houseNumber: 140 },
                    geolocation: { latitude: 32.0621, longitude: 34.7760 },
                    baseDeliveryTime: "30-40 min",
                    rating: 4.8,
                },
                { 
                    _id: rest3Id,
                    name: "Frosty Scoops", 
                    cuisine: "Desserts",
                    address: { city: "Tel Aviv", street: "Dizengoff", houseNumber: 50 },
                    geolocation: { latitude: 32.0772, longitude: 34.7738 },
                    baseDeliveryTime: "15-25 min",
                    rating: 4.7,
                }
            ]);
            console.log('Restaurants seeded successfully.');

            // Seed Products
            await Product.insertMany([
                // Burger Boss
                { restaurantId: rest1Id, category: "Mains", name: "The Double Smash Boss", price: 65, description: "Two juicy beef patties, cheddar cheese, lettuce, tomato, and our secret house sauce.", image: "images/double-burger.jpg" },
                { restaurantId: rest1Id, category: "Mains", name: "Crispy Chicken Supreme", price: 58, description: "Crispy fried chicken breast, brioche bun, coleslaw, and garlic aioli.", image: "images/chicken-burger.jpg" },
                { restaurantId: rest1Id, category: "Sides", name: "Golden French Fries", price: 22, description: "Classic and crispy golden french fries.", image: "images/French-fries.jpg" },
                { restaurantId: rest1Id, category: "Drinks", name: "Glass bottle of Cola", price: 12, description: "A refreshing glass bottle of Coca-Cola.", image: "images/coke.jpg" },

                // Luigi's Crust
                { restaurantId: rest2Id, category: "Mains", name: "Classic Margherita Pizza", price: 55, description: "Classic Neapolitan pizza with tomato sauce, fresh mozzarella, and basil leaves.", image: "images/pizza1.jpg" },
                { restaurantId: rest2Id, category: "Mains", name: "Chef's Special Pizza", price: 72, description: "Our Chef's special pizza with daily changing premium toppings.", image: "images/pizza2.jpg" },

                // Frosty Scoops
                { restaurantId: rest3Id, category: "Desserts", name: "Cookies & Cream Scoop", price: 18, description: "Rich and creamy vanilla ice cream with delicious cookie chunks.", image: "images/vanila-flavor.jpg" },
                { restaurantId: rest3Id, category: "Desserts", name: "Ice Cream Cone", price: 5, description: "A classic crispy waffle cone.", image: "images/cone.jpg" }
            ]);
            console.log('Products seeded successfully.');

            // Fix ownerId for restaurants to point to 'bigboss'
            const owner = await User.findOne({ username: 'bigboss' });
            if (owner) {
                await Restaurant.updateMany({}, { ownerId: owner._id });
                console.log('Linked restaurants to the owner successfully.');
            }

            console.log('Database seeded successfully!');
        } else {
            console.log('Database already contains data. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;
