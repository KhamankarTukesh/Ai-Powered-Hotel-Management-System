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

        const leaveToUpdate = await Leave.findById(id);
        if (!leaveToUpdate) return res.status(404).json({ message: "Leave not found" });

        // 1. Expiry Calculation (Next day 6 PM)
        const expiryDate = new Date(leaveToUpdate.endDate);
        expiryDate.setDate(expiryDate.getDate() + 1); 
        expiryDate.setHours(18, 0, 0, 0); 

        // 2. Database Update (Sabse pehle status update kar dein taaki UI fast respond kare)
        let updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status, wardenNote, expiresAt: expiryDate },
            { new: true }
        ).populate('student', 'fullName studentDetails.rollNumber');

        // 3. AGAR 'Approved' hai, toh background mein PDF bana kar Cloudinary pe daalo
        if (status === 'Approved') {
            const doc = new PDFDocument({ size: 'A6', margin: 30 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            
            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffers);
                try {
                    const result = await uploadPDFToCloudinary(pdfBuffer);
                    
                    // Background save: Student ab apni app se ye link dekh payega
                    updatedLeave.outpassUrl = result.secure_url;
                    await updatedLeave.save();
                    console.log("Outpass uploaded to Cloudinary:", result.secure_url);
                } catch (err) {
                    console.error("Cloudinary Background Error:", err);
                }
            });

            // PDF Content (Wahi purana logic)
            doc.fontSize(14).text('DIGITAL OUTPASS', { align: 'center', underline: true });
            doc.moveDown();
            doc.fontSize(10).text(`Name: ${updatedLeave.student.fullName}`);
            doc.text(`Roll No: ${updatedLeave.student.studentDetails?.rollNumber || 'N/A'}`);
            doc.text(`Dates: ${new Date(updatedLeave.startDate).toDateString()} - ${new Date(updatedLeave.endDate).toDateString()}`);
            doc.moveDown();
            doc.fillColor('green').text(`Status: APPROVED`);
            doc.fillColor('black').text(`Note: ${wardenNote || 'N/A'}`);
            doc.end();

            // 4. IMPORTANT: Warden ko sirf JSON response bhejo, PDF file nahi
            return res.status(200).json({ 
                message: "Leave status updated successfully!", 
                updatedLeave 
            });
            
        } else {
            return res.status(200).json({ message: `Leave ${status}`, updatedLeave });
        }

    } catch (error) {
        res.status(500).json({ message: "Error updating leave", error: error.message });
    }
};
