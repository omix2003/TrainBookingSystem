import { Router } from "express";
import { isAdmin, verifyJWT } from "../Middlewares/auth.middleware.js"
import { addComment, addTrainDetails, deleteTrain, findTrainById, findTrainByName, findTrainByNo, getActiveDays, getTrainSuggestion, searchTrainByJourney, updateTrainDetails, getComment, getAllTrains } from "../Controllers/train.controller.js";

const router = Router()

router.route("/add-train").post(isAdmin, addTrainDetails)
router.route("/search-train-by-no/c/:trainNo").get(findTrainByNo)
router.route("/search-train-by-name/c/:trainName").get(findTrainByName)
router.route("/find-train-by-Id/c/:trainId").get(findTrainById)
router.route("/update-details/c/:trainId").patch(isAdmin, updateTrainDetails)
router.route("/delete-train/c/:trainId").delete(isAdmin, deleteTrain)
router.route("/search-train-by-journey").get(searchTrainByJourney)
router.route("/train-suggestions").get(getTrainSuggestion)
router.route("/get-active-days/c/:trainId").get(getActiveDays)
router.route("/add-comment/c/:trainId").post(verifyJWT, addComment)
router.route("/get-comment/c/:trainId").get(getComment)
router.route("/get-all-trains").get(isAdmin, getAllTrains)

export default router;