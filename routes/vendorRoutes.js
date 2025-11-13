import express from "express";
import { getOneVendor, getVendorFullDetails, getVendors, vendorCreate, vendorDelete, vendorUpdate } from "../controllers/vendorController.js";
import { isAdmin, isAuth } from "../middlewares/authmiddleware.js";


const router = express.Router()

//vendor routes

// CREATE VENDOR ROUTES
router.post("/create", isAuth, isAdmin, vendorCreate);

// VENDORS FETCH
router.get("/get-vendors",isAuth, isAdmin, getVendors)

// ONE VENDOR FETCH
router.get("/one-vendor/:id",isAuth, isAdmin, getOneVendor)

// VENDOR UPDATE
router.put("/vendor-update/:id",isAuth, isAdmin, vendorUpdate)

// VENDOR DELETE
router.delete("/vendor-delete/:id", isAuth, isAdmin, vendorDelete)

// FULL VENDER DETAILS WITH BILLS & PAYMENTS
router.get("/full-details-vender/:id", isAuth, isAdmin, getVendorFullDetails)

export default router