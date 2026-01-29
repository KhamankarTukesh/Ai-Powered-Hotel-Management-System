import Attendance from "../models/Attendance.js"; // Warden wali hostel attendance
import MessActivity from "../models/MessActivity.js";
import mongoose from "mongoose";

export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body;
        // Proper Date Object for Today (Start of the day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validAttendance = attendanceData
            .filter(item => mongoose.Types.ObjectId.isValid(item.studentId))
            .map(item => ({
                student: item.studentId,
                status: item.status,
                date: today, // Clear Date object
                markedBy: req.user.id
            }));

        if (validAttendance.length === 0) {
            return res.status(400).json({ message: "No valid Student IDs provided!" });
        }

        // Use ordered: false taaki agar 10 me se 2 duplicate hon, toh baki 8 save ho jayein
        const records = await Attendance.insertMany(validAttendance, { ordered: false });

        res.status(201).json({
            message: "Attendance marked successfully!",
            count: records.length
        });

    } catch (error) {
        // Agar saare records already marked hain
        if (error.code === 11000 || error.writeErrors) {
            return res.status(200).json({
                message: "Some or all attendance records were already marked for today.",
                details: "Duplicates skipped."
            });
        }
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