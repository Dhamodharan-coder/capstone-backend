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
    travelClass: { type: String, required: true }
});



// Booking schema combining user, passengers, and flight details
const paymentSuccessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:{type:String,default:"pending"},
    passengers: { type: [passengerSchema], required: true },  // Array of passenger subdocuments// Single flight details subdocument
    isDeleted: { type: Boolean, default: false },  // New field for soft delete
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },  // Optional field to track when it was deleted
});
const PaymentSuccess = mongoose.model('PaymentSuccess', paymentSuccessSchema);

module.exports = PaymentSuccess;
