// // middleware/auth.js
// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
// import tokenBlackList from "../models/tokenBlackList.js";

// // ==================== USER ========================
// export const isAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     // token exists
//     if (!token) {
//       return res.status(401).send({
//         success: false,
//         message: "Unauthorized - No token provided",
//       });
//     }

//     const blacklisted = await tokenBlackList.findOne  ({ token })
//     if (blacklisted) {
//       return res.status(404).send({
//         success: false,
//         message: "Token is blacklisted"
//       })
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user decoded ID
//     const user = await userModel.findById(decoded._id);

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error.message);
//     return res.status(401).send({
//       success: false,
//       message: "Unauthorized - Invalid or expired token",
//     });
//   }
// };


// // ====================== ADMIN ============================
// export const isAdmin = async (req, res, next) => {
//   try {
//     // Check if user info exists
//     if (!req.user) {
//       return res.status(401).send({
//         success: false,
//         message: "Unauthorized - No user found"
//       });
//     }

//     // Check admin role
//     if (req.user.role !== "admin") {
//       return res.status(403).send({
//         success: false,
//         message: "Access denied - Admins only"
//       });
//     }

//     // Proceed to next middleware
//     next();

//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error in admin authentication",
//       error: error.message
//     });
//   }
// };

import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ✅ USER AUTH MIDDLEWARE
export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - No token provided"
      });
    }

    // VERIFY TOKEN
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // FIND USER FROM DB
    req.user = await userModel.findById(decoded._id).select("-password");

    if (!req.user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in authentication middleware",
      error: error.message
    });
  }
};

// ✅ ADMIN AUTH MIDDLEWARE
export const isAdmin = async (req, res, next) => {
  try {
    // Ensure user exists
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - No user info found"
      });
    }

    // Check if role is admin
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied - Admins only"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in admin verification",
      error: error.message
    });
  }
};
