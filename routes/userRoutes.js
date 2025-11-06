import express from "express"
// import { isAuth } from "../middlewares/authmiddleware"
import { signupController } from "../controllers/userController.js"

//ROUTER OBJECT
const routes = express.Router()

//routes

//sign up
routes.post('/singup', signupController)

export default routes

