import { Router } from "express";
import { changePassword, getCurrentUser, logOutuser, loginUser, registerUser, updateUserDetails } from "../Controllers/user.cotroller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logOutuser)
router.route("/get-user").get(verifyJWT, getCurrentUser)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/update-details").patch(verifyJWT, updateUserDetails)

export default router;