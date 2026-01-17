import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'warden', 'admin'],
        default: 'student'
    },
    // Student Details: Academic + Contact
    studentDetails: {
        rollNumber: String,
        department: String,
        phone: String,
        idCardImage: String, 
        course: String,      
        batch: String,       
        currentYear: Number  
    },
    parentDetails: {
        guardianName: String,
        guardianContact: String,
        relation: String,    
        address: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: String,
        expiresAt: Date
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;