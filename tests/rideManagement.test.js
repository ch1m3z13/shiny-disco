describe('Ride Management', () => {
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

    test('POST /ride/create - should create a new ride', async () => {
        const res = await request(app)
            .post('/ride/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                startLocation: 'Location A',
                endLocation: 'Location B',
                time: '2023-12-01T10:00:00Z',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Ride created successfully.');
    });

    test('DELETE /ride/cancel/:id - should cancel a ride', async () => {
        // First, create a ride to cancel
        const createResponse = await request(app)
            .post('/ride/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                startLocation: 'Location A',
                endLocation: 'Location B',
                time: '2023-12-01T10:00:00Z',
            });
        const rideId = createResponse.body.rideId; // Assuming the response contains the ride ID

        const res = await request(app)
            .delete(`/ride/cancel/${rideId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Ride canceled successfully.');
    });
});
