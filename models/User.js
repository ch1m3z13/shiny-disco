const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming your database config is here

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
    },
    first_name: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    last_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    profile_picture: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    is_verified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    otp: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    role: { 
        type: DataTypes.ENUM('driver', 'passenger'),
        defaultValue: 'passenger', 
        allowNull: false 
    },
    home_location: { 
        type: DataTypes.GEOMETRY 
    },
    work_location: { 
        type: DataTypes.GEOMETRY
    },
    is_driver: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    vehicle_name: { 
        type: DataTypes.STRING, 
        allowNull: true
    },
    vehicle_year: { 
        type: DataTypes.STRING, 
        allowNull: true
    },
    license_plate_number: { 
        type: DataTypes.STRING, 
        allowNull: true
    },
    drivers_license: {
        type: DataTypes.STRING,
        allowNull: true
    },
    road_worthiness_cert: {
        type: DataTypes.STRING,
        allowNull: true
    },    
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;
