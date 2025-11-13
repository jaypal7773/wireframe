import mongoose from "mongoose";

// Payment Schema
const paymentSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: [true, "Vendor ID is required"]
  },
  billNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    required: [true, "Bill number is required"]
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  paymentMode: {
    type: String,
    enum: ["Cash", "Credit", "UPI", "Bank Transfer", "Cheque"],
    required: [true, "Payment mode is required"]
  },
  paymentEmi: {
    type: String, 
    required: false
  },
  referenceNumber: {
    type: String,
    default: function () {
      return "#REF" + Date.now();
    }
  },
  nextDueDate: {
    type: Date,
    required: false
  },
  paymentDescription: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["Pending", "Complete", "Failed"],
    default: "Pending"
  },
  
}, { timestamps: true });



// AUTO GENERATE NEXTDUEDATE

paymentSchema.pre("save", function (next) {
  if (!this.nextDueDate) {
    const currentDate = new Date(this.paymentDate || Date.now());
    if (this.paymentEmi && this.paymentEmi.includes("/")) {
      const [currentEmi, totalEmi] = this.paymentEmi.split("/").map(Number);
      if (currentEmi < totalEmi) {
        this.nextDueDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
      } else {
        this.nextDueDate = null;
      }
    } else {
      this.nextDueDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
    }
  }
  next();
});

const paymentModel = mongoose.model("Payment", paymentSchema);
export default paymentModel;
