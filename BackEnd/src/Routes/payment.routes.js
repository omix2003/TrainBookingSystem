import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { createBooking } from "../Controllers/booking.controller.js";
import { createOrder } from "../Controllers/payment.controller.js";

const router = Router()

router.route('/create-booking').post(verifyJWT, createOrder)
// router.post('/verify-payment') verifyPayment);
router.route('/create-booking').post(verifyJWT, async (req, res) => {
    try {
        // Step 1: Create booking in the database
        const booking = await createBooking(req, res);
        
        // Step 2: If booking is created successfully, generate a payment order
        if (booking) {
            await createOrder(req, res);
        }
    } catch (error) {
        console.error("Error in create-booking:", error);
        res.status(500).json({ error: "Booking creation failed" });
    }
});

export default router