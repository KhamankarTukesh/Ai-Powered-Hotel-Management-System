import Attendance from '../models/Attendance.js';

// 1. Mark Attendance (Bulk)
export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body; // Array of {studentId, status}
        
        const records = await Attendance.insertMany(
            attendanceData.map(item => ({
                student: item.studentId,
                status: item.status,
                date: new Date().setHours(0,0,0,0), // Aaj ki date ka start
                markedBy: req.user.id
            }))
        );

        res.status(201).json({ message: "Attendance marked successfully", records });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Student's own Attendance Analytics
export const getMyAttendance = async (req, res) => {
    try {
        const totalDays = await Attendance.countDocuments({ student: req.user.id });
        const presentDays = await Attendance.countDocuments({ 
            student: req.user.id, 
            status: 'Present' 
        });

        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        res.status(200).json({
            totalDays,
            presentDays,
            percentage: percentage.toFixed(2),
            status: percentage >= 75 ? "Good" : "Low"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};