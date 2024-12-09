const nodemailer = require('nodemailer');
const User = require('../models/User')

const sendEmailNotification = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

const sendNotificationToDriver = async (driverId, message) => {
    try {
        // Find the driver's email from the database
        const driver = await User.findOne({ where: { id: driverId, role: 'driver' } });
        if (!driver) {
            console.error(`Driver with ID ${driverId} not found.`);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your email service
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'odoprecious5@gmail.com',
            subject: 'New Ride Request Notification',
            text: message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to driver (ID: ${driverId}) at ${driver.email}`);
    } catch (error) {
        console.error('Error sending notification to driver:', error);
    }
};

module.exports = { sendNotificationToDriver };
