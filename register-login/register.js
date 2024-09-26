const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const Booking = require("../models/Booking"); 
const Seat = require('../models/Seat');// Import the User model
const Reservation = require("../models/Reservation")
const FinalBooking = require("../models/FinalBooking");
const authenticateToken = require("../Auth")
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY_USER;




// Register Route
router.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        await newUser.save();
        res.status(201).json({ message: "Registered Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong", error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "Incorrect Username/Password" });
        }

        const passwordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCorrect) {
            return res.status(404).json({ message: "Incorrect Username/Password" });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});



// GET Route to retrieve user details (protected route)
router.get("/user_details", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            message: "User details fetched successfully",
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});



router.post('/save-seats',  async (req, res) => {
    const { selectedSeats } = req.body;
    // const userId = req.user.id; // Get user ID from the JWT token
  
    if (!selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ message: 'No seats selected' });
    }
  
    try {
      // Save the selected seats for the user (update if exists, otherwise create)
     await Seat.findOneAndUpdate(
        // { userId },
        { selectedSeats },
        { upsert: true } // This will insert if no document exists for the userId
      );
  
      res.status(200).json({ message: 'Seats saved successfully!' });
    } catch (error) {
      console.error('Error saving seats:', error);
      res.status(500).json({ message: 'Error saving seats' });
    }
  });
  
  

  // router.get('/get-seats',  async (req, res) => {
  //   // const userId = req.user.id; // Get user ID from JWT token
  
  //   try {
  //     const seatRecord = await Seat.findOne({ userId });
  //     if (!seatRecord) {
  //       return res.status(404).json({ selectedSeats: [] }); // No seats found for this user
  //     }
  
  //     res.status(200).json({ selectedSeats: seatRecord.selectedSeats });
  //   } catch (error) {
  //     console.error('Error fetching seats:', error);
  //     res.status(500).json({ message: 'Error fetching seats' });
  //   }
  // });
  





  
  // router.put("/final_booking/:id", authenticateToken, async (req, res) => {
  //   try {
  //     const updatedFinalBooking = await FinalBooking.findOneAndUpdate(
  //       { _id: req.params.id, userId: req.user.id },
  //       { ...req.body },
  //       { new: true }
  //     );
  //     if (!updatedFinalBooking) {
  //       return res.status(404).json({ message: "Final booking not found or unauthorized" });
  //     }
  //     res.status(200).json({ message: "Final booking updated successfully", updatedFinalBooking });
  //   } catch (error) {
  //     console.error('Error updating final booking:', error);
  //     res.status(500).json({ message: "Something went wrong", error: error.message });
  //   }
  // });

  
  
  

module.exports = router;

