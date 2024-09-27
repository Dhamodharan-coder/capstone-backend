// Backend: payment.js
const express = require("express");
const router = express.Router();
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const authenticateToken = require("../Auth");
const Booking = require("../models/Booking");
const PaymentSuccess = require("../models/Paymentsuccess");
const DeletedBooking = require('../models/DeletedBooking');

// Create a payment session and temporarily save the booking
router.post("/payment", authenticateToken, async (req, res) => {
    try {
        // Step 1: Temporarily save the booking with 'pending' status
       
        const bookingData = {
            userId: req.user.id,  // User ID obtained from the token
            passengers: req.body.passengers,  // Passenger and flight details from the front-end
            createdAt: Date.now(),
             // Set initial status to pending
        };
        

        // Create the pending booking and save it
        const newBooking = new PaymentSuccess(bookingData);
        await newBooking.save();
        
       

        // Step 2: Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Booking ID: ${newBooking._id}`,  // Reference booking ID
                        },
                        unit_amount: req.body.amount * 100,  // Amount in cents (Stripe uses smallest unit)
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.BASEURL}/payment_success?session_id={CHECKOUT_SESSION_ID}&booking_id=${newBooking._id}`,
            cancel_url: `${process.env.BASEURL}/payment_failure?booking_id=${newBooking._id}`,  // Pass booking ID on cancel
        });

        // Respond with the session URL for Stripe checkout
        res.json({ url: session.url });
      
    } catch (error) {
        console.error("Error during payment process:", error.message);
        res.status(500).json({ message: "Payment failed", error: error.message });
    }
});

// Handle successful payments
router.post("/payment_success", authenticateToken,async (req, res) => {
    const { booking_id, session_id } = req.body;
    try {
        // Verify session with Stripe (optional for security)
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            // Step 3: Update booking to 'confirmed' if payment was successful
            const updatedBooking = await PaymentSuccess.findByIdAndUpdate(booking_id, { status: 'confirmed' }, { new: true });

            try {
                 await Booking.findOneAndDelete({ userId: req.user.id });
                
            } catch (error) {
                console.error("Error deleting booking:", error.message);
            }
            
            if (updatedBooking) {
                return res.status(200).json({ success: true, booking: updatedBooking });
            } else {
                const deletedBooking = await PaymentSuccess.findByIdAndDelete(booking_id);
    if (deletedBooking) {
      console.log("Booking deleted successfully:", deletedBooking);
    } else {
      console.log("No booking found with that ID.");
    }
                return res.status(404).json({ success: false, message: "Booking not found" });
            }
        } else {
            const deletedBooking = await PaymentSuccess.findByIdAndDelete(booking_id);
    if (deletedBooking) {
      console.log("Booking deleted successfully:", deletedBooking);
    } else {
      console.log("No booking found with that ID.");
    }
            return res.status(400).json({ success: false, message: "Payment not confirmed" });
        }
    } catch (error) {
        const deletedBooking = await PaymentSuccess.findByIdAndDelete(booking_id);
    if (deletedBooking) {
      console.log("Booking deleted successfully:", deletedBooking);
    } else {
      console.log("No booking found with that ID.");
    }
        console.error("Error confirming payment:", error.message);
        res.status(500).json({ message: "Error confirming payment", error: error.message });
    }
});


//booking details
router.get("/final_bookings", authenticateToken, async (req, res) => {
    try {
      const finalBookings = await PaymentSuccess.find({ userId: req.user.id });
      res.status(200).json({ message: "Final bookings retrieved successfully", finalBookings });
    } catch (error) {
      console.error('Error retrieving final bookings:', error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }

  });


  //booking delete details all 


  router.delete('/final_bookings/:id', authenticateToken ,  async (req, res) => {
    try {
        const bookingId = req.params.id;
       
      console.log(bookingId)
        const booking = await PaymentSuccess.findByIdAndUpdate(bookingId, { isDeleted: true , deletedAt: new Date()}, { new: true });
     
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
 res.json({ message: 'Booking marked as deleted', booking });

       try {
        const deletedBooking = new DeletedBooking({
            userId: booking.userId,
            passengers: booking.passengers,
            deletedBy: bookingId  // Assuming user ID is available from auth middleware
        });
        await deletedBooking.save();
       } catch (error) {
        console.log(error);
       }

try {
    await PaymentSuccess.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted and logged'});
} catch (error) {
    console.log(error)
}
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;









//payment failure

router.post("/payment_failure", async (req, res) => {
  const { booking_id } = req.body;

  try {
      // Delete the pending booking when payment is cancelled or fails
      await PaymentSuccess.findByIdAndDelete(booking_id);
      res.status(200).json({ success: true, message: "Booking deleted due to payment failure" });
  } catch (error) {
      console.error("Error during payment failure handling:", error.message);
      res.status(500).json({ message: "Error handling payment failure", error: error.message });
  }
});


module.exports = router;
