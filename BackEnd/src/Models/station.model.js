import mongoose, { Schema } from "mongoose";

const stationSchema = new Schema({
    stationName: {
        type: String,
        required: true,
        unique: true
    },
    stationCode: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
})

export const Station = mongoose.model("Station", stationSchema)