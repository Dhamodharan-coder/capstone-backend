const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensure each user can only have one seat selection
  },
  selectedSeats: {
    type: [Number], // Assuming seat IDs are numbers
    required: true
  }
});

module.exports = mongoose.model('Seat', SeatSchema);
