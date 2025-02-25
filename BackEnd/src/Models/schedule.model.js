import mongoose, { Schema } from "mongoose";

const fareSchema = new Schema({
    sourceStation: {
        type: String,
        required: true
    },
    destinationStation: {
        type: String,
        required: true
    },
    classFares: [{
        className: {
            type: String,
            enum: ["1A", "2A", "3A", "CC", "SL", "2S", "GEN"],
            required: true
        },
        fare: {
            type: Number,
            required: true
        },
    }],
    distance: {
        type: Number
    },
    duration: {
        type: String
    }

});

const seatsSchema = new Schema({
    className: {
        type: String,
        enum: ["1A", "2A", "3A", "CC", "SL", "2S", "GEN"],
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    waitingList: {
        type: Number,
        default: 0,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
});

const scheduleSchema = new Schema({
    train: {
        type: Schema.Types.ObjectId,
        ref: 'Train',
        required: true
    },
    day: {
        type: String,
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    fares: [fareSchema],
    seats: [seatsSchema],
    lastResetDate: {
        type: Date,
        default: null
    }
})

const resetSeatsDaily = async () => {
    try {
        const today = new Date()
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = weekday[today.getDay()]

        const schedules = await Schedule.find({ day: dayOfWeek })
        for (const schedule of schedules) {
            schedule.seats.forEach((seat) => (
                seat.seatsAvailable = seat.totalSeats,
                seat.waitingList = 0
            ))
            schedule.lastResetDate = today
            await schedule.save()
        }
    } catch (error) {
        console.error('Error resetting seats daily:', error);
    }
}

const scheduleDailyResest = () => {
    const now = new Date()
    const msInDay = 24 * 60 * 60 * 1000

    const nextResetTime = new Date(now)
    nextResetTime.setHours(23, 59, 0, 0)

    const timeUntilNextReset = nextResetTime.getTime() - now.getTime()

    setTimeout(() => {
        resetSeatsDaily()
        scheduleDailyResest()
    }, timeUntilNextReset)
}

scheduleDailyResest()

export const Schedule = mongoose.model("Schedule", scheduleSchema)