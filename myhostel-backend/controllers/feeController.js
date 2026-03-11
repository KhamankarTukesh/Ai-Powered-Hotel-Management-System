import Fee from '../models/Fee.js';
import User from '../models/User.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { createNotification } from '../utils/notify.js';

// 1. Fee record create (Warden karta hai)
export const createFeeRecord = async (req, res) => {
    try {
        const { studentId, hostelRent, messCharges, dueDate } = req.body;
        const fee = await Fee.create({
            student: studentId,
            hostelRent,
            messCharges,
            totalAmount: Number(hostelRent) + Number(messCharges),
            dueDate
        });

        // ✅ Student ko fee created ki notification
        await createNotification(studentId,
            `💰 Your fee record has been created. Total: ₹${fee.totalAmount}. Due Date: ${new Date(dueDate).toDateString()}.`
        );

        res.status(201).json({ message: "Fee record created ✅", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Student payment submit karega
export const payFees = async (req, res) => {
    try {
        const { amount, paymentMethod, externalTransactionId } = req.body;
        const fee = await Fee.findOne({ student: req.user.id });

        if (!fee) return res.status(404).json({ message: "Fee record not found for this student." });

        const newReceiptId = externalTransactionId || `REC${Date.now()}`;

        fee.transactions.push({
            amount,
            paymentMethod,
            date: Date.now(),
            receiptId: newReceiptId
        });
        fee.status = 'Pending Verification';
        await fee.save();

        // ✅ Student ko payment submitted confirmation
        await createNotification(req.user.id,
            `📤 Payment of ₹${amount} submitted via ${paymentMethod}. Receipt ID: ${newReceiptId}. Awaiting warden verification.`
        );

        res.status(200).json({
            message: "Payment submitted! ✅ IMPORTANT: Your receipt is valid for TODAY ONLY. Please download it within the next 1 minute.",
            receiptId: newReceiptId,
            status: fee.status,
            downloadUrl: `/api/fee/receipt/${newReceiptId}`,
            timer: 60000
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Risk calculator
const calculatePaymentRisk = (attendanceRate, daysToDeadline, paidPercentage) => {
    if (attendanceRate < 60 || (daysToDeadline < 3 && paidPercentage === 0)) return 'High';
    else if (attendanceRate < 75 || paidPercentage < 50) return 'Medium';
    return 'Low';
};

// 3. Student apni fees dekhega
export const getMyFees = async (req, res) => {
    try {
        const fee = await Fee.findOne({ student: req.user.id });
        if (!fee) return res.status(404).json({ message: "No fee record found for this student." });
        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Fee analytics (Warden)
export const getFeeAnalytics = async (req, res) => {
    try {
        const allStudents = await User.find({ role: 'student' }).select('fullName studentDetails');
        const fees = await Fee.find().populate('student', 'fullName');

        const combinedData = allStudents.map(student => {
            const feeRecord = fees.find(f => f.student?._id.toString() === student._id.toString());
            if (feeRecord) {
                const progress = feeRecord.totalAmount > 0 ? (feeRecord.paidAmount / feeRecord.totalAmount) * 100 : 0;
                return { ...feeRecord._doc, student, aiRisk: calculatePaymentRisk(80, 5, progress) };
            }
            return { student, status: "Record Not Created", totalAmount: 0, paidAmount: 0, messCharges: 0, hostelRent: 0, aiRisk: "N/A" };
        });

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Download receipt
export const downloadReceipt = async (req, res) => {
    try {
        let { transactionId } = req.params;
        let fee;

        if (!transactionId || transactionId === 'latest' || transactionId === 'undefined') {
            fee = await Fee.findOne({ student: req.user.id }).populate('student', 'fullName email');
            if (!fee || fee.transactions.length === 0) return res.status(404).json({ message: "No transactions found!" });
            transactionId = fee.transactions[fee.transactions.length - 1].receiptId;
        } else {
            fee = await Fee.findOne({ "transactions.receiptId": transactionId }).populate('student', 'fullName email');
        }

        if (!fee) return res.status(404).json({ message: "Receipt not found!" });

        const transaction = fee.transactions.find(t => t.receiptId === transactionId);
        const today = new Date().toLocaleDateString();

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${transactionId}.pdf`);
        doc.pipe(res);

        const isVerified = fee.status === 'Paid' || fee.status === 'Partially Paid';
        const statusColor = isVerified ? '#28a745' : '#e67e22';

        doc.fillColor('#333').fontSize(22).text('HOSTEL MANAGEMENT SYSTEM', { align: 'center', bold: true });
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#666').text('OFFICIAL PAYMENT RECEIPT', { align: 'center' });
        doc.moveDown();
        doc.rect(50, doc.y, 500, 20).fill('#fff5f5');
        doc.fillColor('#e74c3c').fontSize(9).text(`⚠️ IMPORTANT: This receipt is generated for today (${today}) only. Please download and save it immediately.`, 50, doc.y + 6, { align: 'center', width: 500 });
        doc.moveDown(1.5);
        doc.rect(200, doc.y, 200, 25).fill(statusColor);
        doc.fillColor('#fff').fontSize(12).text(fee.status.toUpperCase(), 200, doc.y + 7, { align: 'center', width: 200 });
        doc.moveDown(2).fillColor('#333');
        doc.fontSize(10).text(`Generated Date: ${today}`, { align: 'right' });
        doc.text(`Receipt ID: ${transaction.receiptId}`, { align: 'right' });
        doc.moveDown();
        doc.fontSize(12).text('STUDENT INFORMATION', { underline: true });
        doc.moveDown(0.5);
        doc.text(`Name: ${fee.student.fullName}`);
        doc.text(`Email: ${fee.student.email}`);
        doc.moveDown();
        doc.fontSize(12).text('FEE BREAKDOWN', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Hostel Rent: Rs. ${fee.hostelRent}`);
        doc.text(`Mess Charges: Rs. ${fee.messCharges}`);
        doc.fontSize(11).text(`Total Bill Amount: Rs. ${fee.totalAmount}`, { bold: true });
        doc.moveDown();
        doc.rect(50, doc.y, 500, 1).fill('#eee');
        doc.moveDown();
        doc.fillColor('#333').fontSize(14).text(`Amount Received: Rs. ${transaction.amount}`, { bold: true });
        doc.fontSize(11).fillColor('#666').text(`Method: ${transaction.paymentMethod}`);
        doc.text(`Time: ${new Date(transaction.date).toLocaleString()}`);
        doc.moveDown();
        doc.rect(50, doc.y, 500, 1).fill('#eee');
        doc.moveDown();
        doc.fillColor('#333').fontSize(12).text(`Cumulative Paid: Rs. ${fee.paidAmount}`);
        doc.fillColor(fee.totalAmount - fee.paidAmount > 0 ? '#e74c3c' : '#28a745');
        doc.text(`Dues Remaining: Rs. ${fee.totalAmount - fee.paidAmount}`);
        doc.moveDown(3);
        doc.fillColor(statusColor).fontSize(10).text(isVerified ? '✅ VERIFIED TRANSACTION' : '⏳ AWAITING WARDEN VERIFICATION', { align: 'center' });
        doc.fillColor('#999').fontSize(8).text('This is a computer-generated document and does not require a physical signature.', { align: 'center' });
        doc.end();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Warden payment verify/reject karega
export const verifyPayment = async (req, res) => {
    try {
        const { feeId, transactionId, action } = req.body;
        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ message: "Fee record not found" });

        const transaction = fee.transactions.find(t => t.receiptId === transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (action === 'Approve') {
            fee.paidAmount += transaction.amount;
            fee.status = fee.paidAmount >= fee.totalAmount ? 'Paid' : 'Partially Paid';

            // ✅ Approved notification
            await createNotification(fee.student,
                `✅ Your payment of ₹${transaction.amount} (Receipt: ${transactionId}) has been verified. ${fee.status === 'Paid' ? 'All dues cleared! 🎉' : `Remaining dues: ₹${fee.totalAmount - fee.paidAmount}.`}`
            );

        } else {
            fee.status = 'Unpaid';
            fee.transactions = fee.transactions.filter(t => t.receiptId !== transactionId);

            // ✅ Rejected notification
            await createNotification(fee.student,
                `❌ Your payment (Receipt: ${transactionId}) was rejected by the warden. Please contact the office or resubmit with a valid transaction ID.`
            );
        }

        await fee.save();
        res.status(200).json({ message: action === 'Approve' ? "Payment Verified & Approved! ✅" : "Payment Rejected! ❌", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Clear old transactions (fully paid)
export const clearOldTransactions = async (req, res) => {
    try {
        const { feeId } = req.params;
        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ message: "Fee record not found" });

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

// 8. Mess rebate
export const applyMessRebate = async (req, res) => {
    try {
        const { feeId, rebateAmount } = req.body;
        const fee = await Fee.findById(feeId);

        fee.totalAmount  -= rebateAmount;
        fee.messCharges  -= rebateAmount;
        await fee.save();

        // ✅ Student ko rebate notification
        await createNotification(fee.student,
            `🎉 Mess rebate of ₹${rebateAmount} applied to your account. New total: ₹${fee.totalAmount}.`
        );

        res.status(200).json({ message: "Rebate applied successfully! 💸", fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 9. Export CSV
export const exportFeeCSV = async (req, res) => {
    try {
        const allStudents = await User.find({ role: 'student' }).select('fullName studentDetails');
        const fees = await Fee.find();

        const data = allStudents.map(student => {
            const f = fees.find(record => record.student.toString() === student._id.toString());
            return {
                "Student Name":   student.fullName || 'N/A',
                "Roll Number":    student.studentDetails?.rollNumber || 'N/A',
                "Hostel Rent":    f ? f.hostelRent : 0,
                "Mess Charges":   f ? f.messCharges : 0,
                "Total Amount":   f ? f.totalAmount : 0,
                "Paid Amount":    f ? f.paidAmount : 0,
                "Balance Amount": f ? (f.totalAmount - f.paidAmount) : 0,
                "Payment Status": f ? f.status.toUpperCase() : "RECORD NOT CREATED",
                "Due Date":       (f && f.dueDate) ? new Date(f.dueDate).toLocaleDateString('en-GB') : 'N/A'
            };
        });

        const csv = new Parser().parse(data);
        const dateStr = new Date().toISOString().split('T')[0];
        res.header('Content-Type', 'text/csv');
        res.attachment(`Full_Hostel_Fee_Report_${dateStr}.csv`);
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 10. Pending verifications (Warden)
export const getPendingVerifications = async (req, res) => {
    try {
        const pendingFees = await Fee.find({ status: 'Pending Verification' })
            .populate('student', 'fullName studentDetails email')
            .sort({ updatedAt: -1 });

        const data = pendingFees.map(fee => {
            const lastTx = fee.transactions[fee.transactions.length - 1];
            return {
                feeId:          fee._id,
                fullName:       fee.student.fullName,
                rollNumber:     fee.student.studentDetails.rollNumber,
                dept:           fee.student.studentDetails.department,
                amountToVerify: lastTx?.amount,
                transactionId:  lastTx?.receiptId,
                paymentMethod:  lastTx?.paymentMethod,
                submissionDate: lastTx?.date,
                totalPending:   fee.totalAmount - fee.paidAmount
            };
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};