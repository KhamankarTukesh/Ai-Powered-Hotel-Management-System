import Fee from '../models/Fee.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// 1. Fee create karna (Jab student hostel join kare)
export const createFeeRecord = async (req, res) => {
    try {
        const { studentId, hostelRent, messCharges, dueDate } = req.body; // Inhe add kiya
        const fee = await Fee.create({
            student: studentId,
            hostelRent,
            messCharges,
            totalAmount: Number(hostelRent) + Number(messCharges), // Type safety
            dueDate
        });
        res.status(201).json({ message: "Fee record created ✅", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Payment Update karna (Pay Fees)
export const payFees = async (req, res) => {
    try {
        // req.body se manual transaction ID aur amount le rahe hain
        const { amount, paymentMethod, externalTransactionId } = req.body;

        const fee = await Fee.findOne({ student: req.user.id });

        if (!fee) {
            return res.status(404).json({ message: "Fee record not found for this student." });
        }

        // 1. Transaction details array mein push karna (Without updating paidAmount yet)
        fee.transactions.push({
            amount,
            paymentMethod,
            date: Date.now(),
            // Agar student ID bhej raha hai toh wo, warna system ID
            receiptId: externalTransactionId || `REC${Date.now()}`
        });

        // 2. Status ko "Pending Verification" karna taaki Warden ko dashboard pe dikhe
        fee.status = 'Pending Verification';

        await fee.save();

        res.status(200).json({
            message: "Payment details submitted! Pending warden approval. ✅",
            receiptId: fee.transactions[fee.transactions.length - 1].receiptId,
            status: fee.status
        });

    } catch (error) {
        res.status(500).json({ error: "Server error during payment: " + error.message });
    }
};

// AI Function to calculate risk
const calculatePaymentRisk = (attendanceRate, daysToDeadline, paidPercentage) => {
    if (attendanceRate < 60 || (daysToDeadline < 3 && paidPercentage === 0)) {
        return 'High';
    } else if (attendanceRate < 75 || paidPercentage < 50) {
        return 'Medium';
    }
    return 'Low';
};


export const getFeeAnalytics = async (req, res) => {
    try {
        const fees = await Fee.find().populate('student', 'fullName studentDetails');

        const analyzedFees = fees.map(fee => {
            const risk = calculatePaymentRisk(80, 5, (fee.paidAmount / fee.totalAmount) * 100);
            return { ...fee._doc, aiRisk: risk };
        });

        res.status(200).json(analyzedFees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const downloadReceipt = async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Transaction ID ke basis par fee record dhundo
        const fee = await Fee.findOne({ "transactions.receiptId": transactionId }).populate('student', 'fullName email');

        if (!fee) {
            return res.status(404).json({ message: "Receipt not found for this Transaction ID!" });
        }

        // Specific transaction ki details nikalna
        const transaction = fee.transactions.find(t => t.receiptId === transactionId);

        // PDF Document setup
        const doc = new PDFDocument({ margin: 50 });

        // Browser ko batana ki ye PDF file hai
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${transactionId}.pdf`);

        doc.pipe(res);

        // --- PDF Design ---
        doc.fontSize(20).text('HOSTEL MANAGEMENT SYSTEM', { align: 'center', underline: true });
        doc.moveDown();
        doc.fontSize(16).text('OFFICIAL FEE RECEIPT', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Receipt ID: ${transaction.receiptId}`);
        doc.moveDown();

        doc.text('--------------------------------------------------');
        doc.text(`Student Name: ${fee.student.fullName}`);
        doc.text(`Student Email: ${fee.student.email}`);
        doc.text('--------------------------------------------------');
        doc.moveDown();

        doc.fontSize(14).text(`Amount Paid: Rs. ${transaction.amount}`, { bold: true });
        doc.text(`Payment Method: ${transaction.paymentMethod}`);
        doc.text(`Payment Date: ${new Date(transaction.date).toLocaleString()}`);
        doc.moveDown();

        doc.fontSize(12).text(`Total Paid So Far: Rs. ${fee.paidAmount}`);
        doc.text(`Remaining Balance: Rs. ${fee.totalAmount - fee.paidAmount}`);
        doc.text(`Status: ${fee.status}`);

        doc.moveDown(2);
        doc.fontSize(10).text('Note: This is an electronically generated receipt.', { italic: true, align: 'center' });

        doc.end();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { feeId, transactionId, action } = req.body; // action: 'Approve' ya 'Reject'
        let message = "";

        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ message: "Fee record not found" });

        // Us specific transaction ko dhundo
        const transaction = fee.transactions.find(t => t.receiptId === transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (action === 'Approve') {
            fee.paidAmount += transaction.amount;

            // Status Update Logic
            if (fee.paidAmount >= fee.totalAmount) {
                fee.status = 'Paid';
            } else {
                fee.status = 'Partially Paid';
            }
            message = "Payment Verified & Approved! ✅";
        } else {
            // Agar Warden reject karde (Fake ID case)
            fee.status = 'Unpaid';
            // Transaction array se wo fake entry hata do (Optional)
            fee.transactions = fee.transactions.filter(t => t.receiptId !== transactionId);
            message = "Payment Rejected! Fake Transaction ID. ❌";
        }

        await fee.save();
        res.status(200).json({ message, fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const clearOldTransactions = async (req, res) => {
    const { feeId } = req.params;
    const fee = await Fee.findById(feeId);

    // Sirf 'Paid' status wale purane records ko khali karna
    if (fee.status === 'Paid') {
        fee.transactions = []; // Array reset kar diya
        await fee.save();
    }
    res.status(200).json({ message: "Old records archived! 🗑️" });
};

export const applyMessRebate = async (req, res) => {
    try {
        const { feeId, rebateAmount } = req.body;
        const fee = await Fee.findById(feeId);
        
        fee.totalAmount -= rebateAmount; // Bill kam kar diya
        fee.messCharges -= rebateAmount; // Mess breakdown bhi kam kiya
        
        await fee.save();
        res.status(200).json({ message: "Rebate applied successfully! 💸", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const exportFeeCSV = async (req, res) => {
    try {
        const fees = await Fee.find().populate('student', 'fullName email');
        
        // Data format for CSV
        const data = fees.map(f => ({
            "Student Name": f.student?.fullName || 'N/A',
            "Hostel Rent": f.hostelRent,
            "Mess Charges": f.messCharges,
            "Total Amount": f.totalAmount,
            "Paid Amount": f.paidAmount,
            "Balance": f.totalAmount - f.paidAmount,
            "Status": f.status,
            "Due Date": new Date(f.dueDate).toLocaleDateString()
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        // Setting headers for direct Excel download
        res.header('Content-Type', 'text/csv');
        res.attachment(`Fee_Report_${Date.now()}.csv`);
        return res.send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};