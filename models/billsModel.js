import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: [true, "Vendor ID is required"]
  },
  billName: {
    type: String,
    required: [true, "Bill name is required"]
  },
  billNumber: {
    type: String,
    required: [true, "Bill number is required"]
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  depositeAmount: {
    type: Number,
    required: [true, "Deposit amount is required"]
  },
  remainingBalance: {
    type: Number,
    required: [true, "Remaining balance is required"]
  },
  paymentMode: {
    type: String,
    enum: ["Cash", "Credit", "Bank Transfer", "UPI", "Cheque"],
    required: [true, "Payment mode is required"]
  },
  referenceNumber: {
    type: String,
    required: false
  },
  emi: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },
  emiPaymentMode: {
    type: String,
    enum: ["Monthly", "Quarterly", "Yearly"],
    required: false
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"]
  },
  uploadBill: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["In Process", "Complete", "Pending"],
    default: "In Process"
  },
   payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    }
  ]
}, { timestamps: true });

const billModel = mongoose.model("Bill", billSchema);

export default billModel;
