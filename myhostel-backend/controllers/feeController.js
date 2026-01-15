import Fee from '../models/Fee.js';

// 1. Fee create karna (Jab student hostel join kare)
export const createFeeRecord = async (req, res) => {
    try {
        const { studentId, totalAmount, dueDate } = req.body;
        const fee = await Fee.create({
            student: studentId,
            totalAmount,
            dueDate
        });
        res.status(201).json({ message: "Fee record created", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Payment Update karna (Pay Fees)
export const payFees = async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        const fee = await Fee.findOne({ student: req.user.id });

        if (!fee) return res.status(404).json({ message: "Fee record not found" });

        fee.paidAmount += amount;
        fee.transactions.push({
            amount,
            paymentMethod,
            receiptId: `REC${Date.now()}`
        });

        // Update status logic
        if (fee.paidAmount >= fee.totalAmount) {
            fee.status = 'Paid';
        } else {
            fee.status = 'Partially Paid';
        }

        await fee.save();
        res.status(200).json({ message: "Payment Successful!", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};