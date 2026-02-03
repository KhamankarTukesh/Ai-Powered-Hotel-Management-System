import Fee from '../models/Fee.js';
import User from '../models/User.js';
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

export const payFees = async (req, res) => {
    try {
        const { amount, paymentMethod, externalTransactionId } = req.body;
        const fee = await Fee.findOne({ student: req.user.id });

        if (!fee) {
            return res.status(404).json({ message: "Fee record not found for this student." });
        }

        const newReceiptId = externalTransactionId || `REC${Date.now()}`;

        fee.transactions.push({
            amount,
            paymentMethod,
            date: Date.now(),
            receiptId: newReceiptId
        });

        fee.status = 'Pending Verification';
        await fee.save();

        // Hum response mein specific instructions bhej rahe hain frontend ke liye
        res.status(200).json({
            message: "Payment submitted! ✅ IMPORTANT: Your receipt is valid for TODAY ONLY. Please download it within the next 1 minute.",
            receiptId: newReceiptId,
            status: fee.status,
            downloadUrl: `/api/fee/receipt/${newReceiptId}`, // Direct link for frontend
            timer: 60000 // 1 minute in milliseconds for the toast
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
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
// Controller to fetch current student's fee details
export const getMyFees = async (req, res) => {
    try {
        // req.user.id 'protect' middleware se aata hai
        const fee = await Fee.findOne({ student: req.user.id });

        if (!fee) {
            return res.status(404).json({ message: "No fee record found for this student." });
        }

        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFeeAnalytics = async (req, res) => {
    try {
        const allStudents = await User.find({ role: 'student' }).select('fullName studentDetails');
        const fees = await Fee.find().populate('student', 'fullName');

        const combinedData = allStudents.map(student => {
            const feeRecord = fees.find(f => f.student?._id.toString() === student._id.toString());

            if (feeRecord) {
                // Ensure we don't divide by zero
                const progress = feeRecord.totalAmount > 0 ? (feeRecord.paidAmount / feeRecord.totalAmount) * 100 : 0;
                const risk = calculatePaymentRisk(80, 5, progress);
                
                return { 
                    ...feeRecord._doc, 
                    student: student, 
                    aiRisk: risk 
                };
            } else {
                return {
                    student: student,
                    status: "Record Not Created",
                    totalAmount: 0,
                    paidAmount: 0,
                    messCharges: 0,
                    hostelRent: 0,
                    aiRisk: "N/A"
                };
            }
        });

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const downloadReceipt = async (req, res) => {
    try {
        let { transactionId } = req.params;
        let fee;

        // 1. Check if we need the latest receipt or a specific one
        if (!transactionId || transactionId === 'latest' || transactionId === 'undefined') {
            fee = await Fee.findOne({ student: req.user.id }).populate('student', 'fullName email');
            if (!fee || fee.transactions.length === 0) {
                return res.status(404).json({ message: "No transactions found!" });
            }
            // Pick the last transaction
            const latest = fee.transactions[fee.transactions.length - 1];
            transactionId = latest.receiptId;
        } else {
            fee = await Fee.findOne({ "transactions.receiptId": transactionId }).populate('student', 'fullName email');
        }

        if (!fee) return res.status(404).json({ message: "Receipt not found!" });

        const transaction = fee.transactions.find(t => t.receiptId === transactionId);
        const today = new Date().toLocaleDateString();

        // 2. Setup PDF Document
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${transactionId}.pdf`);
        doc.pipe(res);

        // --- Logic for Dynamic Colors ---
        const isVerified = fee.status === 'Paid' || fee.status === 'Partially Paid';
        const statusColor = isVerified ? '#28a745' : '#e67e22';
        const statusText = fee.status.toUpperCase();

        // Header Section
        doc.fillColor('#333').fontSize(22).text('HOSTEL MANAGEMENT SYSTEM', { align: 'center', bold: true });
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#666').text('OFFICIAL PAYMENT RECEIPT', { align: 'center' });

        // --- EXPIRE NOTIFICATION (Professional Alert) ---
        doc.moveDown();
        doc.rect(50, doc.y, 500, 20).fill('#fff5f5'); 
        doc.fillColor('#e74c3c').fontSize(9).text(
            `⚠️ IMPORTANT: This receipt is generated for today (${today}) only. Please download and save it immediately.`, 
            50, doc.y + 6, { align: 'center', width: 500, bold: true }
        );
        doc.moveDown(1.5);

        // --- Status Badge ---
        doc.rect(200, doc.y, 200, 25).fill(statusColor);
        doc.fillColor('#fff').fontSize(12).text(statusText, 200, doc.y + 7, { align: 'center', width: 200 });
        doc.moveDown(2).fillColor('#333');

        // Dates & IDs
        doc.fontSize(10).text(`Generated Date: ${today}`, { align: 'right' });
        doc.text(`Receipt ID: ${transaction.receiptId}`, { align: 'right' });
        doc.moveDown();

        // Student Info
        doc.fontSize(12).text('STUDENT INFORMATION', { underline: true });
        doc.moveDown(0.5);
        doc.text(`Name: ${fee.student.fullName}`);
        doc.text(`Email: ${fee.student.email}`);
        doc.moveDown();

        // --- FEE BREAKDOWN (Added from Warden Records) ---
        doc.fontSize(12).text('FEE BREAKDOWN', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Hostel Rent: Rs. ${fee.hostelRent}`);
        doc.text(`Mess Charges: Rs. ${fee.messCharges}`);
        doc.fontSize(11).text(`Total Bill Amount: Rs. ${fee.totalAmount}`, { bold: true });
        doc.moveDown();

        // Transaction Details
        doc.rect(50, doc.y, 500, 1).fill('#eee');
        doc.moveDown();
        doc.fillColor('#333').fontSize(14).text(`Amount Received: Rs. ${transaction.amount}`, { bold: true });
        doc.fontSize(11).fillColor('#666').text(`Method: ${transaction.paymentMethod}`);
        doc.text(`Time: ${new Date(transaction.date).toLocaleString()}`);
        doc.moveDown();

        // Footer Totals
        doc.rect(50, doc.y, 500, 1).fill('#eee');
        doc.moveDown();
        doc.fillColor('#333').fontSize(12).text(`Cumulative Paid: Rs. ${fee.paidAmount}`);
        doc.fillColor(fee.totalAmount - fee.paidAmount > 0 ? '#e74c3c' : '#28a745');
        doc.text(`Dues Remaining: Rs. ${fee.totalAmount - fee.paidAmount}`);

        // Stamp
        doc.moveDown(3);
        doc.fillColor(statusColor).fontSize(10).text(
            isVerified ? '✅ VERIFIED TRANSACTION' : '⏳ AWAITING WARDEN VERIFICATION',
            { align: 'center', bold: true }
        );
        
        doc.fillColor('#999').fontSize(8).text('This is a computer-generated document and does not require a physical signature.', { align: 'center' });

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
    try {
        const { feeId } = req.params;
        const fee = await Fee.findById(feeId);

        if (!fee) return res.status(404).json({ message: "Fee record not found" });

        // Logic: Clear only if fully paid to prevent data loss for pending fees
        if (fee.status === 'Paid') {
            fee.transactions = []; 
            await fee.save();
            return res.status(200).json({ message: "Transactions cleared for next cycle! 🗑️" });
        } else {
            return res.status(400).json({ message: "Cannot clear! Student has outstanding dues." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
        // Fetch students and fee records to match the Analytics logic
        const allStudents = await User.find({ role: 'student' }).select('fullName studentDetails');
        const fees = await Fee.find();

        const data = allStudents.map(student => {
            const f = fees.find(record => record.student.toString() === student._id.toString());

            return {
                "Student Name": student.fullName || 'N/A',
                "Roll Number": student.studentDetails?.rollNumber || 'N/A',
                "Hostel Rent": f ? f.hostelRent : 0,
                "Mess Charges": f ? f.messCharges : 0,
                "Total Amount": f ? f.totalAmount : 0,
                "Paid Amount": f ? f.paidAmount : 0,
                "Balance Amount": f ? (f.totalAmount - f.paidAmount) : 0,
                "Payment Status": f ? f.status.toUpperCase() : "RECORD NOT CREATED",
                // Format: 15/02/2026
                "Due Date": (f && f.dueDate) ? new Date(f.dueDate).toLocaleDateString('en-GB') : 'N/A'
            };
        });

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        const dateStr = new Date().toISOString().split('T')[0];
        res.header('Content-Type', 'text/csv');
        res.attachment(`Full_Hostel_Fee_Report_${dateStr}.csv`);
        return res.send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPendingVerifications = async (req, res) => {
    try {
        // Sirf 'Pending Verification' wale records fetch kar rahe hain
        const pendingFees = await Fee.find({ status: 'Pending Verification' })
            .populate('student', 'fullName studentDetails email') // Student ki detail join ki
            .sort({ updatedAt: -1 });

        // Data transform kar rahe hain taaki frontend ko saaf-saaf dikhe
        const data = pendingFees.map(fee => {
            const lastTx = fee.transactions[fee.transactions.length - 1]; // Latest payment
            return {
                feeId: fee._id,
                fullName: fee.student.fullName,
                rollNumber: fee.student.studentDetails.rollNumber,
                dept: fee.student.studentDetails.department,
                amountToVerify: lastTx?.amount,
                transactionId: lastTx?.receiptId,
                paymentMethod: lastTx?.paymentMethod,
                submissionDate: lastTx?.date,
                totalPending: fee.totalAmount - fee.paidAmount
            };
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};