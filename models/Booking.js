const mongoose = require('mongoose');

// Schema for passenger details
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



// Booking schema combining user, passengers, and flight details
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:{type:String,default:"pending"},
    passengers: { type: [passengerSchema], required: true },  // Array of passenger subdocuments// Single flight details subdocument
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
