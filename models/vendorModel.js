import mongoose from "mongoose";

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  vendorId: {
    type: String,
    required: [true, "Vendor ID is required"]
  },
  contactNo: {
    type: Number,
    required: [true, "Contact number is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    // unique: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Gender is required"]
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"]
  },
  city: {
    type: String,
    required: [true, "City is required"]
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"]
  },
  country: {
    type: String,
    required: [true, "Country is required"]
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },
  bills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill"
    }
  ]
}, { timestamps: true });

const vendorModel = mongoose.model("Vendor", vendorSchema);

export default vendorModel;
