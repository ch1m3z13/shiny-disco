const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your Sequelize instance

const RideRequest = sequelize.define('RideRequest', {
    ride_request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ride_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    passenger_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending' // Default status for ride requests
    }
}, {
    tableName: 'ride_requests', // Ensure it matches your database table name
    timestamps: true // Adds createdAt and updatedAt fields
});

// Export the model directly
module.exports = RideRequest;
