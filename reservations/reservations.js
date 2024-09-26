const express = require("express");
const authenticateToken = require("../Auth");
const router = express.Router();
const Reservation = require("../models/Reservation")

router.post('/reservations', authenticateToken, async (req, res) => {
    try {
        
      const { departure, arrival, date, passengers, classType,seatno } = req.body;
      const reservation = new Reservation({
        userId: req.user.id, // Associate the reservation with the logged-in user
        departure,
        arrival,
        date,
        passengers,
        classType,
        seatno,
      });
     const result =  await reservation.save();
      res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  
  // Get all reservations for the logged-in user
  router.get('/reservations', authenticateToken, async (req, res) => {
    try {
      const reservations = await Reservation.find({ userId: req.user.id }); // Only fetch user's reservations
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  
  // Update reservation
  router.put('/reservations/:id', authenticateToken, async (req, res) => {
    try {
      const reservation = await Reservation.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, // Ensure the reservation belongs to the user
        req.body,
        { new: true }
      );
      if (!reservation) return res.status(404).json({ message: 'Reservation not found or unauthorized' });
      res.status(200).json({ message: 'Reservation updated successfully', reservation });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  
  // Delete reservation
  router.delete('/reservations/:id', authenticateToken, async (req, res) => {
    try {
      const reservation = await Reservation.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!reservation) return res.status(404).json({ message: 'Reservation not found or unauthorized' });
      res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });

  module.exports = router;