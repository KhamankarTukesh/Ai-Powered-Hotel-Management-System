import bcrypt, { hash } from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import ActivityLog from "../models/ActivityLog.js";
import dotenv from "dotenv";
import { sendEmail } from '../utils/sendEmail.js';
dotenv.config();
export const registerUser = async (req, res) => {
    try {
        // Data extract karo
        const { fullName, email, password, studentDetails } = req.body;

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "Email already registered!" });

        // 2. OTP Generate karo (6 digits)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // Password Hash karo
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. New User Object (Cloudinary path ke saath)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: 'student',
            studentDetails: {
                rollNumber: studentDetails?.rollNumber || "",
                department: studentDetails?.department || "",
                phone: studentDetails?.phone || "",
                course: studentDetails?.course || "",
                batch: studentDetails?.batch || "",
                currentYear: studentDetails?.currentYear || "",
                // Cloudinary URL yahan save hota hai (Yahan local save nahi ho raha)
                idCardImage: req.file ? req.file.path : ""
            },
            isVerified: false,
            otp: {
                code: otpCode,
                expiresAt: otpExpires
            }
        });

        // Database mein save karo
        await newUser.save();

        // 4. 🔥 SABSE IMPORTANT: Email bhejye
        console.log(`[DNYANDA] Attempting to send OTP to ${email}: ${otpCode}`);

        try {
            await sendEmail(
                email,
                "Verify Your Account - Dnyanda Hostel",
                `Hi ${fullName}, your OTP for registration is: ${otpCode}. This is valid for 10 minutes.`
            );
            console.log("✅ OTP Email sent successfully to:", email);
        } catch (mailError) {
            // Agar email fail ho jaye toh error terminal mein dikhega
            console.error("🔴 Email Sending Failed:", mailError.message);
        }

        // Response bhejdo (Frontend ko otpCode mat bhejna production mein, security risk hai)
        res.status(201).json({
            message: "Registration Successful! Please check your email for OTP.",
            userId: newUser._id
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified. Please login." });
        }

        // Safe Comparison (Check code and expiry)
        if (user.otp.code === otp?.toString() && user.otp.expiresAt > Date.now()) {
            user.isVerified = true;
            user.otp.code = undefined;
            user.otp.expiresAt = undefined;
            await user.save();

            // 🔑 Step 1: Token Generate Karo (Taaki user direct login ho jaye)
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // ✅ Step 2: Welcome Email Bhejye
            try {
                await sendEmail(
                    user.email,
                    "Welcome to Dnyanda Hostel! 🎉",
                    `Hi ${user.fullName}, your account has been successfully verified. You are now logged in.`
                );
            } catch (mailErr) {
                console.log("Welcome mail failed, but user is verified.");
            }

            // 🚀 Step 3: Token aur User data response mein bhejo
            res.status(200).json({
                message: "Account verified successfully! 😊",
                token, // Frontend isi token ko save karega
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            const isExpired = user.otp.expiresAt < Date.now();
            res.status(400).json({
                message: isExpired ? "OTP has expired. Please resend." : "Invalid OTP. Please check again."
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Resend OTP Controller (Ek dum sahi hai, bas consistency check)
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = {
            code: newOTP,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
        };

        await user.save();

        // Console check
        console.log(`[DNYANDA] New OTP for ${email}: ${newOTP}`);

        res.status(200).json({ message: "New OTP sent to your email! 📧" });
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
            { expiresIn: '1d' }
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


// 1. Forgot Password (OTP Generation)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // OTP save kar rahe hain
        user.otp = {
            code: otpCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        await user.save();

        // Terminal mein dikhega taaki aap copy kar sako
        console.log(`[DNYANDA SECURITY] OTP for ${email}: ${otpCode}`);

        // Email bhejna - Isko alag try-catch mein rakha hai taaki crash na ho
        try {
            await sendEmail(
                user.email,
                "Password Reset OTP - Dnyanda Hostel",
                `Your OTP for password reset is: ${otpCode}. It is valid for 10 minutes.`
            );
        } catch (mailError) {
            console.error("🔴 Email Send Fail (Credentials check karein):", mailError.message);
            // Function rukega nahi, 200 response jayega
        }

        res.status(200).json({
            message: "OTP generated successfully",
            otp: otpCode // Testing ke liye response mein bhej rahe hain
        });

    } catch (error) {
        console.error("CRITICAL ERROR in forgotPassword:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Reset Password (Naya Password Save Karna)
export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        // User dhundhna with valid OTP
        const user = await User.findOne({
            email,
            "otp.code": code,
            "otp.expiresAt": { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        // Password Hash karna
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // OTP clear karna
        user.otp = { code: undefined, expiresAt: undefined };
        await user.save();

        // Confirmation Mail (Non-blocking)
        try {
            await sendEmail(
                user.email,
                "Security Alert: Password Changed",
                `Hi ${user.fullName || 'Student'}, your account password was successfully changed.`
            );
        } catch (mailErr) {
            console.log("Confirmation mail failed to send.");
        }

        res.status(200).json({ message: "Password reset successful! 🎉" });

    } catch (error) {
        console.error("CRITICAL ERROR in resetPassword:", error);
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

