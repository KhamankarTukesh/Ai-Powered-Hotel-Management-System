import Leave from '../models/Leave.js';
import PDFDocument from 'pdfkit';
import { uploadPDFToCloudinary } from '../config/cloudinary.js';
import { createNotification } from '../utils/notify.js';

// 1. Student leave apply karega
export const applyLeave = async (req, res) => {
    try {
        const { reason, startDate, endDate } = req.body;
        const newLeave = await Leave.create({
            student: req.user.id,
            reason,
            startDate,
            endDate
        });

        // ✅ Student ko confirmation
        await createNotification(req.user.id,
            `📝 Your leave request from ${new Date(startDate).toDateString()} to ${new Date(endDate).toDateString()} has been submitted. Awaiting approval.`
        );

        res.status(201).json({ message: "Leave applied successfully", newLeave });
    } catch (error) {
        res.status(500).json({ message: "Error applying leave", error: error.message });
    }
};

// 2. Warden saari leaves dekhega
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('student', 'fullName studentDetails.rollNumber');
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};

// 3. Student apni leaves dekhega
export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};

// 4. Warden status update karega
export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, wardenNote } = req.body;

        const leaveToUpdate = await Leave.findById(id);
        if (!leaveToUpdate) return res.status(404).json({ message: "Leave not found" });

        // Expiry — next day 6 PM
        const expiryDate = new Date(leaveToUpdate.endDate);
        expiryDate.setDate(expiryDate.getDate() + 1);
        expiryDate.setHours(18, 0, 0, 0);

        let updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status, wardenNote, expiresAt: expiryDate },
            { new: true }
        ).populate('student', 'fullName studentDetails.rollNumber');

        if (status === 'Approved') {

            // ✅ Approved notification to student
            await createNotification(updatedLeave.student._id,
                `✅ Your leave (${new Date(updatedLeave.startDate).toDateString()} – ${new Date(updatedLeave.endDate).toDateString()}) has been approved! ${wardenNote ? `Note: ${wardenNote}` : ''}`
            );

            // PDF generation in background
            const doc = new PDFDocument({ size: 'A6', margin: 30 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));

            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffers);
                try {
                    const result = await uploadPDFToCloudinary(pdfBuffer);
                    updatedLeave.outpassUrl = result.secure_url;
                    await updatedLeave.save();
                    console.log("Outpass uploaded:", result.secure_url);
                } catch (err) {
                    console.error("Cloudinary Error:", err);
                }
            });

            doc.fontSize(14).text('DIGITAL OUTPASS', { align: 'center', underline: true });
            doc.moveDown();
            doc.fontSize(10).text(`Name: ${updatedLeave.student.fullName}`);
            doc.text(`Roll No: ${updatedLeave.student.studentDetails?.rollNumber || 'N/A'}`);
            doc.text(`Dates: ${new Date(updatedLeave.startDate).toDateString()} - ${new Date(updatedLeave.endDate).toDateString()}`);
            doc.moveDown();
            doc.fillColor('green').text(`Status: APPROVED`);
            doc.fillColor('black').text(`Note: ${wardenNote || 'N/A'}`);
            doc.end();

            return res.status(200).json({ message: "Leave approved successfully!", updatedLeave });

        } else {

            // ✅ Rejected notification to student
            await createNotification(updatedLeave.student._id,
                `❌ Your leave request has been rejected. ${wardenNote ? `Reason: ${wardenNote}` : 'Contact warden for details.'}`
            );

            return res.status(200).json({ message: `Leave ${status}`, updatedLeave });
        }

    } catch (error) {
        res.status(500).json({ message: "Error updating leave", error: error.message });
    }
};