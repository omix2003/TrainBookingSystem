import mongoose, { Schema } from "mongoose";

const detailSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    passengerType: {
        type: String,
        enum: ['Normal', 'Person with disability'],
        required: true
    },
    bookingStatus: {
        type: String,
        required: true,
        enum: ["Confirm", "WL", "Cancelled"]
    },
    currentStatus: {
        type: String,
        required: true,
        enum: ["Confirm", "WL", "Cancelled"]
    },
    seatNo: {
        type: Number,
        default: null
    }
})

const passengerSchema = new Schema(
    {
        train: {
            type: Schema.Types.ObjectId,
            ref: 'Train',
            required: true
        },
        pnrNo: {
            type: String,
            required: true,
            unique: true
        },
        className: {
            type: String,
            enum: ['1A', '2A', '3A', 'CC', 'SL', '2S', 'GEN'],
            required: true
        },
        passengerDetails: [detailSchema]
    },
    { timestamps: true }
)

export const Passenger = mongoose.model("Passenger", passengerSchema)