const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const db = require('../db');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const registerUser = async (req, res) => {
    const { first_name, last_name, phone, email, password, role } = req.body;

    if (!first_name || !last_name || !phone || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }


    try {
        const existingUser = await User.findOne({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            first_name,
            last_name,
            phone,
            email,
            password: hashedPassword,
            role,
            is_verified: false, 
            otp: null, 
        });

        res.status(201).json({
            message: 'User created successfully',
            user: { 
                id: newUser.id,
                email: newUser.email, 
                first_name: newUser.first_name, 
                last_name: newUser.last_name,
                role: newUser.role            },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name } = ticket.getPayload();


        const existingUser = await User.findOne({
            where: { email },
        });
        let user;

        if (existingUser.rows.length > 0) {
            user = existingUser.rows[0];
        } else {
            
          /*  user = await db.query(
                'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
                [email, name]
            );
        */

            user = await User.create({
                email: email,
                first_name: name,
            });
        }

        
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.rows[0].name,
                id: user.rows[0].id,
                email: user.rows[0].email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    googleLogin,
};