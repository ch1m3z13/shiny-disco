// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true, // Set to true to enable SQL query logging
});

module.exports = sequelize;
