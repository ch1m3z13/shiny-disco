describe('Google Login', () => {
    test('POST /auth/google - should login successfully with valid Google ID token', async () => {
        const res = await request(app)
            .post('/auth/google')
            .send({ idToken: 'VALID_GOOGLE_ID_TOKEN' }); // Mocked
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('POST /auth/google - should return error with invalid token', async () => {
        jest.mock('google-auth-library', () => ({
            OAuth2Client: jest.fn().mockImplementation(() => ({
                verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid Google token')),
            })),
        }));

        const res = await request(app)
            .post('/auth/google')
            .send({ idToken: 'INVALID_TOKEN' });
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('Invalid Google token');
    });
});
