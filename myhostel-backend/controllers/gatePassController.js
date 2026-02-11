import GatePass from "../models/GatePass.js";
import { createNotification } from '../utils/notify.js';

// 1. Student Apply 
export const applyGatePass = async (req, res) => {
    try {
        const { reason, destination, expectedInTime } = req.body;
        const newPass = await GatePass.create({
            student: req.user.id,
            reason,
            destination,
            expectedInTime
        });
        await createNotification(
  req.user.id,
  "Your Gate Pass request has been successfully submitted and is awaiting approval."
);

        res.status(201).json({ message: "Gate Pass request sent!", newPass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getActivePass = async (req, res) => {
    try {
        const activePass = await GatePass.findOne({ student: req.user.id });
        
        if (!activePass) {
            return res.status(200).json({ active: false, pass: null });
        }

        res.status(200).json({ active: true, pass: activePass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Warden Approve
export const approveGatePass = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Approved ya Rejected
        const pass = await GatePass.findByIdAndUpdate(id, {
            status,
            approvedBy: req.user.id
        }, { new: true });
        await createNotification(pass.student, `Your Gate Pass is ${status}! 🚪`);
        res.status(200).json({ message: `Pass ${status}!`, pass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};


export const markMovement = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const pass = await GatePass
            .findById(id)
            .populate('student', 'fullName studentDetails');

        if (!pass) {
            return res.status(404).json({ message: "Gate Pass not found!" });
        }

        /* =======================
           STUDENT MARKED OUT
        ======================= */
        if (type === 'out') {
            pass.outTime = Date.now();
            pass.status = 'Out';
            await pass.save();

            // 🔔 Notification to student
            await createNotification(
                pass.student._id,
                "You have been marked OUT by the gate authority. Please return before the expected time."
            );

            return res.status(200).json({
                message: "Student marked OUT",
                pass
            });
        }

        /* =======================
           STUDENT MARKED IN
        ======================= */
        if (type === 'in') {
            const isLate = Date.now() > new Date(pass.expectedInTime).getTime();

            // 🔔 Notification before deleting record
            await createNotification(
                pass.student._id,
                isLate
                    ? "You have returned LATE. Your entry has been recorded and the gate pass is now closed."
                    : "Welcome back! Your gate pass has been successfully closed."
            );

            // STUDENT HOSTEL AA GAYA → DELETE RECORD
            await GatePass.findByIdAndDelete(id);

            return res.status(200).json({
                message: isLate
                    ? "Returned LATE! Record cleared."
                    : "Welcome back! Pass cleared.",
                lateEntry: isLate,
                cleared: true
            });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// 4. Delete Gate Pass (Only for Warden/Admin)
export const deleteGatePass = async (req, res) => {
    try {
        const { id } = req.params;

        const pass = await GatePass.findById(id);
        if (!pass) return res.status(404).json({ message: "Gate Pass record not found!" });

        await GatePass.findByIdAndDelete(id);
await createNotification(
  pass.student,
  "Your Gate Pass record has been removed by the Administration."
);

        res.status(200).json({ message: "Gate Pass record deleted successfully! 🗑️" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all pending gate pass requests for the Warden
export const getPendingPasses = async (req, res) => {
    try {
        // 1. Find passes where status is 'Pending'
        // 2. Populate 'student' to get fullName
        // 3. Sort by latest first (createdAt: -1)
        const pendingPasses = await GatePass.find({ status: 'Pending' })
            .populate({
                path: 'student',
                select: 'fullName studentDetails', // Only fetch what we need
            })
            .sort({ createdAt: -1 });

        // If no passes found, send an empty array instead of 404 
        // (Better for frontend loading states)
        await createNotification(
  req.user.id, // warden/admin who opened dashboard
  "You have new pending Gate Pass requests awaiting your review."
);

        res.status(200).json(pendingPasses);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching pending passes", 
            error: error.message 
        });
    }
};