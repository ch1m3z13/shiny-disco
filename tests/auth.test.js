const request = require('supertest');
const app = require('../server'); // Your Express app

// Sample user data for tests
const userData = {
    name: 'Test Doe2',
    email: 'testdro@example.com',
    password: 'TestPassword123',
    phone: '223454767890',
};

describe('User Registration', () => {
    // Tests are now set up to run with the environment prepared in setupTests.js

    test('POST /auth/signup - should register user with email', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully.');
        expect(res.body.user).toHaveProperty('email', userData.email);
        expect(res.body.user).toHaveProperty('phone', userData.phone);
    });

    test('POST /auth/signup - should return error for duplicate email', async () => {
        // Register the first user
        await request(app)
            .post('/auth/signup')
            .send(userData);

        // Attempt to register the same email again
        const res = await request(app)
            .post('/auth/signup')
            .send(userData);

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe('Email already exists.');
    });

    test('POST /auth/signup - should return error for invalid email format', async () => {
        const invalidUserData = {
            ...userData,
            email: 'invalid-email-format',
        };

        const res = await request(app)
            .post('/auth/signup')
            .send(invalidUserData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid email format.');
    });

    // You can add more tests for phone registration and OTP verification if applicable...
});
