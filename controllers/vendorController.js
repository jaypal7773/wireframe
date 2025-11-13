import vendorModel from "../models/vendorModel.js";
// import billModel from "../models/billModel.js";
// import paymentModel from "../models/paymentModel.js";

// export const vendorCreate = async (req, res) => {
//   try {
//     const vendor = await vendorModel.create(req.body)
//     res.status(200).send({
//       success: true,
//       message: "Vendor Created Successfully",
//       vendor
//     })
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error in Vendor Create API",
//       error: error.message
//     })
//   }
// }

// ==================== CREATE VENDOR ===========================
// export const vendorCreate = async (req, res) => {
//     try {
//         const { name,
//             vendorId,
//             contactNo,
//             email,
//             address,
//             totalAmountDue,
//             totalPayment,
//             nextDueDate,
//             dateOfJoining,
//             totalTransaction,
//             completeTransaction,
//             inProgressTransaction,
//             bills
//         } = req.body

//         //validation
//         if (!name || !vendorId || !contactNo || !email || !address) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Please require all field"
//             })
//         }
//         // check vendor already exists
//         const existsVendor = await vendorModel.findOne({ email, vendorId })
//         if (existsVendor) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Vendor already existsing"
//             })
//         }

//         //vendor create
//         const vendor = await vendorModel.create({
//             name,
//             vendorId,
//             contactNo,
//             email,
//             address,
//             totalAmountDue: totalAmountDue ||0,
//             totalPayment: totalPayment || 0,
//             nextDueDate,
//             dateOfJoining,
//             totalTransaction: totalTransaction || 0,
//             completeTransaction: completeTransaction || 0,
//             inProgressTransaction: inProgressTransaction || 0,
//             bills: bills || []
//         })
//         res.status(201).send({
//             success: true,
//             message: "Vendor created successfully with bills",
//             vendor
//         })
//     } catch (error) {
//         return res.status(500).send({
//             success: false,
//             message: "Error In Vendor Create API"
//         })
//     }
// }
export const vendorCreate = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNo,
      vendorId,
      gender,
      dateOfBirth,
      address,
      city,
      postalCode,
      country,
    //   bills
    } = req.body;

    // Validation
    if (!name || !vendorId || !contactNo || !email || !address) {
      return res.status(400).send({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Check vendor already exists
    const existsVendor = await vendorModel.findOne({ $or: [{ email }, { vendorId }] });
    if (existsVendor) {
      return res.status(400).send({
        success: false,
        message: "Vendor already exists"
      });
    }

    // Create vendor
    const vendor = await vendorModel.create({
      name,
      email,
      contactNo,
      vendorId,
      gender,
      dateOfBirth,
      address,
      city,
      postalCode,
      country,
    //   totalAmountDue: totalAmountDue || 0,
    //   totalPayment: totalPayment || 0,
    //   nextDueDate,
    //   dateOfJoining,
    //   totalTransaction: totalTransaction || 0,
    //   completeTransaction: completeTransaction || 0,
    //   inProgressTransaction: inProgressTransaction || 0,
    //   bills: bills || []
    });

    res.status(201).send({
      success: true,
      message: "Vendor created successfully",
      vendor
    });
  } catch (error) {
    console.error("Error in vendorCreate:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Vendor Create API",
      error: error.message
    });
  }
};

// =============== USER FETCH ======================
export const getVendors = async(req,res) => {
    try{
        const vendors = await vendorModel.find({})
        if(!vendors){
            return res.status(404).send({
                success: false,
                message: "Vendors not fetch"
            })
        }
        res.status(200).send({
            success: true,
            message: "Vendors fetch successfully",
            vendors
        })
    }catch(error) {
        return res.status(500).send({
            success: false,
            message: "Error In Vendor Create API"
        })
    }
}

// ===================== USER FETCH BY ID ==========================
export const getOneVendor = async(req,res) => {
    try{
        const vendor = await vendorModel.findById(req.params.id)
        if(!vendor){
            return res.status(404).send({
                success: false,
                message: "Vendor not fetch"
            })
        }
        res.status(201).send({
            success: true,
            message: "Vendor fetch successfully",
            vendor
        })
    }catch(error) {
        return res.status(500).send({
            success: false,
            message: "Error In One Vandor API"
        })
    }
}

// ================= VENDOR UPDATE ==================
// export const vendorUpdate = async(req,res) => {
//     try{
//         const vendor = await vendorModel.findByIdAndUpdate(req.params._id , req.body, {
//             new: true
//         })
//         if(!vendor){
//             return res.status(404).send({
//                 success: false,
//                 message: "Vendor not found",
//                 vendor
//             })
//         }
//         res.status(201).send({
//             success: true,
//             message: "Vendor update successfully"
//         })
//     }catch{
//         return res.status(500).send({
//             success: false,
//             message: "Error In Vendor Update API"
//         })
//     }
// }
export const vendorUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await vendorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Vendor updated successfully",
      vendor,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Vendor Update API",
      error: error.message,
    });
  }
};

// ====================== VENDOR DELETE =========================
export const vendorDelete = async(req,res) => {
    try{
        const vendorDel = await vendorModel.findByIdAndDelete(req.params.id)
        if(!vendorDel) {
            return res.status(404).send({
                success: false,
                message: "Vendor not found"
            })
        }
        res.status(201).send({
            success: true,
            message: "Vendor Delete Successfully"
        })
    }catch(error) {
        return res.status(500).send({
            message: "Error In Vendor Delete API",
            success: false
        })
    }
}

// complete vender detail 

export const getVendorFullDetails = async (req,res) => {
  try{
    const { id } = req.params

    // find vender with bills and payment
     const vendor = await vendorModel.findById(id)
      .populate({
        path: "bills",
        model: "Bill",
        populate: {
          path: "payments",
          model: "Payment"
        }
      });

      if(!vendor) {
        return res.status(404).send({
          success: false,
          message: "Vender Not Found"
        })
      }

      let totalAmountDue = 0
      let totalPayment = 0
      let completeTransaction = 0
      let inProgressTransaction = 0
      let nextDueDate = null

      vendor.bills.forEach(bill => {
        totalAmountDue += bill.totalDueAmount || 0
        totalPayment += bill.totalPaidAmount || 0

        if (bill.status === "Complete") completeTransaction++
        else inProgressTransaction++

        if(!nextDueDate || (bill.nextDueDate && bill.nextDueDate < nextDueDate)){
          nextDueDate = bill.nextDueDate
        }
      })

      // update vendor fields in Db 
      await vendorModel.findByIdAndUpdate(vendor._id, {
        totalAmountDue,
        totalPayment,
        nextDueDate,
        totalTransaction: vendor.bills.length,
        completeTransaction,
        inProgressTransaction
      })


      res.status(201).send({
        success: true,
        message: "Vender details fetched successfully",
        vendor: {
          ...vendor._doc,
          totalAmountDue,
          totalPayment,
          nextDueDate,
          totalTransaction: vendor.bills.length,
          completeTransaction,
          inProgressTransaction
        }
      })
  }catch(error){
    return res.status(500).send({
      success: false,
      message: "Error In Vendor Full Details API"
    })
  }
}