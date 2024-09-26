const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  date: { type: Date, required: true },
  passengers: { type: Number, required: true },
  classType: { type: String, required: true, enum: ['Economy', 'Business', 'First Class'] },
  status: { type: String, default: 'Pending' }, // Booking status
  seatno:{type:Number},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
