import { v2 as cloudinary } from 'cloudinary';
import ActivityLog from '../models/ActivityLog.js'; 
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import GatePass from '../models/GatePass.js';
import MessMenu from '../models/MessMenu.js';
import Complaint from '../models/Complaint.js';
import Leave from '../models/Leave.js';
import Notice from '../models/Notice.js';
import Room from '../models/Room.js';

// 1. Get User Profile with Room Info
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        const allocatedRoom = await Room.findOne({
            "beds.studentId": req.user.id
        }).select("roomNumber block floor");

        res.json({
            ...user,
            allocatedRoom: allocatedRoom || null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Update Profile with Cloudinary Image Cleanup
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { studentDetails, parentDetails, fullName } = req.body;

        if (studentDetails?.idCardImage && user.studentDetails?.idCardImage) {
            const oldUrl = user.studentDetails.idCardImage;
            if (oldUrl !== studentDetails.idCardImage && !oldUrl.includes('default-avatar')) {
                try {
                    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
                    const match = oldUrl.match(regex);
                    if (match && match[1]) {
                        const publicId = match[1];
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (delError) {
                    console.error("Cloudinary Delete Error:", delError);
                }
            }
        }

        user.fullName = fullName || user.fullName;
        if (user.role === 'student') {
            user.studentDetails = {
                ...(user.studentDetails || {}),
                idCardImage: studentDetails?.idCardImage || user.studentDetails?.idCardImage,
                phone: studentDetails?.phone || user.studentDetails?.phone,
                department: studentDetails?.department || user.studentDetails?.department,
                course: studentDetails?.course || user.studentDetails?.course,
                batch: studentDetails?.batch || user.studentDetails?.batch,
                currentYear: studentDetails?.currentYear || user.studentDetails?.currentYear,
            };
            if (parentDetails) {
                user.parentDetails = {
                    ...(user.parentDetails || {}),
                    guardianName: parentDetails.guardianName || user.parentDetails?.guardianName,
                    guardianContact: parentDetails.guardianContact || user.parentDetails?.guardianContact,
                    relation: parentDetails.relation || user.parentDetails?.relation,
                    address: parentDetails.address || user.parentDetails?.address
                };
            }
        }

        const updatedUser = await user.save();
        await ActivityLog.create({
            student: user._id,
            action: 'Profile-Update',
            description: `${user.fullName} updated their profile info.`
        });

        res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Main Dashboard Summary Logic (Fixes the 500 Error)
export const getStudentSummary = async (req, res) => {
    try {
        const studentId = req.user.id; 
        const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

        const [student, attendanceRecords, fees, gatepass, mess, complaint, leave, notice, roomInfo] = await Promise.all([
            User.findById(studentId).lean(),
            Attendance.find({ student: studentId }).lean(),
            Fee.findOne({ student: studentId }).lean(),
            GatePass.findOne({ student: studentId }).sort({ createdAt: -1 }).lean(),
            MessMenu.findOne({ day: todayDay }).lean(),
            Complaint.findOne({ student: studentId }).sort({ createdAt: -1 }).lean(),
            Leave.findOne({ student: studentId }).sort({ createdAt: -1 }).lean(),
            Notice.findOne().sort({ createdAt: -1 }).lean(),
            Room.findOne({ "beds.studentId": studentId }).lean()
        ]);

        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
        const attendancePercent = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

        res.status(200).json({
            profile: {
                name: student?.fullName || "Student",
                roomNumber: roomInfo?.roomNumber || "Not Assigned",
                block: roomInfo?.block || "N/A"
            },
            attendance: {
                percentage: attendancePercent,
                status: attendancePercent >= 75 ? "Excellent" : "Low"
            },
            fees: {
                pending: fees ? (fees.totalAmount - fees.paidAmount) : 0,
                dueDate: fees?.dueDate || null
            },
            mess: {
                lunch: mess?.lunch || "Not updated",
                dinner: mess?.dinner || "Not updated"
            },
            gatepass: { status: gatepass?.status || "In Campus" },
            complaint: { status: complaint?.status || "No complaints" },
            leave: { status: leave?.status || "No requests" },
            notice: {
                title: notice?.title || "No new notices",
                date: notice?.createdAt || null
            }
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};