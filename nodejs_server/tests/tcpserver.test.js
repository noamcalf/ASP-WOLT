const request = require('supertest');
// To open socket to connect the CPP server
const net = require('net');
const app = require('../src/app');

describe('Node.js to C++ TCP Integration & Fault Tolerance Suite', () => {
    // Init variables for the tests:
    // Mock server and port to mimic the real tcp cpp server
    let mockCppServer;
    let receivedData = '';
    const MOCK_CPP_PORT = 6060;

    // Before running tests, override the process.argv to pass our mock port
    // Mimic the wanted action we want to implement: the user that runs the Nodejs server and CPP servers will also give their connection port
    beforeAll(() => {
        process.argv[2] = MOCK_CPP_PORT.toString();
    });

    // Clean up received data and close mock server after tests
    afterEach(() => {
        receivedData = '';
        if (mockCppServer && mockCppServer.listening) {
            mockCppServer.close();
        }
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
                resolve();
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
            .get('/api/restaurants/rest123/products/prod999') 

        expect(response.status).toBe(200);
        
        // C++ expects: GET <userId> <productId>
        // Unknown because we have not send any header
        expect(receivedData).toEqual('GET unknown_user_id prod999\n');
    });

     // post(('/api/orders/') invokes POST:: in TPC
    it('Should dispatch POST command to C++ with all flat product IDs when an order is created', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        const response = await request(app)
            .post('/api/orders')
            // the products we want to add to the order
            .send({ products: ['prod1', 'prod2'] });

        expect(response.status).toBe(201);
        
        // C++ expects: POST <userId> <orderId> <prod1> <prod2>...
        // Unknown because we have not send any header
        expect(receivedData).toEqual('POST unknown_user_id order777 prod1 prod2\n');
    });

    // patch(('/api/orders/:id') invokes PATCH:: in TPC
    it('Should dispatch PATCH command to C++ with updated product sequence when an order is modified', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        const response = await request(app)
            .patch('/api/orders/order777')
            // New and different list of products we want to be in the order
            .send({ products: ['prod1', 'prod3', 'prod4'] });

        expect(response.status).toBe(200);
        
        // C++ expects: PATCH <userId> <orderId> <prod1> <prod3> <prod4>...
         // Unknown because we have not send any header
        expect(receivedData).toEqual('PATCH unknown_user_id order777 prod1 prod3 prod4\n');
    });

    // delete(('/api/orders/:id') invokes DELETE:: in TPC
    it('Should dispatch DELETE command to C++ when an entire order is removed', async () => {
        // wait for the connection of the mock TCP server
        await startMockCppServer('OK');

        const response = await request(app)
            // Delete the order in the nodejs server
            .delete('/api/orders/order777')

        expect(response.status).toBe(200);
        
        // C++ expects: DELETE <userId> <orderId>
         // Unknown because we have not send any header
        expect(receivedData).toEqual('DELETE unknown_user_id order777\n');
    });

    // Tests 2: CPP server is not running as wanted
    it('Should handle C++ connection rejection gracefully without crashing Node.js process', async () => {
        // We want start the mock cpp server - mimic no connection situation

        // Call nodejs server api 
        const response = await request(app)
            .get('/api/restaurants/rest123/products/prod999')

        // the action should work
        expect(response.status).toBe(200);
    });
});