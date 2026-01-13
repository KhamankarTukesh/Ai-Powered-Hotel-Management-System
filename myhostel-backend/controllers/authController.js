import bcrypt, { hash } from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

//1.Register User
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role, studentDetails } = req.body;


        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        if (role && (role === 'warden' || role === 'admin')) {
            return res.status(403).json({
                message: "Unauthorized! Only Students can register here. Staff accounts are created by the Administrator."
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: 'student',
            studentDetails,
            isVerified: false
        });

        await newUser.save();

        res.status(201).json({
            message: "Student Registration Successful! Please verify your account.",
            user: {
                id: newUser._id,
                name: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });
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