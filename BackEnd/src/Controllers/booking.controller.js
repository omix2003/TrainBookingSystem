import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import { Schedule } from "../Models/schedule.model.js"
import { Booking } from "../Models/booking.model.js"
import { Passenger } from "../Models/passenger.model.js"
import mongoose from "mongoose"
import { Refund } from "../Models/refund.model.js"
import { Payment } from "../Models/payment.model.js"

function parseTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function getTimeDifference(time1, time2) {
    const minutes1 = parseTime(time1);
    const minutes2 = parseTime(time2);

    const diffInMinutes = Math.abs(minutes2 - minutes1);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return { hours, minutes };
}

const createBooking = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { trainId, pnrNo, dateOfJourney, source, destination, totalFare, className, passengers, paymentMethod, paymentId, orderId, currency, arrivalTime, departureTime } = req.body
        if (!trainId || !pnrNo || !dateOfJourney || !source || !totalFare || !destination || !className || !arrivalTime || !departureTime)
            throw new ApiError(400, "All booking details are required")

        if (!passengers)
            throw new ApiError(400, "Passengers details are required")

        if (!paymentId || !orderId || !currency || !paymentMethod)
            throw new ApiError(400, "Payment details are required")

        //to find day from journey date
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date(dateOfJourney);
        const day = weekday[d.getDay()];

        //to find schedule
        let schedule = await Schedule.findOne({ train: trainId, day }).session(session);

        //to add booking details in DB
        const booking = new Booking({
            train: trainId,
            pnrNo,
            dateOfJourney,
            source,
            destination,
            arrivalTime,
            departureTime,
            bookedBy: req.user?._id,
            totalFare,
            isCancelled: false,
            paymentId
        })
        const savedBooking = await booking.save({ session })
        if (!savedBooking)
            throw new ApiError(500, "Something went wrong while creating booking")

        const payment = new Payment({
            amount: totalFare,
            paymentMethod,
            paymentId,
            orderId,
            currency,
            status: "successful"
        })

        const savedPayment = await payment.save({ session })
        if (!savedPayment)
            throw new ApiError(500, "Spmething went wrong while creating payment")

        let classIdx = -1
        for (let i = 0; i < schedule.seats.length; i++)
            if (className === schedule.seats[i].className)
                classIdx = i

        if (classIdx === -1)
            throw new ApiError(400, `${className} class not found`)

        const validatedPassengers = []
        passengers.forEach(passenger => {
            const { name, age, gender, type } = passenger;
            if (!name || !age || !gender || !type)
                throw new ApiError(400, "Passenger details are incomplete");

            let bookingStatus, currentStatus;
            if (schedule.seats[classIdx].seatsAvailable > 0) {
                bookingStatus = "Confirm";
                currentStatus = "Confirm";
                schedule.seats[classIdx].seatsAvailable--;
            } else {
                bookingStatus = "WL";
                currentStatus = "WL";
                schedule.seats[classIdx].waitingList++;
            }

            const seatNo = currentStatus === "Confirm"
                ? (schedule.seats[classIdx]?.seatsAvailable ?? 0) + 1
                : null;

            validatedPassengers.push({
                name,
                age,
                gender,
                passengerType: type,
                bookingStatus,
                currentStatus,
                seatNo
            });
        });
        const newPassenger = new Passenger({
            train: trainId,
            pnrNo,
            className,
            passengerDetails: validatedPassengers
        })
        const savedPassenger = await newPassenger.save({ session })
        if (!savedPassenger)
            throw new ApiError(500, "Something went wrong while adding passengers")

        await schedule.save({ session })

        await session.commitTransaction();
        session.endSession()

        return res.status(200).json(
            new ApiResponse(
                200,
                { savedBooking, savedPassenger, savedPayment },
                "Booking done successfully"
            )
        )
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiError(500, error?.message || "Failed to create booking. Please try agin later.")
    }
})

const getBookingDetails = asyncHandler(async (req, res) => {
    const { pnrNo } = req.params
    if (!pnrNo)
        throw new ApiError(400, "PNR No is required")

    const bookingdetails = await Booking.aggregate(
        [
            {
                $match: {
                    pnrNo: pnrNo,
                },
            },
            {
                $lookup: {
                    from: "trains",
                    localField: "train",
                    foreignField: "_id",
                    as: "trainData",
                },
            },
            {
                $lookup: {
                    from: "passengers",
                    localField: "pnrNo",
                    foreignField: "pnrNo",
                    as: "passengerData",
                },
            },
            {
                $project: {
                    source: 1,
                    destination: 1,
                    pnrNo: 1,
                    dateOfJourney: 1,
                    totalFare: 1,
                    paymentId: 1,
                    bookingDate: "$createdAt",
                    trainNo: "$trainData.trainNo",
                    trainName: "$trainData.trainName",
                    className: "$passengerData.className",
                    passengerDetails:
                        "$passengerData.passengerDetails",
                    trainRoute: "$trainData.route"
                },
            },
        ]
    )
    if (!bookingdetails || bookingdetails.length === 0)
        throw new ApiError(400, `Booking details not found for PNR No: ${pnrNo}`)

    bookingdetails[0].trainRoute[0].forEach((route) => {
        if (route.stationName === bookingdetails[0].source)
            bookingdetails[0].departureTime = route.departureTime
        if (route.stationName === bookingdetails[0].destination)
            bookingdetails[0].arrivalTime = route.arrivalTime
    })

    bookingdetails[0].duration = getTimeDifference(bookingdetails[0].arrivalTime, bookingdetails[0].departureTime)

    return res.status(200).json(
        new ApiResponse(
            200,
            bookingdetails[0],
            "Booking details fetched successfully"
        )
    )
})

const cancelBooking = asyncHandler(async (req, res) => {
    let session
    try {
        session = await mongoose.startSession()
        session.startTransaction()

        const { pnrNo } = req.params
        if (!pnrNo)
            throw new ApiError(400, "PNR No is required")

        //to updated booking status
        const updatedBookingDetails = await Booking.findOneAndUpdate({ pnrNo }, { isCancelled: true }, { new: true }).session(session)
        if (!updatedBookingDetails)
            throw new ApiError(500, "Something went wrong while cancelling booking")

        //to update passenger status
        const passengers = await Passenger.findOne({ pnrNo }).session(session)
        if (!passengers)
            throw new ApiError(404, "Passengers not found")

        // to update seats in schedule
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date(updatedBookingDetails.dateOfJourney);
        const day = weekday[d.getDay()];

        const schedule = await Schedule.findOne({ train: updatedBookingDetails.train, day }).session(session)
        let idx = -1
        for (let i = 0; i < schedule.seats.length; i++)
            if (schedule.seats[i].className === passengers.className)
                idx = i
        if (idx === -1)
            throw new ApiError(404, `${passengers.className} class not found`)

        passengers.passengerDetails.forEach((passenger) => {
            if (passenger.currentStatus === 'Confirm')
                schedule.seats[idx].seatsAvailable++
            else if (passenger.currentStatus === 'WL')
                schedule.seats[idx].waitingList--;
        })
        await schedule.save({ session })

        passengers.passengerDetails.forEach((passenger) => { passenger.currentStatus = 'Cancelled' })
        await passengers.save({ session })

        //to update in refund DB
        const refund = new Refund({
            booking: updatedBookingDetails._id,
            amount: updatedBookingDetails.totalFare,
            status: 'Pending'
        })
        const newRefund = await refund.save({ session })
        if (!newRefund)
            throw new ApiError(500, "Something went wrong while creating refund entry")

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json(
            new ApiResponse(
                200,
                { updatedBookingDetails, passengers, newRefund },
                "Booking cancelled successfully"
            )
        )

    } catch (error) {
        if (session) {
            try {
                session.abortTransaction()
                session.endSession()
            } catch (abortError) {
                throw new ApiError(500, `Error aborting transaction: ${abortError}`)
            }
        }
        throw new ApiError(500, error?.message || "Failed to cancel booking. Please try again later")
    }
})

const getAllPNR = asyncHandler(async (req, res) => {
    try {
        const PNRlist = await Booking.aggregate([
            {
                $project: {
                    pnrNo: 1,
                    _id: 0
                }
            }
        ])
        if (!PNRlist || PNRlist.length === 0)
            throw new ApiError(500, "Something went wrong while fetching PNR nos.")

        return res.status(200).json(
            new ApiResponse(
                200,
                PNRlist,
                "All PNR fetched successfully"
            )
        )
    } catch (error) {

    }
})

const getAllBookingDetails = asyncHandler(async (req, res) => {
    const bookings = await Booking.aggregate([
        {
            $lookup: {
                from: "passengers",
                localField: "pnrNo",
                foreignField: "pnrNo",
                as: "passengerDetails",
            },
        },
        {
            $lookup: {
                from: "trains",
                localField: "train",
                foreignField: "_id",
                as: "trainDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "bookedBy",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $lookup: {
                from: 'payments',
                localField: 'paymentId',
                foreignField: 'paymentId',
                as: 'paymentDetails'
            }
        },
        {
            $project: {
                pnrNo: 1,
                destination: 1,
                dateOfJourney: 1,
                totalFare: 1,
                source: 1,
                isCancelled: 1,
                createdAt: 1,
                passengerDetails: {
                    $first: "$passengerDetails",
                },
                trainDetails: {
                    $first: "$trainDetails",
                },
                userDetails: {
                    $first: "$userDetails",
                },
                paymentDetails: {
                    $first: "$paymentDetails"
                }
            },
        },
    ])
    if (!bookings)
        throw new ApiError(500, "Something went wrong while fetching booking details")

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "All booking details fetched successfully"
        )
    )
})

const getBookingsbyUser = asyncHandler(async (req, res) => {
    const bookings = await Booking.aggregate([
        {
            $match: {
                bookedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "trains",
                localField: "train",
                foreignField: "_id",
                as: "trainData",
            },
        },
        {
            $lookup: {
                from: "passengers",
                localField: "pnrNo",
                foreignField: "pnrNo",
                as: "passengerData",
            },
        },
        {
            $project: {
                source: 1,
                destination: 1,
                pnrNo: 1,
                dateOfJourney: 1,
                totalFare: 1,
                paymentId: 1,
                bookingDate: "$createdAt",
                trainNo: "$trainData.trainNo",
                trainName: "$trainData.trainName",
                className: "$passengerData.className",
                passengerDetails:
                    "$passengerData.passengerDetails",
                trainRoute: "$trainData.route",
                departureTime: 1,
                arrivalTime: 1,
                duration: 1,
                isCancelled: 1
            },
        },
    ])
    if (!bookings)
        throw new ApiError(500, "Something went wrong while fetching booking details")

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "All booking details fetched successfully"
        )
    )
})

export {
    createBooking,
    getBookingDetails,
    cancelBooking,
    getAllPNR,
    getAllBookingDetails,
    getBookingsbyUser
}