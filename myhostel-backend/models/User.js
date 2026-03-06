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
        required: true,
        select: false  // ✅ Fix: Password ab sirf explicitly maangne par aayega
    },
    role: {
        type: String,
        enum: ['student', 'warden', 'admin', 'staff'],
        default: 'student',
        index: true  // ✅ Fix: Role-based queries fast hongi
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
            type: String,  // ✅ String rakha hai (number se leading zero girta hai)
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
            type: String,  // ✅ Fix: Number se String - leading zeros safe rahenge
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
            select: false  // ✅ Fix: OTP ab normal queries mein nahi aayega
        },
        expiresAt: {
            type: Date,
            select: false  // ✅ Fix: Expiry bhi hidden
        }
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;