import { Router } from "express";
import { isAdmin } from "../Middlewares/auth.middleware.js"
import { addSchedule, deleteSchedule, getAllSchedule, updateSchedule } from "../Controllers/schedule.controller.js";

const router = Router()

router.route("/add-schedule").post( addSchedule)
router.route("/get-schedule").get( getAllSchedule)
router.route("/delete-schedule/c/:trainId").delete(isAdmin, deleteSchedule)
router.route("/update-schedule/c/:trainId").patch(isAdmin, updateSchedule)

export default router