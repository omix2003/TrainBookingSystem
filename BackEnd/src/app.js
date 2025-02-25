import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./Routes/user.routes.js"
import trainRouter from "./Routes/train.routes.js"
import adminRouter from "./Routes/admin.routes.js"
import stationRouter from "./Routes/station.routes.js"
import scheduleRouter from "./Routes/schedule.routes.js"
import bookingRouter from "./Routes/booking.routes.js"
import paymentRouter from "./Routes/payment.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/trains", trainRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/stations", stationRouter)
app.use("/api/v1/schedule", scheduleRouter)
app.use("/api/v1/book-ticket", bookingRouter)
app.use("/api/v1/payments", paymentRouter)


export { app }