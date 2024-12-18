const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const connect = async () => {
    return await pool.connect();
};

const end = async () => {
    await pool.end();
};

const clear = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query('TRUNCATE TABLE users, rides, trips RESTART IDENTITY CASCADE');

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err; 
    } finally {
        client.release();
    }
};

module.exports = {
    connect,
    end,
    clear,
    query: (text, params) => pool.query(text, params),
};
