import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Room from '../models/Room.js';
import Notice from '../models/Notice.js';
import Complaint from '../models/Complaint.js';
import GatePass from '../models/GatePass.js';
import MessMenu from '../models/MessMenu.js'; // Assuming you have this for menu

export const getStudentDashboardSummary = async (req, res) => {
    try {
        const studentId = req.user.id;

        // 1. Attendance Summary (Last 30 days percentage)
        const totalAttendance = await Attendance.countDocuments({ student: studentId });
        const presentCount = await Attendance.countDocuments({ student: studentId, status: 'Present' });
        const attendancePercent = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

        // 2. Fees Summary (Latest record)
        const latestFee = await Fee.findOne({ student: studentId }).sort({ createdAt: -1 });
        const feesData = {
            pendingAmount: latestFee ? (latestFee.totalAmount - latestFee.paidAmount) : 0,
            status: latestFee ? latestFee.status : 'No Record'
        };

        // 3. Room & Roommates Summary
        const roomInfo = await Room.findOne({ "students.user": studentId })
            .populate('students.user', 'fullName phone email');
        
        // 4. Mess Summary (Today's Menu)
        const today = new Date().toISOString().split('T')[0];
        const todayMenu = await MessMenu.findOne({ date: today });

        // 5. Recent Notices (Top 3)
        const recentNotices = await Notice.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('postedBy', 'fullName');

        // 6. Quick Stats for Cards (GatePass & Complaints)
        const pendingComplaints = await Complaint.countDocuments({ student: studentId, status: 'Pending' });
        const activeGatePass = await GatePass.findOne({ student: studentId }).sort({ createdAt: -1 });

        // 🚀 Sending EVERYTHING in one object
        res.status(200).json({
            user: {
                fullName: req.user.fullName,
                email: req.user.email,
                avatar: req.user.avatar || null
            },
            stats: {
                attendance: attendancePercent,
                dueFees: feesData.pendingAmount,
                roomNo: roomInfo ? roomInfo.roomNumber : 'Not Assigned',
                gatePassStatus: activeGatePass ? activeGatePass.status : 'None',
                pendingComplaints
            },
            roomSummary: {
                roomNumber: roomInfo?.roomNumber,
                roomType: roomInfo?.type,
                roommates: roomInfo?.students.filter(s => s.user._id.toString() !== studentId) || []
            },
            messSummary: todayMenu || { breakfast: "N/A", lunch: "N/A", dinner: "N/A" },
            notices: recentNotices,
            feesSummary: feesData
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching dashboard summary", 
            error: error.message 
        });
    }
};