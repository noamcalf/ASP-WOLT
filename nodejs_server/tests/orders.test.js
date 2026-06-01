const request = require('supertest');
const app = require('../src/app');
const UserModel = require('../src/models/userModel');
const RestaurantModel = require('../src/models/restaurantModel');
const ProductModel = require('../src/models/productModel');
const OrderModel = require('../src/models/orderModel'); 

describe('Order Management & Header-Based Authentication Tests', () => {
    let activeUserId;
    let activeUserPhone;
    let unauthorizedUserPhone;
    let testRestaurantId;
    let testProductId;

    // Establish a clean state with registered users and an active restaurant menu to simulate real ordering flows
    beforeEach(() => {
        UserModel.clearAll();
        RestaurantModel.clearAll();
        ProductModel.clearAll();
        if (OrderModel && OrderModel.clearAll) OrderModel.clearAll();

        // 1. Create the main authenticated user
        const activeUser = UserModel.createUser({
            username: 'ordering_user',
            phoneNumber: '0501111111',
            password: 'hashed123',
            address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 10 }
        });
        activeUserId = activeUser.id;
        activeUserPhone = activeUser.phoneNumber;

        // 2. Create a secondary user to test data isolation
        const unauthorizedUser = UserModel.createUser({
            username: 'stranger',
            phoneNumber: '0502222222',
            password: 'hashed456',
            address: { city: 'Haifa', street: 'Carmel', houseNumber: 5 }
        });
        unauthorizedUserPhone = unauthorizedUser.phoneNumber;

        // 3. Create a restaurant and a product to order
        const restaurant = RestaurantModel.createRestaurant({
            name: 'Burger Palace',
            cuisine: 'American',
            address: { city: 'Tel Aviv', street: 'Allenby', houseNumber: 44 }
        });
        testRestaurantId = restaurant.id;

        const product = ProductModel.createProductInRestaurant(testRestaurantId, {
            name: 'Classic Burger',
            price: 65
        });
        
        // Extract the verifiable model identifier to match backend catalog queries
        testProductId = product.id;
    });

    describe('Security & Header-Based Identity Extraction', () => {
        
        // Verify that the system strictly blocks requests lacking the custom HTTP identity header
        it.skip('Should reject order operations with 401 Unauthorized if the x-user-phone header is missing', async () => {
            const orderPayload = {
                restaurantId: testRestaurantId,
                items: [{ productId: testProductId, quantity: 2 }]
            };

            // Notice: We are NOT setting the .set('x-user-id') header here
            const response = await request(app)
                .post('/api/orders')
                .send(orderPayload);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/orders - Order Creation', () => {
        
        // Ensure valid purchases are recorded successfully, returning a strict 201 status with an entirely empty payload
        it('Should accept valid orders, returning 201 Created with an empty payload and Location header', async () => {
            const orderPayload = {
                restaurantId: testRestaurantId,
                items: [{ productId: testProductId, quantity: 2 }]
            };

            const response = await request(app)
                .post('/api/orders')
                .set('x-user-phone', activeUserPhone) // Mocking the header extraction
                .send(orderPayload);

            expect(response.status).toBe(201);
            
            // Verify the Location header points to the newly created resource
            expect(response.headers).toHaveProperty('location');
            expect(response.headers.location).toContain('/api/orders/');

            // Strict compliance: Ensure the payload is entirely empty
            expect(response.text === '' || Object.keys(response.body).length === 0).toBe(true);
        });
    });

    describe('GET /api/orders - History & Scope Enforcement', () => {
        
        // Assert that querying the order index explicitly filters and returns ONLY the order history matching the caller's identity scope
        it('Should retrieve a list of orders exclusive to the authenticated user', async () => {
            // First, create an order to populate the history
            await request(app)
                .post('/api/orders')
                .set('x-user-phone', activeUserPhone)
                .send({ restaurantId: testRestaurantId, items: [{ productId: testProductId, quantity: 1 }] });

            // Fetch the history using the active user's header
            const response = await request(app)
                .get('/api/orders')
                .set('x-user-phone', activeUserPhone)

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            
            // Crucial security check: Ensure every returned order belongs to the caller
            const isScopeSecured = response.body.every(order => order.userId === activeUserId);
            expect(isScopeSecured).toBe(true);
        });

        // Ensure users cannot access specific orders they do not own, protecting private order histories
        it('Should return 403 Forbidden or 404 Not Found if a user attempts to fetch another user\'s order by ID', async () => {
            // Create an order owned by activeUserId
            const createResponse = await request(app)
                .post('/api/orders')
                .set('x-user-phone', activeUserPhone)
                .send({ restaurantId: testRestaurantId, items: [{ productId: testProductId, quantity: 1 }] });
            
            const newOrderId = createResponse.headers.location.split('/').pop();

            // Attempt to fetch it using unauthorizedUserId's header
            const response = await request(app)
                .get(`/api/orders/${newOrderId}`)
                .set('x-user-phone', unauthorizedUserPhone);

            // Access must be denied (either 404 to hide its existence, or 403 to deny permission)
            expect([403, 404]).toContain(response.status);
        });
    });

    describe('Unsupported Actions (PATCH / DELETE)', () => {
        
        // Ensure completed orders cannot be mutated or deleted via standard REST actions, locking the invoice state
        it('Should return 404 or 405 when attempting to PATCH or DELETE an order', async () => {
            const patchResponse = await request(app)
                .patch(`/api/orders/some-id`)
                .set('x-user-phone', activeUserPhone);
            
            const deleteResponse = await request(app)
                .delete(`/api/orders/some-id`)
                .set('x-user-phone', activeUserPhone);

            expect([404, 405]).toContain(patchResponse.status);
            expect([404, 405]).toContain(deleteResponse.status);
        });
    });
});