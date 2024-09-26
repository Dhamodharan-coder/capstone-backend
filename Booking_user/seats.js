// const express = require('express');
// const bodyParser = require('body-parser');
// const authenticateToken = require("../register-login/register")

// const router = express.Router();

// router.use(bodyParser.json());

// // In-memory store for selected seats
// let selectedSeats = new Set();

// // Endpoint to get selected seats
// router.get('/seats',authenticateToken, (req, res) => {
//     res.json(Array.from(selectedSeats));
// });

// // Endpoint to select a seat
// router.post('/seats/select', authenticateToken, (req, res) => {
//     const { seatId } = req.body;

//     if (selectedSeats.has(seatId)) {
//         return res.status(400).json({ message: 'Seat already selected' });
//     }

//     selectedSeats.add(seatId);
//     res.status(200).json({ message: 'Seat selected successfully' });
// });

// // Endpoint to deselect a seat
// router.post('/seats/deselect', (req, res) => {
//     const { seatId } = req.body;

//     if (!selectedSeats.has(seatId)) {
//         return res.status(400).json({ message: 'Seat not found' });
//     }

//     selectedSeats.delete(seatId);
//     res.status(200).json({ message: 'Seat deselected successfully' });
// });



// module.exports = router;
