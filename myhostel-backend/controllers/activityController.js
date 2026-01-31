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