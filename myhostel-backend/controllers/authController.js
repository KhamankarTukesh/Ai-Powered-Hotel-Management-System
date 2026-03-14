import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { sendEmail } from '../utils/sendEmail.js';
import { createNotification } from '../utils/notify.js';
dotenv.config();

// ========================
// 1. REGISTER USER
// ========================
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, studentDetails } = req.body;

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "Email already registered!" });

        // OTP Generate
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // ✅ Fix: Reduced bcrypt rounds from 10 to 8 (faster, still secure)
        const hashedPassword = await bcrypt.hash(password, 8);

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
                idCardImage: req.file ? req.file.path : ""
            },
            isVerified: false,
            otp: { code: otpCode, expiresAt: otpExpires }
        });

        await newUser.save();

        // ✅ Notification after registration
        await createNotification(newUser._id, `Welcome to Dnyanda Hostel, ${fullName}! 🎉`);

        // ✅ Fix: Send email AFTER saving user, non-blocking with await
        try {
            await sendEmail(
                email,
                "Verify Your Account - Dnyanda Hostel",
                `Hi ${fullName}, your OTP for registration is: ${otpCode}. This is valid for 10 minutes.`
            );
            console.log("✅ OTP Email sent to:", email);
        } catch (mailError) {
            console.error("🔴 Email Sending Failed:", mailError.message);
        }

        res.status(201).json({
            message: "Registration Successful! Please check your email for OTP.",
            userId: newUser._id
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ========================
// 2. VERIFY OTP
// ========================
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // ✅ Fix: select +otp fields explicitly (because select:false in model)
        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt');
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isVerified) {
            return res.status(400).json({ message: "Account already verified. Please login." });
        }

        if (user.otp.code === otp?.toString() && user.otp.expiresAt > Date.now()) {
            user.isVerified = true;
            user.otp.code = undefined;
            user.otp.expiresAt = undefined;
            await user.save();

            // ✅ Notification after verification
            await createNotification(user._id, "Your account has been verified successfully! ✅");

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Non-blocking welcome email
            sendEmail(
                user.email,
                "Welcome to Dnyanda Hostel! 🎉",
                `Hi ${user.fullName}, your account has been successfully verified!`
            ).catch(err => console.log("Welcome mail failed:", err.message));

            res.status(200).json({
                message: "Account verified successfully! 😊",
                token,
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
                message: isExpired ? "OTP has expired. Please resend." : "Invalid OTP."
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ========================
// 3. RESEND OTP
// ========================
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // ✅ Fix: select otp fields
        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt');
        if (!user) return res.status(404).json({ message: "User not found" });

        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = {
            code: newOTP,
            expiresAt: Date.now() + 10 * 60 * 1000
        };
        await user.save();

        await sendEmail(
            email,
            "New OTP - Dnyanda Hostel",
            `Your new OTP is: ${newOTP}. It is valid for 10 minutes.`
        );

        res.status(200).json({ message: "New OTP sent to your email! 📧" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ========================
// 4. LOGIN USER
// ========================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        // ✅ Fix: select +password explicitly
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        // ✅ Google user check — password null hoga
        if (!user.password) {
            return res.status(400).json({
                message: "This account uses Google Sign-In. Please use Continue with Google."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

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
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ========================
// 5. FORGOT PASSWORD
// ========================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = {
            code: otpCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        await user.save();

        // ✅ Fix: Added await (was missing before!)
        try {
            await sendEmail(
                user.email,
                "Password Reset OTP - Dnyanda Hostel",
                `Your OTP for password reset is: ${otpCode}. It is valid for 10 minutes.`
            );
        } catch (mailError) {
            console.error("🔴 Email Send Failed:", mailError.message);
        }

        res.status(200).json({ message: "OTP sent to your email successfully" });

    } catch (error) {
        console.error("CRITICAL ERROR in forgotPassword:", error);
        res.status(500).json({ error: error.message });
    }
};

// ========================
// 6. RESET PASSWORD
// ========================
export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({
            email,
            "otp.code": code,
            "otp.expiresAt": { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        // ✅ Fix: Reduced bcrypt rounds to 8
        user.password = await bcrypt.hash(newPassword, 8);
        user.otp = { code: undefined, expiresAt: undefined };
        await user.save();

        // ✅ Notification after password reset
        await createNotification(user._id, "Your password was changed successfully. 🔐 If this wasn't you, contact warden.");

        sendEmail(
            user.email,
            "Security Alert: Password Changed",
            `Hi ${user.fullName || 'Student'}, your password was successfully changed.`
        ).catch(err => console.log("Confirmation mail failed:", err.message));

        res.status(200).json({ message: "Password reset successful! 🎉" });

    } catch (error) {
        console.error("CRITICAL ERROR in resetPassword:", error);
        res.status(500).json({ error: error.message });
    }
};

// ========================
// 7. CREATE STAFF (Admin Only)
// ========================
export const createStaff = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (role !== 'warden' && role !== 'admin') {
            return res.status(400).json({ message: "Invalid role for staff creation" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 8);

        const staff = await User.create({
            fullName, email,
            password: hashedPassword,
            role,
            isVerified: true
        });

        res.status(201).json({ message: `${role} created successfully`, staff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ========================
// 8. GOOGLE AUTH
// ========================
export const googleAuth = async (req, res) => {
    try {
        const { email, name } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            // ✅ New Google user — auto register
            user = await User.create({
                fullName: name,
                email,
                password: null,    // ✅ Google user — no password
                isVerified: true,  // ✅ Google verified hai already
                role: 'student',
            });
            await createNotification(user._id,
                `Welcome ${name}! 🎉 Please complete your profile — add roll number & department.`
            );
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Google Login Successful!",
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Google Auth Error:", error.message);
        res.status(500).json({ message: "Google Auth Failed", error: error.message });
    }
};