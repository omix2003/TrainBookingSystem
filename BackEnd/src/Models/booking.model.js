import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        train: {
            type: Schema.Types.ObjectId,
            ref: 'Train',
            required: true
        },
        pnrNo: {
            type: String,
            required: true,
            unique: true,
        },
        dateOfJourney: {
            type: Date,
            required: true
        },
        source: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        departureTime: {
            type: String,
            required: true
        },
        arrivalTime: {
            type: String,
            required: true
        },
        bookedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        totalFare: {
            type: Number,
            required: true
        },
        isCancelled: {
            type: Boolean,
            required: true,
            default: false
        },
        paymentId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Booking = mongoose.model("Booking", bookingSchema)