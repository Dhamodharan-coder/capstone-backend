// forgotPassword.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Assuming a user model is defined
require('dotenv').config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use another email provider
    auth: {
        user: 'nakkulnakkul1024@gmail.com', // Your email
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

// POST: Forgot Password (request a reset link)
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a JWT token with a short expiration
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY_USER, { expiresIn: '1h' });

        // Create reset link
        const resetLink = `${process.env.BASEURL}/reset_password/${token}`;

        // Send email with reset link
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error sending reset link:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST: Reset Password (handle the reset)
router.post('/reset_password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY_USER);
        const userId = decoded.id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
});


module.exports = router;
