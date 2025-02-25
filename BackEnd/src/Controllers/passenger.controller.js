import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import { Train } from "../Models/train.model.js"
import { Passenger } from "../Models/passenger.model.js"

const addPassenger = asyncHandler(async (req, res) => {
    const { trainId, pnrNo, passengers } = req.body
    if (!trainId || !pnrNo || !passengers)
        throw new ApiError(400, "All details are required")

    const train = await Train.findById(trainId)
    if (!train)
        throw new ApiError(404, "Train not found")

    const validatedPassengers = []
    for (const passenger of passengers) {
        const { name, age, gender, seatNo, className, passengerType } = passenger
        if (!name || !age || !gender || !seatNo || !className || !passengerType)
            throw new ApiError(400, "Passenger details are incomplete")

        validatedPassengers.push({
            name,
            age,
            gender,
            seatNo,
            className,
            passengerType
        })
    }

    const newPassenger = await Passenger.create({
        train: trainId,
        pnrNo,
        className,
        passengerDetails: validatedPassengers
    })
    if (!newPassenger)
        throw new ApiError(500, "Something went wrong while adding passengers")

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Passengers added successfully"
        )
    )
})

export { addPassenger }