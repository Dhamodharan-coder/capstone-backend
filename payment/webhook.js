const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking"); 
const nodemailer = require("nodemailer");
const authenticateToken = require("../Auth");
const User = require("../models/User")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nakkulnakkul1024@gmail.com', // Your email
      pass: process.env.EMAIL_PASS,    // Your email password or app password
    },
  });


  router.get("/send-email-success", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const userEmail = user.email; // Extract email from user profile
      console.log("User Email:", userEmail); // Log user email
  
      if (!userEmail) {
        return res.status(400).json({ message: "User email not defined" });
      }
  
      const mailOptions = {
        from: 'nakkulnakkul1024@gmail.com',
        to: userEmail,
        subject: 'Booking Confirmed',
        text: 'You have successfully booked your tickets.',
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error: ", error);
          return res.status(500).json({ message: "Email not sent", error });
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).json({ message: "Email sent successfully!" });
        }
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
    // Endpoint to send an email after booking failure
    router.get("/send-email-failure", authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const booking =  await User.findById(userId);
        
        if (!booking) {
          return res.status(404).json({ message: "No booking found for this user" });
        }
    
        const userEmail = booking.email;
    
        const mailOptions = {
          from: 'nakkulnakkul1024@gmail.com',
          to: userEmail,
          subject: 'Booking Cancelled',
          text: 'There was an error in payment, or the booking was cancelled. Please try again. Thank you.',
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("Error: ", error);
            return res.status(500).json({ message: "Email not sent", error });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: "Email sent successfully!" });
          }
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  
  
  module.exports = router;