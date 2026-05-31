const request = require('supertest');
const app = require('../src/app');
const UserModel = require('../src/models/userModel'); 

describe('User Authentication & Registration Integration Tests', () => {

    // Clean user records between test runs to maintain complete environment isolation
    beforeEach(() => {
        UserModel.clearAll();
    });

    describe('POST /api/users - Registration Success Boundaries', () => {
        it('Should return 201 Created and successfully register a valid user payload with address', async () => {
            const validUser = {
                username: 'noam_calfon',
                phoneNumber: '0501234567',
                password: 'SecurePassword123',
                address: {
                    city: 'Tel Aviv',
                    street: 'Dizengoff',
                    houseNumber: 100
                }
            };

            // Send POST request to the RESTful users endpoint
            const response = await request(app)
                .post('/api/users')
                .send(validUser);

            // Verify status code and success message
            expect(response.status).toBe(201); 
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            
            // Verify the returned user object contains expected identity fields
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.username).toBe(validUser.username);
            expect(response.body.user.phoneNumber).toBe(validUser.phoneNumber);
            
            // Verify address object structure is deeply preserved
            expect(response.body.user).toHaveProperty('address');
            expect(response.body.user.address.city).toBe(validUser.address.city);
            
            // Security check: Ensure password is never returned in the payload
            expect(response.body.user).not.toHaveProperty('password'); 
        });
    });

    describe('POST /api/users - Input Schema Rejections', () => {
        it('Should yield 400 Bad Request when the username field is missing', async () => {
            const incompleteUser = { 
                phoneNumber: '0501234567', 
                password: 'SecurePassword123' 
            };
            
            // Attempt to register a user without a mandatory field
            const response = await request(app)
                .post('/api/users')
                .send(incompleteUser);
            
            // Verify the request is rejected with a 400 status code
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/users/:id - Profile Retrieval', () => {
        it('Should return 200 OK and the user profile without the password', async () => {
            // Setup: Create a user directly via the model before testing retrieval
            const newUser = UserModel.createUser({
                username: 'ben_k',
                phoneNumber: '0509999999',
                password: 'hashed123',
                address: { city: 'Haifa', street: 'Carmel', houseNumber: 10 }
            });

            // Request the specific user's profile using their generated ID
            const response = await request(app)
                .get(`/api/users/${newUser.id}`)
                .set('x-user-phone', newUser.phoneNumber);

            // Verify the correct user data is returned
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', newUser.id);
            expect(response.body).toHaveProperty('username', 'ben_k');
            
            // Security check: Ensure password is not exposed in profile retrieval
            expect(response.body).not.toHaveProperty('password'); 
        });

        it('Should return 404 Not Found for an unknown user ID', async () => {
            // Setup: Create a user to provide a valid phone number for the identity check
            const newUser = UserModel.createUser({
                username: 'auth_user',
                phoneNumber: '0501111111',
                password: 'password123',
                address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 10 }
            });

            // Attempt to retrieve a profile using a non-existent UUID
            const response = await request(app)
                .get('/api/users/fake-uuid-123')
                .set('x-user-phone', newUser.phoneNumber);
            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/tokens - Authentication & Token Generation', () => {
        it('Should authenticate valid credentials and output structural identity tokens', async () => {
            // Setup: Register a user to test login credentials against
            UserModel.createUser({
                username: 'tester',
                phoneNumber: '0501234567',
                password: 'HashedPasswordHere',
                address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 100 }
            });

            // Construct payload utilizing the production-required primary identifier
            const loginCredentials = {
                phoneNumber: '0501234567',
                password: 'HashedPasswordHere'
            };

            // Send POST request to the RESTful tokens endpoint to generate a login token
            const response = await request(app)
                .post('/api/tokens')
                .send(loginCredentials);

            expect(response.status).toBe(200);
            
            // Validate token output requirements
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
            
            // Verify the roles array exists and contains string elements
            expect(response.body).toHaveProperty('roles');
            expect(Array.isArray(response.body.roles)).toBe(true);
        });

        it('Should reject login attempts with invalid credentials with a 401 status', async () => {
            // Construct unmatched authentication payload utilizing the required schema
            const wrongCredentials = {
                phoneNumber: '0500000000',
                password: 'WrongPassword'
            };

            // Attempt to authenticate with mismatched credentials
            const response = await request(app)
                .post('/api/tokens')
                .send(wrongCredentials);

            // Verify the system denies access with a 401 Unauthorized status
            expect(response.status).toBe(401);
        });
    });
});