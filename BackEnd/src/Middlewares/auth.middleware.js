import { ApiError } from "../Utils/ApiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/User.model.js";
import { Admin } from "../Models/admin.model.js";

// Utility function for token verification
const verifyToken = async (token) => {
    if (!token) throw new ApiError(401, "Unauthorized request");

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decodedToken;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired. Please log in again.");
        }
        throw new ApiError(401, "Invalid access token");
    }
};

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = await verifyToken(token);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "Invalid access token");

    req.user = user;
    next();
});

export const isAdmin = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = await verifyToken(token);

    const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
    if (!admin) throw new ApiError(403, "Forbidden: Admin access required");

    req.admin = admin;
    next();
});
