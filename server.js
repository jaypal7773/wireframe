import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js"; 

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

app.use(express.static("public"));


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//routes
import userRoutes from "./routes/userRoutes.js"
import vendorRoutes from "./routes/vendorRoutes.js"
import billRoutes from "./routes/billRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js";





//routes connect
app.use("/api/user", userRoutes)
app.use("/api/vendor-details", vendorRoutes)
app.use("/api/bill", billRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/notification", notificationRoutes);

// Port setup
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
