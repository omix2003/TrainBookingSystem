import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import { Admin } from "../Models/admin.model.js"
import jwt from "jsonwebtoken"
import { Train } from "../Models/train.model.js"
import { Booking } from "../Models/booking.model.js"
import { User } from "../Models/User.model.js"

const generateAccessandRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        const accessToken = await admin.generateAccessToken()
        const refreshToken = await admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const addNewAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username)
        throw new ApiError(400, "Username is required")
    if (!password)
        throw new ApiError(400, "Password is required")
    if (password.trim().length < 6)
        throw new ApiError(400, "Password must have 6 or more characters")

    const existAdmin = await Admin.findOne({ username })
    if (existAdmin)
        throw new ApiError(401, "User already exist with same username or Mobile No or email")

    const newAdmin = await Admin.create(
        {
            username: username.toLowerCase(),
            password
        }
    )
    if (!newAdmin)
        throw new ApiError(500, "Something went wrong while Usering new user.")

    const admin = await Admin.findById(newAdmin._id).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(
            200,
            admin,
            "Admin registered successfully"
        )
    )
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username)
        throw new ApiError(400, "Username is required")
    if (!password)
        throw new ApiError(400, "Password is required to login")

    const admin = await Admin.findOne({ username })
    if (!admin)
        throw new ApiError(400, "User does not exist")

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid)
        throw new ApiError(400, "Password is incorrect")

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200,
                { loggedInAdmin, refreshToken, accessToken },
                "Admin logged in successfully"
            )
        )
})

const logOutAdmin = asyncHandler(async (req, res) => {

    const loggedOutAdmin = await Admin.findByIdAndUpdate(req.admin._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        clearCookie("accessToken", options).
        clearCookie("refreshtoken", options).
        json(
            new ApiResponse(
                200,
                {},
                "Admin logged out"
            )
        )
})

const getAdmin = asyncHandler(async (req, res) => {
    const admins = await Admin.find().select("-password -refreshToken")
    if (!admins || admins.length === 0)
        throw new ApiError(404, "Admin not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            admins,
            "All admins fetched successfully"
        )
    )
})

const deleteAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    if (!adminId)
        throw new ApiError(400, "Admin Id is required")

    const { password } = req.body
    if (!password)
        throw new ApiError(400, "Password is required")

    const admin = await Admin.findById(req.admin?._id)
    const validPassword = await admin.isPasswordCorrect(password)
    if (!validPassword)
        throw new ApiError(410, "Wrong password")

    const deletedAdmin = await Admin.findByIdAndDelete(adminId)
    if (!deletedAdmin)
        throw new ApiError(500, "Something went wrong while deleting admin")

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedAdmin,
            "Admin deleted successfully"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken)
        throw new ApiError(400, "Unauthorized request")

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const admin = await Admin.findById(decodedToken?._id)
        if (!admin)
            throw new ApiError(400, "Invalid refresh token")

        if (incomingRefreshToken !== admin?.refreshToken)
            throw new ApiError(400, "Refresh token is expired or used")

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessandRefreshToken(admin._id)
        return res.status(200).
            cookie("accessToken", accessToken, options).
            cookie("refreshToken", newRefreshToken, options).
            json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed."
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getAllInformation = asyncHandler(async (req, res) => {
    const noOfTrains = await Train.aggregate([
        {
            $count: 'trains'
        }
    ])
    if (!noOfTrains)
        throw new ApiError(500, "Something went wrong while fetching train details")

    const noOfBookings = await Booking.aggregate(
        [
            {
                $match: {
                    dateOfJourney: Date.now()
                },
            },
            {
                $count: "bookings",
            },
        ]
    )
    if (!noOfBookings)
        throw new ApiError(500, "Something went wrong while fetching booking details")

    const dailyRevenue = await Booking.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(24, 0, 0, 0))
                },
                isCancelled: false
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalFare" }
            }
        },
        {
            $project: {
                _id: 0,
                dailyRevenue: "$totalRevenue"
            }
        }
    ])
    if (!dailyRevenue)
        throw new ApiError(500, "Something went wrong while fetching daily revenue")

    const monthlyRevenue = await Booking.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                },
                isCancelled: false
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalFare" }
            }
        },
        {
            $project: {
                _id: 0,
                monthlyRevenue: "$totalRevenue",
            }
        }
    ])
    if (!monthlyRevenue)
        throw new ApiError(500, "Something went wrong while fetching monthly revenue")

    const yeralyRevenue = await Booking.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), 0, 1),
                    $lt: new Date(new Date().getFullYear() + 1, 0, 1)
                },
                isCancelled: false
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalFare" }
            }
        },
        {
            $project: {
                _id: 0,
                annualRevenue: "$totalRevenue"
            }
        }
    ])
    if (!yeralyRevenue)
        throw new ApiError(500, "Something went wrong while fetching annual revenue")


    const activeUser = await User.aggregate([
        {
            $match: {
                isActive: true,
            },
        },
        {
            $count: "activeUsers"
        }
    ])
    if (!activeUser)
        throw new ApiError(500, "Something went wrong while fetching active user details")


    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                createdAt: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
    if (!newUsers)
        throw new ApiError(500, "Something went wrong while fetching new user details")

    return res.status(200).json(
        new ApiResponse(
            200,
            { noOfTrains: noOfTrains[0], noOfBookings, dailyRevenue, monthlyRevenue, yeralyRevenue, activeUser, newUsers },
            "All details fetched successfully"
        )
    )
})

export {
    addNewAdmin,
    loginAdmin,
    logOutAdmin,
    getAdmin,
    deleteAdmin,
    refreshAccessToken,
    getAllInformation
}