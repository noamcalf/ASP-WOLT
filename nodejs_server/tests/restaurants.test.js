// Set express and test's library
const request = require('supertest');
const express = require('express');

// Import the main Express application instance
const app = require('../src/app'); 

const RestaurantModel = require('../src/models/restaurantModel');

// Empty array GET
describe('Restaurants Integration Tests (GET & POST)', () => {
    describe('GET /api/restaurants', () => {
        it('Should return 200 OK and an empty array when no restaurants exist', async () => {
            // Act: Send a GET request to retrieve all restaurants
            const response = await request(app).get('/api/restaurants');

            // Assert: Verify the response status, headers, and that the body is an empty array
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    // Valid post
    describe('POST /api/restaurants', () => {
        it('Should return 201 Created and the newly registered object when payload is valid', async () => {
            // Define a restaurant in a valid Json
            const validRestaurant = {
                name: 'Giraffe',
                cuisine: 'Asian',
                address: {
                    city: 'Tel Aviv',
                    street: 'Ibn Gabirol',
                    houseNumber: 45
                }
            };

            // Act: Send a POST request with the valid payload
            const response = await request(app)
                .post('/api/restaurants')
                .send(validRestaurant); 

            // Assert: Verify the server returns 201 Created and an empty body with Location header
            expect(response.status).toBe(201);
            
            // Check that the Location header exists and starts with the correct path
            expect(response.headers).toHaveProperty('location');
            expect(response.headers.location).toMatch(/^\/api\/restaurants\//);
            
            // Verify that the payload body is actually empty (Supertest returns {} or empty text)
            expect(response.text === '' || Object.keys(response.body).length === 0).toBe(true);
        });

    
        // Invalid post requests: should get 400 status

        // name is missing
        it('Should return 400 Bad Request when "name" is missing', async () => {
            // Arrange: Define an invalid payload missing the mandatory "name" field
            const invalidRestaurant = {
                cuisine: 'Italian',
                address: {
                    city: 'Tel Aviv',
                    street: 'Rothschild',
                    houseNumber: 10
                }
            };

            // Act: Send a POST request with the incomplete data
            const response = await request(app)
                .post('/api/restaurants')
                .send(invalidRestaurant);

            // Assert: Verify that validation fails, triggering a 400 error handled by your error middleware
            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body).toHaveProperty('error');
        });

        // cuisine is missing
        it('Should return 400 Bad Request when "cuisine" is missing', async () => {
            const missingCuisine = {
                name: 'Giraffe',
                address: { city: 'Tel Aviv', street: 'Ibn Gabirol', houseNumber: 45 }
            };

            const response = await request(app).post('/api/restaurants').send(missingCuisine);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        // address is missing
        it('Should return 400 Bad Request when the entire "address" object is missing', async () => {
            const missingAddress = {
                name: 'Giraffe',
                cuisine: 'Asian'
            };

            const response = await request(app).post('/api/restaurants').send(missingAddress);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        // city is missing
        it('Should return 400 Bad Request when address is present but "city" is missing', async () => {
            const missingCity = {
                name: 'Giraffe',
                cuisine: 'Asian',
                address: { street: 'Ibn Gabirol', houseNumber: 45 } // No city
            };

            const response = await request(app).post('/api/restaurants').send(missingCity);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        // street is missing
        it('Should return 400 Bad Request when address is present but "street" is missing', async () => {
            const missingStreet = {
                name: 'Giraffe',
                cuisine: 'Asian',
                address: { city: 'Tel Aviv', houseNumber: 45 } // No street
            };

            const response = await request(app).post('/api/restaurants').send(missingStreet);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        // houseNumber is missing
        it('Should return 400 Bad Request when address is present but "houseNumber" is missing', async () => {
            const missingHouseNumber = {
                name: 'Giraffe',
                cuisine: 'Asian',
                address: { city: 'Tel Aviv', street: 'Ibn Gabirol' } // No houseNumber
            };

            const response = await request(app).post('/api/restaurants').send(missingHouseNumber);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
    // Cleanup completely after all tests in this suite have finished
    afterAll(() => {
        RestaurantModel.clearAll();
    });
});

describe('Restaurants Integration Tests (GET, PATCH, DELETE by ID)', () => {
    let testRestaurantId;

    // Setup: Create a dummy restaurant before running these specific tests
    beforeEach(async () => {
    RestaurantModel.clearAll();
    
    const testRestaurant = {
        name: 'TDD Burger',
        cuisine: 'American',
        address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 100 }
    };

    const response = await request(app)
        .post('/api/restaurants')
        .send(testRestaurant);

    const locationParts = response.headers.location.split('/');
    testRestaurantId = locationParts[locationParts.length - 1];
    });

    // Test 1: Handle unknown IDs (404)
    it('Should return 404 Not Found when querying an unknown restaurant ID', async () => {
        const response = await request(app).get('/api/restaurants/non-existent-uuid-1234');
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    // Test 2: Successful PATCH (204)
    it('Should cleanly modify fields and return 204 No Content', async () => {
        const updatePayload = { name: 'TDD Burger Premium' };
        
        const response = await request(app)
            .patch(`/api/restaurants/${testRestaurantId}`)
            .send(updatePayload);
            
        expect(response.status).toBe(204);
        // Verify payload body is completely empty as required by the professor
        expect(response.text === '' || Object.keys(response.body).length === 0).toBe(true);
    });

    // Test 3: Successful DELETE (204)
    it('Should drop items out of memory entirely and yield a 204 No Content code', async () => {
        const response = await request(app).delete(`/api/restaurants/${testRestaurantId}`);
        
        expect(response.status).toBe(204);
        // Verify payload body is completely empty
        expect(response.text === '' || Object.keys(response.body).length === 0).toBe(true);
    });

    // Cleanup completely after all tests in this suite have finished
    afterAll(() => {
        RestaurantModel.clearAll();
    });
});

// Menu tests
describe('Restaurants Menu Integration Tests (GET, PATCH, DELETE by ID)', () => {
    // Setup: Create 2 dummy restaurant: one with dummy menu and one without products before running these specific tests
    let testRestaurantId;
    let testRestaurantId2;

    beforeEach(async () => {
        // Clean the data
        RestaurantModel.clearAll(); 
        
        // Create two restaurant's Json
        const restaurantPayload = {
            name: 'TDD Burger',
            cuisine: 'American',
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 100 }
        };

        const restaurantPayload2 = {
            name: 'Taco tuesday',
            cuisine: 'Mexican',
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 2 }
        };

        // Create it in the server
        const resResponse = await request(app)
            .post('/api/restaurants')
            .send(restaurantPayload);

        const resResponse2 = await request(app)
            .post('/api/restaurants')
            .send(restaurantPayload2);    
        
        // Get the new restaurant's id
        const locationHeader = resResponse.headers['location']; 
        // Split the URL into argumets with '/' as delimiter 
        testRestaurantId = locationHeader.split('/').pop(); 

        // Get the new restaurant's id
        const locationHeader2 = resResponse2.headers['location']; 
        // Split the URL into argumets with '/' as delimiter 
        testRestaurantId2 = locationHeader2.split('/').pop(); 

        // Create dummy product
        const productPayload = {
            name: 'Classic Burger',
            price: 60
        };

        // The server add's the product into the Restaurant's menu using POST
        await request(app)
            .post(`/api/restaurants/${testRestaurantId}/products`)
            .send(productPayload);
    });

        // Test 1: Get all products from restaurant's menu
    it('Setup test scopes confirming nested menu item objects return 200 states', async () => {
        // Send GET request to the server, and get th response
        const response = await request(app).get(`/api/restaurants/${testRestaurantId}/products`);

        // Check the response status
        expect(response.status).toBe(200);

        // Check the response body:
        // Check that the body of the response (menu) is an array
        expect(Array.isArray(response.body)).toBe(true);
        // Check that the body of the response (menu) is an array with size 1
        expect(response.body.length).toBe(1);
        // Check the parameters of the product
        expect(response.body[0]).toHaveProperty('name', 'Classic Burger');
        expect(response.body[0]).toHaveProperty('price', 60);
        // Each product should have it's RestaurantId as parameter
        expect(response.body[0]).toHaveProperty('restaurantId', testRestaurantId);
    });

    // Test 2: Make sure you can't GET,POST a non excisting RestaurantId
    it('Design negative verification boundaries asserting 404 for unknown parent identifiers', async () => {
        // Create not excisting id
        const notExcistingId = 'non-existent-restaurant-99';

        // Send GET request to the server, and get the response
        const response = await request(app).get(`/api/restaurants/${notExcistingId}/products`);
        // Check the response status
        expect(response.status).toBe(404);
        // Make sure we get error message
        expect(response.body).toHaveProperty('error');

        // Send POST request to the server, and get the response
        const response2 = await request(app).post(`/api/restaurants/${notExcistingId}/products`);
        // Check the response status
        expect(response2.status).toBe(404);
        // Make sure we get error message
        expect(response2.body).toHaveProperty('error');
    });

    // Test 3: Make sure the user give product to add in POST
    it('Enforce input checker filters to flag missing target properties with 400 codes.', async () => {
        // Send POST request to the server, and get the response
        const response = await request(app).post(`/api/restaurants/${testRestaurantId2}/products`);
        // Check the response status
        expect(response.status).toBe(400);
        // Make sure we get error message
        expect(response.body).toHaveProperty('error');
    });

    // Cleanup completely after all tests in this suite have finished
    afterAll(() => {
        RestaurantModel.clearAll();
    });
});