import { User } from "../Models/User.model.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import asyncHandler from "../Utils/asyncHandler.js"
import bcrypt from "bcrypt"

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, mobileNo, name, password } = req.body
    if (!username)
        throw new ApiError(400, "Username is required")
    if (!email)
        throw new ApiError(400, "Email is required")
    if (!mobileNo)
        throw new ApiError(400, "Mobile No is required")
    if (!name)
        throw new ApiError(400, "Name is required")
    if (!password)
        throw new ApiError(400, "Password is required")
    if (password.trim().length < 6)
        throw new ApiError(400, "Password must have 6 or more characters")

    const existUser = await User.findOne(
        {
            $or: [{ username }, { email }, { mobileNo }]
        }
    )
    if (existUser)
        throw new ApiError(401, "User already exist with same username or Mobile No or email")

    const newUser = await User.create(
        {
            username: username.toLowerCase(),
            email,
            name,
            mobileNo,
            password,
            isActive: true,
            lastLogin: Date.now()
        }
    )
    if (!newUser)
        throw new ApiError(500, "Something went wrong while Usering new user.")

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(newUser._id)

    const user = await User.findById(newUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).json(
            new ApiResponse(
                200,
                user,
                "User registered successfully"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username)
        throw new ApiError(400, "Username is required")
    if (!password)
        throw new ApiError(400, "Password is required to login")

    const user = await User.findOne({ username })
    if (!user)
        throw new ApiError(400, "User does not exist")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid)
        throw new ApiError(400, "Password is incorrect")

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findByIdAndUpdate(
        user._id,
        {
            isActive: true,
            lastLogin: Date.now()
        }
    ).select("-password -refreshToken")

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
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        )
})

const logOutuser = asyncHandler(async (req, res) => {

    const loggedOutUser = await User.findByIdAndUpdate(req.user?._id,
        {
            $unset: { refreshToken: 1 },
            isActive: false
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
                "User logged out"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")
    if (!user)
        throw new ApiError(401, "User not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User found successfully"
        )
    )
})

const changePassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    if (!password)
        throw new ApiError(400, "Password is required")

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.user?._id, { password: hashPassword })
    if (!user)
        throw new ApiError(500, "Something went wrong while updating password")

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { name, username, email, mobileNo } = req.body
    if (!name && !username && !email && !mobileNo)
        throw new ApiError(400, "Data is required")

    const newDetails = {}
    if (name) newDetails.name = name
    if (username) newDetails.username = username
    if (email) newDetails.email = email
    if (mobileNo) newDetails.mobileNo = mobileNo

    const user = await User.findByIdAndUpdate(req.user._id, newDetails)
    if (!user)
        throw new ApiError(500, "Something went wrong while updating details")

    const updatedDetails = await User.findById(req.user._id).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedDetails,
            "Details updated successfully"
        )
    )
})

export { registerUser, loginUser, logOutuser, getCurrentUser, changePassword, updateUserDetails }