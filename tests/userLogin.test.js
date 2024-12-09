describe('User Login', () => {
    test('POST /auth/login - should login successfully with valid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'TestPassword123',
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('POST /auth/login - should return error with invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'WrongPassword',
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials.');
    });
});
