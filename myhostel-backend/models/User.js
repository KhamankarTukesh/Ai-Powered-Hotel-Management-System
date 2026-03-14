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
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: false,  
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'warden', 'admin', 'staff'],
        default: 'student',
        index: true
    },

    // Student Details: Academic + Contact
    studentDetails: {
        rollNumber: {
            type: String,
            default: ""
        },
        department: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        idCardImage: {
            type: String,
            default: ""
        },
        course: {
            type: String,
            default: ""
        },
        batch: {
            type: String,
            default: ""
        },
        currentYear: {
            type: Number,
            default: null
        }
    },

    // Parent / Guardian Details
    parentDetails: {
        guardianName: {
            type: String,
            default: ""
        },
        guardianContact: {
            type: String,
            default: ""
        },
        relation: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        }
    },

    // Staff Details (Only for staff role)
    staffDetails: {
        category: {
            type: String,
            enum: ['Electrician', 'Plumber', 'Cleaner', 'Security', 'Mess-Chef'],
            default: null
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },

    // Verification
    isVerified: {
        type: Boolean,
        default: false
    },

    // OTP (Hidden from normal queries)
    otp: {
        code: {
            type: String,
            select: false
        },
        expiresAt: {
            type: Date,
            select: false
        }
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;