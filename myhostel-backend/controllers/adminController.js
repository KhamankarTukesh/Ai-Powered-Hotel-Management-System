import { Parser } from 'json2csv';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import MessActivity from '../models/MessActivity.js'; // Ise add karo
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const getDashboardSummary = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingComplaintsCount = await Complaint.countDocuments({ status: 'Pending' });
        
        // 2. Financials
        const dueFees = await Fee.find({ status: { $in: ['Unpaid', 'Partially Paid'] } })
                                 .populate('student', 'fullName');
        const feeSummary = dueFees.map(f => `${f.student?.fullName || 'Unknown'}: ₹${f.totalAmount - f.paidAmount}`).join(", ");

        // 3. Hostel Attendance (Using Attendance Model) ✅
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

        // 4. Mess Stats (Using MessActivity Model)
        const todayStr = new Date().toISOString().split('T')[0];
        const messStats = await MessActivity.find({ date: todayStr });
        const mealsTaken = messStats.length;

        // 5. Critical Complaints
        const urgentComplaints = await Complaint.find({ 
            $or: [{ priority: 'Urgent' }, { category: 'Mess' }],
            status: 'Pending' 
        }).limit(5);
        const complaintTexts = urgentComplaints.map(c => `[${c.category}]: ${c.description}`).join("; ");

        // 6. OpenAI Analysis (Updated prompt with Hostel Attendance)
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                { 
                    role: "system", 
                    content: "You are a Hostel Warden AI. Summarize 1. Financial Health, 2. Occupancy/Attendance Issues, 3. Urgent Actions." 
                },
                { 
                    role: "user", 
                    content: `Stats: Students: ${totalStudents}. 
                              Hostel Attendance: ${presentInHostel} Present, ${onLeave} on Leave. 
                              Mess: ${mealsTaken} meals served. 
                              Fees Due: ${feeSummary || "None"}. 
                              Urgent Complaints: ${complaintTexts || "None"}.` 
                }
            ],
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
                totalPendingFees: dueFees.length
            },
            aiAnalysis: completion.choices[0].message.content,
            status: "Dashboard Data Loaded ✅"
        });

    } catch (error) {
        res.status(500).json({ error: "Dashboard Error: " + error.message });
    }
};
export const exportFeeReport = async (req, res) => {
    try {
        const fees = await Fee.find().populate('student', 'fullName email');
        
        // Data format set karna Excel ke liye
        const fields = ['student.fullName', 'totalAmount', 'paidAmount', 'status', 'dueDate'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(fees);

        // Browser ko batana ki ye file download karni hai
        res.header('Content-Type', 'text/csv');
        res.attachment('Hostel_Fee_Report.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};