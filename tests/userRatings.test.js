describe('User Ratings', () => {
    let token;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'TestPassword123',
            });
        token = loginResponse.body.token; // Store the token for authenticated requests
    });

    test('POST /ratings - should submit a user rating', async () => {
        const res = await request(app)
            .post('/ratings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                rideId: 'someRideId', // Replace with actual ride ID
                rating: 5,
                comments: 'Great ride!',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Rating submitted successfully.');
    });

    // Additional tests for retrieving ratings...
});
