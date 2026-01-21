import Leave from '../models/Leave.js';
import PDFDocument from 'pdfkit';
import { uploadPDFToCloudinary } from '../config/cloudinary.js';

// 1. Student chutti apply karega
export const applyLeave = async (req, res) => {
    try {
        const { reason, startDate, endDate } = req.body;
        const newLeave = await Leave.create({
            student: req.user.id,
            reason,
            startDate,
            endDate
        });
        res.status(201).json({ message: "Leave applied successfully", newLeave });
    } catch (error) {
        res.status(500).json({ message: "Error applying leave", error: error.message });
    }
};

// 2. Warden saari leave applications dekhega
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('student', 'fullName studentDetails.rollNumber');
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};

// Student apni purani leaves dekhne ke liye
export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};
export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, wardenNote } = req.body;

        // 1. Pehle basic update karo
        let updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status, wardenNote },
            { new: true }
        ).populate('student', 'fullName studentDetails.rollNumber');

        if (!updatedLeave) return res.status(404).json({ message: "Leave not found" });

        // 2. AGAR Status 'Approved' hai, toh PDF banao aur Cloudinary pe daalo
        if (status === 'Approved') {
            const doc = new PDFDocument({ size: 'A6', margin: 30 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            
            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffers);
                try {
                    // Cloudinary upload
                    const result = await uploadPDFToCloudinary(pdfBuffer);
                    
                    // Database mein link save karo
                    updatedLeave.outpassUrl = result.secure_url;
                    await updatedLeave.save();

                    // Final response send karo
                    return res.status(200).json({ 
                        message: "Leave Approved & Outpass Generated!", 
                        outpassUrl: updatedLeave.outpassUrl,
                        updatedLeave 
                    });
                } catch (err) {
                    console.error("Cloudinary Error:", err);
                }
            });

            // --- PDF ka Content ---
            doc.fontSize(14).text('DIGITAL OUTPASS', { align: 'center', underline: true });
            doc.moveDown();
            doc.fontSize(10).text(`Name: ${updatedLeave.student.fullName}`);
            doc.text(`Roll No: ${updatedLeave.student.studentDetails.rollNumber}`);
            doc.text(`Dates: ${updatedLeave.startDate.toDateString()} - ${updatedLeave.endDate.toDateString()}`);
            doc.moveDown();
            doc.text(`Status: ${status}`, { color: 'green' });
            doc.text(`Note: ${wardenNote || 'N/A'}`);
            doc.end();
            
        } else {
            // Agar Rejected ya Pending hai toh seedha response
            res.status(200).json({ message: `Leave ${status}`, updatedLeave });
        }

    } catch (error) {
        res.status(500).json({ message: "Error updating leave", error: error.message });
    }
};