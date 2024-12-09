'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('driver', 'passenger'),
        defaultValue: 'passenger',
        allowNull: false,
      },
      home_location: {
        type: Sequelize.GEOMETRY,
        allowNull: true,
      },
      work_location: {
        type: Sequelize.GEOMETRY,
        allowNull: true,
      },
      is_driver: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      vehicle_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicle_year: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      license_plate_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      drivers_license: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      road_worthiness_cert: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
