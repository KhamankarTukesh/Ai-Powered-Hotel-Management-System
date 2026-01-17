import Attendance from '../models/Attendance.js';
import ActivityLog from '../models/ActivityLog.js'; // Log track karne ke liye

import mongoose from 'mongoose'; // Validate karne ke liye import karein

export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body;
        const today = new Date().setHours(0, 0, 0, 0);

        // Sirf valid data filter karke nikalna
        const validAttendance = attendanceData
            .filter(item => mongoose.Types.ObjectId.isValid(item.studentId)) // ID check karega
            .map(item => ({
                student: item.studentId,
                status: item.status,
                date: today,
                markedBy: req.user.id
            }));

        if (validAttendance.length === 0) {
            return res.status(400).json({ message: "No valid Student IDs provided!" });
        }

        const records = await Attendance.insertMany(validAttendance, { ordered: false });

        res.status(201).json({ 
            message: "Attendance marked successfully!", 
            count: records.length 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entries found. Attendance already marked." });
        }
        res.status(500).json({ error: error.message });
    }
};

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