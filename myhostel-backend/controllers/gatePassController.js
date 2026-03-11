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

        // ✅ Student ko confirmation
        await createNotification(req.user.id,
            `🚪 Gate pass request to "${destination}" submitted successfully. Awaiting warden approval.`
        );

        res.status(201).json({ message: "Gate Pass request sent!", newPass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Student ka active pass
export const getActivePass = async (req, res) => {
    try {
        const activePass = await GatePass.findOne({ student: req.user.id });
        if (!activePass) return res.status(200).json({ active: false, pass: null });
        res.status(200).json({ active: true, pass: activePass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Warden Approve / Reject
export const approveGatePass = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const pass = await GatePass.findByIdAndUpdate(
            id,
            { status, approvedBy: req.user.id },
            { new: true }
        );

        // ✅ Approved ya Rejected — student ko notify
        if (status === 'Approved') {
            await createNotification(pass.student,
                `✅ Your gate pass has been approved! You may proceed.`
            );
        } else {
            await createNotification(pass.student,
                `❌ Your gate pass request was rejected. Contact warden for details.`
            );
        }

        res.status(200).json({ message: `Pass ${status}!`, pass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Mark Movement (Out / In)
export const markMovement = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const pass = await GatePass.findById(id).populate('student', 'fullName studentDetails');
        if (!pass) return res.status(404).json({ message: "Gate Pass not found!" });

        if (type === 'out') {
            pass.outTime = Date.now();
            pass.status  = 'Out';
            await pass.save();

            // ✅ Student marked out
            await createNotification(pass.student._id,
                `🚶 You have been marked OUT. Please return by ${new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
            );

            return res.status(200).json({ message: "Student marked OUT", pass });
        }

        if (type === 'in') {
            const isLate = Date.now() > new Date(pass.expectedInTime).getTime();

            // ✅ Late or on-time return notification
            await createNotification(pass.student._id,
                isLate
                    ? `⚠️ You returned LATE. This has been recorded. Please meet the warden.`
                    : `✅ Welcome back! Gate pass closed successfully.`
            );

            await GatePass.findByIdAndDelete(id);

            return res.status(200).json({
                message: isLate ? "Returned LATE! Record cleared." : "Welcome back! Pass cleared.",
                lateEntry: isLate,
                cleared: true
            });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Delete Gate Pass (Warden/Admin only)
export const deleteGatePass = async (req, res) => {
    try {
        const { id } = req.params;
        const pass = await GatePass.findById(id);
        if (!pass) return res.status(404).json({ message: "Gate Pass record not found!" });

        await GatePass.findByIdAndDelete(id);

        // ✅ Student ko inform karo
        await createNotification(pass.student,
            `🗑️ Your gate pass record has been removed by the administration.`
        );

        res.status(200).json({ message: "Gate Pass deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Get Pending Passes (Warden) — ❌ NO notification here (fetch only)
export const getPendingPasses = async (req, res) => {
    try {
        const pendingPasses = await GatePass.find({ status: 'Pending' })
            .populate({ path: 'student', select: 'fullName studentDetails' })
            .sort({ createdAt: -1 });

        res.status(200).json(pendingPasses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending passes", error: error.message });
    }
};