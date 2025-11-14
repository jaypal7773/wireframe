import express from "express";
import {
  saveDeviceToken,
  sendNotification,
  getUserNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Save user device token
router.post("/save-token", saveDeviceToken);

// Send notification to user
router.post("/send", sendNotification);

// Get notification history
router.get("/history/:userId", getUserNotifications);

export default router;
