import { Router } from "express";
import { addNewAdmin, deleteAdmin, getAdmin, getAllInformation, logOutAdmin, loginAdmin } from "../Controllers/admin.controller.js";
import { isAdmin } from "../Middlewares/auth.middleware.js";


const router = Router()

router.route("/add-admin").post(isAdmin,addNewAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(isAdmin, logOutAdmin)
router.route("/get-admin").get(isAdmin, getAdmin)
router.route("/delete-admin/c/:adminId").delete(isAdmin, deleteAdmin)
router.route("/admin-panel-details").get(isAdmin, getAllInformation)
export default router;