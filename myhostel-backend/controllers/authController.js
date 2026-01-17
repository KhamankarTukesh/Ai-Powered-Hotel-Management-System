import bcrypt, { hash } from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


// registerUser ko update kar rahe hain
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, rollNumber, department, phone } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "Email already registered!" });

        // 1. Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: 'student',
            studentDetails: {
                rollNumber: rollNumber || "",
                department: department || "",
                phone: phone || "",
                idCardImage: req.file ? req.file.path : "" 
            },
            // Khali object initialize kar do taaki baad mein update ho sake
            parentDetails: {
                guardianName: "",
                guardianContact: "",
                relation: "",
                address: ""
            },
            isVerified: false,
            otp: {
                code: otpCode,
                expiresAt: otpExpires
            }
        });

        await newUser.save();
        console.log(`OTP for ${email} is: ${otpCode}`); // Testing ke liye console par

        res.status(201).json({
            message: "Registration Successful! Please verify OTP sent to your email.",
            userId: newUser._id
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//  Verify OTP Function (Naya step)
export const verifyOTP = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp.code === code && user.otp.expiresAt > Date.now()) {
            user.isVerified = true;
            user.otp.code = undefined;
            user.otp.expiresAt = undefined;
            await user.save();
            res.status(200).json({ message: "Account verified successfully! 😊" });
        } else {
            res.status(400).json({ message: "Invalid or Expired OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//2.Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // 1 din ke liye valid hota he
        );

        res.status(200).json({
            message: "Login Successful! 😊",
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
        await user.save();

        console.log(`Reset OTP for ${email}: ${otpCode}`);
        res.status(200).json({ message: "Reset OTP sent to console/email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email, "otp.code": code, "otp.expiresAt": { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = { code: undefined, expiresAt: undefined };
        await user.save();

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // AGAR FILE AAYI HAI TOH CLOUDINARY URL SAVE KARO
        if (req.file) {
            user.studentDetails.idCardImage = req.file.path; 
        }

        user.fullName = req.body.fullName || user.fullName;

        if (user.role === 'student') {
            user.studentDetails = {
                ...user.studentDetails,
                phone: req.body.phone || user.studentDetails.phone,
                department: req.body.department || user.studentDetails.department,
                course: req.body.course || user.studentDetails.course,
                batch: req.body.batch || user.studentDetails.batch,
            };

            // Parent details handle karein
            if (req.body.parentDetails) {
                user.parentDetails = {
                    ...user.parentDetails,
                    guardianName: req.body.parentDetails.guardianName || user.parentDetails.guardianName,
                    guardianContact: req.body.parentDetails.guardianContact || user.parentDetails.guardianContact,
                    relation: req.body.parentDetails.relation || user.parentDetails.relation,
                    address: req.body.parentDetails.address || user.parentDetails.address
                };
            }
        }

        const updatedUser = await user.save();
        res.status(200).json({ message: "Profile updated successfully! ☁️", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// 3. CREATE STAFF (By Admin Only)
export const createStaff = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Sirf Warden ya Admin banane ki permission
        if (role !== 'warden' && role !== 'admin') {
            return res.status(400).json({ message: "Invalid role for staff creation" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staff = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            isVerified: true // Admin bana raha hai toh pehle se verified hai
        });

        res.status(201).json({ message: `${role} created successfully`, staff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};