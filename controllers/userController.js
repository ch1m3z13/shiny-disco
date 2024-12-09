const User = require('../models/User');
const bcrypt = require('bcrypt');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findByPk(userId, {
            attributes: ['first_name', 'last_name', 'phone', 'email', 'role', 'profile_picture']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const submitDriverDetails = async (req, res) => {
    try {
        const { vehicle_name, vehicle_year, license_plate_number } = req.body;

        const profilePicture = req.files['profile_picture'] ? req.files['profile_picture'][0].path : null;
        const driversLicense = req.files['drivers_license'] ? req.files['drivers_license'][0].path : null;
        const roadWorthinessCert = req.files['road_worthiness_cert'] ? req.files['road_worthiness_cert'][0].path : null;
        if (!vehicle_name || !vehicle_year || !license_plate_number || !driversLicense || !roadWorthinessCert) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.is_driver) {
            return res.status(404).json({ message: 'User is already a driver' });
        }

        user.is_driver = true;
        user.drivers_license = driversLicense;
        user.road_worthiness_cert = roadWorthinessCert;
        user.profile_picture = profilePicture;
        user.vehicle_name = vehicle_name;
        user.vehicle_year = vehicle_year;
        user.license_plate_number = license_plate_number;
        user.role = 'driver';

        await user.save();



        return res.status(200).json({ mesasge: 'Drivers details submitted succesfully', user: {
            id: user.id,
            email: user.email, 
            first_name: user.first_name, 
            last_name: user.last_name,
            role: user.role,
            is_driver: user.is_driver,
            profile_picture: user.profile_picture,
            drivers_license: user.drivers_license,
            road_worthiness_cert: user.road_worthiness_cert,
            vehicle_name: user.vehicle_name,
            vehicle_year: user.vehicle_year,
            license_plate_number: user.license_plate_number
        }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesasge: 'server error', error: error.mesasge });
    }
};

const updateUserProfile = async (req, res) => {
    const { first_name, last_name, phone, profile_picture, password, role } = req.body;

    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.phone = phone || user.phone;
        user.profile_picture = profile_picture || user.profile_picture;
        user.role = role || user.role;

        if (password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfilePicture = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update user's profile picture path in the database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profile_picture = req.file.path;  // Save the file path to profile_picture field
        await user.save();

        res.status(200).json({ 
            message: 'Profile picture updated successfully',
            profile_picture: user.profile_picture 
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProfile, updateUserProfile, updateProfilePicture, submitDriverDetails };