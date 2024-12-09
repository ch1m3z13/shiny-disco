// db.js

const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to connect to the database
const connect = async () => {
    return await pool.connect();
};

// Function to end the connection
const end = async () => {
    await pool.end();
};

// Clear all tables for testing purposes
const clear = async () => {
    const client = await pool.connect();
    try {
        // Disable foreign key checks if necessary (Postgres doesn't have this by default)
        await client.query('BEGIN');

        // List all your tables here. Adjust the names according to your schema.
        await client.query('TRUNCATE TABLE users, rides, trips RESTART IDENTITY CASCADE');

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err; // Rethrow the error to handle it in the test
    } finally {
        client.release();
    }
};

module.exports = {
    connect,
    end,
    clear,
    query: (text, params) => pool.query(text, params), // Export query method for use in your application
};
