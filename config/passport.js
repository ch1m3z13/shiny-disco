// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // Check if user exists
        let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = userResult.rows[0];

        if (!user) {
            // Create new user if they don't exist
            userResult = await db.query(
                'INSERT INTO users (name, email, is_verified) VALUES ($1, $2, $3) RETURNING *',
                [profile.displayName, email, true]
            );
            user = userResult.rows[0];
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, isDriver: user.is_driver }, 'secretkey', { expiresIn: '1h' });
        return done(null, { user, token });
    } catch (err) {
        console.error(err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
