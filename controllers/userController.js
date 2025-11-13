import userModel from "../models/userModel.js"
import JWT from "jsonwebtoken";
import tokenBlacklist from "../models/tokenBlackList.js"
import sendMail from "../utils/sendEmail.js";


// =============== USER SIGN UP CONTROLLER ====================

// export const signupController = async(req,res) => {
//     try{
//         const {name, number, email, password, confirmPassword} = req.body;
        
//         //validation
//         if(!name || !number || !email || !password || !confirmPassword) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Required All Fields"
//             })
//         }

//          const userResponse = users.toObject();
//     delete userResponse.password;
//     delete userResponse.confirmPassword;

//         //check password match
//         if(password !== confirmPassword){
//             return res.status(404).send({
//                 success: false,
//                 message: "Password and Confirm Password do not match"
//             })
//         }


//         //existing user email
//         const existing = await userModel.findOne({email})
//         if(existing){
//             return res.status(404).send({
//                 success: false,
//                 message: "User Already Existing"
//             })
//         }
        
//         //user created
//         const users = await userModel.create({
//             name,
//             number,
//             email,
//             password,
//             confirmPassword
//         })
//         res.status(201).send({
//             success: true,
//             message: "User Created Successfully, Please Login",
//             users : userResponse
//         })
        
//     }catch(error){
//         return res.status(500).send({
//             success: false,
//             message: "Error In Sign Up API",
//         })
//     }
// }
export const signupController = async (req, res) => {
  try {
    const { name, number, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !number || !email || !password || !confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Existing user check
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user
    const users = await userModel.create({
      name,
      number,
      email,
      password,
      role
    //   confirmPassword,
    });

    // Convert to plain object and remove sensitive data

    const userResponse = users.toObject();
    delete userResponse.password;


    // Send response
    res.status(201).send({
      success: true,
      message: "User Created Successfully, Please Login",
      users: userResponse, 
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in Signup API",
      error: error.message,
    });
  }
};


// ================= LOGIN CONTROLLER ========================

export const loginController = async(req,res) => {
    try{
        const { email, password} = req.body;
        //validation
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Please add email or password"
            })
        }

        // user check
        const user = await userModel.findOne({email})
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

        //check password
        const isMatch = await user.comparePassword(password)
        if(!isMatch) {
            return res.status(404).send({
                success: false,
                message: "Invalid Credentials"
            })
        }

        //tolen
        const token = await user.genrateToken()
        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false
        })
        .send({
            message: "Login Successfully",
            success: true,
            token,
            user
        })
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error In Login Controller API"
        })
    }
}

// =============== GET ALL USERS ===================
export const getUserController = async (req,res) => {
    try{
      const user = await userModel.findById(req.params.id)
      user.password = undefined
      if(!user) {
        return res.status(404).send({
          message: "User not Found",
          success: false
        })
      }
      res.status(200).send({
        success: true,
        message: "User Fetch Succesfully",
        user
      })
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error In All Users API"
        })
    }
}

// ================== UPDATE USER ======================
export const updateUserController = async (req,res) => {
  try{
      const {name, number, email} = req.body
    const user = await userModel.findByIdAndUpdate(req.user._id,
      {name, number, email},
      {new: true}
    )
    if(!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      })
    }

    //validation and update
    // if(name) user.name = name;
    // if(number) user.number = number;
    // if(email) user.email = email
    
    //user save
    await user.save()

    res.status(200).send({
      success: true,
      message: "User update successfully",
      user
    })
  }catch(error){
    return res.status(500).send({
      success: false,
      message: "Error In Update User API"
    })
  }
}

// ============== UPDATE PASSWORD =========================
export const updatePasswordController = async(req,res) => {
  try{
    const user = await userModel.findById(req.user._id)
    const { oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
      return res.status(404).send({
        success: false,
        message: "Please provide old password and new password"
      })
    }

    // check old password
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid old password"
      })
    }
    user.password = newPassword
    await user.save()

    res.status(201).send({
      success: true,
      message: "Password update successfully"
    })
  }catch(error){
    return res.status(500).send({
      message: "Error In Update Password API",
      success: false
    })
  }
}


// ==================== LOGOUT USER =======================
export const logoutController = async (req, res) => {
  try{
    const { token } = req.cookies
    if(token) {
      await tokenBlacklist.create({
        token
      })
    }
     res
      .cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send({
        success: true,
        message: "Logout Successfully",
      });
    }catch(error){
     return res.status(500).send({
      success: false,
      message: "Error In Logout API"
     })
  }
  }
// export const logoutController = async (req, res) => {
//     try {
//         const {token} = req.cookies;
//         if(token){
//             await tokenBlacklist.create({
//                 token
//                 // expiresAt: new Date(Date.now() + 24*60*60*1000)
//             })
//         }
//         res.status(200)
//             .cookie("token", "", {
//                 expires: new Date(0),
//                 httpOnly: true,
//                 sameSite: "none",
//                 secure: true,

//             })
//             .send({
//                 message: "Logout Successfully",
//                 success: true,
//             });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({
//             message: "Error In Logout API",
//             success: false
//         })
//     }
// }

// // ====================== FORGOT PASSWORD  ===================
// export const forgotPasswordController = async (req,res) => {
//   try{
//     const {email} = req.body
//     //validayion
//     if(!email){
//       return res.status(404).send({
//         success: false,
//         message: "Email is required"
//       })
//     }

//     // find user
//     const user = await userModel.findOne({email})
//     if(!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found"
//       })
//     }

//     // generate otp 
//     const otp = Math.floor(100000 + Math.random() * 900000).toString()

//     // save OTP + Exprie
//     user.resetPasswordOTP = otp
//     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
//     await user.save()

//     // Email Template
//      const html = `
//       <div style="font-family:Arial,sans-serif;line-height:1.6;">
//         <h2>Password Reset Request</h2>
//         <p>Hello ${user.name},</p>
//         <p>Your one-time password (OTP) to reset your password is:</p>
//         <h3 style="color:#007bff;font-size:24px;">${otp}</h3>
//         <p>This OTP will expire in <b>10 minutes</b>.</p>
//         <p>If you didn’t request this, please ignore this email.</p>
//         <br/>
//         <p>Regards,<br/>Support Team</p>
//       </div>
//     `;

//     await sendMail(user.email, "Your OTP for Password Reset", html)

//     res.status(200).send({
//       success: true,
//       message: "OTP sent to your registered email address"
//     })
//   }catch(error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error In Forgot Password API",
//       error
//     })
//   }
// }

// // ================= VERIFY OTP =================
// export const verifyOTPController = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).send({
//         success: false,
//         message: "Email and OTP are required",
//       });
//     }

//     const user = await userModel.findOne({ email });

//     if (
//       !user ||
//       user.resetPasswordOTP !== otp ||
//       user.resetPasswordExpires < Date.now()
//     ) {
//       return res.status(400).send({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "OTP verified successfully",
//     });
//   } catch (error) {
//     console.error("Verify OTP Error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error verifying OTP",
//       error: error.message,
//     });
//   }
// };


// // ================= RESET PASSWORD =================
// export const resetPasswordController = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     if (!email || !otp || !newPassword) {
//       return res.status(400).send({
//         success: false,
//         message: "Email, OTP, and new password are required",
//       });
//     }

//     const user = await userModel.findOne({ email });

//     if (
//       !user ||
//       user.resetPasswordOTP !== otp ||
//       user.resetPasswordExpires < Date.now()
//     ) {
//       return res.status(400).send({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     //  Update password and clear OTP fields
//     user.password = newPassword;
//     user.resetPasswordOTP = null;
//     user.resetPasswordExpires = null;
//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "Password reset successfully. Please login again.",
//     });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error resetting password",
//       error: error.message,
//     });
//   }
// };


// ================== FORGOT PASSWORD (OTP) ==================
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ success: false, message: "Email is required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>Your OTP to reset your password is:</p>
        <h3 style="color:#007bff;">${otp}</h3>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `;

    await sendMail(user.email, "Wireframe Password Reset OTP", html);

    res.status(200).send({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in Forgot Password API",
      error: error.message,
    });
  }
};

// ================== VERIFY OTP ==================
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).send({ success: false, message: "Email and OTP required" });

    const user = await userModel.findOne({ email });
    if (!user || user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
      return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
    }

    res.status(200).send({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error verifying OTP", error: error.message });
  }
};

// ================== RESET PASSWORD ==================
export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).send({ success: false, message: "All fields are required" });

    const user = await userModel.findOne({ email });
    if (!user || user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
      return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error resetting password", error: error.message });
  }
};

