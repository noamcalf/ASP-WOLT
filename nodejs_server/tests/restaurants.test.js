// Set express and test's library
const request = require('supertest');
const express = require('express');

// Import the main Express application instance
const app = require('../src/app'); 

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
});

describe('Restaurants Integration Tests (GET, PATCH, DELETE by ID)', () => {
    let testRestaurantId;

    // Setup: Create a dummy restaurant before running these specific tests
    beforeAll(async () => {
        const testRestaurant = {
            name: 'TDD Burger',
            cuisine: 'American',
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 100 }
        };

        const response = await request(app)
            .post('/api/restaurants')
            .send(testRestaurant);
        
        // Extract the ID from the Location header (e.g., "/api/restaurants/1234-5678")
        const locationParts = response.headers.location.split('/');
        testRestaurantId = locationParts[locationParts.length - 1];
    });

    // Teardown: Ensure memory is completely wiped after these tests finish
    afterAll(() => {
        dataStore.clearAll(); 
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
});