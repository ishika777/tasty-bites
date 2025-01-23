import express from "express";
import {addMenu, editMenu} from "../controllers/menu.controller"
import { isAuthenticated } from "../middlwares/isAuthenticated";
import upload from "../middlwares/multer";
const router = express.Router()

router.route("/").post(isAuthenticated, upload.single("image"), addMenu)
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu)

export default router;
