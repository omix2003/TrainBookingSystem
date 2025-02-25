import asyncHandler from "../Utils/asyncHandler.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { ApiError } from "../Utils/ApiError.js"
import { Station } from "../Models/station.model.js"

const addStation = asyncHandler(async (req, res) => {
    const { stationName, stationCode, city, state } = req.body
    if (!stationName || !stationCode)
        throw new ApiError(400, "Station name and/or station code is required")
    if (!city || !state)
        throw new ApiError(400, "City and State name is required")

    const existStation = await Station.findOne({
        $or: [{ stationName }, { stationCode }]
    })
    if (existStation)
        throw new ApiError(400, "Station with same name or code already exist")

    const newStation = await Station.create({ stationName, stationCode, city, state })
    if (!newStation)
        throw new ApiError(500, "Something went wrong while adding new station")

    return res.status(200).json(
        new ApiResponse(
            200,
            newStation,
            "Station added successfully"
        )
    )
})

const updateStation = asyncHandler(async (req, res) => {
    const { stationId } = req.params
    if (!stationId)
        throw new ApiError(400, "Station Id is required")

    const { stationName, stationCode, city, state } = req.body
    if (!stationCode && !stationName)
        throw new ApiError(400, "Station name and/or station code is required")

    const details = {}
    if (stationName) details.stationName = stationName
    if (stationCode) details.stationCode = stationCode
    if (stationCode) details.city = city
    if (stationCode) details.state = state

    const updatedStationDetails = await Station.findByIdAndUpdate(stationId, details, { new: true })
    if (!updatedStationDetails)
        throw new ApiError(500, "somethibg went wrong while updating train details")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedStationDetails,
            "Station details updated successfully"
        )
    )
})

const getStationSuggestions = asyncHandler(async (req, res) => {
    const { query } = req.query
    if (!query)
        throw new ApiError(400, "Query parameter is required")

    const regex = new RegExp(query, 'i')

    const stations = await Station.aggregate([
        {
            $match: { stationName: regex }
        },
        {
            $project: {
                stationName: 1
            }
        }
    ])
    if (stations.length === 0)
        throw new ApiError(400, "No station name found mathcing the input query")

    return res.status(200).json(
        new ApiResponse(
            200,
            stations,
            "Station suggetions fetched successfully"
        )
    )
})

const deleteStation = asyncHandler(async (req, res) => {
    const { stationId } = req.params
    if (!stationId)
        throw new ApiError(400, "Station Id is required")

    const deletedStation = await Station.findByIdAndDelete(stationId)
    if (!deletedStation)
        throw new ApiError(500, "Something went wrong while deleting station")

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedStation,
            "Station deleted successfully"
        )
    )
})

const getAllStation = asyncHandler(async (req, res) => {
    const stations = await Station.find()
    if (!stations || stations.length === 0)
        throw new ApiError(500, "Something went wrong while fetching all stations")

    return res.status(200).json(
        new ApiResponse(
            200,
            stations,
            "All stations fetched successfully"
        )
    )
})

export { getStationSuggestions, addStation, updateStation, deleteStation, getAllStation }