import mongoose, { Schema } from "mongoose";

const stationSchema = new Schema({
    stationName: {
        type: String,
        required: true
    },
    stationCode: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    stopNumber: {
        type: Number,
        required: true
    }
})

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String
    }
}, { timestamps: true })

const ratingSchema = new Schema({
    rating: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const trainSchema = new Schema({
    trainNo: {
        type: Number,
        required: true,
        unique: true
    },
    trainName: {
        type: String,
        required: true,
    },
    route: {
        type: [stationSchema],
        required: true
    },
    comments: {
        type: [commentSchema]
    },
    rating: {
        type: [ratingSchema]
    }
})

export const Train = mongoose.model("Train", trainSchema)