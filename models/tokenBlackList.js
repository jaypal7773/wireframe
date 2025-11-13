import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true
    },
    expiresAt: {
        type: Date,
        require: false
    }
})

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema)

