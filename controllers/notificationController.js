import admin from "../config/firebaseAdmin.js";
import Notification from "../models/notificationModel.js";
import DeviceToken from "../models/deviceTokenModel.js";

// Save device token
export const saveDeviceToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).send({ success: false, message: "userId & token required" });
    }

    const exists = await DeviceToken.findOne({ token });

    if (!exists) {
      await DeviceToken.create({ userId, token });
    }

    res.status(200).send({
      success: true,
      message: "Device token saved successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to save token",
      error: error.message,
    });
  }
};

// Send Push Notification
export const sendNotification = async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).send({
        success: false,
        message: "userId, title, body are required",
      });
    }

    // get all tokens of user
    const tokens = await DeviceToken.find({ userId }).select("token");

    if (tokens.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No token found for user",
      });
    }

    const messages = tokens.map((item) => ({
      token: item.token,
      notification: { title, body },
      data: data || {}
    }));

    const responses = await Promise.all(
      messages.map((msg) =>
        admin.messaging().send(msg).catch((err) => err.message)
      )
    );

    // save notification log
    await Notification.create({
      userId,
      title,
      body,
      token: tokens.map((t) => t.token).join(","),
      data,
      status: "sent",
    });

    res.status(200).send({
      success: true,
      message: "Notifications sent",
      responses,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error sending notification",
      error: error.message,
    });
  }
};

// Get notification history
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      notifications: logs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};
