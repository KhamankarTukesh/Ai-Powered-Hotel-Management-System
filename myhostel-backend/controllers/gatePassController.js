import GatePass from "../models/GatePass";

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
        const { type } = req.body; // 'out' or 'in'
        
        const updateData = type === 'out' 
            ? { outTime: Date.now(), status: 'Out' } 
            : { actualInTime: Date.now(), status: 'Returned' };

        const pass = await GatePass.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: `Student marked ${type}!`, pass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};