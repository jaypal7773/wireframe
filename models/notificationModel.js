import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    token: {
  type: [String],
  required: true
},
    data: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
