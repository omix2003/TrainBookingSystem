import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import { Schedule } from "../Models/schedule.model.js"
import { Train } from "../Models/train.model.js"

const addSchedule = asyncHandler(async (req, res) => {
    const { day, fares, seats, trainNo } = req.body
    if (!day || !fares || !seats || !trainNo)
        throw new ApiError(400, "All data are required")

    if (fares.length === 0 || seats.length === 0)
        throw new ApiError(400, "Fares and Seats data are required")

    fares.forEach((fare) => {
        if (!fare.sourceStation || !fare.destinationStation ||
            !fare.classFares || fare?.classFares.length === 0 || !fare.distance)
            throw new ApiError(400, "Fare details is incomplete")

        fare?.classFares.forEach((classFare) => {
            if (!classFare.className || !classFare.fare)
                throw new ApiError(400, "Classfare details is incomplete")
        })
    })

    seats.forEach((seat) => {
        if (!seat.className || !seat.seatsAvailable || !seat.totalSeats)
            throw new ApiError(400, "Seats details is incomplete")
    })

    const train = await Train.findOne({ trainNo })
    if (!train)
        throw new ApiError(400, "Train not found. Enter valid train number")

    const existSchedule = await Schedule.findOne({ train: train._id, day })
    if (existSchedule)
        throw new ApiError(400, "Schedule already exist for given day and given train")

    const newSchedule = await Schedule.create({
        train: train._id,
        day,
        seats,
        fares,
    })
    if (!newSchedule)
        throw new ApiError(500, "Something went wrong while adding schedule")

    return res.status(200).json(
        new ApiResponse(
            200,
            newSchedule,
            "Schedule added successfully"
        )
    )
})

const getAllSchedule = asyncHandler(async (req, res) => {
    const schedules = await Schedule.aggregate([
        {
            $group: {
                _id: "$train",
                days: {
                    $push: "$day",
                },
                fares: {
                    $push: "$fares",
                },
                // seats: {
                //     $push: "$seats",
                // },
            },
        },
        {
            $lookup: {
                from: "trains",
                localField: "_id",
                foreignField: "_id",
                as: "trainDetails",
            },
        },
        {
            $unwind: "$trainDetails",
        },
        {
            $project: {
                days: 1,
                fares: 1,
                // seats: 1,
                trainName: "$trainDetails.trainName",
                trainNo: "$trainDetails.trainNo",
            },
        },
    ]);

    if (!schedules || schedules.length === 0)
        throw new ApiError(400, "Something went wrong while fetching schedules.")

    return res.status(200).json(
        new ApiResponse(
            200,
            schedules,
            "All schedules fetched successfully"
        )
    )
})

const deleteSchedule = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")

    const { day } = req.body
    if (!day)
        throw new ApiError(400, "Day is required")
    console.log(day);

    const schedule = await Schedule.findOneAndDelete({ train: trainId, day })
    if (!schedule)
        throw new ApiError(404, "Schedule not found for selected train on selected day")

    return res.status(200).json(
        new ApiResponse(
            200,
            schedule,
            "Schedule fetched successfully"
        )
    )
})

const updateSchedule = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")

    const { newFares } = req.body
    if (!newFares || !Array.isArray(newFares))
        throw new ApiError("Fares information is required")

    const schedules = await Schedule.find({ train: trainId })
    if (!schedules)
        throw new ApiError(404, "No schedules found for given train")

    for (const schedule of schedules) {
        schedule.fares = newFares
        await schedule.save()
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            schedules,
            "Schedule updated successfully"
        )
    )

})

export {
    addSchedule,
    getAllSchedule,
    deleteSchedule,
    updateSchedule
}