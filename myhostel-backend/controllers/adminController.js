import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import OpenAI from 'openai'; // Kyunki aapne OpenAI use kiya hai

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getDashboardSummary = async (req, res) => {
    try {
        // 1. Database Stats (Simple Numbers)
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingComplaintsCount = await Complaint.countDocuments({ status: 'Pending' });
        
        // 2. Fee Data (Financial Health)
        const pendingFees = await Fee.find({ status: 'Pending' }).populate('student', 'name');
        const feeSummary = pendingFees.map(f => `${f.student.name}: ₹${f.amount}`).join(", ");

        // 3. Attendance Data (Today's Trend)
        const today = new Date().setHours(0, 0, 0, 0);
        const todayAttendance = await Attendance.find({ date: { $gte: today } });
        const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
        const absentCount = todayAttendance.filter(a => a.status === 'Absent').length;

        // 4. Critical Complaints (Safety & Mess)
        const urgentComplaints = await Complaint.find({ 
            $or: [{ priority: 'Urgent' }, { category: 'Mess' }],
            status: 'Pending' 
        }).limit(5);
        const complaintTexts = urgentComplaints.map(c => `[${c.category}]: ${c.description}`).join("; ");

        // 5. OpenAI "All-Rounder" Analysis
        let aiInsight = "Gathering data...";
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                { 
                    role: "system", 
                    content: "You are a Hostel Management AI. Analyze Fees, Attendance, and Complaints. Give a concise summary: 1. Financial Risk, 2. Attendance issues, 3. Urgent Safety/Mess tasks." 
                },
                { 
                    role: "user", 
                    content: `Stats: Total Students: ${totalStudents}, Present today: ${presentCount}, Absent: ${absentCount}. 
                              Pending Fees: ${feeSummary || "None"}. 
                              Urgent Complaints: ${complaintTexts || "None"}.` 
                }
            ],
        });
        aiInsight = completion.choices[0].message.content;

        // 6. Final Response
        res.status(200).json({
            stats: {
                totalStudents,
                pendingComplaintsCount,
                presentToday: presentCount,
                absentToday: absentCount
            },
            aiAnalysis: {
                comprehensiveInsight: aiInsight,
                status: "AI-Powered Deep Scan Complete"
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};