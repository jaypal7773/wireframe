import paymentModel from "../models/paymentModel.js";
import billModel from "../models/billsModel.js";
import vendorModel from "../models/vendorModel.js";

// ====================== CREATE PAYMENT =================================
export const paymentCreateController = async (req, res) => {
  try {
    const {
      vendorId,
      billNumber,
      billId,
      totalAmount: totalAmountRaw,
      paymentMode,
      paymentEmi,
      referenceNumber,
      paymentDescription,
      status
    } = req.body;

    // allow billNumber OR billId
    const billRef = billNumber || billId;

    // validation: required fields
    if (
      !vendorId ||
      !billRef ||
      totalAmountRaw === undefined ||
      !paymentMode ||
      paymentEmi === undefined ||
      !paymentDescription ||
      !status
    ) {
      return res.status(400).send({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // validate numeric totalAmount
    const totalAmount = Number(totalAmountRaw);
    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid totalAmount"
      });
    }

    // find vendor and bill
    const vendor = await vendorModel.findById(vendorId);
    const bill = await billModel.findById(billRef);

    if (!vendor || !bill) {
      return res.status(404).send({
        success: false,
        message: "Vendor or bill not found"
      });
    }

    // create payment (this will trigger pre-save hooks on schema)
    const paymentCreate = await paymentModel.create({
      vendorId,
      billNumber: billRef,
      totalAmount,
      paymentMode,
      paymentEmi,
      referenceNumber: referenceNumber || "#REF" + Date.now(),
      paymentDescription,
      status
    });

    // update bill remaining balance and status
    const newRemaining = (bill.remainingBalance || 0) - totalAmount;
    await billModel.findByIdAndUpdate(
      billRef,
      {
        remainingBalance: newRemaining < 0 ? 0 : newRemaining,
        status: newRemaining <= 0 ? "Complete" : "In Process"
      },
      { new: true }
    );

        //  Auto-update Vendor Totals
    const allBills = await billModel.find({ vendorId });
    const totalDue = allBills.reduce((acc, b) => acc + (b.remainingBalance || 0), 0);
    const totalPaid = allBills.reduce(
      (acc, b) => acc + ((b.totalAmount || 0) - (b.remainingBalance || 0)),
      0
    );
    const completeTrx = allBills.filter((b) => b.status === "Complete").length;
    const inProgressTrx = allBills.filter((b) => b.status !== "Complete").length;

    await vendorModel.findByIdAndUpdate(
      vendorId,
      {
        totalAmountDue: totalDue,
        totalPayment: totalPaid,
        totalTransaction: allBills.length,
        completeTransaction: completeTrx,
        inProgressTransaction: inProgressTrx,
      },
      { new: true }
    );

    // update vendor total payment 
    // await vendorModel.findByIdAndUpdate(
    //   vendorId,
    //   { $inc: { totalPayment: totalAmount } },
    //   { new: true }
    // );

    return res.status(201).send({
      success: true,
      message: "Payment created successfully",
      paymentCreate
    });
  } catch (error) {
    console.error("Error in paymentCreateController:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Payment Create API",
    });
  }
};


// ===================== GET ALL PAYMENT ========================
export const getPaymentController = async(req,res) => {
    try{
        const payments = await paymentModel.find({})
        //validation
        if(!payments) {
            return res.status(404).send({
                success: false,
                message: "Payment Details Not Found",
            })
        }

        res.status(201).send({
            success: true,
            message: "Payment Fetch Successfully",
            payments
        })
    }catch(error) {
        return res.status(500).send({
            success: false,
            message: "Error In Fetch Payment API"
        })
    }
}

// ================= FETCH ONE PAYMENT DETAILS ======================
export const onePaymentController = async(req,res) => {
    try{
        const payment = await paymentModel.findById(req.params.id)
        //validation
        if(!payment) {
            return res.status(404).send({
                success: false,
                message: "Payment Details Not Found"
            })
        }
        res.status(201).send({
            success: true,
            message: "Payment Fetch Successfully",
            payment
        })
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error In Payment API"
        })
    }
}

// ===================== DELETE PAYMENT =================
export const deletePaymentController = async(req,res) => {
    try{
        const deletePayment = await paymentModel.findByIdAndDelete(req.params.id)
        // validation
        if(!deletePayment){
            return res.status(404).send({
                success: false,
                message: "Payment Detail Not Found"
            })
        }
        res.status(201).send({
            success: true,
            message: "Payment Delete Successfully",
            // deletePayment
        })
    }catch(error) {
        return res.status(500).send({
            success: false,
            message: "Error In Delete Payment API"
        })
    }
}