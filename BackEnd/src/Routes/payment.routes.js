import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { createBooking } from "../Controllers/booking.controller.js";
import { createOrder } from "../Controllers/payment.controller.js";

const router = Router()

router.route('/create-booking').post(verifyJWT, createOrder)

export default router