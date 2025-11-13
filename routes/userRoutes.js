import express from "express"
import { isAuth } from "../middlewares/authmiddleware.js"
import { forgotPasswordController, getUserController, loginController, logoutController, resetPasswordController, signupController, updatePasswordController, updateUserController, verifyOTPController } from "../controllers/userController.js"

//ROUTER OBJECT
const routes = express.Router()

//routes

// sign up
routes.post('/singup', signupController)

// login 
routes.post('/login', loginController)

// User find
routes.get("/userget/:id",isAuth, getUserController)

// update user
routes.put('/updateuser', isAuth, updateUserController)

// update password
routes.post('/update-password', isAuth, updatePasswordController)

// logout user
routes.get('/logout-user', isAuth, logoutController)

// forgot password 
routes.post("/forgot-password", forgotPasswordController)
routes.post("/verify-otp", verifyOTPController);
routes.post("/reset-password", resetPasswordController);
export default routes


