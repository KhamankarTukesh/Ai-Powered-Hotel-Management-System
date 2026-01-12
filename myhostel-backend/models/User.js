import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required: true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique: true,
        lowercase: true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type:String,
        enum: ['student','warden','admin'],
        default: 'student'
    },
    studentDetails: {
        rollNumber: String,
        department: String,
        phone: String,
        idCardImage: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
otp: {
        code: String,
        expiresAt: Date
    }
}, { timestamps: true});

const User = new mongoose.model('User',userSchema);
export default User;