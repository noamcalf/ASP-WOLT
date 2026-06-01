const request = require('supertest');
// To open socket to connect the CPP server
const net = require('net');
const app = require('../src/app');
const { connectToCppServer, closeConnection } = require('../src/utils/tcpClient');
const RestaurantModel = require('../src/models/restaurantModel');
const ProductModel = require('../src/models/productModel');

describe('Node.js to C++ TCP Integration & Fault Tolerance Suite', () => {
    // Init variables for the tests:
    // Mock server and port to mimic the real tcp cpp server
    let mockCppServer;
    let receivedData = '';
    const MOCK_CPP_PORT = 6060;

    // Dynamic IDs to replace hardcoded fake IDs
    let testRestaurantId;
    let pId1, pId2, pId3, pId4;
    let testOrderId;

    // Before running tests, override the process.argv to pass our mock port
    // Mimic the wanted action we want to implement: the user that runs the Nodejs server and CPP servers will also give their connection port
    beforeAll(() => {
        process.argv[2] = MOCK_CPP_PORT.toString();
    });

    beforeEach(() => {
        RestaurantModel.clearAll();
        ProductModel.clearAll();
        const rest = RestaurantModel.createRestaurant({ name: 'Test', cuisine: 'Tech', address: { city: 'TA', street: 'A', houseNumber: 1 } });
        testRestaurantId = rest.id;
        pId1 = ProductModel.createProductInRestaurant(testRestaurantId, { name: 'prod1', price: 10 }).id;
        pId2 = ProductModel.createProductInRestaurant(testRestaurantId, { name: 'prod2', price: 20 }).id;
        pId3 = ProductModel.createProductInRestaurant(testRestaurantId, { name: 'prod3', price: 30 }).id;
        pId4 = ProductModel.createProductInRestaurant(testRestaurantId, { name: 'prod4', price: 40 }).id;
    });

    // Clean up received data and close mock server after tests
    afterEach(() => {
        receivedData = '';
        if (mockCppServer && mockCppServer.listening) {
            mockCppServer.close();
        }
        closeConnection(); // Prevents Jest from hanging infinitely
    });

    /**
     * Helper function to spin up a transient Mock C++ TCP Server
     * This simulates how the real C++ server accepts sockets and data.
     */
    const startMockCppServer = (responseToEmit = 'OK') => {
        // Create promise to make sure we continue ONLY after the server is running as wanted
        return new Promise((resolve) => {
            // Create the TCP server: sync command
            mockCppServer = net.createServer((socket) => {
                socket.on('data', (data) => {
                    receivedData += data.toString();
                    // Simulate CPP server sending confirmation back and closing
                    socket.write(responseToEmit);
                });
            });
            // Use callback func to make sure we fulfill the promise only after the server is running and listening: unsync command
            mockCppServer.listen(MOCK_CPP_PORT, '127.0.0.1', () => {
                connectToCppServer(); // Trigger connection manually here to ensure sync
                setTimeout(resolve, 50);
            });
        });
    };

    // Tests 1: CPP server is running as wanted

    // get('api/restaurant/:id/products/:pId') invokes RECOMMEND:: in TPC
    it('Should dispatch GET command to C++ when a user requests a specific product', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        // Send the request and wait for response
        const response = await request(app)
            .get(`/api/restaurants/${testRestaurantId}/products/${pId1}`) 

        expect(response.status).toBe(200);
        
        // C++ expects: GET <userId> <productId>
        // Unknown because we have not send any header
        expect(receivedData).toEqual(`GET unknown_user_id ${pId1}\n`);
    });

     // post(('/api/orders/') invokes POST:: in TPC
    it('Should dispatch POST command to C++ with all flat product IDs when an order is created', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        const response = await request(app)
            .post('/api/orders')
            // the products we want to add to the order (Adjusted to real schema)
            .send({ restaurantId: testRestaurantId, items: [{ productId: pId1, quantity: 1 }, { productId: pId2, quantity: 1 }] });

        expect(response.status).toBe(201);
        testOrderId = response.headers.location.split('/').pop();
        
        // C++ expects: POST <userId> <orderId> <prod1> <prod2>...
        // Unknown because we have not send any header
        expect(receivedData).toEqual(`POST unknown_user_id ${testOrderId} ${pId1} ${pId2}\n`);
    });

    // patch(('/api/orders/:id') invokes PATCH:: in TPC
    it.skip('Should dispatch PATCH command to C++ with updated product sequence when an order is modified', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        const response = await request(app)
            .patch(`/api/orders/${testOrderId}`)
            // New and different list of products we want to be in the order (Adjusted to real schema)
            .send({ items: [{ productId: pId1, quantity: 1 }, { productId: pId3, quantity: 1 }, { productId: pId4, quantity: 1 }] });

        expect(response.status).toBe(200);
        
        // C++ expects: PATCH <userId> <orderId> <prod1> <prod3> <prod4>...
         // Unknown because we have not send any header
        expect(receivedData).toEqual(`PATCH unknown_user_id ${testOrderId} ${pId1} ${pId3} ${pId4}\n`);
    });

    // delete(('/api/orders/:id') invokes DELETE:: in TPC
    it.skip('Should dispatch DELETE command to C++ when an entire order is removed', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        const response = await request(app)
            // Delete the order in the nodejs server
            .delete(`/api/orders/${testOrderId}`)

        expect(response.status).toBe(200);
        
        // C++ expects: DELETE <userId> <orderId>
         // Unknown because we have not send any header
        expect(receivedData).toEqual(`DELETE unknown_user_id ${testOrderId}\n`);
    });

    // Tests 2: CPP server is not running as wanted
    it('Should handle C++ connection rejection gracefully without crashing Node.js process', async () => {
        // We want start the mock cpp server - mimic no connection situation

        // Call nodejs server api 
        const response = await request(app)
            .get(`/api/restaurants/${testRestaurantId}/products/${pId1}`)

        // the action should work
        expect(response.status).toBe(200);
    });
});