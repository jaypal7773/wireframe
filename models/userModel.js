import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "name is required"]
    },
    number: {
        type: Number,
        require: [true, "number is required"]
    },
    email: {
        type: String,
        require: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "password is required"],
    },
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

//hash password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

//compare password
UserSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}
UserSchema.methods.comparePass = async function (plainPass) {
    return await bcrypt.compare(plainPass, this.confirmPassword)
}

//JWT token
UserSchema.methods.genrateToken = function () {
    return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

export const userModel = mongoose.model("User", UserSchema)
export default userModel

