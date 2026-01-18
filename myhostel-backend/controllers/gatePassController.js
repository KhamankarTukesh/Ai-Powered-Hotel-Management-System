import GatePass from "../models/GatePass.js";

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
        res.status(201).json({ message: "Gate Pass request sent!", newPass });
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
        res.status(200).json({ message: `Pass ${status}!`, pass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Guard Exit/Entry mark 
export const markMovement = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'out' ya 'in'
        
        // Sahi field: fullName aur studentDetails (idCardImage ke liye)
        const pass = await GatePass.findById(id).populate('student', 'fullName studentDetails');
        
        if (!pass) return res.status(404).json({ message: "Gate Pass not found!" });

        if (type === 'out') {
            pass.outTime = Date.now();
            pass.status = 'Out';
        } else if (type === 'in') {
            pass.actualInTime = Date.now();
            pass.status = 'Returned';

            // 🧐 LATE RETURN LOGIC
            if (pass.actualInTime > pass.expectedInTime) {
                // Save changes before returning error response
                await pass.save();
                return res.status(200).json({ 
                    message: "Student returned LATE! ⚠️ Warning logged.", 
                    lateEntry: true,
                    studentName: pass.student.fullName,
                    studentPhoto: pass.student.studentDetails.idCardImage, // Asli photo field
                    pass 
                });
            }
        }

        await pass.save();
        res.status(200).json({ 
            message: `Student marked ${type} successfully.`, 
            studentName: pass.student.fullName,
            studentPhoto: pass.student.studentDetails.idCardImage, // Verification ke liye
            pass 
        });
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

        res.status(200).json({ message: "Gate Pass record deleted successfully! 🗑️" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};