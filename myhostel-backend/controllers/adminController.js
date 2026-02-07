import { Parser } from 'json2csv';
import OpenAI from 'openai';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Complaint from '../models/Complaint.js';
import Leave from '../models/Leave.js';
import Fee from '../models/Fee.js';
import Room from '../models/Room.js';
import Notice from '../models/Notice.js';
import MessActivity from '../models/MessActivity.js';
import MessMenu from '../models/MessMenu.js';
import GatePass from '../models/GatePass.js';
import ActivityLog from '../models/ActivityLog.js';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});
export const getWardenDashboardSummary = async (req, res) => {
    try {
        // Log to check if req.user exists
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User context missing" });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const todayStr = new Date().toLocaleDateString('en-CA');

        const results = await Promise.allSettled([
            User.findById(req.user._id).select('fullName role name').lean(), // #0
            User.countDocuments({ role: 'student' }), // #1
            Attendance.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).lean(), // #2
            Complaint.find({}).lean(), // #3
            Leave.countDocuments({ status: 'Pending' }), // #4
            Fee.find({}).populate('student', 'fullName').lean(), // #5
            Room.find({}).lean(), // #6
            Notice.findOne().sort({ createdAt: -1 }).select('title content createdAt isEmergency').lean(), // #7
            MessActivity.find({ date: todayStr }).lean(), // #8
            MessMenu.findOne({ day: new Date().toLocaleDateString('en-US', { weekday: 'long' }) }).lean(), // #9
            GatePass.countDocuments({ status: 'Pending' }), // #10
            GatePass.findOne().sort({ createdAt: -1 }).select('createdAt').lean(), // #11
            ActivityLog.countDocuments({ action: 'Check-out' }), // #12
            ActivityLog.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }), // #13
            ActivityLog.findOne().sort({ createdAt: -1 }).select('description createdAt').lean() // #14
        ]);

        // Safely extract values from allSettled
        const getValue = (index) => results[index].status === 'fulfilled' ? results[index].value : null;

        const wardenInfo = getValue(0);
        const totalStudents = getValue(1) || 0;
        const attendanceToday = getValue(2) || [];
        const allComplaints = getValue(3) || [];
        const pendingLeavesCount = getValue(4) || 0;
        const feeStats = getValue(5) || [];
        const roomsInfo = getValue(6) || [];
        const latestNotice = getValue(7);
        const messActivityToday = getValue(8) || [];
        const todayMenu = getValue(9);
        const pendingGatePassesCount = getValue(10) || 0;
        const latestGatePass = getValue(11);
        const activeOutStudents = getValue(12) || 0;
        const activityTodayCount = getValue(13) || 0;
        const latestActivity = getValue(14);

        // --- Attendance Calculations ---
        const presentToday = attendanceToday.filter(a => a.status === 'Present').length;
        const onLeaveToday = attendanceToday.filter(a => a.status === 'Leave').length;

        // --- Finance Calculations ---
        let totalRevenue = 0, totalReceived = 0;
        feeStats.forEach(f => {
            totalRevenue += f.totalAmount || 0;
            totalReceived += f.paidAmount || 0;
        });

        res.status(200).json({
            status: "Success",
            profileStats: {
                // DB key match: Sharma Warden yahan se aayega
                wardenName: wardenInfo?.fullName || wardenInfo?.name || "Warden",
                role: wardenInfo?.role || "warden",
            },
            attendanceStats: {
                present: presentToday,
                absent: attendanceToday.filter(a => a.status === 'Absent').length,
                onLeave: onLeaveToday,
                unmarked: Math.max(0, totalStudents - attendanceToday.length),
                attendancePercentage: totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : 0
            },
            messStats: {
                mealsServedToday: messActivityToday.length,
                todayMenu: todayMenu ? {
                    breakfast: todayMenu.breakfast,
                    lunch: todayMenu.lunch,
                    dinner: todayMenu.dinner
                } : "Menu Not Set",
                pendingFeedback: messActivityToday.filter(m => !m.rating).length
            },
            activityStats: {
                todayMovements: activityTodayCount,
                lastMovement: latestActivity ? { text: latestActivity.description, time: latestActivity.createdAt } : null
            },
            roomStats: {
                totalRooms: roomsInfo.length,
                totalBeds: roomsInfo.reduce((acc, room) => acc + (room.capacity || 0), 0),
                occupiedBeds: roomsInfo.reduce((acc, room) => acc + (room.beds ? room.beds.filter(bed => bed.studentId).length : 0), 0),
                availableBeds: 0, // Logic adjustment if needed
                occupancyPercentage: 0
            },
            complaintStats: {
                total: allComplaints.filter(c => c.status !== 'Resolved').length,
                pending: allComplaints.filter(c => c.status === 'Pending').length,
                resolved: allComplaints.filter(c => c.status === 'Resolved').length,
                urgentCount: allComplaints.filter(c => c.status !== 'Resolved' && c.priority === 'Urgent').length,
            },
            leaveStats: { pendingCount: pendingLeavesCount, onLeaveToday },
            gatepassStats: {
                pendingCount: pendingGatePassesCount,
                lastRequestTime: latestGatePass?.createdAt || null,
                activeOutCount: activeOutStudents
            },
            financeStats: {
                totalDues: totalRevenue - totalReceived,
                collectionRate: totalRevenue > 0 ? ((totalReceived / totalRevenue) * 100).toFixed(1) : 0,
            },
            latestNotice: latestNotice ? {
                title: latestNotice.title,
                content: latestNotice.content || latestNotice.message,
                date: latestNotice.createdAt,
                isEmergency: latestNotice.isEmergency || false
            } : null
        });

    } catch (error) {
        console.error("Dashboard Final Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
// --- 2. ROUTE: GET AI ANALYSIS (ON CLICK) ---
export const getWardenAIInsight = async (req, res) => {
    try {
        // Fetch only necessary data for AI context
        const [totalStudents, attendance, complaints, fees] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            Attendance.countDocuments({ status: 'Present', createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
            Complaint.find({ status: 'Pending', priority: 'Urgent' }).limit(5).lean(),
            Fee.find({}).lean()
        ]);

        const dues = fees.reduce((acc, f) => acc + (f.totalAmount - f.paidAmount), 0);
        const issues = complaints.map(c => c.description).join("; ");

        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                { role: "system", content: "You are a Hostel Warden AI. Summarize financials, attendance, and urgent issues in 3 sharp bullet points." },
                { role: "user", content: `Stats: Students: ${totalStudents}, Present: ${attendance}, Dues: ₹${dues}, Urgent Issues: ${issues || "None"}` }
            ],
            temperature: 0.2
        });

        res.status(200).json({
            aiAnalysis: completion.choices[0].message.content
        });
    } catch (error) {
        res.status(500).json({ message: "AI Analysis failed", error: error.message });
    }
};