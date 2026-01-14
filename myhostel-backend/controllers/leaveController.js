import Leave from '../models/Leave.js';

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

// 3. Warden Leave Approve/Reject karega
export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, wardenNote } = req.body;

        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status, wardenNote },
            { new: true }
        );

        res.status(200).json({ message: `Leave ${status}`, updatedLeave });
    } catch (error) {
        res.status(500).json({ message: "Error updating leave", error: error.message });
    }
};