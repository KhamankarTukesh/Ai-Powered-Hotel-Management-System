import Attendance from "../models/Attendance.js"; // Warden wali hostel attendance
import MessActivity from "../models/MessActivity.js";
import mongoose from "mongoose";

export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Bulk operations taiyar karein
        const ops = attendanceData
            .filter(item => mongoose.Types.ObjectId.isValid(item.studentId))
            .map(item => ({
                updateOne: {
                    filter: { student: item.studentId, date: today },
                    update: { 
                        $set: { 
                            status: item.status, 
                            markedBy: req.user.id 
                        } 
                    },
                    upsert: true // Agar record nahi mila toh naya banao
                }
            }));

        if (ops.length === 0) return res.status(400).json({ message: "Invalid Data" });

        await Attendance.bulkWrite(ops);

        res.status(200).json({ message: "Attendance updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user.id;
        const now = new Date();
        
        // Is mahine ki pehli date (1st of current month)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Aaj tak kitne din beet chuke hain (e.g., Feb 3 hai toh 3 days)
        const daysElapsed = now.getDate(); 

        // 1. Current Month mein kitne din "Present" marked hai
        const presentDays = await Attendance.countDocuments({
            student: studentId,
            status: 'Present',
            date: { $gte: startOfMonth }
        });

        // 2. Real Percentage: (Present Days / Days Passed in Month) * 100
        const percentage = daysElapsed > 0 ? (presentDays / daysElapsed) * 100 : 0;

        // 3. Aaj ki Mess Activity
        const todayStr = now.toLocaleDateString('en-CA'); 
        const todayActivity = await MessActivity.findOne({
            student: studentId,
            date: todayStr
        });

        res.status(200).json({
            totalDays: daysElapsed, // Calendar days passed
            presentDays,            // Actually present
            percentage: percentage.toFixed(2),
            status: percentage >= 75 ? "Good" : "Low",
            todayCheckIn: {
                recorded: !!todayActivity,
                breakfast: todayActivity?.meals?.breakfast?.checked || false,
                lunch: todayActivity?.meals?.lunch?.checked || false,
                dinner: todayActivity?.meals?.dinner?.checked || false
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDailyReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const report = await Attendance.find({ date: today })
            .populate('student', 'fullName roomNo')
            .select('student status');

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteDailyReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await Attendance.deleteMany({ date: today });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No records found for today to delete." });
        }

        res.status(200).json({ 
            message: "Today's attendance report has been cleared.",
            count: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};