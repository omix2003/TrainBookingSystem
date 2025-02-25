import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import Razorpay from "razorpay"
import crypto from "crypto"


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = asyncHandler(async (req, res) => {
    const { amount, currency } = req.body

    const options = {
        amount: amount * 100,
        currency,
        receipt: crypto.randomBytes(10).toString('hex')
    }

    try {
        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json(
            new ApiResponse(
                200,
                order,
            )
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

export {
    createOrder
}