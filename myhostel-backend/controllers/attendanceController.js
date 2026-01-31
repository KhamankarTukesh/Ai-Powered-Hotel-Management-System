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
        // Aaj ki date format: "2026-01-28" (Jaisa aapke schema mein hai)
        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Hostel Attendance Stats (From Warden Data)
        const totalDays = await Attendance.countDocuments({ student: studentId });
        const presentDays = await Attendance.countDocuments({
            student: studentId,
            status: 'Present'
        });

        // 2. Aaj ki Mess Activity (From Student Data)
        const todayActivity = await MessActivity.findOne({
            student: studentId,
            date: todayStr
        });

        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        res.status(200).json({
            // Chart ke liye data
            totalDays,
            presentDays,
            percentage: percentage.toFixed(2),
            status: percentage >= 75 ? "Good" : "Low",

            // UI ke "Recorded" section ke liye data
            todayCheckIn: todayActivity ? {
                recorded: true,
                // Check karte hain koi bhi ek meal mark hui hai ya nahi
                lastMealTime: todayActivity.updatedAt,
                breakfast: todayActivity.meals.breakfast.checked,
                lunch: todayActivity.meals.lunch.checked,
                dinner: todayActivity.meals.dinner.checked
            } : { recorded: false }
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