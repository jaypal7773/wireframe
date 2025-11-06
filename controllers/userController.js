import userModel from "../models/userModel.js"

export const signupController = async(req,res) => {
    try{
        const {name, number, email, password, confirmPassword} = req.body;
        
        //validation
        if(!name || !number || !email || !password || !confirmPassword) {
            return res.status(404).send({
                success: false,
                message: "Required All Fields"
            })
        }

        //check password match
        if(password !== confirmPassword){
            return res.status(404).send({
                success: false,
                message: "Password and Confirm Password do not match"
            })
        }

        //existing user email
        const existing = await userModel.findOne({email})
        if(existing){
            return res.status(404).send({
                success: false,
                message: "User Already Existing"
            })
        }
        
        //user created
        const users = await userModel.create({
            name,
            number,
            email,
            password,
            confirmPassword
        })
        res.status(201).send({
            success: true,
            message: "User Created Successfully, Please Login",
            users
        })
        
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error In Sign Up API"
        })
    }
}