const mongoose = require('mongoose');

const finalBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flightname: { type: String, required: true },
  price: { type: Number, required: true },
  passengers: { type: Number, required: true },
  time: { type: String, required: true },
  total: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  stops: { type: Number, required: true },
  travelhours: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const FinalBooking = mongoose.model('FinalBooking', finalBookingSchema);
module.exports = FinalBooking;
