import express from "express";
import {getOrders, createCheckoutSession} from "../controllers/order.controller.js"
import { isAuthenticated } from "../middlwares/isAuthenticated.js";
const router = express.Router()

router.route("/").post(isAuthenticated, getOrders)
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession)
// router.route("/webhook").post()

export default router;
