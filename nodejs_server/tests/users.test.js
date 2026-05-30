const request = require('supertest');
const app = require('../src/app');
// Import the new user's model
const UserModel = require('../src/models/userModel'); 

describe('User Authentication & Registration Integration Tests', () => {

    // Clean user records between test runs to maintain complete environment isolation
    beforeEach(() => {
        UserModel.clearAll();
    });

    // Test 1: Registration
    describe('POST /api/users/register - Success Boundaries', () => {
        it('Should return 200 OK and successfully register a valid user payload with address', async () => {
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

            const response = await request(app)
                .post('/api/users/register')
                .send(validUser);

            // Assertions based on description requirements
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.username).toBe(validUser.username);
            expect(response.body.user.phoneNumber).toBe(validUser.phoneNumber);
            
            // Verify address object structure is deeply preserved
            expect(response.body.user).toHaveProperty('address');
            expect(response.body.user.address.city).toBe(validUser.address.city);
            expect(response.body.user.address.street).toBe(validUser.address.street);
            expect(response.body.user.address.houseNumber).toBe(validUser.address.houseNumber);

            // Don't return the password!
            expect(response.body.user).not.toHaveProperty('password'); 
        });
    });

    // Test 2: Post with incomplete fileds
    describe('POST /api/users/register - Input Schema Rejections', () => {
        it('Should yield 400 Bad Request when the username field is missing', async () => {
            const incompleteUser = {
                phoneNumber: '0501234567',
                password: 'SecurePassword123',
                address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 100 }
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(incompleteUser);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('username');
        });

        it('Should yield 400 Bad Request when the address object or its nested fields are missing', async () => {
            const userWithMissingAddressFields = {
                username: 'noam_calfon',
                phoneNumber: '0501234567',
                password: 'SecurePassword123',
                address: {
                    city: 'Tel Aviv'
                }
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userWithMissingAddressFields);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('address');
        });
    });

    // Test 3: Valid Authentication Proccess
    describe('POST /api/users/login - Authentication & Token Generation', () => {
        it('Should authenticate valid credentials and output structural identity tokens', async () => {
            // Register a user
            UserModel.createUser({
                username: 'tester',
                phoneNumber: '0501234567',
                password: 'HashedPasswordHere',
                address: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: 100 }
            });

            // his login data
            const loginCredentials = {
                phoneNumber: '0501234567',
                password: 'HashedPasswordHere'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginCredentials);

            expect(response.status).toBe(200);
            
            // Validate token output requirements
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
            
            // Check if the response contains structural identity string arrays (roles):

            // Has a roles section array (may have more then one role)
            expect(response.body).toHaveProperty('roles');
            expect(Array.isArray(response.body.roles)).toBe(true);
            // every role in the array is a string
            expect(response.body.roles.every(role => typeof role === 'string')).toBe(true);
        });

        // In case we try to log in with wrong log in data
        it('Should reject login attempts with invalid credentials with a 401 status', async () => {
            const wrongCredentials = {
                phoneNumber: '0501234567',
                password: 'WrongPassword'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(wrongCredentials);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid phone number or password');
        });
    });
});