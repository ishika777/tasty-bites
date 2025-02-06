import express from "express";
import { createRestaurant, getRestaurant, updateRestaurant, getRestaurantOrders, updateOrderStatus, searchRestaurant, getRestaurantDetails } from "../controllers/restaurant.controller.js";
import { isAuthenticated } from "../middlwares/isAuthenticated.js";
import upload from "../middlwares/multer.js";
const router = express.Router()

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant)
router.route("/").get(isAuthenticated, getRestaurant)
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant)
router.route("/order").get(isAuthenticated, getRestaurantOrders)
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus)
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant)
router.route("/:id").get(isAuthenticated, getRestaurantDetails)

export default router;
