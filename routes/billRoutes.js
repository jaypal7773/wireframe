import express from "express";
import { isAdmin, isAuth } from "../middlewares/authmiddleware.js";
import { billCreateController, deleteBillController, getAllBillController, oneBillController, updateBillController } from "../controllers/billController.js";


const router = express.Router()

// bill routes

// bill create 
router.post("/create", isAuth, isAdmin, billCreateController)

// bills fetch
router.get("/fetch-bills", isAuth, isAdmin, getAllBillController)

// one bill fetch
router.get("/one-bill/:id" , isAuth, isAdmin, oneBillController)

// update bill 
router.put("/update-bill/:id", isAuth, isAdmin, updateBillController);

// delete bill
router.delete("/delete-bill/:id", isAuth, isAdmin, deleteBillController)

export default router