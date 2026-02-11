import Attendance from "../models/Attendance.js"; // Warden wali hostel attendance
import MessActivity from "../models/MessActivity.js";
import mongoose from "mongoose";

export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ops = attendanceData
            .filter(item => mongoose.Types.ObjectId.isValid(item.studentId))
            .map(item => ({
                updateOne: {
                    filter: { student: item.studentId, date: today },
                    update: {
                        $set: {
                            status: item.status,
                            markedBy: req.user.id,
                            date: today // ✔ ensures date always saved
                        }
                    },
                    upsert: true
                }
            }));

        if (!ops.length)
            return res.status(400).json({ message: "Invalid Data" });

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

        /* ---------- Month Range ---------- */
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // safer range end

        /* ---------- Days Passed ---------- */
        const daysPassed = now.getDate(); // 1 → 31

        /* ---------- Present Count ---------- */
        const presentDays = await Attendance.countDocuments({
            student: studentId,
            status: "Present",
            date: { $gte: startOfMonth, $lte: today }
        });

        /* ---------- Percentage (Correct Logic) ---------- */
        const percentage =
            daysPassed > 0
                ? ((presentDays / daysPassed) * 100).toFixed(2)
                : 0;

        /* ---------- Today's Attendance ---------- */
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayAttendance = await Attendance.findOne({
            student: studentId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        /* ---------- Mess Activity ---------- */
        const todayStr = now.toLocaleDateString("en-CA");

        const todayActivity = await MessActivity.findOne({
            student: studentId,
            date: todayStr
        });

        res.status(200).json({
            totalDays: daysPassed, // ✔ FIXED
            presentDays,
            percentage,
            status: percentage >= 75 ? "Good" : "Low",

            todayCheckIn: {
                recorded: !!todayAttendance || !!todayActivity,
                status: todayAttendance?.status || "Pending",
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