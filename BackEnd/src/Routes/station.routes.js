import { Router } from "express";
import { getStationSuggestions, addStation, updateStation, deleteStation, getAllStation } from "../Controllers/station.controller.js";
import { isAdmin } from "../Middlewares/auth.middleware.js";

const router = Router()

router.route("/add-station").post(isAdmin, addStation)
router.route("/update-station/c/:stationId").patch(isAdmin, updateStation)
router.route("/station-suggestions").get(getStationSuggestions)
router.route("/delete-station/c/:stationId").delete(isAdmin, deleteStation)
router.route("/get-station").get(getAllStation)
export default router