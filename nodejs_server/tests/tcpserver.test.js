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
    // Mimic the action we want to implement: the user that runs the Nodejs server and CPP servers will also give their connection port
    beforeAll(() => {
        process.argv[2] = MOCK_CPP_PORT.toString();
    });

    // Seed valid database records before each test to pass the HTTP Controller validations
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

    // Clean up received data and close mock server safely after tests
   afterEach(async () => {
        receivedData = '';
        closeConnection(); // Prevents Jest from hanging infinitely
        await new Promise((resolve) => {
            if (mockCppServer && mockCppServer.listening) {
                // Destroy all active sockets first to force close
                if (mockCppServer._activeSockets) {
                    for (const socket of mockCppServer._activeSockets) {
                        socket.destroy();
                    }
                    mockCppServer._activeSockets.clear();
                }
                mockCppServer.close(resolve);
            } else {
                resolve();
            }
        });
    });

    /**
     * Helper function to spin up a transient Mock C++ TCP Server
     * This simulates how the real C++ server accepts sockets and data.
     */
    const startMockCppServer = () => {
        return new Promise((resolve) => {
            // Track active sockets so we can destroy them on teardown
            const activeSockets = new Set();

            mockCppServer = net.createServer((socket) => {
                activeSockets.add(socket);
                socket.on('close', () => activeSockets.delete(socket));

                socket.on('data', (data) => {
                    const reqStr = data.toString();
                    receivedData += reqStr;
                    
                    // Simulate C++ Server logic:
                    // If it's a GET (recommendation command), return the expected format with pId2
                    if (reqStr.startsWith('GET')) {
                        socket.write(`200 Ok\n\n${pId2}\n`);
                    } else {
                        // For Fire & Forget commands (POST/PATCH/DELETE)
                        socket.write('OK'); 
                    }
                });

                // Handle client-side disconnects gracefully — prevent ECONNRESET propagation
                socket.on('error', (err) => {
                    if (err.code !== 'ECONNRESET') {
                        console.error('[MockServer] Unexpected socket error:', err.message);
                    }
                });
            });

            // Attach the active sockets set to the server for cleanup in afterEach
            mockCppServer._activeSockets = activeSockets;

            mockCppServer.listen(MOCK_CPP_PORT, '127.0.0.1', () => {
                const tcpClientModule = require('../src/utils/tcpClient');
                tcpClientModule.resetReconnectFlag();
                tcpClientModule.connectToCppServer();
                setTimeout(resolve, 250);
            });
        });
    };

    // Tests 1: CPP server is running as wanted and syncing data correctly

    // get('api/restaurant/:id/products/:pId') invokes PATCH:: in TPC to add viewing history
    it('Should dispatch PATCH command to C++ when a user requests a specific product', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer();
        
        // Send the request and wait for response
        const response = await request(app).get(`/api/restaurants/${testRestaurantId}/products/${pId1}`); 
        expect(response.status).toBe(200);
        
        // C++ expects: PATCH <userId> <productId> (adds product to existing user)
        // Unknown because we have not sent any authentication header
        expect(receivedData).toEqual(`PATCH unknown_user_id ${pId1}\n`);
    });

    // post('/api/orders/') invokes PATCH:: in TPC to add products to the user's history
    it('Should dispatch PATCH command to C++ with all flat product IDs when an order is created', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer();
        
        const response = await request(app)
            .post('/api/orders')
            // the products we want to add to the order
            .send({ restaurantId: testRestaurantId, items: [{ productId: pId1, quantity: 1 }, { productId: pId2, quantity: 1 }] });

        expect(response.status).toBe(201);
        testOrderId = response.headers.location.split('/').pop();
        
        // C++ expects ONLY: PATCH <userId> <prod1> <prod2>... (No orderId is needed for C++)
        expect(receivedData).toEqual(`PATCH unknown_user_id ${pId1} ${pId2}\n`);
    });

    // patch('/api/orders/:id') invokes DELETE:: then PATCH:: in TPC to update history
    it('Should dispatch DELETE then PATCH commands to C++ when an order is modified', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer();
        
        const response = await request(app)
            .patch(`/api/orders/${testOrderId}`)
            // New and different list of products we want to be in the order
            .send({ items: [{ productId: pId1, quantity: 1 }, { productId: pId3, quantity: 1 }, { productId: pId4, quantity: 1 }] });

        expect(response.status).toBe(200);
        
        // C++ expects first DELETE for the old products, then PATCH for the new ones
        expect(receivedData).toEqual(`DELETE unknown_user_id ${pId1} ${pId2}\nPATCH unknown_user_id ${pId1} ${pId3} ${pId4}\n`);
    });

    // delete('/api/orders/:id') invokes DELETE:: in TPC
    it('Should dispatch DELETE command to C++ when an entire order is removed', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer();
        
        const response = await request(app).delete(`/api/orders/${testOrderId}`);
        expect(response.status).toBe(204);
        
        // C++ expects: DELETE <userId> <prod1> <prod3> <prod4>...
        expect(receivedData).toEqual(`DELETE unknown_user_id ${pId1} ${pId3} ${pId4}\n`);
    });

    // get('/api/users/:id/recommendations/:productId') invokes GET:: in TPC (RecommendCommand)
    it('Should dispatch GET command and successfully parse the returned recommendations', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer();
        
        // Request recommendations for pId1
        const response = await request(app).get(`/api/users/unknown_user_id/recommendations/${pId1}`);
        
        expect(response.status).toBe(200);
        
        // C++ expects: GET <userId> <productId>
        expect(receivedData).toEqual(`GET unknown_user_id ${pId1}\n`); 
        
        // Verifies we parsed the C++ response (200 Ok\n\n<id>) and mapped it to the real product details
        expect(response.body).toHaveLength(1);
        expect(response.body[0].id).toBe(pId2); 
    });

    // Tests 2: CPP server is not running as wanted
    it('Should handle C++ connection rejection gracefully without crashing Node.js process', async () => {
        // We do NOT start the mock cpp server here - mimicking a connection failure/offline server

        // Call nodejs server api 
        const response = await request(app).get(`/api/restaurants/${testRestaurantId}/products/${pId1}`);
        
        // The action should work and return 200 without crashing the main Express app
        expect(response.status).toBe(200);
    });
});