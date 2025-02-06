import express from "express";
import {addMenu, editMenu} from "../controllers/menu.controller.js"
import { isAuthenticated } from "../middlwares/isAuthenticated.js";
import upload from "../middlwares/multer.js";
const router = express.Router()

router.route("/").post(isAuthenticated, upload.single("image"), addMenu)
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu)

export default router;
