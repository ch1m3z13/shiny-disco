const request = require('supertest');
const app = require('../server'); // Your Express app
const db = require('../db'); // Your database connection module
const { OAuth2Client } = require('google-auth-library'); // If needed for mocking Google login

// This function runs before all tests
beforeAll(async () => {
    // Connect to the test database
    await db.connect(); // Ensure your db module has this function implemented
});

// This function runs before each test
beforeEach(async () => {
    // Clear the database or reset any necessary data before each test
    await db.clear(); // Implement a clear function in your db module
});

// This function runs after all tests
afterAll(async () => {
    // Close the database connection
    await db.end(); // Ensure your db module has this function implemented
});

// Example of mocking Google authentication
jest.mock('google-auth-library', () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => ({
            verifyIdToken: jest.fn().mockImplementation((token) => {
                if (token === 'VALID_GOOGLE_ID_TOKEN') {
                    return Promise.resolve({ email: 'testuser@example.com' }); // Mocked user data
                }
                return Promise.reject(new Error('Invalid Google token'));
            }),
        })),
    };
});

// Set any global variables if needed
global.testUserId = 'someTestUserId'; // Example of setting a global variable

// Export the request and app for use in test files if necessary
module.exports = { request, app };
