import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import { Train } from "../Models/train.model.js"
import mongoose, { Schema } from "mongoose"
import { Schedule } from "../Models/schedule.model.js"

function parseTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes; // Convert time to total minutes
}

function getTimeDifference(time1, time2) {
    const minutes1 = parseTime(time1);
    const minutes2 = parseTime(time2);

    const diffInMinutes = Math.abs(minutes2 - minutes1);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return { hours, minutes };
}

const addTrainDetails = asyncHandler(async (req, res) => {
    const { trainNo, trainName, route } = req.body

    if (!trainNo)
        throw new ApiError(400, "Train no is required")
    if (!trainName)
        throw new ApiError(400, "Train name is required")
    if (!route)
        throw new ApiError(400, "Route is required")

    const existTrain = await Train.findOne({ trainNo })
    if (existTrain)
        throw new ApiError(410, "Train with same number already exist")

    const newTrain = await Train.create(
        {
            trainNo,
            trainName,
            route
        }
    )
    if (!newTrain)
        throw new ApiError(500, "Something went wrong while adding new train")

    return res.status(200).json(
        new ApiResponse(
            200,
            newTrain,
            "Train added successfully"
        )
    )
})

const findTrainByNo = asyncHandler(async (req, res) => {
    const { trainNo } = req.params
    if (!trainNo)
        throw new ApiError(400, "Train no is required")

    const trainDetails = await Train.aggregate([
        {
            $match: {
                trainNo: Number(trainNo),
            },
        },
        {
            $lookup: {
                from: "schedules",
                localField: "_id",
                foreignField: "train",
                as: "schedules",
            },
        },

    ])
    if (!trainDetails || trainDetails.length === 0)
        throw new ApiError(400, "Train not found with given Train No")

    let activeDays = []
    trainDetails[0].schedules.map((schedule) => {
        activeDays.push(schedule.day)
    })
    trainDetails[0].activeDays = activeDays

    trainDetails[0].departureTime = trainDetails[0].route[0].departureTime
    trainDetails[0].arrivalTime = trainDetails[0].route[trainDetails[0].route.length - 1].arrivalTime

    trainDetails[0].duration = getTimeDifference(trainDetails[0].departureTime, trainDetails[0].arrivalTime)

    return res.status(200).json(
        new ApiResponse(
            200,
            trainDetails[0],
            "Train details fetched successfully"
        )
    )
})

const findTrainByName = asyncHandler(async (req, res) => {
    const { trainName } = req.params
    if (!trainName)
        throw new ApiError(400, "Train name is required")

    const trainDetails = await Train.aggregate([
        {
            $match: {
                trainName: trainName,
            },
        },
        {
            $lookup: {
                from: "schedules",
                localField: "_id",
                foreignField: "train",
                as: "schedules",
            },
        },

    ])
    if (!trainDetails || trainDetails.length === 0)
        throw new ApiError(400, "Train not found")

    let activeDays = []
    trainDetails[0].schedules.map((schedule) => {
        activeDays.push(schedule.day)
    })
    trainDetails[0].activeDays = activeDays

    trainDetails[0].departureTime = trainDetails[0].route[0].departureTime
    trainDetails[0].arrivalTime = trainDetails[0].route[trainDetails[0].route.length - 1].arrivalTime

    trainDetails[0].duration = getTimeDifference(trainDetails[0].departureTime, trainDetails[0].arrivalTime)

    return res.status(200).json(
        new ApiResponse(
            200,
            trainDetails[0],
            "Train details fetched successfully"
        )
    )
})

const findTrainById = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")

    const trainDeatils = await Train.findById(trainId)
    if (!trainDeatils)
        throw new ApiError(400, "Train not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            trainDeatils,
            "Train details fetched successfully"
        )
    )
})

const updateTrainDetails = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")
    const { trainNo, trainName, route } = req.body
    if (!trainName && !trainNo && !route)
        throw new ApiError(400, "Details are required")

    const details = {}
    if (trainNo) details.trainNo = trainNo
    if (trainName) details.trainName = trainName
    if (route) details.route = route

    const updatedDetails = await Train.findByIdAndUpdate(trainId, details, { new: true })
    if (!updatedDetails)
        throw new ApiError(500, "Something went wrong while updating train details")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedDetails,
            "Details updated successfully"
        )
    )
})

const deleteTrain = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")

    const deletedTrain = await Train.findByIdAndDelete(trainId)
    if (!deletedTrain)
        throw new ApiError(400, "Train not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Train deleted successfully"
        )
    )
})

const searchTrainByJourney = asyncHandler(async (req, res) => {
    const { source, destination, dateOfJourney } = req.query
    if (!source || !destination || !dateOfJourney)
        throw new ApiError(400, "Station name and/or travel date required")

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(dateOfJourney);
    const day = weekday[d.getDay()];


    const trains = await Train.aggregate([
        //to find trains with given stations
        {
            $match: {
                "route.stationName": {
                    $all: [source, destination],
                },
            },
        },
        //to find schedules related to founded trains
        {
            $lookup: {
                from: "schedules",
                localField: "_id",
                foreignField: "train",
                as: "availableDays",
            },
        },
        //to make different documents
        {
            $unwind: {
                path: "$availableDays",
            },
        },
        //to find document with given day
        {
            $match: {
                "availableDays.day": day,
            },
        },
        //to project wanted attributes
        {
            $project: {
                trainName: 1,
                trainNo: 1,
                route: 1,
                availableDays: 1,
            },
        },
    ])

    const filteredTrains = trains.filter((train) => {
        const route = train.route.map(station => station.stationName)
        const sourceIdx = route.indexOf(source)
        const destinationIdx = route.indexOf(destination)

        return sourceIdx !== -1 && destinationIdx !== -1 && sourceIdx < destinationIdx
    })

    if (filteredTrains.length === 0)
        throw new ApiError(404, `No trains availble between ${source} ans ${destination} on ${dateOfJourney}`)

    return res.status(200).json(
        new ApiResponse(
            200,
            filteredTrains,
            "All trains fetched successfully"
        )
    )
})

const getTrainSuggestion = asyncHandler(async (req, res) => {
    const { query } = req.query
    if (!query)
        throw new ApiError(400, "Query parameter is required")

    if (isNaN(query)) {
        const regex = new RegExp(query, 'i')
        const trains = await Train.aggregate([
            {
                $match: { trainName: { $regex: regex } }
            },
            {
                $project: {
                    trainName: 1
                }
            }
        ])
        if (trains.length === 0)
            throw new ApiError(400, "No trains found matching input query")

        return res.status(200).json(
            new ApiResponse(
                200,
                trains,
                "Trains fetched successfully"
            )
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Query is numeric value"
        )
    )
})

const getActiveDays = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train id is required")

    const activeDays = await Schedule.aggregate([
        [
            {
                $match: {
                    'train': new mongoose.Types.ObjectId(trainId)
                }
            },
            {
                $project: {
                    day: 1,
                }
            }
        ]
    ])
    if (!activeDays || activeDays.length === 0)
        throw new ApiError(500, "Something went wrong while searching active days")

    return res.status(200).json(
        new ApiResponse(
            200,
            activeDays,
            "Active days fetched successfully"
        )
    )
})

const addComment = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")

    const { content } = req.body
    if (!content)
        throw new ApiError(400, "Content is required")

    const train = await Train.findById(trainId)
    if (!train)
        throw new Error(404, "Train not found")


    const comments = train.comments
    comments.push({ content, owner: req?.user?._id, username: req?.user?.username })
    const updatedData = await train.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedData,
            "Comment added successfully"
        )
    )
})

const getComment = asyncHandler(async (req, res) => {
    const { trainId } = req.params
    if (!trainId)
        throw new ApiError(400, "Train Id is required")

    const comments = await Train.aggregate([
        {
            $match: {
                '_id': new mongoose.Types.ObjectId(trainId)
            }
        },
        {
            $project: {
                comments: 1
            }
        },
        {
            $unwind: {
                path: '$comments'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'comments.owner',
                foreignField: '_id',
                as: 'User'
            }
        },
        {
            $unwind: {
                path: '$User'
            }
        },
        {
            $project: {
                comments: '$comments.content',
                username: '$User.name'
            }
        }
    ]
    )
    if (!comments)
        throw new ApiError(500, "Something went wrong while fetching comments")

    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "Comments fetched successfully"
        )
    )

})

const getAllTrains = asyncHandler(async (req, res) => {
    const trains = await Train.find()
    if (!trains)
        throw new ApiError(404, "No train found")

    return res.status(200).json(
        new ApiResponse(
            200,
            trains,
            "All trains fetched successfully"
        )
    )
})

export {
    addTrainDetails,
    findTrainByNo,
    findTrainByName,
    findTrainById,
    updateTrainDetails,
    deleteTrain,
    searchTrainByJourney,
    getTrainSuggestion,
    getActiveDays,
    addComment,
    getComment,
    getAllTrains
}