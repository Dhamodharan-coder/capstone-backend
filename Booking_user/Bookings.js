const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

const mongoose = require('mongoose'); 
const authenticateToken = require("../Auth");
// POST: Save booking for the logged-in user
router.post("/booking_list/user", authenticateToken, async (req, res) => {
    try {
        // Destructure passengers and flightDetails from the request body
        const { passengers } = req.body;

        // Create a new booking instance with userId, passengers, and flightDetails
        const booking = new Booking({
            userId: req.user.id, // Link booking to the logged-in user
            passengers, // Passengers information from request body
        });

        // Save the booking to the database
        await booking.save();
        res.status(201).json({ message: "User booking added successfully", booking });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET: Retrieve all bookings for the logged-in user
router.get("/booking_list/user_list", authenticateToken, async (req, res) => {
    try {
        // Find bookings for the logged-in user
        const bookings = await Booking.find({ userId: req.user.id });

        // Check if any bookings are found
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json({ message: "User bookings retrieved successfully", data: bookings });
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});


// DELETE: Delete a specific passenger from a booking
router.delete("/booking_list/user/:bookingId", authenticateToken, async (req, res) => {
    const { passengerId } = req.params; // Passenger ID from the URL parameters // User ID from the authenticated user

    try {
       

        // Find the booking where the userId matches and remove the passenger from the passengers array
        const booking = await Booking.findOneAndDelete(
            { userId: req.user.id },  // Match userId and passengerId
            { $unset: { "passengers": { _id: passengerId } } },            // Remove passenger by _id
            { new: true }                                                     // Return the updated document
        );
        if (!booking) {
            return res.status(404).json({ message: "Booking or Passenger not found or not authorized" });
        }

        res.status(200).json({ message: "Passenger deleted successfully", booking });
    } catch (error) {
        console.error("Error deleting passenger:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports =  router;