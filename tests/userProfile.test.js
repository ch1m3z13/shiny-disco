describe('User Profile', () => {
    test('GET /user/profile - should return user profile', async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'TestPassword123',
            });
        const token = loginResponse.body.token;

        const res = await request(app)
            .get('/user/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email', 'testuser@example.com');
    });

    // Additional tests for updating user profiles...
});
