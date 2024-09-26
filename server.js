const express = require("express");
const cors = require("cors");



const app = express();

const admin = require("./Admin-register/Admin")
const register_login= require("./register-login/register");
const payment = require("./payment/payment");
const webhook = require("./payment/webhook");
const amadeus = require("./amadeus/amadeus_api");
const reservations = require("./reservations/reservations.js");
const booking = require("./Booking_user/Bookings")
// const seats = require("./Booking_user/seats");
const forgot = require("./register-login/reset.js");
const connectDB = require('./db'); 


// Use CORS middleware
app.use(cors());


connectDB();

// Use express.json() to parse JSON request bodies
app.use(express.json());
app.use("/",register_login);
app.use("/",payment);
app.use("/", webhook);
app.use("/",amadeus);
// app.use("/",seats);
app.use("/",booking)
app.use("/",admin)
app.use("/",reservations);
app.use("/api",forgot);


// Start the server (example port 3000)
const PORT = 3000;




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
