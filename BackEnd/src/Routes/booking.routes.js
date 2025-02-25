import { Router } from "express";
import { cancelBooking, createBooking, getAllBookingDetails, getAllPNR, getBookingDetails, getBookingsbyUser } from "../Controllers/booking.controller.js";
import { isAdmin, verifyJWT } from "../Middlewares/auth.middleware.js"

const router = Router()

router.route("/bookings").post(verifyJWT, createBooking)
router.route("/booking-details/c/:pnrNo").get(getBookingDetails)
router.route("/cancel-booking/c/:pnrNo").post(verifyJWT, cancelBooking)
router.route("/get-pnr").get(verifyJWT, getAllPNR)
router.route("/get-all-booking-details").get(isAdmin, getAllBookingDetails)
router.route("/get-booking-by-user").get(verifyJWT, getBookingsbyUser)
export default router