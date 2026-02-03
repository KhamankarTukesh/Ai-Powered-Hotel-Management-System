import { Parser } from 'json2csv';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import MessActivity from '../models/MessActivity.js'; 
import OpenAI from 'openai';

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY, // Aapka .env wala name
    baseURL: "https://openrouter.ai/api/v1" 
});

export const getDashboardSummary = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingComplaintsCount = await Complaint.countDocuments({ status: 'Pending' });
        
        // 2. Financials (Optimized for AI context window)
        const dueFees = await Fee.find({ status: { $in: ['Unpaid', 'Partially Paid'] } })
                                 .populate('student', 'fullName');
        
        const totalDueAmount = dueFees.reduce((acc, f) => acc + (f.totalAmount - f.paidAmount), 0);
        // AI ko summary dene ke liye short list
        const feeSummary = dueFees.slice(0, 5).map(f => `${f.student?.fullName}: ₹${f.totalAmount - f.paidAmount}`).join(", ");

        // 3. Hostel Attendance Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const hostelAttendanceToday = await Attendance.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const presentInHostel = hostelAttendanceToday.filter(a => a.status === 'Present').length;
        const absentInHostel = hostelAttendanceToday.filter(a => a.status === 'Absent').length;
        const onLeave = hostelAttendanceToday.filter(a => a.status === 'Leave').length;

        // 4. Mess Stats (Fixed Local Date Bug)
        const todayStr = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"
        const messStats = await MessActivity.find({ date: todayStr });
        const mealsTaken = messStats.length;

        // 5. Critical Complaints
        const urgentComplaints = await Complaint.find({ 
            $or: [{ priority: 'Urgent' }, { category: 'Mess' }],
            status: 'Pending' 
        }).limit(5);
        const complaintTexts = urgentComplaints.map(c => `[${c.category}]: ${c.description}`).join("; ");

        // 6. OpenAI/OpenRouter Analysis (Updated for Mistral)
        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct", // Mistral model use ho raha hai
            messages: [
                { 
                    role: "system", 
                    content: "You are a Hostel Warden AI. Summarize financials, attendance issues, and urgent actions in 3 short bullet points." 
                },
                { 
                    role: "user", 
                    content: `Stats: Total Students: ${totalStudents}. 
                              Today's Attendance: ${presentInHostel} Present, ${onLeave} Leave. 
                              Mess: ${mealsTaken} meals served. 
                              Financials: ₹${totalDueAmount} total due (${feeSummary}). 
                              Urgent Complaints: ${complaintTexts || "None"}.` 
                }
            ],
            temperature: 0.2
        });

        res.status(200).json({
            stats: {
                totalStudents,
                pendingComplaintsCount,
                hostelPresence: {
                    present: presentInHostel,
                    absent: absentInHostel,
                    leave: onLeave
                },
                messMealsToday: mealsTaken,
                totalPendingFeesAmount: totalDueAmount
            },
            aiAnalysis: completion.choices[0].message.content,
            status: "Dashboard Data Loaded ✅"
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: "Dashboard Error: " + error.message });
    }
};