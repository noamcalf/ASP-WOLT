const request = require('supertest');
const app = require('../src/app');
const RestaurantModel = require('../src/models/restaurantModel');
const ProductModel = require('../src/models/productModel');

describe('Global Text-Based Search Engine TDD Suite', () => {
    let testRestaurantId;

    // Init dataStore
    beforeEach(() => {
        RestaurantModel.clearAll();
        ProductModel.clearAll();

        // Seed comprehensive testing data setup matching system models
        const restaurant1 = RestaurantModel.createRestaurant({
            name: 'Pizza Hut',
            cuisine: 'Italian',
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 50 }
        });
        testRestaurantId = restaurant1.id;

        RestaurantModel.createRestaurant({
            name: 'Burger Joint',
            cuisine: 'American',
            address: { city: 'Haifa', street: 'Carmel', houseNumber: 12 }
        });

        // Seed products containing only name and price attributes
        ProductModel.createProductInRestaurant(testRestaurantId, {
            name: 'Cheesy Garlic Bread',
            price: 30
        });

        ProductModel.createProductInRestaurant(testRestaurantId, {
            name: 'Pepperoni Pizza',
            price: 70
        });

        // Seed a corrupted restaurant record missing the name attribute to test engine resilience
        RestaurantModel.createRestaurant({
            cuisine: 'Unknown',
            address: { city: 'Eilat', street: 'Hamar', houseNumber: 2 }
        });
    });

    // Handel non existing search value
    it('Should return a 200 OK status and decoupled empty arrays for non-matching alphanumeric queries', async () => {
        const response = await request(app).get('/api/search/XYZInvalidKeyword123');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('restaurants');
        expect(response.body).toHaveProperty('products');
        expect(Array.isArray(response.body.restaurants)).toBe(true);
        expect(Array.isArray(response.body.products)).toBe(true);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    // Handle only white-spaces: (%20)
    it('Should return clean empty structures and handle graceful degradation when query consists of blank spaces', async () => {
        const response = await request(app).get('/api/search/%20%20%20');

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    // Handle Case Insensitivity & Name Matching:
    // Test 1
    it('Should seamlessly handle mixed-case variations across multi-entity search pipelines', async () => {
        const response = await request(app).get('/api/search/pIzZa');

        expect(response.status).toBe(200);
        
        // Assert output structures segregate entities into separate keys
        expect(response.body.restaurants.length).toBe(1);
        expect(response.body.restaurants[0].name).toBe('Pizza Hut');

        expect(response.body.products.length).toBe(1);
        expect(response.body.products[0].name).toBe('Pepperoni Pizza');
    });

    // Test 2
    it('Should trigger successful partial substring evaluations on entity names without dropping records', async () => {
        const response = await request(app).get('/api/search/Garlic');

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(1);
        expect(response.body.products[0].name).toBe('Cheesy Garlic Bread');
    });

    // Handle regex addings
    it('Should neutralize the asterisk (*) wildcard and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('Pizza*')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize the plus (+) wildcard and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('Pizza+')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize the question mark (?) wildcard and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('Pizza?')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize the caret (^) anchor and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('^Pizza')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize the dollar ($) anchor and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('Hut$')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize square brackets ([]) and treat them as literal characters', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('[P]izza')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize parentheses (()) and treat them as literal characters', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('(Pizza)')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize the pipe (|) operator and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('Pizza|Burger')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    it('Should neutralize the dot (.) wildcard and treat it as a literal character', async () => {
        const response = await request(app).get(`/api/search/${encodeURIComponent('Pizza.')}`);

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(0);
        expect(response.body.products.length).toBe(0);
    });

    // Robustness & Fault Tolerance Validations
    it('Should bypass entity records with missing name parameters safely without throwing exceptions', async () => {
        const response = await request(app).get('/api/search/Burger');

        expect(response.status).toBe(200);
        expect(response.body.restaurants.length).toBe(1);
        expect(response.body.restaurants[0].name).toBe('Burger Joint');
    });
});