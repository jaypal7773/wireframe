import express from "express";
import { isAdmin, isAuth } from "../middlewares/authmiddleware.js";
import { deletePaymentController, getPaymentController, onePaymentController, paymentCreateController } from "../controllers/paymentController.js";

const router = express.Router();

// ROUTES

// payment create
router.post("/create-payment", isAuth, isAdmin, paymentCreateController);

// payment fetch
router.get("/payment-fetch",isAuth, isAdmin, getPaymentController)

// one payment detail fetch
router.get("/one-payment-fetch/:id", isAuth, isAdmin, onePaymentController)

// payment detele 
router.delete("/delete-payment/:id", isAuth, isAdmin, deletePaymentController)

// Export router
export default router;
