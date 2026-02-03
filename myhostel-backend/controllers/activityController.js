import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";


export const getStudentActivities = async (req, res) => {
    try {
        const { rollNumber } = req.query;

        if (!rollNumber) {
            return res.status(400).json({ error: "Roll Number is required" });
        }

        // --- FIX: Nested field query use karein ---
        const student = await User.findOne({ "studentDetails.rollNumber": rollNumber });

        if (!student) {
            return res.status(404).json({ error: "No student found with this Roll Number" });
        }

        // History fetch karein
        const history = await ActivityLog.find({ student: student._id })
            .populate('student', 'fullName studentDetails roomNumber') // studentDetails ko bhi populate karein
            .sort({ createdAt: -1 });

        res.status(200).json(history);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a specific activity log
export const deleteActivityLog = async (req, res) => {
    try {
        const { id } = req.params;

        // Check karein ki log exist karta hai ya nahi
        const log = await ActivityLog.findById(id);
        if (!log) {
            return res.status(404).json({ error: "Activity log not found" });
        }

        await ActivityLog.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true, 
            message: "Activity log deleted successfully" 
        });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Poore student ki history ek saath delete karne ke liye
export const clearStudentHistory = async (req, res) => {
    try {
        const { rollNumber } = req.query;
        const student = await User.findOne({ "studentDetails.rollNumber": rollNumber });

        if (!student) return res.status(404).json({ error: "Student not found" });

        await ActivityLog.deleteMany({ student: student._id });
        
        res.status(200).json({ message: "All logs cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: "Clear history failed" });
    }
};