/**
 * TDD Suite for Global Error Handling Middleware
 */
const request = require('supertest');
const express = require('express');

// We setup a mock Express application to test our future middleware.
// In WOLT-109, these middlewares will be implemented in the actual app.js.
const app = express();
app.use(express.json());

/**
 * MOCK ROUTES FOR TESTING
 * We simulate a working route and a failing route to trigger the middlewares.
 */
app.get('/api/working', (req, res) => {
    res.status(200).json({ success: true });
});

app.get('/api/crash', (req, res, next) => {
    // Simulating an unexpected runtime failure (e.g., database disconnect)
    const error = new Error('Database connection lost unexpectedly');
    next(error); 
});

/**
 * PLACEHOLDERS FOR MIDDLEWARE (To be built in WOLT-109)
 * In TDD, we write the assertions first. When we run this file now, 
 * the tests will fail because the middleware logic is missing.
 */
// TODO: app.use(notFoundMiddleware);
// TODO: app.use(globalErrorMiddleware);

/**
 * ASSERTION SUITES
 */
describe('Global Error Handling Middleware', () => {

    it('Should enforce lookups on bad routes and return 404 uniform JSON', async () => {
        // Act: Request a route that was never defined
        const response = await request(app).get('/api/route-that-does-not-exist');

        // Assert: Expect a 404 status code and a JSON error message
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Route not found');
    });

    it('Should catch unexpected runtime failures and return 500 uniform JSON', async () => {
        // Act: Request the route that simulates a system crash
        const response = await request(app).get('/api/crash');

        // Assert: Expect a 500 status code and a clean JSON error representation
        expect(response.status).toBe(500);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Internal Server Error');
    });

});