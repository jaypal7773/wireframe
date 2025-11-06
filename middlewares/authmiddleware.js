// middleware/auth.js
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; 

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // token exists
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user decoded ID
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).send({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
