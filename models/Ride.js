const { Model, DataTypes, GEOMETRY } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a db.js file to initialize Sequelize
//const { Geometry } = require('sequelize-postgres');

class Ride extends Model {}

Ride.init({
    ride_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // Make sure to replace with the actual Users model/table name
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    origin: {
        type: GEOMETRY('POINT', 4326), // Stores longitude-latitude point for origin
        allowNull: false,
    },
    destination: {
        type: GEOMETRY('POINT', 4326), // Stores longitude-latitude point for destination
        allowNull: false,
    },
    route: {
        type: GEOMETRY('LINESTRING', 4326), // Route as a line connecting origin and destination
        allowNull: false,
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    seats_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    ride_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open',
    },
    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: false, // We're managing created_at and updated_at manually
    indexes: [
        {
            fields: ['route'],
            using: 'GIST', // GIST index for faster spatial queries
        },
        {
            fields: ['origin'],
            using: 'GIST',
        },
        {
            fields: ['destination'],
            using: 'GIST',
        },
    ],
});

module.exports = Ride;
