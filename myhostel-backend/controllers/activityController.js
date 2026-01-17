import ActivityLog from "../models/ActivityLog.js";

export const getStudentActivities = async (req, res) => {
    try {
        const history = await ActivityLog.find({ student: req.params.studentId })
                                         .sort({ timestamp: -1 }); 
        
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};