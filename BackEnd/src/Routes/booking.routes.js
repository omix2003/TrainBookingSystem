import { Router } from "express";
import { cancelBooking, createBooking, getAllBookingDetails, getAllPNR, getBookingDetails, getBookingsbyUser } from "../Controllers/booking.controller.js";
import { isAdmin, verifyJWT } from "../Middlewares/auth.middleware.js"

const router = Router()

router.route("/bookings").post( createBooking)
router.route("/booking-details/c/:pnrNo").get(getBookingDetails)
router.route("/cancel-booking/c/:pnrNo").post( cancelBooking)
router.route("/get-pnr").get( getAllPNR)
router.route("/get-all-booking-details").get( getAllBookingDetails)
router.route("/get-booking-by-user").get(getBookingsbyUser)
export default router