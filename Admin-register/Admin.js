const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/Adminuser");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PaymentSuccess = require("../models/Paymentsuccess")
const Reservation = require("../models/Reservation")
const DeletedBooking = require('../models/DeletedBooking');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY_ADMIN;


router.post('/admin/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        admin = new Admin({
            email,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


});

router.post("/admin/login", async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(404).json({ message: "Incorrect Adminname/Password" });
        }

        const passwordCorrect = await bcrypt.compare(req.body.password, admin.password);
        if (!passwordCorrect) {
            return res.status(404).json({ message: "Incorrect Adminname/Password" });
        }

        const token = jwt.sign({ email: admin.email, id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});


const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user; // Attach user data to the request
        next();
    });
};

router.get("/admin/users",auth,async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude password field for security
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  router.delete('/admin/users/:id',auth, async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  });



  router.get("/admin/final_bookings", auth, async (req, res) => {
    try {
      const finalBookings = await PaymentSuccess.find({});
      res.status(200).json({ message: "Final bookings retrieved successfully", finalBookings });
    } catch (error) {
      console.error('Error retrieving final bookings:', error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });

  router.get("/admin/reservation",auth,async(req,res)=>{
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })

  router.put("/admin/reservation/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;  // Get the reservation ID from the URL params
      const { status , seatno } = req.body;// Get the new status from the request body
      // Ensure status is provided
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
  
      // Find reservation by ID and update the status
      const reservation = await Reservation.findByIdAndUpdate(
        id, 
        { status , seatno },  // Only updating the status field
        { new: true }  // Return the updated reservation
      );

      // If reservation not found, return 404
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      // Return the updated reservation
      res.status(200).json({ message: "Reservation status updated", reservation });
  
    } catch (error) {
      console.error("Error updating reservation:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.delete("/admin/reservation/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;  // Get the reservation ID from the URL params
      
      // Ensure status is provided
      if (!id) {
        return res.status(400).json({ message: "Id not Valid" });
      }
  
      // Find reservation by ID and update the status
      const reservation = await Reservation.findByIdAndDelete(id);
      // If reservation not found, return 404
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      // Return the updated reservation
      res.status(200).json({ message: "Reservation Deleted", reservation });
  
    } catch (error) {
      console.error("Error Deleting reservation:", error);
      res.status(500).json({ message: "Server error" });
    }
  });




  // Retrieve all deleted bookings
router.get('/admin/deleted-bookings', auth, async (req, res) => {
  try {
      const deletedBookings = await DeletedBooking.find();
      res.json(deletedBookings);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports=router;