import billModel from "../models/billsModel.js";
import vendorModel from "../models/vendorModel.js";

export const billCreateController = async (req, res) => {
  try {
   
    const {
      vendorId,
      billName,
      billNumber,
      totalAmount,
      depositeAmount,
      remainingBalance,
      paymentMode,
      referenceNumber,
      emi,
      emiPaymentMode,
      dueDate,
      uploadBill,
      status
    } = req.body;

    //  Validation
    if (
      !vendorId ||
      !billName ||
      !billNumber ||
      !totalAmount ||
      !depositeAmount ||
      !remainingBalance ||
      !paymentMode ||
      !referenceNumber ||
      !emi ||
      !emiPaymentMode ||
      !dueDate ||
      !uploadBill ||
      !status
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    //  Check vendor existence
    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: "Vendor not found",
      });
    }

    // Create bill
    const billGenerate = await billModel.create({
      vendorId,
      billName,
      billNumber,
      totalAmount: Number(totalAmount),
      depositeAmount: Number(depositeAmount),
      remainingBalance: Number(remainingBalance),
      paymentMode,
      referenceNumber,
      emi,
      emiPaymentMode,
      dueDate,
      uploadBill,
      status,
    });

    // link bill to vender
    await vendorModel.findByIdAndUpdate(
      vendorId,
      { $push: { bills: billGenerate._id}},
      { new: true}
    )

    // Success response
    res.status(201).send({
      success: true,
      message: "Bill generated successfully",
      bill: billGenerate
    });
  } catch (error) {
    console.error("Error In Bill Create API:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Bill Create API",
      error: error.message,
    });
  }
};

// ================= GET ALL BILL ====================
export const getAllBillController = async(req,res) => {
  try{
    const bills = await billModel.find({})
     
    // validation
    if(!bills) {
      return res.status(404).send({
        success: false,
        message: "Not fetch bills"
      })
    }
    res.status(201).send({
      success: true,
      message: "All bills fetch successfully",
      bills
    })
  }catch(error){
    return res.status(500).send({
      success: false,
      message: "Error In All Bills API"
    })
  }
}

// =================== ONE BILL FETCH ===================
export const oneBillController = async(req,res) => {
  try{
    const oneBill = await billModel.findById(req.params.id)

    // validation
    if(!oneBill){
      return res.status(404).send({
        success: false,
        message: "Not fetch bill"
      })
    }
    res.status(201).send({
      success: true,
      message: "Bill fetch successfully",
      oneBill
    })
  }catch(error) {
    return res.status(500).send({
      success: false,
      message: "Error In One Bill Fetch API"
    })
  }
}

// ======================= UPDATE BILL ===================
// export const updateBillController = async(req,res) => {
//   try{
//     const id = req.params.id
//     const updateBill = await billModel.findByIdAndUpdate(id, req.body, {
//       new:true
//     })

//     // validation
//     if(!updateBill){
//       return res.status(404).send({
//         success: false,
//         message: "Bill not found"
//       })
//     }
//     res.status(201).send({
//       success: true,
//       message: "Bill update successfully"
//     })
//   }catch(error){
//     return res.status(500).send({
//       success: false,
//       message: "Error In Update Bill API"
//     })
//   }
// }

export const updateBillController = async (req, res) => {
  try {
    const id = req.params.id;
    const updateBill = await billModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // validation
    if (!updateBill) {
      return res.status(404).send({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Bill updated successfully",
      bill: updateBill,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Update Bill API",
      error: error.message,
    });
  }
};

// ======================== DELETE BILL ========================
export const deleteBillController = async(req,res) => {
  try{
    const deleteBill = await billModel.findByIdAndDelete(req.params.id)
     // validation
     if(!deleteBill){
      return res.status(404).send({
        success: false,
        message: "Not found bill"
      })
     }
     res.status(201).send({
      success: true,
      message: "Bill delete successfully"
     })
  }catch(error) {
    return res.status(500).send({
      success: false,
      message: "Error In Delete Bill API"
    })
  }
}