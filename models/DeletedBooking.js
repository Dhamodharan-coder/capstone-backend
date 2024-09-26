const mongoose = require('mongoose');

// Schema to log deleted bookings
const passengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    flightno: { type: Array, required: true },
    scheduleddate:{type:Date,required:true},
    stops: { type: Number, required: true },
    totalprice:{ type: String, required: true },
    price: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    totalDuration: { type: String, required: true },
    carrierCode: { type: Array, required: true },
    aircraft: { type: String, required: true },
    travelClass: { type: Array, required: true }
});

const deletedBookingSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    passengers: { type: [passengerSchema], required: true },  // Include passenger details
    deletedAt: { type: Date, default: Date.now },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Who deleted the booking
});

const DeletedBooking = mongoose.model('DeletedBooking', deletedBookingSchema);

module.exports = DeletedBooking;
