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
export const getActivePass = async (req, res) => {
    try {
        // Hum sirf wo pass dhoond rahe hain jo is student ka hai 
        // Aur status 'Returned' ya 'Rejected' nahi hai (Ya simply wo delete nahi hua)
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
        res.status(200).json({ message: `Pass ${status}!`, pass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markMovement = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const pass = await GatePass.findById(id).populate('student', 'fullName studentDetails');
        if (!pass) return res.status(404).json({ message: "Gate Pass not found!" });

        if (type === 'out') {
            pass.outTime = Date.now();
            pass.status = 'Out';
            await pass.save();
            return res.status(200).json({ message: "Student marked OUT", pass });
        } 
        
        if (type === 'in') {
            // Check if student is late before deleting for the response message
            const isLate = Date.now() > new Date(pass.expectedInTime).getTime();
            
            // STUDENT HOSTEL AA GAYA -> DELETE FROM DB
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