const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Middleware to authenticate and get user ID from token
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Authorization denied' });
    }

    try {
        // Verify token and extract payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded ID from token:", decoded.id);
        const userId = decoded.userId;

        // Find user by ID to ensure user still exists
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user data to the request object
        req.user = { id: userId };

        // Continue to next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Token is invalid or has expired' });
    }
};

module.exports = authenticate;