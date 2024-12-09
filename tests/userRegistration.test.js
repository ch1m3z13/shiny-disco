describe('User Registration', () => {
    test('POST /auth/signup/email - should register user with email', async () => {
        const res = await request(app)
            .post('/auth/signup/email')
            .send({
                email: 'testuser@example.com',
                password: 'TestPassword123',
                phone: '1234567890',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully.');
    });

    test('POST /auth/signup/email - should return error for duplicate email', async () => {
        await request(app)
            .post('/auth/signup/email')
            .send({
                email: 'testuser@example.com',
                password: 'TestPassword123',
                phone: '1234567890',
            });
        const res = await request(app)
            .post('/auth/signup/email')
            .send({
                email: 'testuser@example.com',
                password: 'AnotherPassword123',
                phone: '1234567890',
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe('Email already exists.');
    });

    // Add more tests for phone registration and OTP verification...
});
